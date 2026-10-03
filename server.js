const express = require('express');
const cors = require('cors');

const app = express();

// Configura o CORS para permitir requisições do Netlify
app.use(cors());
app.use(express.json());

// Token de autenticação da Tecla e URL base da API
const SYSCONSULT_TOKEN = 'Bearer G7k2P9x4M1q8R5zC';
const API_BASE_URL = 'https://gestaoapi.teclaconsultoria.com.br/api/Sysconsult';

// Rota raiz para testar se o servidor está no ar
app.get('/', (req, res) => {
    res.send('Servidor Proxy Sysconsult a rodar com sucesso!');
});

// Rota POST que recebe os dados do frontend e reencaminha para a API da Tecla
app.post('/api/register', async (req, res) => {
    try {
        const apiResponse = await fetch(`${API_BASE_URL}/UserRegister`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers['authorization'] || SYSCONSULT_TOKEN
            },
            body: JSON.stringify(req.body)
        });

        const data = await apiResponse.json();
        res.status(apiResponse.status).json(data);
    } catch (error) {
        console.error('Erro no proxy:', error);
        res.status(500).json({ error: 'Erro ao conectar à API da Tecla', details: error.message });
    }
});

// Definição da porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor a rodar na porta ${PORT}`);
});