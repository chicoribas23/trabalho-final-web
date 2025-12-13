document.addEventListener("DOMContentLoaded", ()=> {
    const dogMenu = document.querySelector(".dog-menu");
    const API_URL ="https://back-end-tf-web-i3bt.vercel.app";



const botaoAutor = document.getElementById('botaoAutor');
const elAutor = document.getElementById('autor');
const elApi = document.getElementById('api');
const elBd = document.getElementById('bd');

botaoAutor.addEventListener('click', pegarInformacao);

const urlBase = "https://back-end-tf-web-i3bt.vercel.app/";

async function pegarInformacao() {

  elAutor.innerText = "Aguarde... "

  try {
    const response = await fetch(urlBase);

    if (!response.ok) {
      throw new Error("Erro na requisição: " + response.status);
    }

    const data = await response.json();
    elAutor.innerHTML = `<strong>Autor:</strong> ${data.autor}`;
    elApi.innerHTML = `<strong>API:</strong> ${data.mensagem}`;
    elBd.innerHTML = `<strong>Banco de Dados:</strong> ${data.dbStatus}`;

  } catch (error) {
    console.error("Erro:", error);
    elAutor.innerText = `Erro: ${error}`;
  }
