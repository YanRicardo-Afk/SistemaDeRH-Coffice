// Serviço responsável por montar o PDF do comprovante de ponto.
//
// Usamos a biblioteca "pdfkit" porque ela gera o PDF diretamente em Node,
// sem precisar de um navegador/Chromium (como o Puppeteer exigiria) nem de
// HTML intermediário (como o html2pdf) — o que a torna mais leve para um
// backend simples como este, além de já ser compatível com a stack atual
// (Node/Express) sem exigir nenhuma dependência de sistema.

const PDFDocument = require('pdfkit');

const {
    calcularHorasTrabalhadas,
    paraDataISO
} = require('../utils/calculoPonto');

function formatarDataBR(data) {

    const iso = paraDataISO(data);
    const [ano, mes, dia] = iso.split('-');

    return `${dia}/${mes}/${ano}`;
}

function formatarHora(hora) {

    if (!hora) return '-';

    // "HH:MM:SS" -> "HH:MM"
    return hora.slice(0, 5);
}

// Gera o PDF do comprovante e resolve com um Buffer pronto para ser
// enviado na resposta HTTP (res.send(buffer)).
//
// Parâmetros:
//   funcionario -> { nome_completo, matricula, cargo }
//   pontos      -> lista de registros já com os valores "efetivos"
//                  (considerando eventuais ajustes do RH), no formato
//                  { data, entrada, saida, saldo, ajustado }
//   dataInicio, dataFim -> período do comprovante ("YYYY-MM-DD")
function gerarComprovantePDF({ funcionario, pontos, dataInicio, dataFim }) {

    return new Promise((resolve, reject) => {

        try {

            const doc = new PDFDocument({ margin: 40, size: 'A4' });
            const chunks = [];

            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            const margemEsquerda = doc.page.margins.left;

            // ── Cabeçalho ──────────────────────────────────────────
            doc.fontSize(18).fillColor('#3E1D0E').text('Coffice');

            doc.fontSize(13).fillColor('#000000')
                .text('Comprovante de Registro de Ponto');

            doc.moveDown(0.5);

            doc.fontSize(9).fillColor('#555555');
            doc.text(`Período: ${formatarDataBR(dataInicio)} a ${formatarDataBR(dataFim)}`);
            doc.text(`Emitido em: ${formatarDataBR(new Date())} às ${new Date().toLocaleTimeString('pt-BR')}`);

            doc.moveDown(1);

            // ── Dados do funcionário (apenas o que já existe no sistema) ──
            doc.fontSize(11).fillColor('#000000');
            doc.text(`Nome: ${funcionario.nome_completo}`);
            doc.text(`Matrícula: ${funcionario.matricula}`);
            doc.text(`Cargo: ${funcionario.cargo || '-'}`);

            doc.moveDown(1);

            // ── Tabela de registros ────────────────────────────────
            // pdfkit não tem um componente de tabela pronto, então desenhamos
            // manualmente linhas (retângulos) e o texto de cada célula.
            const colunas = [
                { titulo: 'Data', largura: 80 },
                { titulo: 'Entrada', largura: 80 },
                { titulo: 'Saída', largura: 80 },
                { titulo: 'Horas Trabalhadas', largura: 120 },
                { titulo: 'Saldo', largura: 80 }
            ];

            const larguraTotal = colunas.reduce((soma, c) => soma + c.largura, 0);
            const x = margemEsquerda;
            let y = doc.y;

            const desenharCabecalhoTabela = () => {

                doc.rect(x, y, larguraTotal, 20).fill('#A1663C');

                let cx = x;
                doc.fontSize(9).fillColor('#ffffff');

                colunas.forEach((coluna) => {
                    doc.text(coluna.titulo, cx + 4, y + 6, {
                        width: coluna.largura - 8
                    });
                    cx += coluna.largura;
                });

                y += 20;
            };

            desenharCabecalhoTabela();

            let houveAjuste = false;

            pontos.forEach((ponto, index) => {

                // Quebra de página quando chega perto do rodapé
                if (y > 760) {
                    doc.addPage();
                    y = 40;
                    desenharCabecalhoTabela();
                }

                if (ponto.ajustado) {
                    houveAjuste = true;
                }

                const dataIso = paraDataISO(ponto.data);

                const horasTrabalhadas = calcularHorasTrabalhadas(
                    ponto.entrada,
                    ponto.saida,
                    dataIso
                );

                const valores = [
                    formatarDataBR(ponto.data) + (ponto.ajustado ? ' *' : ''),
                    formatarHora(ponto.entrada),
                    formatarHora(ponto.saida),
                    horasTrabalhadas || '-',
                    ponto.saldo || '-'
                ];

                // fundo "zebrado" para facilitar a leitura
                doc.rect(x, y, larguraTotal, 18)
                    .fill(index % 2 === 0 ? '#F7EFE5' : '#FFFFFF');

                let cx = x;
                doc.fontSize(9).fillColor('#3E1D0E');

                valores.forEach((valor, i) => {
                    doc.text(String(valor), cx + 4, y + 5, {
                        width: colunas[i].largura - 8
                    });
                    cx += colunas[i].largura;
                });

                y += 18;
            });

            doc.moveDown(1);

            if (pontos.length === 0) {

                doc.fontSize(10).fillColor('#555555').text(
                    'Nenhum registro de ponto encontrado no período informado.',
                    x, y + 10
                );

            } else if (houveAjuste) {

                doc.fontSize(8).fillColor('#854F0B').text(
                    '* Registro ajustado pelo setor de RH. O histórico completo ' +
                    'de alterações (valor original, valor novo, responsável e ' +
                    'data/hora) fica disponível para auditoria no sistema.',
                    x, y + 10,
                    { width: larguraTotal }
                );
            }

            doc.end();

        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { gerarComprovantePDF };
