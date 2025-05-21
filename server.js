const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const FILE_PATH = path.join(__dirname, 'respostas.txt');

app.use(cors());
app.use(express.json());

// Função para ler todos os dados e transformar em objeto por CPF
function lerRespostasComoObjeto() {
  if (!fs.existsSync(FILE_PATH)) return {};
  const conteudo = fs.readFileSync(FILE_PATH, 'utf-8');
  const blocos = conteudo.split(/\n\n+/).filter(Boolean);
  const dados = {};
  blocos.forEach(b => {
    const linhas = b.split('\n');
    const nome = linhas[0]?.replace('Nome: ', '').trim();
    const cpf = linhas[1]?.replace('CPF: ', '').trim();
    const parcelas = linhas[2]?.replace('Parcelas: ', '').trim();
    const tipoConta = linhas[3]?.replace('Conta: ', '').trim();
    const data = linhas[4]?.replace('Data: ', '').trim();
    if (cpf) {
      dados[cpf] = { nome, cpf, parcelas, tipoConta, data };
    }
  });
  return dados;
}

// Função para salvar o objeto de volta no .txt
function salvarRespostasComoTexto(dados) {
  const blocos = Object.values(dados).map(d =>
    `Nome: ${d.nome}\nCPF: ${d.cpf}\nParcelas: ${d.parcelas}\nConta: ${d.tipoConta}\nData: ${d.data}`
  );
  fs.writeFileSync(FILE_PATH, blocos.join('\n\n'));
}

app.post('/salvar', (req, res) => {
  const { nome, cpf, parcelas, tipoConta, data } = req.body;
  if (!nome || !cpf) return res.status(400).send('Nome e CPF obrigatórios.');
  const dados = lerRespostasComoObjeto();
  dados[cpf] = { nome, cpf, parcelas, tipoConta, data };
  salvarRespostasComoTexto(dados);
  res.send('Atualizado com sucesso.');
});

app.get('/respostas.txt', (req, res) => {
  if (!fs.existsSync(FILE_PATH)) return res.send('');
  res.sendFile(FILE_PATH);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
