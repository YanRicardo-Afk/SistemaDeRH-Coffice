const token =
    localStorage.getItem('token');


async function carregarFuncionarios() {

    const response = await fetch(
        'http://localhost:3000/funcionarios',
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const funcionarios =
        await response.json();

    const select =
        document.getElementById('funcionarioId');

    funcionarios.forEach(funcionario => {

        select.innerHTML += `
            <option value="${funcionario.id}">
                ${funcionario.nome_completo}
            </option>
        `;

    });

}

carregarFuncionarios();


const form =
    document.getElementById('formHolerite');


form.addEventListener('submit', async (e) => {

    e.preventDefault();

    const salario =
        Number(document.getElementById('salario').value);

    const inss =
        Number(document.getElementById('inss').value);

    const onibus =
        Number(document.getElementById('onibus').value);

    const vale =
        Number(document.getElementById('vale').value);

    const totalDescontos =
        inss + onibus + vale;

    const totalLiquido =
        salario - totalDescontos;

    const holerite = {

        funcionario_id:
            Number(
                document.getElementById('funcionarioId').value
            ),

        descricao:
            document.getElementById('descricao').value,

        inss_normal: inss,

        onibus_fretado: onibus,

        vale_alimentacao: vale,

        salario: salario,

        total_vencimentos: salario,

        total_descontos: totalDescontos,

        total_liquido: totalLiquido

    };

    const response = await fetch(
        'http://localhost:3000/holerites',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(holerite)
        }
    );

    const data = await response.json();

    document.getElementById('mensagem')
        .textContent =
        data.mensagem || data.erro;

});