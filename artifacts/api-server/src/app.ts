import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// Build a list of allowed origins:
// - ALLOWED_ORIGIN: set this to your Vercel frontend URL in Render's env vars
// - Always include localhost variants for local development
const allowedOrigins = new Set<string>([
  "http://localhost:5173",
  "http://localhost:4173",
]);

if (process.env.ALLOWED_ORIGIN) {
  // Support comma-separated list: e.g. "https://my-app.vercel.app,https://www.mycustomdomain.com"
  process.env.ALLOWED_ORIGIN.split(",").forEach((o) =>
    allowedOrigins.add(o.trim())
  );
}

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(
  cors({
    origin: "*",
    
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
