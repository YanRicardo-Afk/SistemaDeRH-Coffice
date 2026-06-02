const perfil =
    localStorage.getItem('perfil');

if (perfil !== 'rh') {

    document
        .getElementById('menuFuncionarios')
        .style.display = 'none';

}

document
    .getElementById('btnSair')
    .addEventListener('click', () => {

        localStorage.clear();

        window.location.href =
            'login.html';

    });