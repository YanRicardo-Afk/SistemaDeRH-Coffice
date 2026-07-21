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

    document.getElementById('matricula').value =
    funcionario.matricula;

document.getElementById('nome').value =
    funcionario.nome_completo;

document.getElementById('statusCivil').value =
    funcionario.status_civil;

document.getElementById('dataNascimento').value =
    funcionario.data_nascimento?.split('T')[0] || '';

document.getElementById('endereco').value =
    funcionario.endereco;

document.getElementById('email').value =
    funcionario.email;

document.getElementById('telefone').value =
    funcionario.telefone;

document.getElementById('cargo').value =
    funcionario.cargo;

document.getElementById('dataAdmissao').value =
    funcionario.data_admissao?.split('T')[0] || '';

document.getElementById('dataFerias').value =
    funcionario.data_ferias?.split('T')[0] || '';

document.getElementById('perfil').value =
    funcionario.perfil;
}

carregarFuncionario();

const form =
    document.getElementById('formFuncionario');

form.addEventListener('submit', async (e) => {

    e.preventDefault();

    const funcionario = {

        matricula:
            document.getElementById('matricula').value,

        nome_completo:
            document.getElementById('nome').value,

        status_civil:
            document.getElementById('statusCivil').value,

        data_nascimento:
            document.getElementById('dataNascimento').value,

        endereco:
            document.getElementById('endereco').value,

        email:
            document.getElementById('email').value,

        telefone:
            document.getElementById('telefone').value,

        cargo:
            document.getElementById('cargo').value,

        data_admissao:
            document.getElementById('dataAdmissao').value,

        data_ferias:
            document.getElementById('dataFerias').value,

        perfil:
            document.getElementById('perfil').value

    };

    const response = await fetch(
        `http://localhost:3000/funcionarios/${id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(funcionario)
        }
    );

    const data = await response.json();

    if (response.ok) {

        document.getElementById('mensagem')
            .textContent =
            'Funcionário atualizado com sucesso!';

        setTimeout(() => {

            window.location.href =
                `funcionario.html?id=${id}`;

        }, 1500);

    } else {

        document.getElementById('mensagem')
            .textContent =
            data.erro;

    }

});

document
    .getElementById('btnExcluir')
    .addEventListener('click', async () => {

        const confirmar = confirm(
            'Tem certeza que deseja excluir este funcionário?'
        );

        if (!confirmar) {
            return;
        }

        const response = await fetch(
            `http://localhost:3000/funcionarios/${id}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (response.ok) {

            alert('Funcionário excluído com sucesso!');

            window.location.href =
                'funcionarios.html';

        } else {

            alert(data.erro);

        }

    });

    configurarBotaoVoltar(`funcionario.html?id=${id}`);