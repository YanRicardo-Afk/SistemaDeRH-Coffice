const form = document.getElementById('loginForm');
const erro = document.getElementById('erro');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {

        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (!response.ok) {
            erro.textContent = data.erro;
            return;
        }

        // salva token
        localStorage.setItem('token', data.token);

        // salva perfil
        localStorage.setItem('perfil', data.usuario.perfil);

        // redireciona
        window.location.href = 'inicio.html';

    } catch (error) {
        erro.textContent = 'Erro ao conectar com servidor';
    }
});