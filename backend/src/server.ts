import express from "express";
import cors from "cors";

import { config } from "./config/env";
import { router } from "./routes/api";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

// Enable CORS for all requests
app.use(
  cors({
    origin: config.corsOrigin,
  })
);

// Parse incoming requests with JSON payloads
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Handle API routing; send /api requests to API
app.use("/api", router);

// Serve static files from the React build
app.use(express.static("../frontend/dist"));

// Handle React routing; send all other requests to React app
app.get("*", (_req, res) => {
  res.sendFile("../frontend/dist/index.html");
});

// Error handler middleware
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
