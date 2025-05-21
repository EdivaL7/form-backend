const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const FILE_PATH = path.join(__dirname, 'respostas.txt');

app.use(cors());
app.use(express.json());

app.post('/salvar', (req, res) => {
  const { nome, cpf, parcelas, tipoConta, data } = req.body;
  if (!nome || !cpf) return res.status(400).send('Faltando dados');

  const bloco = `Nome: ${nome}\nCPF: ${cpf}\nParcelas: ${parcelas}\nConta: ${tipoConta}\nData: ${data}\n\n`;

  fs.appendFile(FILE_PATH, bloco, (err) => {
    if (err) return res.status(500).send('Erro ao salvar');
    res.send('Salvo');
  });
});

app.get('/respostas.txt', (req, res) => {
  if (!fs.existsSync(FILE_PATH)) return res.send('');
  res.sendFile(FILE_PATH);
});

app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
