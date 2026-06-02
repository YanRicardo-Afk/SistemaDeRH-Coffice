fetch('../pages/menu.html')
    .then(res => res.text())
    .then(html => {

        document
            .getElementById('menu')
            .innerHTML = html;

        const script =
            document.createElement('script');

        script.src =
            '../js/menu.js';

        document.body.appendChild(script);

    });