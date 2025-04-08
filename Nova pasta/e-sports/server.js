const express = require('express');
const app = express();
const port = 3000;

// Servir arquivos estáticos
app.use(express.static('./'));

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});