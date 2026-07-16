const perfil = localStorage.getItem('perfil');

if (perfil !== 'rh') {

    document
        .getElementById('menuFuncionarios')
        .style.display = 'none';

}

document
    .getElementById('btnSair')
    .addEventListener('click', logout);

const paginaAtual = window.location.pathname;

document
    .querySelectorAll('.menu a')
    .forEach(link => {

        if (
            paginaAtual.includes(
                link.getAttribute('href')
            )
        ) {

            link.classList.add('ativo');

        }

    });