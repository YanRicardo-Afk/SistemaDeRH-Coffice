const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const token = localStorage.getItem("token");

const API_BASE = "http://localhost:3000";

async function carregarPontos() {

    let url;

    if (id) {

        // RH consultando outro funcionário
        url = `${API_BASE}/pontos/funcionario/${id}`;

    } else {

        // Usuário consultando seus próprios pontos
        url = `${API_BASE}/pontos/meus`;

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

        // Registros ajustados pelo RH recebem um selo visual. O registro
        // original enviado pelo funcionário continua intacto no banco.
        const seloAjuste = ponto.ajustado
            ? '<span class="selo-ajustado" title="Registro ajustado pelo RH">ajustado</span>'
            : '';

        // O botão de histórico só aparece em registros que já foram
        // ajustados ao menos uma vez.
        const botaoHistorico = ponto.ajustado
            ? `<button class="btn-historico-ponto" title="Ver histórico de alterações" data-id="${ponto.id}">🕓</button>`
            : '';

        linhas += `
            <tr data-ponto-id="${ponto.id}" data-entrada="${ponto.entrada || ''}" data-saida="${ponto.saida || ''}" data-data="${ponto.data}">
                <td>${new Date(ponto.data).toLocaleDateString("pt-BR")} ${seloAjuste}</td>
                <td>${ponto.entrada || '-'}</td>
                <td>${ponto.saida || '-'}</td>
                <td class="${saldoClass}">${saldo}</td>
                <td>
                    <button
                        class="btn-editar-ponto"
                        title="Editar registro"
                        data-id="${ponto.id}"
                    >✎</button>
                    ${botaoHistorico}
                </td>
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
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>${linhas}</tbody>
        </table>
    `;

    // Reconecta os botões de editar e histórico após recriar a tabela
    document.querySelectorAll('.btn-editar-ponto').forEach(botao => {
        botao.addEventListener('click', () => abrirModalAjuste(botao.dataset.id));
    });

    document.querySelectorAll('.btn-historico-ponto').forEach(botao => {
        botao.addEventListener('click', () => abrirModalAuditoria(botao.dataset.id));
    });
}

carregarPontos();

configurarBotaoVoltar(`funcionario.html?id=${id}`);

// ── Editar ponto (RH) ────────────────────────────────────────────────
// Abre um modal simples para o RH corrigir a entrada e/ou a saída de um
// registro. A alteração NUNCA sobrescreve o ponto original: o backend
// cria um novo registro de ajuste (auditoria), conforme a Portaria
// 671/2021.

const modalAjuste = document.getElementById('modalAjustePonto');
const modalAjusteData = document.getElementById('modalAjusteData');
const inputAjusteEntrada = document.getElementById('inputAjusteEntrada');
const inputAjusteSaida = document.getElementById('inputAjusteSaida');
const mensagemErroAjuste = document.getElementById('mensagemErroAjuste');
const btnSalvarAjuste = document.getElementById('btnSalvarAjuste');
const btnCancelarAjuste = document.getElementById('btnCancelarAjuste');

let pontoEmEdicaoId = null;

function abrirModalAjuste(pontoId) {

    const linha = document.querySelector(`tr[data-ponto-id="${pontoId}"]`);
    if (!linha) return;

    pontoEmEdicaoId = pontoId;

    const data = linha.dataset.data;
    const entrada = linha.dataset.entrada;
    const saida = linha.dataset.saida;

    modalAjusteData.textContent =
        `Data: ${new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`;

    // <input type="time"> aceita "HH:MM" ou "HH:MM:SS"
    inputAjusteEntrada.value = entrada ? entrada.slice(0, 8) : '';
    inputAjusteSaida.value = saida ? saida.slice(0, 8) : '';

    mensagemErroAjuste.textContent = '';
    modalAjuste.classList.add('ativo');
}

function fecharModalAjuste() {
    modalAjuste.classList.remove('ativo');
    pontoEmEdicaoId = null;
}

btnCancelarAjuste?.addEventListener('click', fecharModalAjuste);

// ── Histórico de auditoria (visualização das alterações de um ponto) ──
// Busca GET /pontos/:id/auditoria, que retorna o registro original
// (imutável) e a lista de todos os ajustes feitos pelo RH naquele ponto,
// com data/hora, quem alterou e os valores antigo/novo de cada edição.

const modalAuditoria = document.getElementById('modalAuditoria');
const modalAuditoriaData = document.getElementById('modalAuditoriaData');
const auditoriaConteudo = document.getElementById('auditoriaConteudo');
const btnFecharAuditoria = document.getElementById('btnFecharAuditoria');

function formatarHoraExibicao(hora) {
    return hora ? hora.slice(0, 5) : '-';
}

function formatarDataHoraExibicao(dataHora) {
    return new Date(dataHora).toLocaleString('pt-BR');
}

async function abrirModalAuditoria(pontoId) {

    modalAuditoriaData.textContent = '';
    auditoriaConteudo.innerHTML = '<p>Carregando histórico...</p>';
    modalAuditoria.classList.add('ativo');

    try {

        const response = await fetch(
            `${API_BASE}/pontos/${pontoId}/auditoria`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const dados = await response.json();

        if (!response.ok) {
            throw new Error(dados.erro || 'Erro ao buscar histórico.');
        }

        modalAuditoriaData.textContent =
            `Data do registro: ${new Date(dados.registroOriginal.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`;

        // Registro original, sempre exibido primeiro (nunca é alterado)
        let html = `
            <div class="auditoria-item auditoria-original">
                <strong>Registro original (funcionário)</strong>
                <p>Entrada: ${formatarHoraExibicao(dados.registroOriginal.entrada)} —
                   Saída: ${formatarHoraExibicao(dados.registroOriginal.saida)} —
                   Saldo: ${dados.registroOriginal.saldo || '-'}</p>
            </div>
        `;

        if (dados.ajustes.length === 0) {
            html += '<p>Nenhum ajuste foi feito neste registro.</p>';
        } else {

            html += dados.ajustes.map(ajuste => `
                <div class="auditoria-item">
                    <strong>Ajuste em ${formatarDataHoraExibicao(ajuste.editado_em)}</strong>
                    <p>Alterado por: ${ajuste.editado_por_nome} (matrícula ${ajuste.editado_por_matricula})</p>
                    <p>
                        De: entrada ${formatarHoraExibicao(ajuste.entrada_anterior)},
                        saída ${formatarHoraExibicao(ajuste.saida_anterior)},
                        saldo ${ajuste.saldo_anterior || '-'}
                    </p>
                    <p>
                        Para: entrada ${formatarHoraExibicao(ajuste.entrada_ajustada)},
                        saída ${formatarHoraExibicao(ajuste.saida_ajustada)},
                        saldo ${ajuste.saldo_ajustado || '-'}
                    </p>
                </div>
            `).join('');
        }

        auditoriaConteudo.innerHTML = html;

    } catch (erro) {
        console.error(erro);
        auditoriaConteudo.innerHTML =
            `<p class="modal-ajuste-erro">${erro.message || 'Erro ao buscar histórico.'}</p>`;
    }
}

btnFecharAuditoria?.addEventListener('click', () => {
    modalAuditoria.classList.remove('ativo');
});

btnSalvarAjuste?.addEventListener('click', async () => {

    if (!pontoEmEdicaoId) return;

    const entrada = inputAjusteEntrada.value;
    const saida = inputAjusteSaida.value;

    if (!entrada && !saida) {
        mensagemErroAjuste.textContent =
            'Informe ao menos um horário (entrada ou saída).';
        return;
    }

    btnSalvarAjuste.disabled = true;
    mensagemErroAjuste.textContent = '';

    try {

        const response = await fetch(
            `${API_BASE}/pontos/${pontoEmEdicaoId}/ajustar`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    entrada: entrada || undefined,
                    saida: saida || undefined
                })
            }
        );

        const dados = await response.json();

        if (!response.ok) {
            throw new Error(dados.erro || 'Erro ao ajustar ponto.');
        }

        fecharModalAjuste();

        // Recarrega a lista para exibir o valor já ajustado e o selo
        await carregarPontos();

    } catch (erro) {
        console.error(erro);
        mensagemErroAjuste.textContent = erro.message || 'Erro ao ajustar ponto.';
    } finally {
        btnSalvarAjuste.disabled = false;
    }
});

// ── Gerar Comprovante em PDF ─────────────────────────────────────────

const inputPeriodo = document.getElementById('periodoComprovante');
const btnGerarComprovante = document.getElementById('btnGerarComprovante');
const modalErro = document.getElementById('modalErroComprovante');
const mensagemErro = document.getElementById('mensagemErroComprovante');

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

        // Nesta página o "id" é sempre o funcionário que o RH está
        // consultando (sem id, é o próprio RH vendo seus pontos).
        const url = id
            ? `${API_BASE}/pontos/comprovante/${id}?dataInicio=${dataInicio}&dataFim=${dataFim}`
            : `${API_BASE}/pontos/comprovante?dataInicio=${dataInicio}&dataFim=${dataFim}`;

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