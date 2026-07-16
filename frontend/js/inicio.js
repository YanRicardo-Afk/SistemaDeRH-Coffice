const token = localStorage.getItem('token');

if (!token) {

    window.location.href = '/pages/login.html';

} else {

    const usuario = JSON.parse(
        localStorage.getItem('usuario')
    );

    document.getElementById('saudacao').innerText =
        `Olá, ${usuario.nome}`;



}

async function carregarPontoHoje() {

    try {

        console.log("Entrou na função");

        const response = await fetch(
            "http://localhost:3000/pontos/hoje",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log("Status:", response.status);

        const ponto = await response.json();

        console.log("Resposta:", ponto);

        const botao =
            document.getElementById("btnRegistrarPonto");

        console.log("Botão:", botao);

        horaEntrada.textContent =
    ponto.entrada
        ? ponto.entrada.substring(0, 5)
        : "--:--";

horaSaida.textContent =
    ponto.saida
        ? ponto.saida.substring(0, 5)
        : "--:--";

botao.disabled = false;

if (!ponto.entrada) {

    botao.textContent = "Registrar Entrada";

}

else if (!ponto.saida) {

    botao.textContent = "Registrar Saída";

}

else {

    botao.textContent = "Expediente Encerrado";

    botao.disabled = true;

}

    }

    catch (erro) {

        console.error(erro);

    }

}

async function registrarPonto() {

    const botao =
        document.getElementById("btnRegistrarPonto");

    let url = "";

    if (botao.textContent === "Registrar Entrada") {

        url = "http://localhost:3000/pontos/entrada";

    }

    else if (botao.textContent === "Registrar Saída") {

        url = "http://localhost:3000/pontos/saida";

    }

    else {

        return;

    }

    const response = await fetch(
        url,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const resultado = await response.json();

    alert(resultado.mensagem || resultado.erro);

    carregarPontoHoje();

}

document
    .getElementById("btnRegistrarPonto")
    .addEventListener(
        "click",
        registrarPonto
    );

function atualizarRelogio() {

    const elemento = document.getElementById("horaAtual");

    if (!elemento) return;

    const agora = new Date();

    elemento.textContent =
        agora.toLocaleTimeString(
            "pt-BR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}

function atualizarData() {

    const elemento =
        document.getElementById("dataHoje");

    if (!elemento) return;

    const hoje = new Date();

    elemento.textContent =
        hoje.toLocaleDateString(
            "pt-BR",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

}

atualizarRelogio();

atualizarData();

carregarPontoHoje();


setInterval(atualizarRelogio, 1000);