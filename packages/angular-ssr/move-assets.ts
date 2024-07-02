import fs from 'fs/promises';
import { existsSync } from 'fs';

main();

async function main() {
  //   const files = await fs.readdir('./dist/angular-ssr/browser');

  //   const assets = files
  //     .filter((file) => !file.includes('.html'))
  //     .filter((file) => file.includes('.'));

  //   if (existsSync('./dist/angular-ssr/browser/assets')) {
  //     await fs.rm('./dist/angular-ssr/browser/assets', { recursive: true });
  //   }

  //   await fs.mkdir('./dist/angular-ssr/browser/assets');
  //   await Promise.all(
  //     assets.map(async (file) => {
  //       fs.rename(
  //         `./dist/angular-ssr/browser/${file}`,
  //         `./dist/angular-ssr/browser/assets/${file}`
  //       );
  //     })
  //   );

  const htmlFile = await fs.readFile(
    './dist/angular-ssr/browser/index.html',
    'utf-8'
  );

  const replaced = htmlFile.replace(
    /(href|src)="([^"]+)"/g,
    (match, p1, p2) => {
      if (!p2.startsWith('/') && !p2.startsWith('http')) {
        return `${p1}="${process.env['PREFIX']}/${p2}"`;
      }
      return match;
    }
  );

  fs.writeFile('./dist/angular-ssr/browser/index.html', replaced);

  // server
  const serverHtmlFile = await fs.readFile(
    './dist/angular-ssr/server/index.server.html',
    'utf-8'
  );

  const replacedServer = serverHtmlFile.replace(
    /(href|src)="([^"]+)"/g,
    (match, p1, p2) => {
      if (!p2.startsWith('/') && !p2.startsWith('http')) {
        return `${p1}="${process.env['PREFIX']}/${p2}"`;
      }
      return match;
    }
  );

  fs.writeFile('./dist/angular-ssr/server/index.server.html', replacedServer);
}
