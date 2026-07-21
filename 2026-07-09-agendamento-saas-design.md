# Especificação: Plataforma de Agendamento para Prestadores de Serviço

**Data:** 2026-07-09
**Status:** Aprovado para plano de implementação

## 1. Visão Geral

Plataforma SaaS (gratuita nesta fase, monetização fica para versão futura) que permite a
prestadores de serviço (barbeiros, tatuadores, massagistas, psicólogos etc.) disponibilizar
uma página pública de agendamento personalizada, onde clientes solicitam horários sem
necessidade de login. O prestador confirma, recusa ou sugere um novo horário para cada
solicitação através de um dashboard próprio.

Cada conta de prestador representa uma única pessoa com uma única agenda (suporte a times
com múltiplos profissionais por conta fica para uma versão futura).

## 2. Arquitetura Geral

- **Framework:** Next.js 14+ (App Router), aplicação full-stack única
- **Banco de dados:** PostgreSQL (Docker local em desenvolvimento; Neon/Supabase DB free
  tier em produção — usado apenas como banco, sem as demais features do Supabase)
- **ORM:** Prisma
- **Autenticação do prestador:** NextAuth.js (Google OAuth + e-mail/senha)
- **Autenticação do cliente:** nenhuma — gerenciamento de agendamento via link único
  (token) enviado por e-mail
- **E-mails:** Resend (free tier) com templates em React Email
- **Upload de logo:** serviço de armazenamento de arquivos (Vercel Blob ou Cloudinary free
  tier — decidir na fase de implementação)
- **Deploy:** Vercel (free tier)
- **Repositório:** único repositório no GitHub, documentado por fases de desenvolvimento

### Estrutura de rotas

```
/p/[slug]                      → página pública de agendamento do prestador
/p/[slug]/agendamento/[token]  → gerenciar (cancelar/aceitar/recusar) uma solicitação via link do e-mail
/login                         → login do prestador
/dashboard                     → visão geral da agenda
/dashboard/servicos             → CRUD de serviços
/dashboard/horarios             → horário de funcionamento + bloqueios
/dashboard/personalizar         → logo + cores da página pública
```

## 3. Modelo de Dados

```
Provider (Prestador)
├─ id, nome, slug (usado na URL /p/slug, único)
├─ email, senha_hash (ou vínculo com conta Google)
├─ logo_url, cor_destaque, cor_fundo
├─ horario_funcionamento (dias da semana + intervalos, ex: seg-sex 09:00-18:00)
└─ criado_em

Service (Serviço)
├─ id, provider_id
├─ nome, descrição, preço, duração_minutos
└─ ativo (bool)

BlockedSlot (Bloqueio de horário)
├─ id, provider_id
├─ tipo: "recorrente" | "pontual"
├─ recorrente: dia_da_semana + hora_inicio + hora_fim (ex: toda sexta 12h-13h)
├─ pontual: data_inicio + data_fim (data/hora exatas)
└─ motivo (texto livre, opcional)

Appointment (Agendamento/Solicitação)
├─ id, provider_id, service_id
├─ cliente_nome, cliente_email, cliente_telefone (opcional)
├─ data_hora_inicio, data_hora_fim (horário atual solicitado/confirmado)
├─ proposta_data_hora_inicio, proposta_data_hora_fim (preenchido apenas durante reagendamento em análise)
├─ status: "pendente" | "confirmado" | "reagendamento_proposto" | "cancelado" | "recusado"
├─ token_gerenciamento (UUID único; usado no link do e-mail para cancelar/aceitar/recusar, sem login)
└─ criado_em
```

### Fluxo de status do Appointment

```
pendente ──(prestador confirma)──────────────→ confirmado
         ──(prestador recusa)────────────────→ recusado
         ──(prestador sugere outro horário)──→ reagendamento_proposto
         ──(cliente cancela via link)────────→ cancelado

reagendamento_proposto ──(cliente aceita)─────→ confirmado (data_hora_inicio/fim = proposta)
                        ──(cliente recusa)────→ cancelado
                        ──(cliente cancela)───→ cancelado

confirmado ──(cliente cancela via link)───────→ cancelado
```

### Regras de disponibilidade

- A disponibilidade de horários na página pública é calculada em tempo real:
  `horário de funcionamento` menos `bloqueios (recorrentes + pontuais)` menos
  `agendamentos que se sobrepõem e estão em pendente, confirmado ou reagendamento_proposto`
  (considerando a duração do serviço escolhido).
- Enquanto um agendamento está em `reagendamento_proposto`, tanto o horário original quanto
  o horário proposto contam como ocupados, para evitar conflito duplo.
- A validação de disponibilidade deve ocorrer no servidor no momento da criação da
  solicitação, para evitar condição de corrida entre dois clientes solicitando o mesmo
  horário simultaneamente.

## 4. Fluxo de E-mails

| Evento | Destinatário | Conteúdo |
|---|---|---|
| Cliente envia solicitação | Cliente | Confirmação de recebimento, aguardando o prestador + link de gerenciamento |
| Cliente envia solicitação | Prestador | Notificação de nova solicitação pendente + link para o dashboard |
| Prestador confirma | Cliente | Agendamento confirmado, com data/hora final + link de gerenciamento |
| Prestador recusa | Cliente | Aviso de que não foi possível confirmar o horário |
| Prestador sugere novo horário | Cliente | Novo horário sugerido, com opções de aceitar/recusar via link |
| Cliente aceita novo horário | Prestador | Notificação de reagendamento aceito |
| Cliente recusa novo horário | Prestador | Notificação de reagendamento recusado (agendamento cancelado) |
| Cliente cancela (a qualquer momento) | Prestador | Notificação de cancelamento |

Todas as ações de cancelar/aceitar/recusar usam o mesmo `token_gerenciamento` do
agendamento, sem exigir login do cliente. O sistema de e-mails poderá ser expandido depois
(ex: lembrete automático antes do horário confirmado).

## 5. Dashboard do Prestador — Telas

- **Visão geral da agenda:** lista/calendário com todos os agendamentos e ações rápidas
  (confirmar, recusar, sugerir novo horário, cancelar)
- **Serviços:** CRUD de nome, descrição, preço, duração, ativo/inativo
- **Horários:** horário de funcionamento (dias da semana + intervalos) e bloqueios
  (recorrentes e pontuais)
- **Personalizar:** upload de logo, cor de destaque e cor de fundo, com preview da página
  pública
- **Link da página pública:** exibição e cópia do link `/p/slug` para compartilhar com
  clientes

## 6. Tratamento de Erros e Casos-Limite

- **Concorrência de horário:** validação de disponibilidade no servidor no momento da
  criação da solicitação; a segunda tentativa para o mesmo horário é rejeitada.
- **Token inválido/expirado/já usado:** página amigável informando que o link não é mais
  válido.
- **Bloqueio conflitante com agendamento confirmado:** o prestador é avisado e precisa
  resolver o conflito (cancelar o agendamento) antes que o bloqueio tenha efeito.
- **Falha no envio de e-mail (Resend):** o agendamento é salvo normalmente no banco (e-mail
  é notificação, não trava de fluxo); a falha é registrada para possível reenvio manual.

## 7. Testes

- Testes unitários para o cálculo de disponibilidade de slots (parte mais sensível a bugs)
- Testes de integração para o fluxo completo: solicitação → confirmação/recusa/reagendamento
  → e-mails disparados
- Testes manuais guiados para as telas do dashboard (o desenvolvedor está aprendendo
  Next.js durante o processo)

## 8. Fora de Escopo (versões futuras)

- Conta/login do cliente com histórico de agendamentos
- Múltiplos profissionais por conta de prestador (times/negócios)
- Monetização (planos pagos, comissão por agendamento)
- App mobile nativo (o MVP é web responsivo; mobile reaproveitará a mesma API depois)
- Lembretes automáticos por e-mail antes do horário confirmado
- Login social adicional além de Google
