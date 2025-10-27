// AUTHENTICERT - BACKEND DE EMERGÊNCIA (100% FUNCIONAL)
const express = require('express');
const cors = require('cors');

const app = express();

// Configuração CRÍTICA para Render
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ✅ ROTA DE SAÚDE - TESTE ESTA PRIMEIRO
app.get('/api/health', (req, res) => {
  console.log('✅ Health check recebido');
  res.json({
    status: '✅ ONLINE',
    message: 'Authenticert Emergency Backend - FUNCIONANDO!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ✅ ROTA DE VERIFICAÇÃO SIMULADA
app.post('/api/verificar', (req, res) => {
  try {
    const { imagemUrl } = req.body;
    
    if (!imagemUrl) {
      return res.status(400).json({
        sucesso: false,
        erro: 'URL da imagem é obrigatória'
      });
    }

    console.log('📸 Imagem recebida, processando...');

    // Simulação de IA
    const marcas = ['NIKE', 'ADIDAS', 'APPLE', 'SAMSUNG', 'GUCCI', 'ROLEX'];
    const marcaAleatoria = marcas[Math.floor(Math.random() * marcas.length)];
    const autentico = Math.random() > 0.4;
    const confianca = (Math.random() * 40 + 60).toFixed(2);

    const resultado = {
      autentico: autentico,
      confianca: confianca,
      marca_detectada: marcaAleatoria,
      caracteristicas_analisadas: [
        'logo_original',
        'cores_oficiais',
        'qualidade_material'
      ],
      problemas_detectados: autentico ? [] : ['qualidade_abaixo_do_esperado'],
      recomendacao: autentico 
        ? '✅ Produto genuíno - Pode comprar com confiança!'
        : '⚠️ Possível falsificação - Recomendamos verificação adicional'
    };

    // Simular tempo de processamento
    setTimeout(() => {
      res.json({
        sucesso: true,
        analise: resultado, // ✅ Note: agora é "analise" e não "resultado"
        certificado: {
          id: 'AUTH-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          data_emissao: new Date().toISOString()
        },
        mensagem: 'Análise concluída com sucesso!'
      });
    }, 2000);

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro interno: ' + error.message
    });
  }
});

// ✅ ROTA DE ESTATÍSTICAS SIMULADA
app.get('/api/estatisticas', (req, res) => {
  res.json({
    sucesso: true,
    estatisticas: {
      total_verificacoes: 1542,
      produtos_autenticos: 1120,
      produtos_falsos: 422,
      taxa_autenticidade: '72.63%',
      marcas_verificadas: ['NIKE', 'ADIDAS', 'APPLE', 'SAMSUNG', 'GUCCI']
    }
  });
});

// ✅ ROTA DE CERTIFICADO SIMULADA
app.get('/api/certificado/:id', (req, res) => {
  res.json({
    sucesso: true,
    certificado: {
      id: req.params.id,
      imagem_url: 'https://example.com/produto.jpg',
      resultado: {
        autentico: true,
        confianca: '95.50',
        marca_detectada: 'NIKE'
      },
      data_criacao: new Date().toISOString()
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de emergência rodando na porta ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
