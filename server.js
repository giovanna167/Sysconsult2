const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const SYSCONSULT_TOKEN = 'Bearer G7k2P9x4M1q8R5zC';
const API_BASE_URL = 'https://gestaoapi.teclaconsultoria.com.br/api/Sysconsult';


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
    return res.status(apiResponse.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Informe o e-mail para acessar.' });
    }

    const apiResponse = await fetch(`${API_BASE_URL}/UserByEmail?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Authorization': req.headers['authorization'] || SYSCONSULT_TOKEN
      }
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok || data.error) {
      return res.status(404).json({ error: data.error || 'Utilizador não encontrado na base de dados.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso!',
      user: data.User,
      clinic: data.Clinic
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Proxy rodando em http://localhost:3000'));