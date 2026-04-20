import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { authRouter } from "./modules/auth/routes.js";
import { addressRouter } from "./modules/address/routes.js";
import { wasteTransactionRouter } from "./modules/waste-transaction/routes.js";
import { userRouter } from "./modules/user/route.js";
import { env } from "./config/index.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.js";
import cors from "cors";
import { openApiDocument } from "./docs/openapi.js";

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use("/auth", authRouter);
app.use("/", userRouter);
app.use("/", addressRouter);
app.use("/", wasteTransactionRouter);

app.use(notFoundHandler);
app.use(errorHandler);

