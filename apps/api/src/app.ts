import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { allowedOrigins } from "./config/security.js";
import { authRouter } from "./routes/auth.routes.js";
import { carbonRouter } from "./routes/carbon.routes.js";
import { dashboardRouter } from "./routes/dashboard.routes.js";
import { challengeRouter } from "./routes/challenge.routes.js";
import { blogRouter } from "./routes/blog.routes.js";
import { offsetRouter } from "./routes/offset.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { insightsRouter } from "./routes/insights.routes.js";
import { chatRouter } from "./routes/chat.routes.js";
import { publicRouter } from "./routes/public.routes.js";
import { errorHandler, notFound } from "./middleware/error.js";

export const app = express();
app.set("trust proxy", 1);

const getRateLimitKey = (request: express.Request) => {
  const forwardedFor = request.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0]?.trim() || "anonymous";
  }

  if (Array.isArray(forwardedFor) && forwardedFor[0]) {
    return forwardedFor[0];
  }

  return request.ip ? ipKeyGenerator(request.ip) : "anonymous";
};

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS policy."));
    },
    credentials: true
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);
app.use(compression());
app.use(
  rateLimit({
    windowMs: 1000 * 60 * 15,
    limit: 250,
    keyGenerator: getRateLimitKey,
    standardHeaders: true,
    legacyHeaders: false
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", service: "EcoTrack AI API" });
});

app.use("/api/auth", authRouter);
app.use("/api/carbon", carbonRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/challenges", challengeRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/offsets", offsetRouter);
app.use("/api/admin", adminRouter);
app.use("/api/insights", insightsRouter);
app.use("/api/chat", chatRouter);
app.use("/api/public", publicRouter);

app.use(notFound);
app.use(errorHandler);
