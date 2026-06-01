const token = localStorage.getItem('token');

if (!token) {
    window.location.href = 'login.html';
}

async function carregarFuncionarios(
    nome = '',
    cargo = ''
) {

    try {

        let url = 'http://localhost:3000/funcionarios?';

        if (nome) {
            url += `nome=${nome}&`;
        }

        if (cargo) {
            url += `cargo=${cargo}`;
        }
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const funcionarios =
            await response.json();

        const lista =
            document.getElementById(
                'listaFuncionarios'
            );

        lista.innerHTML = '';

        funcionarios.forEach(funcionario => {

            lista.innerHTML += `
            <div
                class="funcionario-card"
                onclick="abrirFuncionario(${funcionario.id})"
            >
                <h3>${funcionario.nome_completo}</h3>

                <p>Matrícula: ${funcionario.matricula}</p>

                <p>Cargo: ${funcionario.cargo}</p>

                <hr>
            </div>
        `;

        });

    } catch (error) {

        console.error(error);

    }

}

carregarFuncionarios();

document
.getElementById('btnPesquisar')
.addEventListener('click', () => {

    const nome =
        document.getElementById('pesquisaNome').value;

    const cargo =
        document.getElementById('filtroCargo').value;

    carregarFuncionarios(nome, cargo);

});

document
    .getElementById('btnNovoFuncionario')
    .addEventListener('click', () => {

        window.location.href =
            'cadastrar-funcionario.html';

    });

    function abrirFuncionario(id){
        window.location.href = 
        `funcionario.html?id=${id}`;
    }
