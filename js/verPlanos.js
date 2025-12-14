// Arquivo: ../js/verPlanos.js

// ==============================================================================
// 1. Configuração da API e Obtenção do ID
// ==============================================================================
const urlBase = "https://back-end-tf-web-i3bt.vercel.app/";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const inputId = document.getElementById("id");
if (inputId) {
    inputId.value = "Carregando...";
}

// ==============================================================================
// 2. Integração Uploadcare (NOVO)
// ==============================================================================

// Importa o módulo do Uploadcare para gerenciar o upload de arquivos
// NOTA: Certifique-se que o <script> no HTML tenha type="module"
import * as UC from "https://cdn.jsdelivr.net/npm/@uploadcare/file-uploader@1/web/uc-file-uploader-regular.min.js";

// Define os componentes do Uploadcare
UC.defineComponents(UC);

// Seleciona o componente de upload do Uploadcare
const ctxProvider = document.querySelector("uc-upload-ctx-provider");

var imageUrl = null; // URL da imagem enviada pelo Uploadcare

// Elementos para exibição
var selimg = document.getElementById("selimg"); 
const imagemPreview = document.getElementById("imagem-preview"); 

// Listener para o sucesso do upload no Uploadcare
ctxProvider.addEventListener("common-upload-success", (e) => {
    e.preventDefault();

    // Atualiza o nome do arquivo selecionado e a URL
    selimg.textContent = `Novo arquivo: ${e.detail.successEntries[0].name}`;
    imageUrl = e.detail.successEntries[0].cdnUrl; 

    // Atualiza o preview com a nova URL
    imagemPreview.src = imageUrl;
});

// ==============================================================================
// 3. Função de Carregamento de Dados (GET)
// ==============================================================================

(async () => {
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
        const plano = data[0] || data; 

        if (!plano || !plano.id) {
            if (inputId) inputId.value = `Erro: Plano com ID ${id} não encontrado.`;
            return;
        }

        // Preenche os campos do formulário
        document.getElementById("id").value = plano.id;
        document.getElementById("nome").value = plano.nome;
        document.getElementById("descricao").value = plano.descricao;
        document.getElementById("preco").value = plano.preco; 
        
        // Define a URL da imagem atual para exibição
        if (imagemPreview) {
            imagemPreview.src = plano.imagem_url; 
        }

    } catch (error) {
        if (inputId) inputId.value = `Erro ao carregar plano: ${error.message}`;
        console.error("Erro ao carregar plano:", error);
    }
})();


// ==============================================================================
// 4. Função de Salvar/Atualizar (PUT)
// ==============================================================================

// Seleciona o botão "Salvar" (submit do formulário)
const botaoSalvar = document.getElementById("submit");
botaoSalvar.addEventListener("click", salvarPlano);

// Função para atualizar as informações do plano
async function salvarPlano(e) {
    e.preventDefault(); 

    if (!id) {
        alert("ID do plano não encontrado para atualização.");
        return;
    }

    try {
        // Coleta os dados do formulário
        const dados = {
            nome: document.getElementById("nome").value,
            descricao: document.getElementById("descricao").value,
            // Certifique-se que o preço é um número
            preco: parseFloat(document.getElementById("preco").value), 
            // Se imageUrl não for null (novo upload), use-o. Senão, use o src da imagem atual.
            imagem_url: imageUrl || imagemPreview.src, 
        };
        
        // Verifica se o preço é válido antes de enviar
        if (isNaN(dados.preco)) {
             throw new Error("O preço informado não é um valor numérico válido.");
        }

        const endpoint = `/planos/${id}`; 
        const urlFinal = urlBase + endpoint; 

        // Faz a requisição PUT
        const response = await fetch(urlFinal, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dados),
        });

        if (!response.ok) {
            throw new Error("Erro na requisição PUT: " + response.status);
        }

        alert("Plano alterado com sucesso!");
        // Redireciona para a página de listagem de planos
        window.location.href = "planos1.html"; 

    } catch (error) {
        console.error("Erro ao alterar plano:", error);
        alert("Plano não alterado: " + error.message);
        // Não redireciona, permite que o usuário tente corrigir
    }
}