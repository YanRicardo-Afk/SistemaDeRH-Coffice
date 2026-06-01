const form =
    document.getElementById('formFuncionario');

form.addEventListener('submit', async (e) => {

    e.preventDefault();

    const token =
        localStorage.getItem('token');

    const funcionario = {

    matricula:
        document.getElementById('matricula').value,

    nome_completo:
        document.getElementById('nome').value,

    status_civil:
        document.getElementById('statusCivil').value,

    data_nascimento:
        document.getElementById('dataNascimento').value,

    endereco:
        document.getElementById('endereco').value,

    email:
        document.getElementById('email').value,

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
        'Funcionário cadastrado com sucesso!';

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

