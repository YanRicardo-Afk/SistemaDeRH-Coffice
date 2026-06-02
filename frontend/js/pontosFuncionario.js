const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const token = localStorage.getItem('token');

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
    const lista = document.getElementById('listaPontos');
    lista.innerHTML = '';

    if (pontos.length === 0) {
        lista.innerHTML = '<p style="padding: 16px; color: #3E1D0E;">Nenhum ponto encontrado.</p>';
        return;
    }

    let linhas = '';

    pontos.forEach(ponto => {
        const saldo = ponto.saldo || '-';
        const saldoClass = saldo.startsWith('+') ? 'ponto-saldo-positivo'
                         : saldo.startsWith('-') && saldo !== '-' ? 'ponto-saldo-negativo'
                         : '';

        linhas += `
            <tr>
                <td>${ponto.data}</td>
                <td>${ponto.entrada}</td>
                <td>${ponto.saida || '-'}</td>
                <td class="${saldoClass}">${saldo}</td>
            </tr>
        `;
    });

    lista.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Entrada</th>
                    <th>Saída</th>
                    <th>Saldo</th>
                </tr>
            </thead>
            <tbody>${linhas}</tbody>
        </table>
    `;
}

carregarPontos();