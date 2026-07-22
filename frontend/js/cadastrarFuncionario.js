const token =
    localStorage.getItem('token');

const DOMINIO_EMAIL = '@coffice.com';

const form =
    document.getElementById('formFuncionario');

const inputMatricula =
    document.getElementById('matricula');

const inputNome =
    document.getElementById('nome');

const inputEmailLocal =
    document.getElementById('emailLocal');

const emailFeedback =
    document.getElementById('emailFeedback');

// ── Matrícula automática ──────────────────────────────────────────────
// Busca no servidor a próxima matrícula disponível apenas para exibir
// como sugestão. O valor definitivo é sempre recalculado e garantido
// pelo backend no momento em que o cadastro é salvo.
async function carregarProximaMatricula() {

    try {

        const response = await fetch(
            'http://localhost:3000/funcionarios/gerar-matricula',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        inputMatricula.value =
            data.matricula || '';

    } catch (error) {

        console.error('Erro ao gerar matrícula:', error);
        inputMatricula.placeholder = 'Não foi possível gerar';

    }
}

carregarProximaMatricula();

// ── Sugestão de e-mail a partir do nome ───────────────────────────────
// Ex: "Pedro Carvalho" -> "pedro.carvalho"
// Só sugere automaticamente enquanto o usuário não tiver digitado
// nada por conta própria no campo de e-mail.
let emailEditadoManualmente = false;

function normalizarParaEmail(texto) {

    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove acentos
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .join('.')
        .replace(/[^a-z0-9.]/g, '');
}

inputNome.addEventListener('input', () => {

    if (emailEditadoManualmente) {
        return;
    }

    inputEmailLocal.value =
        normalizarParaEmail(inputNome.value);

    verificarEmailDisponivel();
});

inputEmailLocal.addEventListener('input', () => {

    emailEditadoManualmente = true;
    verificarEmailDisponivel();
});

// ── Verificação em tempo real de e-mail duplicado ─────────────────────
let debounceEmail;

function verificarEmailDisponivel() {

    clearTimeout(debounceEmail);

    const local = inputEmailLocal.value.trim();

    if (!local) {
        emailFeedback.textContent = '';
        emailFeedback.className = 'field-hint';
        return;
    }

    emailFeedback.textContent = 'Verificando disponibilidade...';
    emailFeedback.className = 'field-hint';

    debounceEmail = setTimeout(async () => {

        const email = `${local}${DOMINIO_EMAIL}`;

        try {

            const response = await fetch(
                `http://localhost:3000/funcionarios/verificar-email?email=${encodeURIComponent(email)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (data.disponivel) {
                emailFeedback.textContent = `E-mail disponível: ${email}`;
                emailFeedback.className = 'field-hint sucesso';
            } else {
                emailFeedback.textContent = 'Este e-mail já está em uso. Ajuste o texto antes de @coffice.com.';
                emailFeedback.className = 'field-hint erro';
            }

        } catch (error) {

            console.error('Erro ao verificar e-mail:', error);
            emailFeedback.textContent = '';
            emailFeedback.className = 'field-hint';

        }

    }, 400);
}

// ── Envio do formulário ────────────────────────────────────────────────
form.addEventListener('submit', async (e) => {

    e.preventDefault();

    const emailCompleto =
        `${inputEmailLocal.value.trim()}${DOMINIO_EMAIL}`;

    const funcionario = {

    // matrícula não é enviada: o backend sempre gera automaticamente,
    // garantindo que nunca se repita.

    nome_completo:
        inputNome.value,

    status_civil:
        document.getElementById('statusCivil').value,

    data_nascimento:
        document.getElementById('dataNascimento').value,

    endereco:
        document.getElementById('endereco').value,

    email:
        emailCompleto,

    telefone:
        document.getElementById('telefone').value,

    cargo:
        document.getElementById('cargo').value,

    data_admissao:
        document.getElementById('dataAdmissao').value,

    data_ferias:
        document.getElementById('dataFerias').value || null,

    perfil:
        document.getElementById('perfil').value,

    senha:
        document.getElementById('senha').value

};

    const response = await fetch(
        'http://localhost:3000/funcionarios',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(funcionario)
        }
    );

    const data = await response.json();

    document.getElementById('mensagem')
        .textContent =
        data.mensagem || data.erro;

    if (response.ok) {

    document.getElementById('mensagem')
        .textContent =
        `Funcionário cadastrado com sucesso! Matrícula: ${data.matricula}`;

    setTimeout(() => {
        window.location.href =
            'funcionarios.html';
    }, 1500);

} else {

    document.getElementById('mensagem')
        .textContent =
        data.erro;

}
});

document.getElementById("btnCancelar").addEventListener("click", () => {
    window.location.href = "funcionarios.html";
});

configurarBotaoVoltar("funcionarios.html");
