import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/error-handler";
import { routes } from "./routes";

export const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN,
    credentials: true
  })
);
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ status: "ok", app: "FinTrack API" });
});

app.use(routes);
app.use(errorHandler);
