/**
 * ==============================================================================
 * CPANEL APPLICATION STARTUP FILE - SPMI UNIVERSITAS PALEMBANG
 * ==============================================================================
 * File ini digunakan sebagai "Application startup file" di menu Setup Node.js App
 * pada cPanel. File ini akan menjalankan server produksi Next.js.
 * ==============================================================================
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

console.log(`[SPMI UNPAL] Menyiapkan server Next.js (Mode: ${dev ? 'Development' : 'Production'})...`);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error handling request:', req.url, err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    })
      .once('error', (err) => {
        console.error('Server listen error:', err);
        process.exit(1);
      })
      .listen(port, () => {
        console.log(`[SPMI UNPAL] Server aktif dan mendengarkan pada http://${hostname}:${port}`);
        console.log(`[SPMI UNPAL] Node.js version: ${process.version}`);
      });
  })
  .catch((err) => {
    console.error('Failed to prepare Next.js app:', err);
    process.exit(1);
  });
