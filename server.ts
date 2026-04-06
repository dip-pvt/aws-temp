import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import os from "os";
import axios from "axios";

async function getAWSMetadata() {
  const IMDS_URL = "http://169.254.169.254/latest/api/token";
  const METADATA_URL = "http://169.254.169.254/latest/meta-data/";

  try {
    // Try to get IMDSv2 token
    const tokenResponse = await axios.put(IMDS_URL, null, {
      headers: { "X-aws-ec2-metadata-token-ttl-seconds": "21600" },
      timeout: 1000,
    });
    const token = tokenResponse.data;

    const fetch = async (path: string) => {
      const res = await axios.get(`${METADATA_URL}${path}`, {
        headers: { "X-aws-ec2-metadata-token": token },
        timeout: 1000,
      });
      return res.data;
    };

    return {
      instanceId: await fetch("instance-id"),
      availabilityZone: await fetch("placement/availability-zone"),
      publicIp: await fetch("public-ipv4").catch(() => "N/A"),
      privateIp: await fetch("local-ipv4"),
      publicDns: await fetch("public-hostname").catch(() => "N/A"),
      region: (await fetch("placement/availability-zone")).slice(0, -1),
    };
  } catch (error) {
    return null; // Not on AWS or IMDS disabled
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/api/metadata", async (req, res) => {
    console.log("Fetching metadata...");
    try {
      const aws = await getAWSMetadata();
      const system = {
        hostname: os.hostname(),
        platform: os.platform(),
        uptime: os.uptime(),
        load: os.loadavg(),
        memory: {
          total: os.totalmem(),
          free: os.freemem(),
        },
        network: os.networkInterfaces(),
      };

      res.json({
        aws,
        system,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error in /api/metadata:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Prevent API requests from falling through to SPA fallback
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: "API route not found" });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
