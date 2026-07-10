const token = localStorage.getItem('token');

if (!token) {
    window.location.href = '/pages/login.html';
} else {

    const usuario = JSON.parse(
        localStorage.getItem('usuario')
    );

    document.getElementById('usuario-info').innerText =
        `${usuario.nome} (${usuario.perfil})`;

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