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
        };
        localStorage.setItem('token', data.token);

        // salva perfil
        localStorage.setItem('perfil', data.usuario.perfil);

        // salva dados do usuário
        localStorage.setItem(
            'usuario',
            JSON.stringify(data.usuario)
        );

        // se for o primeiro login do usuário, pede a troca de senha antes de entrar no sistema
        if (data.usuario.primeiro_login) {
            window.location.href = 'trocar-senha.html';
            return;
        }

        // redireciona
        window.location.href = 'inicio.html';

    } catch (error) {
        erro.textContent = 'Erro ao conectar com servidor';
    }
});