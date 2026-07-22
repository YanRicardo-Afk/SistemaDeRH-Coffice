const token = localStorage.getItem('token');
const DOMINIO_EMAIL = '@coffice.com';

const nomeErro =
    document.getElementById('nomeErro');

const telefoneErro =
    document.getElementById('telefoneErro');

const dataNascimentoErro =
    document.getElementById('dataNascimentoErro');

const senhaErro =
    document.getElementById('senhaErro');

const form = document.getElementById('formFuncionario');
const inputMatricula = document.getElementById('matricula');
const inputNome = document.getElementById('nome');
const inputTelefone = document.getElementById('telefone');
const inputDataNascimento = document.getElementById('dataNascimento');
const inputSenha = document.getElementById('senha');
const inputEmailLocal = document.getElementById('emailLocal');
const emailFeedback = document.getElementById('emailFeedback');
const mensagem = document.getElementById('mensagem');
const modalSucesso =
    document.getElementById('modalSucesso');

const mensagemSucesso =
    document.getElementById('mensagemSucesso');

function mostrarModalSucesso(matricula) {

    mensagemSucesso.textContent =
        `Funcionário cadastrado com sucesso! Matrícula: ${matricula}`;

    modalSucesso.classList.add('ativo');

}
// ── Função para mostrar mensagens ────────────────────────────────────
function mostrarErro(campo, elementoErro, texto) {

    elementoErro.textContent = texto;

    campo.classList.add('input-erro');

}

function limparErro(campo, elementoErro) {

    elementoErro.textContent = '';

    campo.classList.remove('input-erro');

}

// ── Validação do nome ────────────────────────────────────────────────
// Permite somente letras, incluindo acentos, e espaços.
inputNome.addEventListener('input', () => {
    inputNome.value = inputNome.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '');
});

// ── Validação do telefone ───────────────────────────────────────────
// Permite somente números.
inputTelefone.addEventListener('input', () => {
    inputTelefone.value = inputTelefone.value.replace(/\D/g, '');
});

// ── Validação da idade mínima ───────────────────────────────────────
function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(`${dataNascimento}T00:00:00`);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();

    // Se ainda não fez aniversário neste ano,
    // diminui 1 ano da idade.
    if (
        mesAtual < mesNascimento ||
        (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())
    ) {
        idade--;
    }

    return idade;
}

// ── Matrícula automática ──────────────────────────────────────────────
// Busca no servidor a próxima matrícula disponível apenas para exibir
// como sugestão.
// O valor definitivo é sempre recalculado pelo backend no cadastro.
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
        inputMatricula.value = data.matricula || '';
    } catch (error) {
        console.error('Erro ao gerar matrícula:', error);
        inputMatricula.placeholder = 'Não foi possível gerar';
    }
}

carregarProximaMatricula();

// ── Sugestão de e-mail a partir do nome ───────────────────────────────
// Exemplo:
// "Pedro Carvalho" -> "pedro.carvalho"
let emailEditadoManualmente = false;

function normalizarParaEmail(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .join('.')
        .replace(/[^a-z0-9.]/g, '');
}

// Quando o nome é alterado,
// sugere automaticamente um e-mail.
inputNome.addEventListener('input', () => {
    if (emailEditadoManualmente) {
        return;
    }

    inputEmailLocal.value = normalizarParaEmail(inputNome.value);
    verificarEmailDisponivel();
});

// Se o usuário alterar o e-mail manualmente,
// para de alterar automaticamente o e-mail pelo nome.
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

// ── Validação dos dados antes do envio ───────────────────────────────
function validarDadosCadastro() {

    const nome =
        inputNome.value.trim();

    const telefone =
        inputTelefone.value.trim();

    const dataNascimento =
        inputDataNascimento.value;

    const senha =
        inputSenha.value;


    // Limpa todos os erros anteriores

    limparErro(
        inputNome,
        nomeErro
    );

    limparErro(
        inputTelefone,
        telefoneErro
    );

    limparErro(
        inputDataNascimento,
        dataNascimentoErro
    );

    limparErro(
        inputSenha,
        senhaErro
    );


    // ── Validação do nome ────────────────────────────────────────────

    const nomeValido =
        /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(nome);


    if (!nomeValido) {

        mostrarErro(
            inputNome,
            nomeErro,
            'O nome deve conter somente letras e espaços.'
        );

        inputNome.focus();

        return false;

    }


    // ── Validação do telefone ───────────────────────────────────────

    if (!/^\d{10,11}$/.test(telefone)) {

        mostrarErro(
            inputTelefone,
            telefoneErro,
            'Digite um telefone válido com 10 ou 11 números.'
        );

        inputTelefone.focus();

        return false;

    }


    // ── Validação da data de nascimento ─────────────────────────────

    if (!dataNascimento) {

        mostrarErro(
            inputDataNascimento,
            dataNascimentoErro,
            'Informe a data de nascimento.'
        );

        inputDataNascimento.focus();

        return false;

    }


    // ── Validação da idade ──────────────────────────────────────────

    const idade =
        calcularIdade(
            dataNascimento
        );


    if (idade < 14) {

        mostrarErro(
            inputDataNascimento,
            dataNascimentoErro,
            'O funcionário deve ter pelo menos 14 anos de idade.'
        );

        inputDataNascimento.focus();

        return false;

    }


    // ── Validação da senha ──────────────────────────────────────────

    if (senha.length < 6) {

        mostrarErro(
            inputSenha,
            senhaErro,
            'A senha deve possuir no mínimo 6 caracteres.'
        );

        inputSenha.focus();

        return false;

    }


    return true;

}

// ── Envio do formulário ──────────────────────────────────────────────
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Limpa mensagens anteriores
    mensagem.textContent = '';
    mensagem.className = '';

    // Interrompe o cadastro caso algum dado seja inválido.
    if (!validarDadosCadastro()) {
        return;
    }

    const emailCompleto = `${inputEmailLocal.value.trim()}${DOMINIO_EMAIL}`;

    const funcionario = {
        // A matrícula não é enviada.
        // O backend gera automaticamente.
        nome_completo: inputNome.value.trim(),
        status_civil: document.getElementById('statusCivil').value,
        data_nascimento: inputDataNascimento.value,
        endereco: document.getElementById('endereco').value.trim(),
        email: emailCompleto,
        telefone: inputTelefone.value,
        cargo: document.getElementById('cargo').value,
        data_admissao: document.getElementById('dataAdmissao').value,
        data_ferias: document.getElementById('dataFerias').value || null,
        perfil: document.getElementById('perfil').value,
        senha: inputSenha.value
    };

    try {
        const response = await fetch('http://localhost:3000/funcionarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(funcionario)
        });

        const data = await response.json();

        // ── Cadastro realizado com sucesso ─────────────────────
        if (response.ok) {

    // Mostra o modal de sucesso
    mostrarModalSucesso(
        data.matricula
    );


    // Aguarda 2 segundos e volta
    // automaticamente para a lista de funcionários.

    setTimeout(() => {

        window.location.href =
            'funcionarios.html';

    }, 2000);


} else {

    mostrarMensagem(
        data.erro ||
        'Erro ao cadastrar funcionário.'
    );

}
    } catch (error) {
        console.error('Erro ao cadastrar funcionário:', error);
        mostrarMensagem('Não foi possível conectar ao servidor. Tente novamente.');
    }
});

// ── Botão Cancelar ───────────────────────────────────────────────────
document.getElementById('btnCancelar').addEventListener('click', () => {
    window.location.href = 'funcionarios.html';
});

// ── Botão Voltar ─────────────────────────────────────────────────────
configurarBotaoVoltar('funcionarios.html');