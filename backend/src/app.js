//chamando os "programas" que vamos usar agora
const express = require('express');
const cors = require('cors');

const app = express();

// Permite receber JSON
app.use(express.json());

// Libera acesso do frontend
app.use(cors());

module.exports = app;