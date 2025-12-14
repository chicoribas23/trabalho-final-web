// Arquivo: ../js/verPlanos.js

// ==============================================================================
// 1. Configuração da API e Obtenção do ID
// ==============================================================================
// **IMPORTANTE**: Substitua o placeholder pela URL real do seu back-end.
const urlBase = "https://back-end-tf-web-i3bt.vercel.app/";

// Obtém o ID do plano da URL (query string)
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Define o valor inicial do campo "id" como "Carregando..."
const inputId = document.getElementById("id");
if (inputId) {
    inputId.value = "Carregando...";
}

// ==============================================================================
// 2. Integração Uploadcare
// ==============================================================================

// Importa o módulo do Uploadcare para gerenciar o upload de arquivos
import * as UC from "https://cdn.jsdelivr.net/npm/@uploadcare/file-uploader@1/web/uc-file-uploader-regular.min.js";

// Define os componentes do Uploadcare
UC.defineComponents(UC);

// Seleciona o componente de upload do Uploadcare
const ctxProvider = document.querySelector("uc-upload-ctx-provider");

var imageUrl = null; // URL da imagem enviada pelo Uploadcare

// Elementos para exibição
var selimg = document.getElementById("selimg"); // Elemento para exibir o nome do arquivo selecionado
const imagemPreview = document.getElementById("imagem-preview"); // Elemento <img> de preview

// Listener para o sucesso do upload no Uploadcare
ctxProvider.addEventListener("common-upload-success", (e) => {
    e.preventDefault();

    // Atualiza o nome do arquivo selecionado e a URL
    selimg.textContent = e.detail.successEntries[0].name;
    imageUrl = e.detail.successEntries[0].cdnUrl; // Captura a nova URL

    // Atualiza o preview com a nova URL
    imagemPreview.src = imageUrl;
});

// ==============================================================================
// 3. Função de Carregamento de Dados (GET)
// ==============================================================================

(async () => {
    // Se não houver ID na URL, aborta e exibe erro
    if (!id) {
        if (inputId) inputId.value = "Erro: ID não encontrado na URL.";
        return;
    }
    
    try {
        const endpoint = `/planos/${id}`;
        const urlFinal = urlBase + endpoint;

        const response = await fetch(urlFinal);

        if (!response.ok) {
            throw new Error(`Erro na requisição GET: ${response.status}`);
        }

        const data = await response.json();
        const plano = data[0] || data; // Pega o primeiro elemento ou o objeto direto

        if (!plano || !plano.id) {
            if (inputId) inputId.value = `Erro: Plano com ID ${id} não encontrado.`;
            return;
        }

        // Preenche os campos do formulário com os dados do plano
        document.getElementById("id").value = plano.id;
        document.getElementById("nome").value = plano.nome;
        document.getElementById("descricao").value = plano.descricao;
        document.getElementById("preco").value = plano.preco; 
        
        // Define a URL da imagem atual para exibição
        if (imagemPreview) {
            imagemPreview.src = plano.imagem_url; 
            // O valor inicial de imageUrl (null) só será substituído se um novo upload ocorrer.
            // O valor do input hidden (se você o mantiver) é desnecessário com esta lógica.
        }

    } catch (error) {
        if (inputId) inputId.value = `Erro ao carregar plano: ${error.message}`;
        console.error("Erro ao carregar plano:", error);
    }
})();


// ==============================================================================
// 4. Função de Salvar/Atualizar (PUT)
// ==============================================================================

// Seleciona o botão "Salvar" e adiciona um listener para capturar o evento de clique
const botaoSalvar = document.getElementById("submit");
botaoSalvar.addEventListener("click", salvarPlano);

// Função para atualizar as informações do plano
async function salvarPlano(e) {
    e.preventDefault(); // Impede o comportamento padrão do botão

    if (!id) {
        alert("ID do plano não encontrado para atualização.");
        return;
    }

    try {
        // Coleta os dados do formulário
        const dados = {
            nome: document.getElementById("nome").value,
            descricao: document.getElementById("descricao").value,
            preco: parseFloat(document.getElementById("preco").value), // Converte para número, se necessário
            // Prioriza a nova URL (imageUrl) se houver um novo upload. 
            // Caso contrário, usa a URL que já está no src da imagem preview (que veio do GET inicial).
            imagem_url: imageUrl || imagemPreview.src, 
        };

        const endpoint = `/planos/${id}`; // Endpoint da API para atualizar o plano
        const urlFinal = urlBase + endpoint; // URL completa da requisição

        // Faz a requisição PUT para atualizar os dados do plano
        const response = await fetch(urlFinal, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dados),
        });

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error("Erro na requisição PUT: " + response.status);
        }

        // Exibe mensagem de sucesso e redireciona para a página de planos
        alert("Plano alterado com sucesso!");
        window.location.href = "planos.html";

    } catch (error) {
        // Exibe mensagem de erro e redireciona para a página de planos
        alert("Plano não alterado: " + error.message);
        window.location.href = "planos.html";
    }
}