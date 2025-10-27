// SERVIDOR COMPLETO AUTHENTICERT COM SUPABASE
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Configuração do Supabase - SUBSTITUA COM SUAS CREDENCIAIS!
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Simulação de IA para verificação
function analisarProdutoComIA(imagemUrl) {
  console.log('🔍 Analisando produto com IA...');
  
  const marcas = ['NIKE', 'ADIDAS', 'APPLE', 'SAMSUNG', 'GUCCI', 'ROLEX'];
  const aleatorio = Math.random();
  
  return {
    autentico: aleatorio > 0.4, // 60% de chance de ser autêntico
    confianca: (aleatorio * 100).toFixed(2),
    marca_detectada: marcas[Math.floor(Math.random() * marcas.length)],
    caracteristicas: [
      'logo_original',
      'cores_autenticas', 
      'qualidade_material',
      'proporcoes_corretas'
    ],
    detalhes: aleatorio > 0.4 
      ? 'Produto apresenta todas características de autenticidade'
      : 'Possíveis indícios de falsificação detectados'
  };
}

// Rota de saúde
app.get('/api/health', async (req, res) => {
  try {
    // Testar conexão com Supabase
    const { data, error } = await supabase.from('verificacoes').select('count');
    
    res.json({
      status: '✅ ONLINE',
      message: 'Authenticert + Supabase funcionando!',
      database: error ? '❌ ERRO' : '✅ CONECTADO',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      status: '⚠️ ONLINE COM ERROS',
      message: 'Backend online mas com problemas no banco',
      error: error.message
    });
  }
});

// Rota principal - Verificar produto
app.post('/api/verificar', async (req, res) => {
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
    const resultadoIA = analisarProdutoComIA(imagemUrl);
    
    // 2. Gerar ID único do certificado
    const certificadoId = 'CERT_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // 3. Salvar no banco de dados
    const { data, error } = await supabase
      .from('verificacoes')
      .insert([
        {
          imagem_url: imagemUrl,
          resultado: resultadoIA,
          certificado_id: certificadoId
        }
      ])
      .select();

    if (error) {
      console.error('❌ Erro no Supabase:', error);
      throw error;
    }

    console.log('✅ Verificação salva no banco!');

    // 4. Retornar resultado
    res.json({
      sucesso: true,
      resultado: resultadoIA,
      certificado_id: certificadoId,
      certificado_url: `/certificado/${certificadoId}`,
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

// Buscar certificado específico
app.get('/api/certificado/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('verificacoes')
      .select('*')
      .eq('certificado_id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Certificado não encontrado'
      });
    }

    res.json({
      sucesso: true,
      certificado: data
    });

  } catch (error) {
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao buscar certificado'
    });
  }
});

// Listar todas verificações
app.get('/api/verificacoes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('verificacoes')
      .select('*')
      .order('data_criacao', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json({
      sucesso: true,
      verificacoes: data,
      total: data.length
    });

  } catch (error) {
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao buscar verificações'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Authenticert rodando na porta ${PORT}`);
  console.log(`🔗 Health: http://localhost:${PORT}/api/health`);
  console.log(`📊 Supabase: ${supabaseUrl ? '✅ Configurado' : '❌ Não configurado'}`);
});
