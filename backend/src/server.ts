import express from "express";
import cors from "cors";
import { config } from "./config/env";
import { router } from "./routes/api";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(
  cors({
    origin: config.corsOrigin,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.use("*", (_req, res) => res.status(404).json({ error: "Not Found" }));
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
