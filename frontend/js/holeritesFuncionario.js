const params =
    new URLSearchParams(
        window.location.search
    );

const id = params.get('id');

const token =
    localStorage.getItem('token');

async function carregarHolerites() {

    const response = await fetch(
        `http://localhost:3000/holerites/funcionario/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const holerites =
        await response.json();

    const lista =
        document.getElementById('listaHolerites');

    lista.innerHTML = '';

    if (holerites.length === 0) {

        lista.innerHTML =
            '<p>Nenhum holerite encontrado.</p>';

        return;
    }

    holerites.forEach(holerite => {

        lista.innerHTML += `
            <div>

                <h3>${holerite.descricao}</h3>

                <p>Salário: R$ ${holerite.salario}</p>

                <p>INSS: R$ ${holerite.inss_normal}</p>

                <p>Vale Alimentação: R$ ${holerite.vale_alimentacao}</p>

                <p>Ônibus Fretado: R$ ${holerite.onibus_fretado}</p>

                <p>Total Vencimentos: R$ ${holerite.total_vencimentos}</p>

                <p>Total Descontos: R$ ${holerite.total_descontos}</p>

                <p>Total Líquido: R$ ${holerite.total_liquido}</p>

                <hr>

            </div>
        `;

    });

}

carregarHolerites();