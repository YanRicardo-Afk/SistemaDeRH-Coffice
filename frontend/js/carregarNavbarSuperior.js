fetch("../pages/navbarSuperior.html")
    .then(res => res.text())
    .then(html => {

        document
            .getElementById("navbarSuperior")
            .innerHTML = html;

        const script = document.createElement("script");

        script.src = "../js/navbarSuperior.js";

        document.body.appendChild(script);

    });