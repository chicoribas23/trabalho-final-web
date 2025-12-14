// Arquivo: ../js/verPlanos.js

// 1. Definição da URL base da API
// **IMPORTANTE**: Substitua o placeholder pela URL real do seu back-end.
const urlBase = "https://back-end-tf-web-i3bt.vercel.app"; 

// 2. Obtém o ID do plano da URL (query string)
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// 3. Elementos do Formulário
const formEditarPlano = document.getElementById("form-editar-plano"); 
const inputId = document.getElementById("id");

if (inputId) {
    inputId.value = "Carregando...";
}

// =========================================================================
// FUNÇÃO DE CARREGAMENTO (GET - Carrega os dados para edição)
// =========================================================================

// Função autoexecutável para buscar os dados do plano pelo ID
(async () => {
    if (!id) {
        if (inputId) inputId.value = "Erro: ID não encontrado na URL.";
        return;
    }
    
    try {
        const endpoint = `/planos/${id}`;
        const urlFinal = urlBase + endpoint;

        // Faz a requisição GET
        const response = await fetch(urlFinal);

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const plano = await response.json(); 

        if (!plano || !plano.id_plano) {
             if (inputId) inputId.value = `Erro: Plano com ID ${id} não encontrado.`;
             return;
        }

        // 4. Preenche os campos do formulário
        document.getElementById("id").value = plano.id_plano;
        document.getElementById("nome").value = plano.nome;
        document.getElementById("descricao").value = plano.descricao;
        document.getElementById("preco").value = plano.preco; 
        
        // Preenche o campo de URL atual (Hidden) e a pré-visualização
        const imagemPreview = document.getElementById("imagem-preview");
        // ATENÇÃO: 'caminho_arquivo_foto_atual' deve ser o ID do input hidden no HTML
        const imagemUrlAtual = document.getElementById("caminho_arquivo_foto_atual"); 
        
        if (imagemPreview && plano.caminho_arquivo_foto) {
            imagemPreview.src = plano.caminho_arquivo_foto;
        }

        if (imagemUrlAtual) {
            imagemUrlAtual.value = plano.caminho_arquivo_foto; // Salva a URL antiga
        }

    } catch (error) {
        if (inputId) inputId.value = `Erro ao carregar plano: ${error.message}`;
        console.error("Erro ao carregar plano:", error);
    }
})();


// =========================================================================
// FUNÇÃO DE ATUALIZAÇÃO (PUT - Envia os dados editados)
// =========================================================================

// Adiciona um listener para o evento de SUBMIT do formulário
if (formEditarPlano) {
    formEditarPlano.addEventListener("submit", atualizarPlano);
}


async function atualizarPlano(e) {
    e.preventDefault(); // Impede o comportamento padrão do submit

    if (!id) {
        alert("ID do plano não encontrado para atualização.");
        return;
    }

    // 1. Coleta os dados em FormData
    const formData = new FormData();
    
    // 2. Verifica se o campo de arquivo está preenchido
    const arquivoImagem = document.getElementById("imagem_plano").files[0];
    const urlAtual = document.getElementById("caminho_arquivo_foto_atual").value;
    
    // 3. Monta o objeto JSON para enviar ao Back-end (PUT)
    // ATENÇÃO: Seu server.js (Back-end) não está configurado para receber arquivos
    // via PUT. Por isso, estamos enviando a URL antiga ou a URL da nova imagem
    // (se o seu Back-end tratar o upload em JSON, o que é incomum).
    
    const dados = {
        nome: document.getElementById("nome").value,
        descricao: document.getElementById("descricao").value,
        preco: document.getElementById("preco").value,
        // Mantém o campo de URL se nenhuma nova imagem foi selecionada
        caminho_arquivo_foto: arquivoImagem ? "" : urlAtual // Se arquivoImagem existe, o Back-end deve processá-lo
    };
    
    // Se você estiver usando o Uploadcare (que envia URL no campo), você colocaria aqui:
    // caminho_arquivo_foto: arquivoImagem ? nova_url_do_uploadcare : urlAtual

    try {
        const endpoint = `/planos/${id}`;
        const urlFinal = urlBase + endpoint;

        // Faz a requisição PUT (enviando JSON)
        const response = await fetch(urlFinal, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json", 
            },
            body: JSON.stringify(dados),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro na requisição: ${response.status}. Detalhe: ${errorData.erro || response.statusText}`);
        }

        alert("Plano atualizado com sucesso!");
        // Redireciona para a lista
        window.location.href = "planos1.html"; 

    } catch (error) {
        console.error("Erro ao atualizar plano:", error);
        alert(`Plano não atualizado. Detalhe: ${error.message}`);
    }
}