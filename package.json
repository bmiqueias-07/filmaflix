import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Configurações para o servidor aceitar dados externos e JSON
app.use(cors());
app.use(express.json());

// Conecta ou cria o arquivo do banco de dados na hora
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao SQLite:', err.message);
    } else {
        console.log('⚡ Conectado ao banco de dados SQLite.');
    }
});

// Cria a tabela de filmes se ela não existir
db.run(`
    CREATE TABLE IF NOT EXISTS filmes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        videoUrl TEXT NOT NULL
    )
`);

// ROTA 1: Buscar todos os filmes do banco de dados (Para a sua página inicial)
app.get('/api/filmes', (req, res) => {
    db.all('SELECT * FROM filmes', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// ROTA 2: Cadastrar um novo filme (Para o seu painel de administrador)
app.post('/api/filmes', (req, res) => {
    const { title, category, description, videoUrl } = req.body;

    if (!title || !category || !description || !videoUrl) {
        return res.status(400).json({ error: "Preencha todos os campos obrigatórios." });
    }

    const sql = 'INSERT INTO filmes (title, category, description, videoUrl) VALUES (?, ?, ?, ?)';
    const params = [title, category, description, videoUrl];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(211).json({
            message: "Filme cadastrado no banco de dados com sucesso!",
            id: this.lastID
        });
    });
});

// Inicia o servidor backend na porta 3000
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
