const params =
    new URLSearchParams(window.location.search);

const funcionarioId = params.get("id");

const token =
    localStorage.getItem("token");

const form =
    document.getElementById("formHolerite");

const mensagem =
    document.getElementById("mensagem");

// Se por algum motivo a página for aberta sem um
// funcionário definido, volta para a lista.
if (!funcionarioId) {

    window.location.href = "funcionarios.html";

}

async function carregarFuncionario() {

    try {

        const response = await fetch(

            `http://localhost:3000/funcionarios/${funcionarioId}`,

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

        if (!response.ok) {
            throw new Error("Funcionário não encontrado");
        }

        const funcionario = await response.json();

        document.getElementById("nomeCabecalho").textContent =
            funcionario.nome_completo;

        document.getElementById("cargoCabecalho").textContent =
            funcionario.cargo;

    }

    catch (erro) {

        console.error(erro);

        document.getElementById("nomeCabecalho").textContent =
            "Funcionário não encontrado";

        document.getElementById("cargoCabecalho").textContent = "";

    }

}

carregarFuncionario();

function formatarMoeda(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}

function atualizarResumo() {

    const salario =
        Number(document.getElementById("salario").value) || 0;

    const inss =
        Number(document.getElementById("inss").value) || 0;

    const onibus =
        Number(document.getElementById("onibus").value) || 0;

    const vale =
        Number(document.getElementById("vale").value) || 0;

    const totalDescontos =
        inss + onibus + vale;

    const totalLiquido =
        salario - totalDescontos;

    document.getElementById("resumoDescontos").textContent =
        formatarMoeda(totalDescontos);

    document.getElementById("resumoLiquido").textContent =
        formatarMoeda(totalLiquido);

}

["salario", "inss", "onibus", "vale"].forEach(campoId => {

    document
        .getElementById(campoId)
        .addEventListener("input", atualizarResumo);

});

document
    .getElementById("btnCancelar")
    .addEventListener("click", () => {

        window.location.href = `funcionario.html?id=${funcionarioId}`;

    });

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const salario =
        Number(document.getElementById("salario").value);

    const inss =
        Number(document.getElementById("inss").value);

    const onibus =
        Number(document.getElementById("onibus").value);

    const vale =
        Number(document.getElementById("vale").value);

    const totalDescontos =
        inss + onibus + vale;

    const totalLiquido =
        salario - totalDescontos;

    const holerite = {

        funcionario_id: Number(funcionarioId),

        descricao:
            document.getElementById("descricao").value,

        inss_normal: inss,

        onibus_fretado: onibus,

        vale_alimentacao: vale,

        salario: salario,

        total_vencimentos: salario,

        total_descontos: totalDescontos,

        total_liquido: totalLiquido

    };

    const botaoSalvar =
        form.querySelector('button[type="submit"]');

    botaoSalvar.disabled = true;

    mensagem.className = "";
    mensagem.textContent = "Salvando...";

    try {

        const response = await fetch(

            "http://localhost:3000/holerites",

            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(holerite)
            }

        );

        const data = await response.json();

        if (response.ok) {

            mensagem.className = "sucesso";

            mensagem.textContent =
                data.mensagem || "Holerite cadastrado com sucesso!";

            form.reset();

            atualizarResumo();

            setTimeout(() => {

                window.location.href =
                    `holerites-funcionario.html?id=${funcionarioId}`;

            }, 1200);

        }

        else {

            mensagem.className = "erro";

            mensagem.textContent =
                data.erro || "Erro ao cadastrar holerite.";

            botaoSalvar.disabled = false;

        }

    }

    catch (erro) {

        console.error(erro);

        mensagem.className = "erro";

        mensagem.textContent =
            "Erro ao conectar com o servidor.";

        botaoSalvar.disabled = false;

    }

});

configurarBotaoVoltar(`funcionario.html?id=${funcionarioId}`);