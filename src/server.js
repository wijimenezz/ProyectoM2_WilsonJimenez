import "dotenv/config";
import express from "express";
import routes from "./routes/index.js";
import { errorHandler } from "./Middlewares/globalMiddleware.js";

const app = express();
const PORT = process.env.PORT ||3000;

app.use(express.json());

app.use("/api", routes);



app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})
app.use(errorHandler);