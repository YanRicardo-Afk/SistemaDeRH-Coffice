const params =
    new URLSearchParams(
        window.location.search
    );

const id = params.get('id');

const token =
    localStorage.getItem('token');

async function carregarPontos() {

    const response = await fetch(
        `http://localhost:3000/pontos/funcionario/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const pontos = await response.json();

    const lista =
        document.getElementById('listaPontos');

    lista.innerHTML = '';

    if (pontos.length === 0) {

        lista.innerHTML =
            '<p>Nenhum ponto encontrado.</p>';

        return;
    }

    pontos.forEach(ponto => {

        lista.innerHTML += `
            <div>

                <p><strong>Data:</strong> ${ponto.data}</p>

                <p><strong>Entrada:</strong> ${ponto.entrada}</p>

                <p><strong>Saída:</strong> ${ponto.saida || '-'}</p>

                <p><strong>Saldo:</strong> ${ponto.saldo || '-'}</p>

                <hr>

            </div>
        `;

    });

}

carregarPontos();