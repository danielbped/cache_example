const express = require("express");
const redisClient = require("./redis");

const app = express();
const PORT = 3000;

app.get("/perifericos", async (req, res) => {
  try {
    if (!redisClient.isOpen) redisClient.connect();

    const data = await redisClient.get("perifericos");
    // Verificamos se existem os dados armazenados no cache, caso existam, estes serão retornados
    if (data) {
      const response = JSON.parse(data);
      return res.status(200).json(response);
    }

    // Caso não existam estes dados no cache, consultaríamos o banco de dados original,
    // buscaríamos os dados e salvaríamos em cache
    const perifericos = [
      { id: 1, name: "Teclado Mecânico" },
      { id: 2, name: "Mouse Ergonômico" },
      { id: 3, name: "Monitor Ultrawide" },
    ];

    // Armazenando os dados por 60 segundos
    await redisClient.set(
      "perifericos",
      JSON.stringify(perifericos),
      "EX",
      60
    );
    res.status(200).json(perifericos);
  } catch (err) {
    console.error("Error", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
