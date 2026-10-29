// Parked-copy wrapper for Resonance Frequency on Fly (private, no public services).
// Runs the app's own prebuilt API server (artifacts/api-server/dist) on an
// internal port and serves the app's prebuilt web frontend
// (artifacts/resonance/dist/public) with SPA fallback, proxying /api/* to the
// API process — mirroring how the combined Replit deployment behaved.
// Node stdlib only; the app's own code is unmodified.
import http from "node:http";
import { spawn } from "node:child_process";
import { createReadStream, existsSync, statSync } from "node:fs";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = join(ROOT, "web");
const API_PORT = 8081;
const PORT = Number(process.env.PORT || 8080);

// The prebuilt API bundle has its Replit build-machine path baked in for its
// pino worker files, so in the image the API dist lives at that exact path.
const BAKED_API_ENTRY = "/home/runner/workspace/artifacts/api-server/dist/index.mjs";
const API_ENTRY = existsSync(BAKED_API_ENTRY) ? BAKED_API_ENTRY : join(ROOT, "api", "index.mjs");

const api = spawn("node", ["--enable-source-maps", API_ENTRY], {
  env: { ...process.env, PORT: String(API_PORT) },
  stdio: "inherit",
});
api.on("exit", (code) => {
  console.error(`api server exited with code ${code}`);
  process.exit(code ?? 1);
});

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".map": "application/json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".webmanifest": "application/manifest+json",
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://internal");
  if (url.pathname.startsWith("/api/")) {
    const proxy = http.request(
      { host: "127.0.0.1", port: API_PORT, path: req.url, method: req.method, headers: req.headers },
      (up) => {
        res.writeHead(up.statusCode || 502, up.headers);
        up.pipe(res);
      }
    );
    proxy.on("error", () => {
      if (!res.headersSent) res.writeHead(502);
      res.end("api unavailable");
    });
    req.pipe(proxy);
    return;
  }
  let filePath = normalize(join(WEB_ROOT, decodeURIComponent(url.pathname)));
  if (!filePath.startsWith(WEB_ROOT)) {
    res.writeHead(403);
    res.end();
    return;
  }
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = join(WEB_ROOT, "index.html");
  }
  res.writeHead(200, { "Content-Type": MIME[extname(filePath)] || "application/octet-stream" });
  createReadStream(filePath).pipe(res);
});
server.listen(PORT, () => console.log(`resonance parked server listening on ${PORT}`));
