<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:0EA5E9,100:1D4ED8&height=190&section=header&text=FinTrack&fontSize=48&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Gestão%20Financeira%20Pessoal%20para%20Web%20e%20Mobile&descAlignY=58&descSize=17" />

<div align="center">
  <p><a href="./README.en.md">🇺🇸 Read in English</a></p>
  
  <img src="https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&weight=700&size=24&duration=3000&pause=900&color=0EA5E9&center=true&vCenter=true&width=900&lines=Rastreie+Receitas+e+Despesas;Construa+Metas+Financeiras;Analise+Relatórios+Mensais;Dashboard+Financeiro+Moderno" alt="Typing SVG" />

  <br>

  <img src="https://img.shields.io/badge/Status-Dashboard_Financeiro-0EA5E9?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Categoria-FinTech-1D4ED8?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Versão-1.0.0-1E3A8A?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Licença-MIT-181717?style=for-the-badge" />
</div>

---

## 💸 Sobre

**FinTrack** é uma plataforma de finanças pessoais desenhada para ajudar usuários a gerenciar receitas, despesas, categorias e metas financeiras com uma interface de dashboard limpa e moderna.

O projeto inclui interfaces mobile e web, alimentadas por uma API REST e um banco de dados relacional.

<div align="center">
  <img src="screenshots/login.png" width="48%" alt="Tela de Login" />
  <img src="screenshots/dashboard.png" width="48%" alt="Dashboard Principal" />
  <br>
  <em>Interfaces de Autenticação e Dashboard principal</em>
</div>

---

## ✨ Funcionalidades

- Autenticação de usuários (JWT)
- Rastreamento de receitas e despesas
- Categorias de transações
- Balanço e resumo mensal
- Acompanhamento de metas financeiras
- Métricas e gráficos no dashboard
- Feed de transações recentes
- Filtros por tipo, categoria e data
- Rotas protegidas
- Validação de dados na API

---

## 🧱 Tecnologias

<div align="center">

<img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" />
<img src="https://img.shields.io/badge/NativeWind-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-181717?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
<img src="https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white" />
<img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />

</div>

---

## 📱 Telas

```txt
Mobile
├── Login
├── Registrar
├── Dashboard
├── Transações
├── Nova Transação
├── Categorias
├── Metas
└── Perfil

Web
├── Dashboard
├── Transações
├── Categorias
├── Metas
└── Configurações
```

---

## 🗂️ Estrutura do Projeto

```txt
fintrack/
├── apps/
│   ├── mobile/
│   ├── web/
│   └── api/
├── packages/
│   └── shared/
├── docker-compose.yml
└── README.md
```

---

## 🚀 Como Começar

Siga os passos abaixo para rodar o projeto localmente.

### 1. Clone o repositório e instale as dependências
```bash
git clone https://github.com/odevfigueiredo/fintrack.git
cd fintrack
npm install
```

### 2. Configure as Variáveis de Ambiente
Copie os arquivos `.env.example` para criar os arquivos de ambiente finais:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env
```
*(Nota: Certifique-se de ajustar as credenciais no `apps/api/.env` caso encontre erros de permissão no Prisma nos próximos passos).*

### 3. Inicie o Banco de Dados
Suba o container do MySQL usando o Docker Compose:
```bash
docker compose up -d
```

### 4. Configure as Tabelas do Banco
Gere o Prisma Client, rode as migrations e popule o banco com dados padrão e o usuário de teste:
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 5. Rode as Aplicações
Abra terminais separados para cada serviço e inicie-os:
```bash
# Terminal 1 - Iniciar a API (Backend)
npm run dev:api

# Terminal 2 - Iniciar o Dashboard (Web)
npm run dev:web

# Terminal 3 - Iniciar o App (Mobile)
npm run dev:mobile
```

---

## 🔐 Usuário de Teste

Um usuário de teste é criado automaticamente ao rodar o script de seed do banco de dados:
```txt
email: user@fintrack.dev
senha: 123456
```

---

## 📌 Resumo da API

```txt
POST   /auth/register
POST   /auth/login
GET    /auth/me

GET    /transactions
POST   /transactions
GET    /transactions/:id
PUT    /transactions/:id
DELETE /transactions/:id

GET    /categories
POST   /categories
PUT    /categories/:id
DELETE /categories/:id

GET    /goals
POST   /goals
PUT    /goals/:id
DELETE /goals/:id

GET    /dashboard/summary
```

---

## 🧭 Próximos Passos (Roadmap)

- Agrupamento de contas bancárias
- Transações recorrentes
- Exportação em CSV/PDF
- Limites de orçamento
- Gráficos avançados
- Sincronização offline robusta
- Lembretes por notificação push

---

## 📸 Galeria

<div align="center">
  <h3>Transações</h3>
  <img src="screenshots/transacoes.png" width="100%" alt="Transações" />

  <br><br>

  <h3>Categorias e Metas</h3>
  <img src="screenshots/categorias.png" width="48%" alt="Categorias" />
  <img src="screenshots/metas.png" width="48%" alt="Metas" />

  <br><br>

  <h3>Configurações</h3>
  <img src="screenshots/configuracoes.png" width="100%" alt="Configurações" />
</div>

---

<div align="center">

Desenvolvido por [Jonatha Figueiredo](https://github.com/odevfigueiredo)

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1D4ED8,100:0EA5E9&height=120&section=footer" />

</div>
