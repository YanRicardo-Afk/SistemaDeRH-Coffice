console.log('navbarSuperior.js carregado');

const usuario = JSON.parse(
    localStorage.getItem('usuario')
);

console.log(usuario);

const nome = document.getElementById('nomeUsuario');
const email = document.getElementById('emailUsuario');

console.log(nome);
console.log(email);

if (usuario && nome && email) {

    nome.textContent = usuario.nome;
    email.textContent = usuario.email;

}