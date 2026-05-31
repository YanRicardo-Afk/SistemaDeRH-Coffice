// pega dados salvos
const token = localStorage.getItem('token');
const perfil = localStorage.getItem('perfil');

// se não tiver token → volta pro login
if (!token) {
    window.location.href = 'login.html';
}

// pega nome do usuário via API
async function carregarUsuario() {

    try {

        const response = await fetch('http://localhost:3000/api/perfil', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        // coloca na tela
        document.getElementById('saudacao').textContent =
        `Olá, ${data.nome_completo}`;

        document.getElementById('perfil').textContent =
        `Perfil: ${data.perfil}`;

    } catch (error) {
        console.log(error);
    }
}

carregarUsuario();


// esconder menu funcionários se não for RH
if (perfil !== 'rh') {
    document.getElementById('menu-funcionarios').style.display = 'none';
}


const logoutBtn = document.getElementById('logout');

logoutBtn.addEventListener('click', () => {

    // limpa dados
    localStorage.removeItem('token');
    localStorage.removeItem('perfil');

    // volta pro login
    const confirmar = confirm('Deseja sair?');

    if (confirmar) {
        localStorage.clear();
        window.location.href = 'login.html';
}

});