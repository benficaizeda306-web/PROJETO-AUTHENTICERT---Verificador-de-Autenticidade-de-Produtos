// SERVIDOR AUTHENTICERT - SEM SUPABASE (PARA TESTE)
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Simulando um "banco de dados" em memória
let verificacoes = [];

// IA para Verificação
class SistemaIA {
  constructor() {
    this.marcasReconhecidas = [
      'NIKE', 'ADIDAS', 'APPLE', 'SAMSUNG', 'GUCCI', 
      'ROLEX', 'LOUIS VUITTON', 'PRADA', 'RAY-BAN', 'OAKLEY'
    ];
  }

  analisarProduto(imagemBase64) {
    console.log('🤖 IA: Analisando produto...');
    
    const marcaIndex = Math.floor(Math.random() * this.marcasReconhecidas.length);
    const marca = this.marcasReconhecidas[marcaIndex];
    const scoreAutenticidade = Math.random() * 100;
    const autentico = scoreAutenticidade > 65;
    
    return {
      autentico: autentico,
      confianca: scoreAutenticidade.toFixed(2),
      marca_detectada: marca,
      caracteristicas_analisadas: [
        'logo_original',
        'cores_oficiais', 
        'qualidade_material',
        'acabamento_premium'
      ],
      problemas_detectados: autentico ? [] : ['qualidade_abaixo_esperado'],
      recomendacao: autentico 
        ? '✅ Produto genuíno - Pode comprar com confiança!'
        : '⚠️ Possível falsificação - Recomendamos verificação adicional'
    };
  }
}

const ia = new SistemaIA();

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({
    status: '✅ ONLINE',
    message: 'Authenticert - Backend SIMPLES (sem banco)',
    timestamp: new Date().toISOString(),
    total_verificacoes: verificacoes.length
  });
});

// Rota principal - Verificação
app.post('/api/verificar', (req, res) => {
  try {
    const { imagemUrl } = req.body;
    
    if (!imagemUrl) {
      return res.status(400).json({
        sucesso: false,
        erro: 'URL da imagem é obrigatória'
      });
    }

    console.log('🔄 Iniciando verificação...');

    // 1. Análise com IA
    const resultadoIA = ia.analisarProduto(imagemUrl);
    
    // 2. Gerar certificado único
    const certificadoId = 'AUTH-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    // 3. Salvar em memória
    const verificacao = {
      imagem_url: imagemUrl.substring(0, 500),
      resultado: resultadoIA,
      certificado_id: certificadoId,
      data_criacao: new Date().toISOString()
    };
    verificacoes.push(verificacao);

    console.log('✅ Verificação salva em memória!');

    // 4. Retornar resultado
    res.json({
      sucesso: true,
      certificado: {
        id: certificadoId,
        data_emissao: new Date().toISOString()
      },
      analise: resultadoIA,
      mensagem: 'Análise concluída com sucesso!'
    });

  } catch (error) {
    console.error('💥 Erro na verificação:', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro interno: ' + error.message
    });
  }
});

// Buscar certificado
app.get('/api/certificado/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const verificacao = verificacoes.find(v => v.certificado_id === id);

    if (!verificacao) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Certificado não encontrado'
      });
    }

    res.json({
      sucesso: true,
      certificado: verificacao
    });

  } catch (error) {
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao buscar certificado'
    });
  }
});

// Estatísticas
app.get('/api/estatisticas', (req, res) => {
  try {
    const total = verificacoes.length;
    const autenticos = verificacoes.filter(v => v.resultado.autentico).length;
    const falsos = total - autenticos;
    const marcas = [...new Set(verificacoes.map(v => v.resultado.marca_detectada))];

    res.json({
      sucesso: true,
      estatisticas: {
        total_verificacoes: total,
        produtos_autenticos: autenticos,
        produtos_falsos: falsos,
        taxa_autenticidade: total > 0 ? ((autenticos / total) * 100).toFixed(2) + '%' : '0%',
        marcas_verificadas: marcas
      }
    });

  } catch (error) {
    res.json({
      sucesso: true,
      estatisticas: {
        total_verificacoes: 0,
        produtos_autenticos: 0,
        produtos_falsos: 0,
        taxa_autenticidade: '0%',
        marcas_verificadas: []
      }
    });
  }
});

// Listar verificações
app.get('/api/verificacoes', (req, res) => {
  try {
    const { limite = 20 } = req.query;
    const verificacoesRecentes = verificacoes
      .sort((a, b) => new Date(b.data_criacao) - new Date(a.data_criacao))
      .slice(0, parseInt(limite));

    res.json({
      sucesso: true,
      verificacoes: verificacoesRecentes,
      total: verificacoesRecentes.length
    });

  } catch (error) {
    res.json({
      sucesso: true,
      verificacoes: [],
      total: 0
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('🚀 AUTHENTICERT - BACKEND SIMPLES INICIADO!');
  console.log(`📍 Porta: ${PORT}`);
  console.log(`🌐 Health: http://localhost:${PORT}/api/health`);
});
