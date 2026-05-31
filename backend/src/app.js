const express = require('express');
const cors = require('cors');

const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');
const dbTestRoutes = require('./routes/dbTestRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const funcionarioRoutes =
    require('./routes/funcionarioRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/', testRoutes);
app.use('/auth', authRoutes);

module.exports = app;

app.use('/', dbTestRoutes);
app.use('/api', protectedRoutes);
app.use('/funcionarios', funcionarioRoutes);