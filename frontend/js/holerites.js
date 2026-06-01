const token = localStorage.getItem('token');

async function carregarHolerites() {

    const response = await fetch(
        'http://localhost:3000/holerites/me',
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const holerites = await response.json();

    const lista =
        document.getElementById('listaHolerites');

    lista.innerHTML = '';

    holerites.forEach(holerite => {

        lista.innerHTML += `
            <div>

                <h3>${holerite.descricao}</h3>

                <p>
                    Salário:
                    R$ ${Number(holerite.salario).toFixed(2)}
                </p>

                <p>
                    Total Líquido:
                    R$ ${Number(holerite.total_liquido).toFixed(2)}
                </p>

                <hr>

            </div>
        `;

    });
    if (holerites.length === 0) {

    lista.innerHTML = `
        <p>Nenhum holerite encontrado.</p>
    `;

    return;
}
}

carregarHolerites();