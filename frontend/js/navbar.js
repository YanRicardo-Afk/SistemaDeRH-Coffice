const perfil =
    localStorage.getItem('perfil');

if (perfil === 'rh') {

    document.getElementById('menuRh')
        .innerHTML = `
            <a href="funcionarios.html">
                Funcionários
            </a>

            <a href="cadastrar-funcionario.html">
                Cadastrar Funcionário
            </a>

            <a href="cadastrar-holerite.html">
                Cadastrar Holerite
            </a>
        `;
}

document
    .getElementById('btnSair')
    .addEventListener('click', () => {

        localStorage.removeItem('token');
        localStorage.removeItem('perfil');

        window.location.href =
            'login.html';

    });