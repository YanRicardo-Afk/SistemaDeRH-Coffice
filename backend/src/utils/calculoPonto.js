// Funções utilitárias de cálculo de ponto.
// Centralizadas aqui para serem reaproveitadas pelo registro de saída,
// pelos ajustes feitos pelo RH e pela geração do comprovante em PDF —
// evitando duplicar a lógica de cálculo em vários lugares.

const JORNADA_PADRAO_HORAS = 8;

// Converte um valor de data vindo do MySQL (Date ou string) para "YYYY-MM-DD".
function paraDataISO(data) {

    if (data instanceof Date) {
        return data.toISOString().split('T')[0];
    }

    return String(data).split('T')[0];
}

// Formata um número decimal de horas para "HH:MM".
function formatarDuracao(horasDecimais) {

    const horas = Math.floor(horasDecimais);

    const minutos = Math.round(
        (horasDecimais - horas) * 60
    );

    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
}

// Calcula o total de horas trabalhadas no dia (formato "HH:MM").
// Retorna null se o registro estiver incompleto (sem entrada ou sem saída).
function calcularHorasTrabalhadas(entrada, saida, data) {

    if (!entrada || !saida) {
        return null;
    }

    const entradaDate = new Date(`${data}T${entrada}`);
    const saidaDate = new Date(`${data}T${saida}`);

    const horas = (saidaDate - entradaDate) / 1000 / 60 / 60;

    return formatarDuracao(horas);
}

// Calcula o saldo em relação à jornada de 8h (formato "+HH:MM" / "-HH:MM").
// Retorna null se o registro estiver incompleto.
function calcularSaldo(entrada, saida, data) {

    if (!entrada || !saida) {
        return null;
    }

    const entradaDate = new Date(`${data}T${entrada}`);
    const saidaDate = new Date(`${data}T${saida}`);

    const horasTrabalhadas =
        (saidaDate - entradaDate) / 1000 / 60 / 60;

    const saldoHoras = horasTrabalhadas - JORNADA_PADRAO_HORAS;

    const sinal = saldoHoras >= 0 ? '+' : '-';

    return sinal + formatarDuracao(Math.abs(saldoHoras));
}

module.exports = {
    JORNADA_PADRAO_HORAS,
    paraDataISO,
    calcularHorasTrabalhadas,
    calcularSaldo
};
