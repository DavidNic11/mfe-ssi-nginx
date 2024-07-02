import fs from "fs/promises";
import express from "express";
import { parse } from "node-html-parser";

const isProduction = process.env.NODE_ENV === "production";

const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";

const templateHtml = isProduction
  ? await fs.readFile("./dist/client/index.html", "utf-8")
  : "";

const ssrManifest = isProduction
  ? await fs.readFile("./dist/client/.vite/ssr-manifest.json", "utf-8")
  : undefined;

const server = express();

let vite;

if (!isProduction) {
  const { createServer } = await import("vite");

  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  server.use(vite.middlewares);
} else {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  server.use(compression());
  server.use(base, sirv("./dist/client", { extensions: [] }));
}

const getRendered = async (url) => {
  let template;
  let render;
  if (!isProduction) {
    // Always read fresh template in development
    template = await fs.readFile("./index.html", "utf-8");
    template = await vite.transformIndexHtml(url, template);
    render = (await vite.ssrLoadModule("/src/main.server.tsx")).render;
  } else {
    template = templateHtml;
    render = (await import("./dist/server/main.server.js")).render;
  }

  const rendered = await render();

  return {
    html: template
      .replace(`<!--app-head-->`, rendered.head ?? "")
      .replace(`<!--app-html-->`, rendered.html ?? ""),
    renderedApp: rendered,
  };
};

// Serve HTML
server.use("/", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "");
    const { html, renderedApp } = await getRendered(url);

    let sendable = html;

    if (req.headers["x-fragment"]) {
      const parsed = parse(html);

      const scripts = parsed.getElementsByTagName("script");
      const links = parsed
        .getElementsByTagName("link")
        .filter((link) => link.toString().includes('rel="stylesheet"'));

      sendable =
        scripts.join("\n") +
        "\n" +
        links.join("\n") +
        `<div id="root">` +
        renderedApp.html +
        `</div>`;
    }

    res.set("Access-Control-Allow-Origin", "*");
    res.status(200).set({ "Content-Type": "text/html" }).send(sendable);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

// Start http server
server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
