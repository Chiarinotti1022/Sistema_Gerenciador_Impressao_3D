
# Sistema de Gerenciamento de Impressão 3D

Sistema web desenvolvido para auxiliar no gerenciamento de uma operação de impressão 3D, centralizando o cadastro de produtos, o registro de pedidos, o acompanhamento da produção e a visualização de resultados financeiros.

## Integrantes

- **Luiz Chiarinotti**
- **Gabriel Paulon**

## Objetivo

Facilitar a organização das atividades de uma operação de impressão 3D, oferecendo uma interface intuitiva para acompanhar pedidos, gerenciar produtos e consultar informações importantes para o controle do negócio.

## Funcionalidades

### Painel Inicial
- Visão geral dos pedidos cadastrados.
- Acompanhamento da situação da produção.
- Exibição dos indicadores de faturamento e lucro.
- Resumo das informações operacionais.

### Cadastro de Produtos
- Registro de novos produtos.
- Organização dos produtos disponíveis.
- Armazenamento de informações utilizadas nos pedidos.

### Gerenciamento de Pedidos
- Cadastro de pedidos de clientes.
- Registro de informações de contato.
- Inclusão de múltiplos produtos em um mesmo pedido.
- Acompanhamento dos pedidos cadastrados.

### Controle de Produção
Acompanhamento dos pedidos por meio de três situações:

- **Não feito:** pedido aguardando produção.
- **Fazendo:** pedido em processo de fabricação.
- **Feito:** pedido com produção concluída.

### Indicadores Financeiros
- Cálculo do faturamento.
- Cálculo do lucro.
- Utilização dos valores de venda e custos registrados.
- Visualização dos resultados no painel inicial.

## Tecnologias Utilizadas

O projeto utiliza as seguintes tecnologias:

- **React:** construção da interface web.
- **JavaScript (JSX):** implementação dos componentes e funcionalidades.
- **HTML5:** estruturação da aplicação.
- **CSS3:** estilização da interface.
- **Node.js e npm:** ambiente de desenvolvimento e gerenciamento de dependências.

## Como Executar o Projeto

### Pré-requisitos

É necessário possuir instalado:

- Node.js
- npm

### Instalação

**1.** Clone o repositório ou baixe os arquivos do projeto.

**2.** Abra o terminal na pasta do projeto.

**3.** Instale as dependências:

```bash
npm install
```

**4.** Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

**5.** Abra no navegador o endereço informado pelo terminal.

> **Observação:** o comando de inicialização pode variar conforme os scripts configurados no arquivo `package.json`.

## Organização da Aplicação

A aplicação está organizada em telas e componentes reutilizáveis, permitindo maior facilidade de manutenção e expansão.

As principais áreas do sistema são:

- **Início:** painel de acompanhamento e indicadores.
- **Produtos:** gerenciamento dos produtos cadastrados.
- **Pedidos:** cadastro e gerenciamento das encomendas.
- **Componentes:** elementos reutilizáveis, como formulários.

## Possíveis Melhorias Futuras

- [ ] Exportação de relatórios financeiros.
- [ ] Filtros de pedidos por período, cliente e situação.
- [ ] Controle de estoque de filamentos e resinas.
- [ ] Integração com banco de dados persistente.
- [ ] Autenticação de usuários.
- [ ] Relatórios de produtividade.
- [ ] Histórico detalhado de produção.

## Autores

Projeto desenvolvido por:

**Luiz Chiarinotti**  
**Gabriel Paulon**
