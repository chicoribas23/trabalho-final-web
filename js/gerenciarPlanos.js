// Arquivo: ../js/gerenciarPlanos.js

// 1. Definição da URL base da API
// **IMPORTANTE**: Substitua o placeholder pela URL real do seu back-end.
const urlBase = "https://back-end-tf-web-i3bt.vercel.app/";

// 2. "Pegando" o elemento HTML da tabela
const tabelaCorpo = document.getElementById("tabela-corpo");

// Função autoexecutável para buscar e exibir os planos (Função de Listagem/Read)
(async () => {
    if (!tabelaCorpo) {
        console.error("Erro: O elemento com ID 'tabela-corpo' não foi encontrado no HTML.");
        return;
    }

    tabelaCorpo.innerHTML = "<tr><td colspan='5'>Aguarde, carregando planos...</td></tr>";

    try {
        const endpoint = "/planos";
        const urlFinal = urlBase + endpoint;

        const response = await fetch(urlFinal);

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        tabelaCorpo.innerHTML = "";
        
        if (data.length === 0) {
             tabelaCorpo.innerHTML = "<tr><td colspan='5'>Nenhum plano encontrado. Utilize o botão 'Adicionar Plano' para cadastrar um novo.</td></tr>";
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
                    <a class="botao editar" href="ver-planos.html?id=${plano.id}">Editar</a>
                    <a class="botao excluir" data-id="${plano.id}" data-nome="${plano.nome}">Excluir</a>
                </td>
            `;
            tabelaCorpo.appendChild(linha);
        });
    } catch (error) {
        tabelaCorpo.innerHTML = `<tr><td colspan='5' style='color: red;'>
            Erro ao carregar planos. Detalhe: ${error.message}
        </td></tr>`;
    }
})();

// =========================================================================
// FUNÇÕES DE EXCLUSÃO (DELETE)
// =========================================================================

// 3. Criando o gatilho para executar a função de exclusão
// Adiciona um listener de evento para capturar cliques na tabela
if (tabelaCorpo) {
    tabelaCorpo.addEventListener("click", acao);
}

// Função para lidar com ações de clique na tabela
function acao(e) {
    // Verifica se o elemento clicado (e.target) possui a classe "excluir"
    if (e.target.classList.contains("excluir")) {
        e.preventDefault(); // Impede o comportamento padrão do link (navegar)
        
        const id = e.target.getAttribute("data-id"); // Obtém o ID do plano
        const nome = e.target.getAttribute("data-nome"); // Obtém o nome para confirmação

        if (confirm(`Tem certeza que deseja excluir o plano "${nome}" (ID: ${id})?`)) {
            excluirPlano(id); // Chama a função para excluir o plano
        }
    }
}

// Função para excluir um plano
async function excluirPlano(id) {
    try {
        const endpoint = `/planos/${id}`; // Endpoint da API para excluir o plano
        const urlFinal = urlBase + endpoint; // URL completa da requisição

        // Faz a requisição DELETE para excluir o plano
        const response = await fetch(urlFinal, {
            method: "DELETE",
        });

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            // Tenta ler o erro do corpo, se houver
            const errorText = await response.text();
            throw new Error(`Erro na requisição: ${response.status}. Mensagem: ${errorText}`);
        }

        // Se o servidor retornar 200/204, assume sucesso
        // const data = await response.json(); // Se a API retornar JSON de confirmação

        // Exibe mensagem de sucesso
        alert("Plano excluído com sucesso!");

    } catch (error) {
        // Exibe mensagem de erro caso a exclusão falhe
        console.error("Erro ao excluir plano:", error);
        alert(`O Plano não foi excluído! Detalhe: ${error.message}`);
    }

    // Recarrega a página para atualizar a lista de planos (mostrando que o item sumiu)
    window.location.href = "planos1.html";
}