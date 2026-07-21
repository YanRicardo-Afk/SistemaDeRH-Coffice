const token = localStorage.getItem('token');

async function carregarHolerites() {

    const lista = document.getElementById('listaHolerites');

    try {

        const response = await fetch(
            'http://localhost:3000/holerites/me',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error('Erro ao carregar holerites');
        }

        const holerites = await response.json();

        lista.innerHTML = '';

        // Se não houver nenhum holerite
        if (holerites.length === 0) {

            lista.innerHTML = `
                <p style="color:#3E1D0E;">
                    Nenhum holerite encontrado.
                </p>
            `;

            return;
        }

        // Exibe todos os holerites
        holerites.forEach(holerite => {

            lista.innerHTML += `
                <div class="holerite-card">

                    <div class="holerite-nome">
                        ${holerite.descricao}
                    </div>


                    <div class="holerite-campos">

                        <div class="holerite-campo">
                            <span class="holerite-campo-label">
                                Salário
                            </span>

                            <span class="holerite-campo-valor">
                                R$ ${holerite.salario}
                            </span>
                        </div>


                        <div class="holerite-campo">
                            <span class="holerite-campo-label">
                                INSS
                            </span>

                            <span class="holerite-campo-valor">
                                R$ ${holerite.inss_normal}
                            </span>
                        </div>


                        <div class="holerite-campo">
                            <span class="holerite-campo-label">
                                Vale Alimentação
                            </span>

                            <span class="holerite-campo-valor">
                                R$ ${holerite.vale_alimentacao}
                            </span>
                        </div>


                        <div class="holerite-campo">
                            <span class="holerite-campo-label">
                                Ônibus Fretado
                            </span>

                            <span class="holerite-campo-valor">
                                R$ ${holerite.onibus_fretado}
                            </span>
                        </div>

                    </div>


                    <hr class="holerite-divider">


                    <div class="holerite-totais">

                        <div class="holerite-total-item">

                            <span class="holerite-total-label">
                                Total Vencimentos
                            </span>

                            <span class="holerite-total-valor">
                                R$ ${holerite.total_vencimentos}
                            </span>

                        </div>


                        <div class="holerite-total-item">

                            <span class="holerite-total-label">
                                Total Descontos
                            </span>

                            <span class="holerite-total-valor">
                                R$ ${holerite.total_descontos}
                            </span>

                        </div>


                        <div class="holerite-total-item holerite-total-liquido">

                            <span class="holerite-total-label">
                                Total Líquido
                            </span>

                            <span class="holerite-total-valor">
                                R$ ${holerite.total_liquido}
                            </span>

                        </div>

                    </div>

                </div>
            `;

        });

    } catch (error) {

        console.error('Erro ao carregar holerites:', error);

        lista.innerHTML = `
            <p style="color:#3E1D0E;">
                Erro ao carregar os holerites.
            </p>
        `;

    }
}

carregarHolerites();