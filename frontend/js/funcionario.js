const params =
    new URLSearchParams(
        window.location.search
    );

const id = params.get('id');

const token =
    localStorage.getItem('token');

async function carregarFuncionario() {

    const response = await fetch(
        `http://localhost:3000/funcionarios/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const funcionario =
        await response.json();

    document.getElementById('nome').value =
        funcionario.nome_completo;

    document.getElementById('email').value =
        funcionario.email;

    document.getElementById('cargo').value =
        funcionario.cargo;

    document.getElementById('dataFerias').value =
        funcionario.data_ferias || '';

}

carregarFuncionario();