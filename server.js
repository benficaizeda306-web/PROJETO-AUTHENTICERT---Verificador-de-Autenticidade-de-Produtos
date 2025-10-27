const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(require('cors')());

// Rota simples de teste
app.get('/', (req, res) => {
  res.json({ message: '✅ Authenticert está funcionando!' });
});

// Health check para Railway
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Servidor Authenticert online! 🚀'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🎉 Servidor rodando na porta ${PORT}`);
  console.log(`🔗 Acesse: http://localhost:${PORT}`);
});
