import express from "express";
import { createServer as createViteServer } from "vite";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Routes
  app.get("/api/system-info", async (req, res) => {
    try {
      const cpus = os.cpus();
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      
      const networkInterfaces = os.networkInterfaces();
      const interfaces = Object.keys(networkInterfaces).map(name => ({
        name,
        details: networkInterfaces[name]
      }));

      // Get Disk Info (Node 18.15.0+)
      let diskInfo = null;
      try {
        const stats = await fs.statfs("/");
        diskInfo = {
          total: stats.bsize * stats.blocks,
          free: stats.bsize * stats.bfree,
          available: stats.bsize * stats.bavail,
          used: stats.bsize * (stats.blocks - stats.bfree),
        };
      } catch (e) {
        console.error("Disk info error:", e);
      }

      res.json({
        platform: os.platform(),
        release: os.release(),
        arch: os.arch(),
        uptime: os.uptime(),
        hostname: os.hostname(),
        cpu: {
          model: cpus[0].model,
          cores: cpus.length,
          speed: cpus[0].speed,
          loadAvg: os.loadavg() // [1, 5, 15 min]
        },
        memory: {
          total: totalMem,
          free: freeMem,
          used: usedMem,
          usagePercent: ((usedMem / totalMem) * 100).toFixed(2)
        },
        disk: diskInfo,
        network: interfaces,
        process: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          pid: process.pid,
          version: process.version
        },
        userInfo: os.userInfo()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to gather system info" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
