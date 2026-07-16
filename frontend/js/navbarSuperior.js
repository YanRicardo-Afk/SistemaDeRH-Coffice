console.log("navbarSuperior.js carregado");

iniciarNavbar();

function iniciarNavbar() {

    carregarUsuario();

    iniciarDropdown();

    iniciarBotaoSair();

}

function carregarUsuario() {

    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );

    console.log(usuario);

    const nome = document.getElementById("nomeUsuario");
    const email = document.getElementById("emailUsuario");

    console.log(nome);
    console.log(email);

    if (usuario && nome && email) {

        nome.textContent = usuario.nome;
        email.textContent = usuario.email;

    }

}

function iniciarDropdown() {

    const usuarioMenu = document.getElementById("usuarioMenu");
    const dropdown = document.getElementById("dropdownUsuario");

    if (!usuarioMenu || !dropdown) return;

    usuarioMenu.addEventListener("click", function (e) {

        e.stopPropagation();

        dropdown.classList.toggle("aberto");

    });

    document.addEventListener("click", function () {

        dropdown.classList.remove("aberto");

    });

}

function iniciarBotaoSair() {

    const btnSair = document.getElementById("btnSairNavbar");

    if (!btnSair) return;

    btnSair.addEventListener("click", function (e) {

        e.stopPropagation();

        logout();

    });

}