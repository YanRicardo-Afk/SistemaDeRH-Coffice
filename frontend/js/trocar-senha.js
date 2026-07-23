const form = document.getElementById('trocarSenhaForm');
const erro = document.getElementById('erro');
const sucesso = document.getElementById('sucesso');

// Se não houver token (usuário chegou nessa página sem logar), manda de volta pro login.
const token = localStorage.getItem('token');

if (!token) {
    window.location.href = 'login.html';
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    erro.textContent = '';
    sucesso.textContent = '';

    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (novaSenha.length < 6) {
        erro.textContent = 'A senha deve possuir no mínimo 6 caracteres';
        return;
    }

    if (novaSenha !== confirmarSenha) {
        erro.textContent = 'As senhas não coincidem';
        return;
    }

    try {

        const response = await fetch('http://localhost:3000/auth/trocar-senha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ novaSenha, confirmarSenha })
        });

        const data = await response.json();

        if (!response.ok) {
            erro.textContent = data.erro;
            return;
        }

        // atualiza os dados salvos localmente, marcando que o primeiro login foi concluído
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (usuario) {
            usuario.primeiro_login = false;
            localStorage.setItem('usuario', JSON.stringify(usuario));
        }

        sucesso.textContent = 'Senha alterada com sucesso! Redirecionando...';

        setTimeout(() => {
            window.location.href = 'inicio.html';
        }, 1200);

    } catch (error) {
        erro.textContent = 'Erro ao conectar com servidor';
    }
});