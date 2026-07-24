-- Migração: cria a tabela de ajustes de ponto feitos pelo RH.
--
-- Requisito legal (Portaria nº 671/2021): o registro original feito pelo
-- funcionário (tabela `pontos`) NUNCA é alterado. Toda edição feita pelo RH
-- gera uma NOVA linha nesta tabela, preservando o valor anterior, o valor
-- novo, quem alterou e quando — funcionando como trilha de auditoria.
--
-- Requer MySQL 8.0+ (o sistema usa função de janela ROW_NUMBER() nas
-- consultas que leem esta tabela).
--
-- Como aplicar:
--   mysql -u <usuario> -p <nome_do_banco> < 001_criar_tabela_ponto_ajustes.sql
--
-- Observação: essa mesma tabela também é criada automaticamente ao rodar
-- "npm run db:init" (arquivo backend/src/database/init.js foi atualizado).
-- Use este script apenas se preferir aplicar a migração manualmente em um
-- banco que já existe.

CREATE TABLE IF NOT EXISTS ponto_ajustes (
    id INT AUTO_INCREMENT PRIMARY KEY,

    -- Registro original (imutável) que está sendo ajustado
    ponto_id INT NOT NULL,

    -- Funcionário dono do ponto (facilita consultas e integridade)
    funcionario_id INT NOT NULL,

    -- Usuário do RH que realizou o ajuste
    editado_por INT NOT NULL,

    -- Valores ANTES deste ajuste específico
    -- (podem já ser valores de um ajuste anterior, se o registro já
    -- tiver sido corrigido mais de uma vez — isso preserva a cadeia
    -- completa de alterações)
    entrada_anterior TIME NULL,
    saida_anterior TIME NULL,
    saldo_anterior VARCHAR(20) NULL,

    -- Valores DEPOIS deste ajuste
    entrada_ajustada TIME NULL,
    saida_ajustada TIME NULL,
    saldo_ajustado VARCHAR(20) NULL,

    editado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ponto_id)
        REFERENCES pontos(id)
        ON DELETE CASCADE,

    FOREIGN KEY (funcionario_id)
        REFERENCES funcionarios(id)
        ON DELETE CASCADE,

    FOREIGN KEY (editado_por)
        REFERENCES funcionarios(id)
);

-- Observação: não é preciso criar um índice manual em ponto_id — o InnoDB
-- já cria um índice automaticamente para colunas com chave estrangeira.
