import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { globalLimiter } from "./middleware/rateLimit.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";
import healthRouter from "./routes/health.js";
import authRouter from "./routes/authRoutes.js";
import slotRouter from "./routes/slotRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import crowdRouter from "./routes/crowdRoutes.js";
import alertRouter from "./routes/alertRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import sseRouter from "./routes/sseRoutes.js";

const app = express();

app.use(helmet());

const allowedOrigins = env.CORS_ORIGIN.split(",").map((origin) => origin.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(globalLimiter);

// Routes
app.use("/api/health", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/slots", slotRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/crowd", crowdRouter);
app.use("/api/v1/alerts", alertRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/stream", sseRouter);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
