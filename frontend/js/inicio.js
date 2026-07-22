const token = localStorage.getItem('token');

let acaoRegistro = "";

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
function abrirModal() {

    const modal =
        document.getElementById("modalPonto");

    const tipo =
        document.getElementById("tipoRegistro");

    const data =
        document.getElementById("modalData");

    const hora =
        document.getElementById("modalHora");

    const botao =
        document.getElementById("btnRegistrarPonto");

    modal.style.display = "flex";
    document.getElementById("mensagemModal").textContent = "";

document.getElementById("btnConfirmarModal").disabled = false;

document.getElementById("btnCancelarModal").disabled = false;

    if (botao.textContent === "Registrar Entrada") {

    acaoRegistro = "entrada";

    tipo.textContent = "Entrada";

}

else {

    acaoRegistro = "saida";

    tipo.textContent = "Saída";

}

    const agora = new Date();

    data.textContent =
        agora.toLocaleDateString("pt-BR");

    hora.textContent =
        agora.toLocaleTimeString("pt-BR");

}

function fecharModal() {

    document
        .getElementById("modalPonto")
        .style.display = "none";

}

document
    .getElementById("btnCancelarModal")
    .addEventListener(
        "click",
        fecharModal
    );


async function registrarPonto() {

    const mensagem =
        document.getElementById("mensagemModal");

    const btnConfirmar =
        document.getElementById("btnConfirmarModal");

    const btnCancelar =
        document.getElementById("btnCancelarModal");

    mensagem.textContent = "Registrando...";

    btnConfirmar.disabled = true;
    btnCancelar.disabled = true;

    try {

        const response = await fetch(

            `http://localhost:3000/pontos/${acaoRegistro}`,

            {

                method: "POST",

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        const resultado = await response.json();

        if (!response.ok) {

            mensagem.textContent =
                resultado.erro;

            btnConfirmar.disabled = false;
            btnCancelar.disabled = false;

            return;

        }

        mensagem.textContent =
            "✔ Registro realizado com sucesso!";

        carregarPontoHoje();

        setTimeout(() => {

            fecharModal();

        }, 1500);

    }

    catch (erro) {

        console.error(erro);

        mensagem.textContent =
            "Erro ao registrar ponto.";

        btnConfirmar.disabled = false;
        btnCancelar.disabled = false;

    }

}

document
    .getElementById("btnRegistrarPonto")
    .addEventListener(
        "click",
        abrirModal
    );

document
    .getElementById("btnConfirmarModal")
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


// ===== Carrossel de Avisos =====

function initCarrosselAvisos() {

    const container = document.getElementById("carrosselAvisos");
    const track = document.getElementById("carrosselTrack");
    const dotsContainer = document.getElementById("carrosselDots");
    const btnEsquerda = document.getElementById("setaEsquerda");
    const btnDireita = document.getElementById("setaDireita");

    if (!track) return;

    const slides = track.querySelectorAll(".aviso-imagem");

    if (slides.length === 0) return;

    let indiceAtual = 0;
    let autoplayInterval = null;

    slides.forEach((_, indice) => {

        const dot = document.createElement("button");

        dot.classList.add("carrossel-dot");

        if (indice === 0) {
            dot.classList.add("ativo");
        }

        dot.addEventListener("click", () => {
            irParaSlide(indice);
        });

        dotsContainer.appendChild(dot);

    });

    const dots = dotsContainer.querySelectorAll(".carrossel-dot");

    function atualizarCarrossel() {

        track.style.transform = `translateX(-${indiceAtual * 100}%)`;

        dots.forEach((dot, indice) => {
            dot.classList.toggle("ativo", indice === indiceAtual);
        });

    }

    function proximoSlide() {

        indiceAtual = (indiceAtual + 1) % slides.length;

        atualizarCarrossel();

    }

    function slideAnterior() {

        indiceAtual = (indiceAtual - 1 + slides.length) % slides.length;

        atualizarCarrossel();

    }

    function irParaSlide(indice) {

        indiceAtual = indice;

        atualizarCarrossel();

        reiniciarAutoplay();

    }

    function iniciarAutoplay() {

        autoplayInterval = setInterval(proximoSlide, 5000);

    }

    function reiniciarAutoplay() {

        clearInterval(autoplayInterval);

        iniciarAutoplay();

    }

    if (btnDireita) {

        btnDireita.addEventListener("click", () => {
            proximoSlide();
            reiniciarAutoplay();
        });

    }

    if (btnEsquerda) {

        btnEsquerda.addEventListener("click", () => {
            slideAnterior();
            reiniciarAutoplay();
        });

    }

    if (slides.length > 1) {

        container.addEventListener("mouseenter", () => clearInterval(autoplayInterval));

        container.addEventListener("mouseleave", iniciarAutoplay);

        iniciarAutoplay();

    }

}

initCarrosselAvisos();