import express from "express";
import cors from "cors";
import helmet from "helmet";
import healthRouter from "./routes/health.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10kb" }));

// Routes
app.use("/api/health", healthRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: {
      code: err.code || "INTERNAL_ERROR",
      message: err.message || "An unexpected error occurred",
    },
  });
});

export default app;
