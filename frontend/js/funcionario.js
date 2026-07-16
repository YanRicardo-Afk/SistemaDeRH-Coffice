const params =
    new URLSearchParams(window.location.search);

const id = params.get("id");

const token =
    localStorage.getItem("token");

function formatarData(data) {

    if (!data) return "Não definida";

    return new Date(data).toLocaleDateString("pt-BR", {
        timeZone: "UTC"
    });

}

async function carregarFuncionario() {

    try {

        const response = await fetch(

            `http://localhost:3000/funcionarios/${id}`,

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

        const funcionario = await response.json();

        // Cabeçalho
        document.getElementById("nomeCabecalho").textContent =
            funcionario.nome_completo;

        document.getElementById("cargoCabecalho").textContent =
            funcionario.cargo;

        // Dados
        document.getElementById("matricula").textContent =
            funcionario.matricula;

        document.getElementById("nome").textContent =
            funcionario.nome_completo;

        document.getElementById("statusCivil").textContent =
            funcionario.status_civil;

        document.getElementById("dataNascimento").textContent =
    formatarData(funcionario.data_nascimento);

        document.getElementById("endereco").textContent =
            funcionario.endereco;

        document.getElementById("email").textContent =
            funcionario.email;

        document.getElementById("telefone").textContent =
            funcionario.telefone;

        document.getElementById("cargo").textContent =
            funcionario.cargo;

        document.getElementById("dataAdmissao").textContent =
    formatarData(funcionario.data_admissao);

       document.getElementById("dataFerias").textContent =
    formatarData(funcionario.data_ferias);

        document.getElementById("perfil").textContent =
            funcionario.perfil;

    }

    catch (erro) {

        console.error(erro);

        alert("Erro ao carregar funcionário.");

    }

}

carregarFuncionario();

document
    .getElementById("btnEditar")
    .addEventListener("click", () => {

        window.location.href =
            `editar-funcionario.html?id=${id}`;

    });

document
    .getElementById("btnHolerites")
    .addEventListener("click", () => {

        window.location.href =
            `holerites-funcionario.html?id=${id}`;

    });

document
    .getElementById("btnPontos")
    .addEventListener("click", () => {

        window.location.href =
            `pontos-funcionario.html?id=${id}`;

    });