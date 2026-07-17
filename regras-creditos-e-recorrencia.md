# Créditos, Agendamento e Recorrência — o caminho e o que validar

> Regras críticas de negócio do Moven. Serve de base pra alinhar com o cliente (a academia).
> Contexto: hoje a academia funciona no "contrato de boca" (acordos verbais no fim da aula). O sistema padroniza isso sem tirar a conversa humana — só formaliza.

## O modelo escolhido: **débito tardio ("molde", não "reserva")**

- **Crédito = pote de N aulas.** "1 crédito = 1 aula, qualquer aula." Não é reserva por dia da semana.
- **Agendamento recorrente** ("toda terça e quinta") é uma **preferência/automação**, NÃO um agendamento real e **NÃO debita crédito adiantado**.
- O crédito só é **debitado quando a aula realmente acontece** — no momento em que o sistema gera a aula da semana ou quando o aluno confirma.
- **Consequências (todas boas):**
  - Aula **avulsa** (o sábado diferentão) debita 1 crédito como qualquer outra — se tem crédito, pode ir.
  - **Feriado** que cancela um dia do padrão não "perde" crédito, porque nada foi pré-gasto.
  - Flexível: o padrão não tranca o pote.
- **Bloqueio ("sem créditos")** só acontece quando o pote **zera de verdade** — o que é o comportamento correto (comprou N aulas, foi a N, precisa renovar).
- **Toque de "academia inteligente":** aviso proativo via WhatsApp quando resta 1 aula — ex.: *"Seu pacote está na última aula. Quer renovar? Fale com o professor."* Formaliza a renovação sem perder o toque humano.

## O que precisa ser validado/definido com o cliente

1. **Custo por aula:** toda aula vale **1 crédito**? A aula especial de sábado (maior/premium) vale **mais**? → campo `creditCost` na aula (padrão 1).
2. **Momento exato do débito:** quando o sistema **gera** a aula, quando o aluno **confirma**, ou só quando marca **presença**? (muda o comportamento de estorno)
3. **Estorno:** cancelar com **≥2h de antecedência** devolve o crédito (regra que já temos). Confirmar como isso se comporta no modelo tardio.
4. **Padrão que excede o pacote** (ex.: terça+quinta por 4 semanas = 8 aulas, pacote de 4): **avisar** (recomendado) ou **travar**?
5. **Aviso de "acabando":** disparar na **penúltima** ou na **última** aula? Qual texto/tom?
6. **Validade vencida com créditos sobrando:** aluno **perde** os créditos? Notifica antes (já temos "3 dias antes")?
7. **Aula experimental / avulsa sem pacote:** como conta? (o experimental já é 1x por aluno, com aprovação da proprietária)
8. **Formalizar o "contrato de boca":** o gestor **registra o pacote no sistema** no momento do acordo (fim da aula). Esse é o passo que tira da informalidade.

## Por que importa

O crédito precisa ser **justo e rastreável** pra substituir o acordo verbal. O modelo tardio garante isso (o aluno gasta conforme usa), e os avisos automáticos dão a percepção de uma academia que **se preocupa** com o cliente — sem burocratizar a relação.
