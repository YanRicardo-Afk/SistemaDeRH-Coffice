const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const token = localStorage.getItem("token");

async function carregarPontos() {

    let url;

    if (id) {

        // RH consultando outro funcionário
        url = `http://localhost:3000/pontos/funcionario/${id}`;

    } else {

        // Usuário consultando seus próprios pontos
        url = "http://localhost:3000/pontos/meus";

    }

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Erro ao buscar pontos.");
    }


    const pontos = await response.json();
    const lista = document.getElementById('listaPontos');
    lista.innerHTML = '';

    if (pontos.length === 0) {
        lista.innerHTML = '<p style="padding: 16px; color: #3E1D0E;">Nenhum ponto encontrado.</p>';
        return;
    }

    let linhas = '';

    pontos.forEach(ponto => {
        const saldo = ponto.saldo || '-';
        const saldoClass = saldo.startsWith('+') ? 'ponto-saldo-positivo'
                         : saldo.startsWith('-') && saldo !== '-' ? 'ponto-saldo-negativo'
                         : '';

        // Registros ajustados pelo RH recebem um selo visual, mas o
        // registro original continua intacto no banco (auditoria).
        const seloAjuste = ponto.ajustado
            ? '<span class="selo-ajustado" title="Registro ajustado pelo RH">ajustado</span>'
            : '';

        linhas += `
            <tr>
                <td>${new Date(ponto.data).toLocaleDateString("pt-BR")} ${seloAjuste}</td>
                <td>${ponto.entrada}</td>
                <td>${ponto.saida || '-'}</td>
                <td class="${saldoClass}">${saldo}</td>
            </tr>
        `;
    });

    lista.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Entrada</th>
                    <th>Saída</th>
                    <th>Saldo</th>
                </tr>
            </thead>
            <tbody>${linhas}</tbody>
        </table>
    `;
}

carregarPontos();

configurarBotaoVoltar(`funcionario.html?id=${id}`);

// ── Gerar Comprovante em PDF ─────────────────────────────────────────
// Esta página é usada tanto pelo funcionário normal (vendo os próprios
// pontos) quanto pelo RH (também podendo gerar o próprio comprovante,
// já que aqui nunca há "id" na URL).

const inputPeriodo = document.getElementById('periodoComprovante');
const btnGerarComprovante = document.getElementById('btnGerarComprovante');
const modalErro = document.getElementById('modalErroComprovante');
const mensagemErro = document.getElementById('mensagemErroComprovante');

// Preenche o seletor de período com o mês atual por padrão
if (inputPeriodo) {
    const hoje = new Date();
    const mesAtual = String(hoje.getMonth() + 1).padStart(2, '0');
    inputPeriodo.value = `${hoje.getFullYear()}-${mesAtual}`;
}

function mostrarErroComprovante(texto) {
    mensagemErro.textContent = texto;
    modalErro.classList.add('ativo');
}

document.getElementById('btnFecharErroComprovante')
    ?.addEventListener('click', () => modalErro.classList.remove('ativo'));

// Converte o valor do <input type="month"> ("2026-07") no primeiro e
// último dia daquele mês, no formato "YYYY-MM-DD" esperado pela API.
function calcularIntervaloDoMes(valorMesAno) {
    const [ano, mes] = valorMesAno.split('-').map(Number);
    const primeiroDia = new Date(ano, mes - 1, 1);
    const ultimoDia = new Date(ano, mes, 0);

    const paraISO = (d) => d.toISOString().split('T')[0];

    return {
        dataInicio: paraISO(primeiroDia),
        dataFim: paraISO(ultimoDia)
    };
}

async function gerarComprovante() {

    if (!inputPeriodo.value) {
        mostrarErroComprovante('Selecione um período para gerar o comprovante.');
        return;
    }

    const { dataInicio, dataFim } = calcularIntervaloDoMes(inputPeriodo.value);

    const textoOriginal = btnGerarComprovante.textContent;
    btnGerarComprovante.disabled = true;
    btnGerarComprovante.textContent = 'Gerando...';

    try {

        const url = `http://localhost:3000/pontos/comprovante?dataInicio=${dataInicio}&dataFim=${dataFim}`;

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const erro = await response.json().catch(() => ({}));
            throw new Error(erro.erro || 'Erro ao gerar comprovante.');
        }

        const blob = await response.blob();

        // Tenta usar o nome de arquivo sugerido pelo servidor
        // (Content-Disposition); se não vier, usa um nome padrão.
        const disposicao = response.headers.get('Content-Disposition') || '';
        const match = disposicao.match(/filename="?([^"]+)"?/);
        const nomeArquivo = match ? match[1] : 'comprovante_ponto.pdf';

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = nomeArquivo;
        document.body.appendChild(link);
        link.click();
        link.remove();

    } catch (erro) {
        console.error(erro);
        mostrarErroComprovante(erro.message || 'Erro ao gerar comprovante.');
    } finally {
        btnGerarComprovante.disabled = false;
        btnGerarComprovante.textContent = textoOriginal;
    }
}

btnGerarComprovante?.addEventListener('click', gerarComprovante);