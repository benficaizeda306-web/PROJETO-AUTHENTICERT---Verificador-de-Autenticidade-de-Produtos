const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running!' });
});

// Rota de verificação
app.post('/api/verificar', (req, res) => {
  try {
    const { imagemUrl } = req.body;

    if (!imagemUrl) {
      return res.status(400).json({ sucesso: false, erro: 'imagemUrl é obrigatória' });
    }

    // Simulação de IA
    const marcas = ['NIKE', 'ADIDAS', 'APPLE', 'SAMSUNG', 'GUCCI'];
    const marca = marcas[Math.floor(Math.random() * marcas.length)];
    const autentico = Math.random() > 0.4;
    const confianca = (Math.random() * 100).toFixed(2);

    const resultado = {
      autentico,
      confianca,
      marca_detectada: marca,
      caracteristicas_analisadas: ['logo_original', 'cores_oficiais', 'qualidade_material'],
      problemas_detectados: autentico ? [] : ['qualidade_abaixo_esperado'],
      recomendacao: autentico 
        ? '✅ Produto genuíno - Pode comprar com confiança!'
        : '⚠️ Possível falsificação - Recomendamos verificação adicional'
    };

    const certificadoId = 'AUTH-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    res.json({
      sucesso: true,
      analise: resultado,
      certificado: {
        id: certificadoId,
        data_emissao: new Date().toISOString()
      },
      mensagem: 'Análise concluída com sucesso!'
    });

  } catch (error) {
    console.error('Erro em /api/verificar:', error);
    res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
  }
});

// Rota de estatísticas
app.get('/api/estatisticas', (req, res) => {
  res.json({
    sucesso: true,
    estatisticas: {
      total_verificacoes: 1500,
      produtos_autenticos: 1100,
      produtos_falsos: 400,
      taxa_autenticidade: '73.33%',
      marcas_verificadas: ['NIKE', 'ADIDAS', 'APPLE', 'SAMSUNG', 'GUCCI']
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
