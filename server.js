/**
 * ==============================================================================
 * CPANEL APPLICATION STARTUP FILE - SPMI UNIVERSITAS PALEMBANG
 * ==============================================================================
 * File ini digunakan sebagai "Application startup file" di menu Setup Node.js App
 * pada cPanel. Mendukung Phusion Passenger dan standalone Node server.
 * ==============================================================================
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 3000;

console.log(`[SPMI UNPAL] Menyiapkan server Next.js (Mode: ${dev ? 'Development' : 'Production'})...`);

const app = next({ dev, hostname, port: typeof port === 'number' ? port : 3000 });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error handling request:', req.url, err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });

    server.once('error', (err) => {
      console.error('Server listen error:', err);
      process.exit(1);
    });

    // Dukungan resmi Phusion Passenger di cPanel
    if (typeof PhusionPassenger !== 'undefined') {
      server.listen('passenger');
      console.log('[SPMI UNPAL] Server aktif di bawah Phusion Passenger cPanel');
    } else {
      server.listen(port, () => {
        console.log(`[SPMI UNPAL] Server aktif pada port: ${port}`);
      });
    }
  })
  .catch((err) => {
    console.error('Failed to prepare Next.js app:', err);
    process.exit(1);
  });
