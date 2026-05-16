import "reflect-metadata";
import express from "express";
import resourceRoutes from "./routes/resource.route";
import { SqliteDataSource } from "./utils/data-source";
import config from "./config/config";
import { logger } from "./middleware/logger";

const app = express();

app.use(logger);

app.use(express.json());

app.use("/api", resourceRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", environment: config.nodeEnv });
});

SqliteDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(config.port, () => {
      console.log(`Server is running on http://localhost:${config.port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });

export default app;
