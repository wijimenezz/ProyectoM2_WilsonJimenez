import "dotenv/config";
import express from "express";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT ||3000;

app.use(express.json());

app.use("/api", routes);



app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})