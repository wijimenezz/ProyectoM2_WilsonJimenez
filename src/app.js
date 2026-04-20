import "dotenv/config";
import express from "express";
import routes from "./routes/index.js";
import { errorHandler } from "./Middlewares/globalMiddleware.js";
import cors from "cors";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", routes);

const swaggerDocument = YAML.load("./openapi.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler);
export default app;
