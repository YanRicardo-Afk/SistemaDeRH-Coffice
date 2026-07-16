const token = localStorage.getItem('token');

if (!token) {

    window.location.href = '/pages/login.html';

} else {

    const usuario = JSON.parse(
        localStorage.getItem('usuario')
    );

    document.getElementById('saudacao').innerText =
        `Olá, ${usuario.nome}`;

    const btnEntrada =
        document.getElementById('btnEntrada');

    const btnSaida =
        document.getElementById('btnSaida');

    btnEntrada.addEventListener('click', async () => {

        const response = await fetch(
            'http://localhost:3000/pontos/entrada',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        alert(data.mensagem || data.erro);

    });

    btnSaida.addEventListener('click', async () => {

        const response = await fetch(
            'http://localhost:3000/pontos/saida',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        alert(data.mensagem || data.erro);

    });

}

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

atualizarRelogio();

setInterval(atualizarRelogio, 1000);