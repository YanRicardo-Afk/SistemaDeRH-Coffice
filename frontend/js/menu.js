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

    const btnMenuMobile =
    document.getElementById("btnMenuMobile");

const menu =
    document.querySelector(".menu");

const overlay =
    document.getElementById("overlayMenu");

if(btnMenuMobile && menu){

    btnMenuMobile.addEventListener("click",()=>{

        menu.classList.toggle("aberto");

        overlay.classList.toggle("ativo");

    });

}

if(overlay){

    overlay.addEventListener("click",()=>{

        menu.classList.remove("aberto");

        overlay.classList.remove("ativo");

    });

}