/**
 * Local dev server — bridges Vite's proxy to the Vercel API handler.
 * Run with: node api/dev-server.mjs
 * (the `npm run dev:api` script does this automatically)
 *
 * Requires ANTHROPIC_API_KEY in your environment or a .env file in the root.
 */

import 'dotenv/config';
import http from 'node:http';

const PORT = 3001;

// Vercel handler uses ESM default export — load it via dynamic import so
// tsx/Node can resolve the TypeScript source at runtime via tsx.
const { default: generateHandler } = await import('./generate.ts');

const server = http.createServer(async (req, res) => {
  // Parse body
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString();

  let body = {};
  try { body = JSON.parse(raw); } catch { /* leave as empty object */ }

  // Minimal Vercel-compatible req/res shim
  const shimReq = {
    method: req.method,
    headers: req.headers,
    body,
  };

  const shimRes = {
    _status: 200,
    _headers: {},
    status(code) { this._status = code; return this; },
    setHeader(k, v) { this._headers[k] = v; return this; },
    json(data) {
      res.writeHead(this._status, { 'Content-Type': 'application/json', ...this._headers });
      res.end(JSON.stringify(data));
    },
  };

  try {
    await generateHandler(shimReq, shimRes);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Dev server error', details: String(err) }));
  }
});

server.listen(PORT, () => {
  console.log(`API dev server running at http://localhost:${PORT}`);
});
