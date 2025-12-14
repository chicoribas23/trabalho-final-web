// Arquivo: ../js/gerenciarPlanos.js (MODIFICADO)

// 1. Definição da URL base da API
const urlBase = "https://back-end-tf-web-i3bt.vercel.app/";

// 2. "Pegando" os elementos HTML
// USANDO ID: 'lista-planos' (Corpo da tabela)
const listaPlanos = document.getElementById("lista-planos"); 
// Elementos da busca
const campoBusca = document.getElementById("campo-busca");   
const botaoBuscar = document.getElementById("botao-buscar"); 

// =========================================================================
// FUNÇÃO DE CARREGAMENTO/BUSCA (READ)
// =========================================================================

/**
 * Função principal para buscar e exibir os planos.
 * @param {string} termoBusca - O termo de busca a ser enviado à API.
 */
async function carregarPlanos(termoBusca = "") {
    if (!listaPlanos) {
        console.error("Erro: O elemento com ID 'lista-planos' não foi encontrado no HTML.");
        return;
    }

    listaPlanos.innerHTML = "<tr><td colspan='5'>Aguarde, carregando planos...</td></tr>";

    try {
        let endpoint = "/planos";
        
        // Adiciona o termo de busca à URL
        if (termoBusca.trim() !== "") {
            // Usa 'q' para busca global (padrão JSON Server)
            endpoint += `?q=${encodeURIComponent(termoBusca.trim())}`;
        }
        
        const urlFinal = urlBase + endpoint;

        const response = await fetch(urlFinal);

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        listaPlanos.innerHTML = ""; // Limpa o "Carregando"
        
        if (data.length === 0) {
            listaPlanos.innerHTML = `<tr><td colspan='5'>Nenhum plano encontrado ${termoBusca ? `para "${termoBusca}"` : ''}.</td></tr>`;
            return;
        }

        data.forEach((plano) => {
            const precoFormatado = parseFloat(plano.preco).toFixed(2).replace('.', ',');

            const linha = document.createElement("tr");
            
            linha.innerHTML = `
                <td>${plano.id}</td>
                <td>${plano.nome}</td>
                <td>${plano.descricao}</td>
                <td>R$ ${precoFormatado}</td>
                <td>
                    <a class="botao editar" href="verPlanos.html?id=${plano.id}">Editar</a>
                    <a class="botao excluir" data-id="${plano.id}" data-nome="${plano.nome}">Excluir</a>
                </td>
            `;
            listaPlanos.appendChild(linha);
        });
    } catch (error) {
        listaPlanos.innerHTML = `<tr><td colspan='5' style='color: red;'>
            Erro ao carregar planos. Detalhe: ${error.message}
        </td></tr>`;
    }
}

// =========================================================================
// GATILHOS DA BUSCA E INICIALIZAÇÃO
// =========================================================================

// Gatilho para iniciar a busca no clique do botão
if (botaoBuscar) {
    botaoBuscar.addEventListener("click", () => {
        carregarPlanos(campoBusca.value);
    });
}

// Gatilho para iniciar a busca ao pressionar Enter no campo
if (campoBusca) {
    campoBusca.addEventListener("keypress", (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            carregarPlanos(campoBusca.value);
        }
    });
}

// Carrega os planos ao iniciar a página
document.addEventListener("DOMContentLoaded", () => {
    carregarPlanos();
});


// =========================================================================
// FUNÇÕES DE EXCLUSÃO (DELETE)
// =========================================================================

// Gatilho para lidar com ações de clique na tabela
if (listaPlanos) {
    listaPlanos.addEventListener("click", acao);
}

// Função para lidar com ações de clique na tabela
function acao(e) {
    if (e.target.classList.contains("excluir")) {
        e.preventDefault(); 
        
        const id = e.target.getAttribute("data-id"); 
        const nome = e.target.getAttribute("data-nome"); 

        if (confirm(`Tem certeza que deseja excluir o plano "${nome}" (ID: ${id})?`)) {
            excluirPlano(id); 
        }
    }
}

// Função para excluir um plano
async function excluirPlano(id) {
    try {
        const endpoint = `/planos/${id}`;
        const urlFinal = urlBase + endpoint;

        const response = await fetch(urlFinal, {
            method: "DELETE",
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro na requisição: ${response.status}. Mensagem: ${errorText}`);
        }

        alert("Plano excluído com sucesso!");

    } catch (error) {
        console.error("Erro ao excluir plano:", error);
        alert(`O Plano não foi excluído! Detalhe: ${error.message}`);
    }

    // Recarrega a lista de planos (melhor UX que recarregar a página)
    carregarPlanos(campoBusca ? campoBusca.value : "");
}