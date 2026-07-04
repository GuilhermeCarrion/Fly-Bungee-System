# Planejamento Fundação — Moven

> Documento vivo. Base para as sprints do Jira. Branch de trabalho: `develop`.
> Objetivo: destravar o desenvolvimento passo a passo com padrões e modelo de dados claros, antes de sair codando.

---

## 1. Organização do projeto (git)

| Branch | Papel |
|---|---|
| `main` | Versão "final" completa = **demo/referência**. Vai pra Vercel mostrar ao cliente. Não desenvolvemos aqui. |
| `develop` | **Desenvolvimento real, passo a passo**. Partiu do commit `0d0daa7` (limpo). É aqui que trabalhamos. |

Para consultar o "gabarito" de um arquivo da versão final enquanto codifica:
```bash
git show main:src/server/services/AppointmentService.ts
```

---

## 2. Visão do produto (resumo do TCC)

Sistema web **interno** (o aluno NÃO usa; só recebe WhatsApp) para gestão de estúdio de Bungee Fitness.

**MVP faz:** gestão de alunos, planos/pacotes, agendamentos + automação por WhatsApp (lembretes/confirmações).
**MVP NÃO faz:** app mobile, bot conversacional, dashboard financeiro completo, portal do aluno.

Usuários: **gestor/proprietário, professor, atendente**.

---

## 3. ⚠️ Decisão-chave: SaaS ≠ "aluno em várias academias"

Dois conceitos que estavam misturados:

- **Multi-tenant SaaS** (o que queremos): várias academias no mesmo sistema, cada uma vê só o seu. Resolve com `academyId` em tudo. **Simples.**
- **M:N membership** (o que confundiu): o mesmo aluno pertence a várias academias ao mesmo tempo. Exige 3 tabelas de vínculo (`Membership`, `Enrollment`, `ProfessorAcademy`) e joins em quase toda query. **Complexo.**

**✅ Decidido: modelo simples** (1 academia por aluno/professor/usuário). Continua sendo SaaS de verdade; a mesma pessoa em duas academias vira dois cadastros (padrão em SaaS). Se um dia surgir a necessidade real de M:N, migramos.

---

## 4. Modelo de dados proposto (simples)

Cada tabela tem `academyId` (isolamento SaaS). Em linguagem simples:

| Tabela | O que é | Campos-chave / exemplo |
|---|---|---|
| **Academy** | A academia (tenant) | `name`. Ex.: "Fly Bungee Araçatuba" |
| **User** | Quem loga | `email`, `password`, `role`, `academyId`, `active` |
| **Professor** | Quem dá aula | `name`, `phone`, `cpf`, `userId?` (vínculo opcional p/ login), `academyId` |
| **Student** | Aluno (pessoa) | dados pessoais + `heightCm`, `weightKg` (limites de segurança); `academyId` |
| **Plan** | Modelo de plano que a academia vende | `name`, `credits`, `durationDays`, `price` |
| **Package** | Plano **comprado** por um aluno | `studentId`, `planId`, `creditsLeft`, `validUntil`, `paymentStatus` |
| **ClassSession** | Uma aula | `professorId`, `startAt`, `capacity`, `status` |
| **Appointment** | Agendamento do aluno na aula | `studentId`, `classSessionId`, `packageId`, `bookingStatus`, `attendance` |

**Exemplo de fluxo:** a Ana (Professor, com `userId` para logar) cria uma `ClassSession` terça 19h, capacidade 12. O João (Student) tem um `Package` ativo (8 créditos, válido até 30/08). Ele agenda → nasce um `Appointment` (BOOKED) e consome 1 crédito do Package. No dia, a Ana marca `attendance = PRESENT`.

### Detalhe importante: 2 eixos de estado no Appointment
- `bookingStatus`: **BOOKED → CONFIRMED / CANCELLED / RESCHEDULED** (ciclo do agendamento)
- `attendance`: **PENDING → PRESENT / NO_SHOW** (presença no dia)

Misturar os dois num enum só vira bagunça — por isso ficam separados.

---

## 5. Fundação de qualidade (antes das features)

1. **RBAC de verdade:** enum `Role` passa de `ADMIN/USER` para **`ADMIN / GESTOR / PROFESSOR`**, e o middleware passa a **checar o papel** (hoje qualquer logado faz tudo).
2. **Tratamento de erro central:** um helper `handleError` + classes de erro (`AppError`) para devolver o status certo (404 não-encontrado, 409 duplicado, 500 inesperado) em vez de 400 pra tudo.
3. **`academyId` sempre tipado como `string`** (hoje vem `string | null` e passa direto pros controllers).

---

## 6. Bugs encontrados na revisão (corrigir cedo)

| # | Onde | Problema |
|---|---|---|
| 1 | `src/lib/axios.ts:29` | Lê `localStorage "token"`, mas o app salva em `@App:token`. Resultado: **após logar sem refresh, chamadas dão 401.** |
| 2 | `AuthService.ts:59` | `findById` sem `await` → validação de "usuário não encontrado" é código morto. |
| 3 | `AppointmentService.ts` | Não valida se o aluno é da mesma academia (vazamento cross-tenant). *No modelo proposto isso some por construção.* |
| 4 | `ClassSessionRepository.ts:20` | Lotação conta agendamentos `CANCELLED`; e o aluno não consegue reagendar após cancelar. **→ corrigir junto do ciclo de cancelamento (S4):** hoje não há como cancelar, então o bug não se manifesta e o fix está acoplado à lógica de cancelar/estornar. |
| 5 | `ProfessorController.ts:8` | Método com typo `strore` (deveria ser `store`). |

---

## 7. Backlog sugerido (sprints)

| Sprint | Entrega |
|---|---|
| **S0 — Fundação** | Corrigir bugs 1, 2 e 5 (o #4 vai com o S4); RBAC com 3 roles + checagem no middleware; helper de erro; ajustar enum `Role` |
| **S1 — Alunos** | Endpoints faltantes (GET by id / PATCH / DELETE) + tela `/alunos` (lista + form) |
| **S2 — Professores** | Update/delete (com "tem aula futura?") + vínculo `userId` + tela |
| **S3 — Planos/Pacotes** | Modelar `Plan` + `Package` (crédito + validade + pagamento) |
| **S4 — Aulas + Agendamentos** | Ciclo completo (confirmar/cancelar/remarcar/presença) + consumo de crédito |
| **S5 — Dashboard** | Visão geral na home (`/`) com widgets reais (agenda do dia, próxima aula, KPIs) |
| **Futuro** | Hardening de auth (cookies httpOnly + refresh + recuperação de senha); WhatsApp (Cloud API) + tabela `Jobs` + `node-cron` |

> **Convenção de rotas:** URLs limpas, sem prefixo `dashboard` (`/alunos`, `/professores`, `/agendamentos`, `/planos`). Usar **route group** do Next.js `src/app/(painel)/...` para compartilhar o layout da sidebar sem poluir a URL. A visão geral fica na home (`/`).

---

## 8. Decisões já tomadas

- ✅ `main` = demo / `develop` = desenvolvimento.
- ✅ Banco de dev separado (Supabase agora, Docker/VPS depois).
- ✅ Professor = entidade **híbrida** (com `userId` opcional para login).
- ✅ `Jobs`/automação/WhatsApp = **fase futura** (só pensamos no conceito agora).
- ✅ Multi-tenant SaaS via `academyId`.
- ✅ **Modelo de aluno simples** (1 academia por aluno; sem M:N).
- ✅ **Limites físicos = bloqueio** fora da faixa (42–107 kg, ≥1,40 m). Futuro: mensagem amigável explicando o motivo de segurança — a validar com o cliente (que já relatou que não deve ser permitido).
- ✅ **Aula experimental** = flag `isTrial` + `approvedBy` no `Appointment`. O mesmo mecanismo servirá para **eventos gratuitos** no futuro.
- ✅ **Recuperação de senha + refresh token** entram junto da **migração para cookies httpOnly** (sprint de hardening de auth, depois do núcleo — "mata dois coelhos").
- ✅ **Rotas** sem prefixo `dashboard`, via route group `(painel)` (ver seção 7).

---

## 9. 🟡 Decisões pendentes (preciso de você)

Nenhuma no momento. 🎉 (as da seção 9 foram respondidas e migraram para a seção 8)

---

## 10. Features futuras (backlog de ideias — longo prazo)

Funcionalidades que agregam valor mas ficam para **depois do MVP**. (O "não faz" duro do produto está na seção 2; aqui são ideias que queremos preservar.)

- ⭐ **Lançamento de aulas (agenda recorrente):** aluna recorrente com pacote deixa a semana pré-agendada (ex.: "terça e quinta 19h", "dia sim dia não"); o sistema gera os `Appointment` automaticamente e debita créditos. Grande diferencial prático — reflete o comportamento real da academia.
  - *Building block técnico:* recorrência na `ClassSession` (gerar sessões "toda terça 19h" sem cadastro manual).
- **Tipos/modalidades de aula:** catálogo (tipo `Plan`, mas de aula) — só se surgir mais de uma modalidade.
- **Relatórios** de frequência/inadimplência/agendamentos, exportáveis em PDF/CSV (RF07).
- **Automação WhatsApp + `Jobs` + `node-cron`:** a "inteligência" interna (confirmação 12h antes, no-show automático, alerta de expiração 3 dias antes). Fase própria, discutida à parte.

### Dívida técnica / hardening (não-features)
Cookies httpOnly, refresh token e recuperação de senha (agendados na linha *Hardening de auth* da seção 7); rate limiting no login; testes automatizados (auth + automações).
