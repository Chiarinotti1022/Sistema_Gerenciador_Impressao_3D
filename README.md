# Sistema de Gerenciamento de Impressão 3D

Sistema web desenvolvido para auxiliar no gerenciamento de uma operação de impressão 3D, centralizando o cadastro de produtos, o registro de pedidos, o acompanhamento da produção e a visualização de resultados financeiros.

O projeto utiliza **React** para o desenvolvimento da interface e **Supabase** para autenticação de usuários e futura persistência dos dados operacionais.

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
- Utilização dos valores de venda, custos e taxas registrados.
- Visualização dos resultados no painel inicial.

### Autenticação de Usuários

O sistema possui integração com o **Supabase Authentication**, responsável pela autenticação e validação das credenciais dos usuários.

Atualmente, estão implementadas as seguintes funcionalidades:

- Sistema de login.
- Validação das credenciais informadas.
- Comunicação com o serviço de autenticação do Supabase.

Essa integração representa a primeira etapa da implementação do backend da aplicação.

## Banco de Dados

O projeto utiliza o **Supabase**, uma plataforma de backend que disponibiliza banco de dados PostgreSQL, autenticação e APIs para comunicação com aplicações web.

### Estado Atual da Integração

Atualmente, o Supabase está integrado ao sistema para realizar a autenticação dos usuários.

Entretanto, as funcionalidades relacionadas ao armazenamento dos dados operacionais ainda não estão conectadas ao banco de dados.

As integrações pendentes incluem:

- **Produtos:** armazenamento, consulta e atualização dos produtos cadastrados.
- **Pedidos:** persistência das informações dos pedidos e clientes.
- **Taxas:** armazenamento das taxas utilizadas nos cálculos financeiros.
- **Produção:** atualização e consulta das situações de produção.
- **Indicadores financeiros:** utilização dos dados armazenados para calcular faturamento e lucro.

A próxima etapa do desenvolvimento consiste em conectar essas funcionalidades ao Supabase, permitindo o armazenamento e a recuperação dos dados diretamente do banco.

## Tecnologias Utilizadas

O projeto utiliza as seguintes tecnologias:

- **React:** construção da interface web.
- **JavaScript (JSX):** implementação dos componentes e funcionalidades.
- **HTML5:** estruturação da aplicação.
- **CSS3:** estilização da interface.
- **Node.js e npm:** ambiente de desenvolvimento e gerenciamento de dependências.
- **Supabase:** autenticação de usuários e integração com serviços de backend.
- **PostgreSQL:** banco de dados disponibilizado pelo Supabase.

## Como Executar o Projeto

### Pré-requisitos

É necessário possuir instalado:

- Node.js
- npm

Também é necessário configurar a conexão com o Supabase.

### Instalação

**1.** Clone o repositório ou baixe os arquivos do projeto.

**2.** Abra o terminal na pasta do projeto.

**3.** Instale as dependências:

```bash
npm install
```

**4.** Configure as variáveis de ambiente necessárias para a conexão com o Supabase.

**5.** Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

**6.** Abra no navegador o endereço informado pelo terminal.

> **Observação:** o comando de inicialização pode variar conforme os scripts configurados no arquivo `package.json`.

> **Segurança:** não publique chaves secretas ou credenciais privadas do Supabase no repositório.

## Organização da Aplicação

A aplicação está organizada em telas e componentes reutilizáveis, permitindo maior facilidade de manutenção e expansão.

As principais áreas do sistema são:

- **Início:** painel de acompanhamento e indicadores.
- **Produtos:** gerenciamento dos produtos cadastrados.
- **Pedidos:** cadastro e gerenciamento das encomendas.
- **Componentes:** elementos reutilizáveis, como formulários.
- **Autenticação:** login e validação das credenciais utilizando o Supabase.

## Estado Atual do Desenvolvimento

O sistema encontra-se em desenvolvimento, com funcionalidades de gerenciamento implementadas na interface e integração inicial com o backend.

| Funcionalidade | Situação |
|---|---|
| Painel inicial | ✅ Implementado |
| Cadastro de produtos na interface | ✅ Implementado |
| Gerenciamento de pedidos na interface | ✅ Implementado |
| Controle de produção | ✅ Implementado |
| Indicadores financeiros | ✅ Implementado |
| Integração com Supabase Authentication | ✅ Implementado |
| Login com validação de credenciais | ✅ Implementado |
| Persistência de produtos no Supabase | 🚧 Pendente |
| Persistência de pedidos no Supabase | 🚧 Pendente |
| Persistência de taxas no Supabase | 🚧 Pendente |
| Integração dos indicadores com o banco | 🚧 Pendente |

> **Importante:** embora o sistema já possua integração com o Supabase para autenticação, os dados de produtos, pedidos, taxas e demais informações operacionais ainda não estão vinculados ao banco de dados.

## Possíveis Melhorias Futuras

- Integração completa das tabelas de produtos, pedidos e taxas com o Supabase.
- Implementação das operações de cadastro, consulta, atualização e exclusão diretamente no banco de dados.
- Persistência das informações de produção.
- Integração dos indicadores financeiros com os dados armazenados.
- Exportação de relatórios financeiros.
- Filtros de pedidos por período, cliente e situação.
- Controle de estoque de filamentos e resinas.
- Aprimoramento do controle de acesso dos usuários.
- Relatórios de produtividade.
- Histórico detalhado de produção.

## Autores

Projeto desenvolvido por:

**Luiz Chiarinotti**  
**Gabriel Paulon**
