function abrirFuncionario(id) {
    window.location.href = `funcionario.html?id=${id}`;
}

function abrirEditar(id) {
    window.location.href = `editar-funcionario.html?id=${id}`;
}

function abrirPontos(id) {
    window.location.href = `pontos-funcionario.html?id=${id}`;
}

function abrirHolerites(id) {
    window.location.href = `holerites-funcionario.html?id=${id}`;
}

function configurarBotaoVoltar(destino) {

    const btn = document.getElementById("btnVoltar");

    if (!btn) return;

    btn.addEventListener("click", () => {
        window.location.href = destino;
    });

}