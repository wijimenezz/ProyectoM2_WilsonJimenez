import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`🌐 Local: http://localhost:${PORT}/api-docs`);
  console.log(
    `🌍 Producción: https://proyectom2wilsonjimenez-production.up.railway.app/api-docs`,
  );
});
