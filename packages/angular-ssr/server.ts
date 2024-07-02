import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import parse from 'node-html-parser';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // // Example Express Rest API endpoints
  // // server.get('/api/**', (req, res) => { });
  // // Serve static files from /browser
  server.get(
    '*.*',
    express.static(browserDistFolder, {
      maxAge: '1y',
    })
  );

  server.get('/internal/fragment', async (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    const html = await commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .catch((err) => next(err));

    const parsed = parse(html as string);

    const scripts = parsed
      .getElementsByTagName('head')
      .map((head) => head.getElementsByTagName('script'));

    const styles = parsed
      .getElementsByTagName('head')
      .map((head) => head.getElementsByTagName('style'));

    const links = parsed
      .getElementsByTagName('head')
      .map((head) =>
        head
          .getElementsByTagName('link')
          .filter((link) => link.toString().includes('rel="stylesheet"'))
      );

    const root = parsed.getElementsByTagName('body')[0].childNodes;

    const fragment =
      scripts.join('\n') +
      styles.join('\n') +
      '\n' +
      links.join('\n') +
      root.join('\n');

    return res.send(fragment);
  });

  // All regular routes use the Angular engine
  server.get('/', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
