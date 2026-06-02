fetch('../pages/navbar.html')
    .then(res => res.text())
    .then(html => {

        document.getElementById('navbar')
            .innerHTML = html;

        const script =
            document.createElement('script');

        script.src = '../js/navbar.js';

        document.body.appendChild(script);

    });