// Arquivo: ../js/inserirPlano.js

// 1. Definição da URL base da API
const urlBase = "https://back-end-tf-web-i3bt.vercel.app/"; // Substitua pela sua URL real

// 2. "Pegando" o formulário e o botão
const formInserirPlano = document.getElementById("form-inserir-plano");

// Adiciona um listener para o evento de SUBMIT do formulário
if (formInserirPlano) {
    formInserirPlano.addEventListener("submit", inserirPlano);
}


// 3. Função para inserir um novo plano
async function inserirPlano(e) {
    e.preventDefault(); // Impede o comportamento padrão do submit do formulário

    // Coleta os dados do formulário, incluindo o arquivo de imagem
    // O objeto FormData é obrigatório para enviar arquivos via fetch/POST.
    const formData = new FormData();
    
    // Anexa os dados do formulário ao FormData
    formData.append('nome', document.getElementById("nome").value);
    formData.append('descricao', document.getElementById("descricao").value);
    formData.append('preco', document.getElementById("preco").value);
    
    // Anexa o arquivo de imagem
    const arquivoImagem = document.getElementById("imagem_plano").files[0];
    if (arquivoImagem) {
        // 'imagem_plano' deve ser o nome esperado pelo seu Back-end para o arquivo
        formData.append('imagem_plano', arquivoImagem); 
    }

    try {
        const endpoint = "/planos"; // Endpoint da API para inserir um novo plano
        const urlFinal = urlBase + endpoint; // URL completa da requisição

        // Faz a requisição POST. 
        // ATENÇÃO: Ao usar FormData, o "Content-Type" DEVE SER OMITIDO,
        // pois o navegador configura automaticamente como 'multipart/form-data'.
        const response = await fetch(urlFinal, {
            method: "POST",
            body: formData, // Envia o FormData diretamente
        });

        // Verifica se a resposta foi bem-sucedida (200-299)
        if (!response.ok) {
            // Tenta ler a mensagem de erro da API
            const errorData = await response.json(); 
            throw new Error(`Erro na requisição: ${response.status}. Detalhe: ${errorData.message || response.statusText}`);
        }

        // Se chegou aqui, a inserção foi bem-sucedida
        alert("Plano inserido com sucesso!");
        
        // Redireciona para a página de listagem de planos
        window.location.href = "planos1.html";

    } catch (error) {
        // Exibe mensagem de erro e redireciona (ou mantém na página)
        console.error("Erro ao inserir plano:", error);
        alert(`Plano não inserido. Verifique o console. Detalhe: ${error.message}`);
    }
}