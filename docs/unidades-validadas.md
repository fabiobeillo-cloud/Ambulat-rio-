# Registro de validação — Unidades (escopo Coordenação de Relacionamento Médico)

- Fonte: confirmação do coordenador em sessão Claude Code, 2026-11-24.
- Referência comparada: ramo `claude/claude-md-docs-ifl1uu`, `src/data/dados-mestres.ts`
  (derivado de `BEILLO_MATRIZ_COMPLETA_VERSAO_FINAL.xlsx`, aba BASE MÉDICA).
- Sem dados pessoais neste arquivo.

Legenda: ✅ confirmado · ⚠️ a validar · ❌ ausente no código

| Ciclo de visitas | Nome oficial (matriz) | Situação | Observação |
|---|---|---|---|
| Ana Rosa | AES Ana Rosa | ✅ confirmado | |
| Mogi das Cruzes | AES Mogi das Cruzes | ✅ confirmado | Alto Tietê |
| João Dias | AES João Dias | ✅ confirmado | |
| Tatuapé / UA Vitória | UA Vitória | ✅ confirmado | |
| Suzano | UA Suzano | ✅ confirmado | Alto Tietê |
| Santana | UA Santana | ✅ confirmado | |
| Osasco | AES Osasco | ✅ confirmado | |
| Itaquaquecetuba | UA Itaquaquecetuba | ✅ confirmado | Alto Tietê |
| Butantã | UA Luz Butantã | ✅ confirmado 2026-11-24 | |
| Arujá | AES Ipiranga Arujá | ✅ confirmado 2026-11-24 | Alto Tietê |
| Guarulhos — unidade 1 | AES Guarulhos | ✅ confirmado 2026-11-24 | |
| Guarulhos — unidade 2 | UA Carlos Chagas HCC | ✅ confirmado 2026-11-24 | |
| UA Metropolitano | — | ❌ ausente no código | Confirmada no escopo (extra-grupo); dados a extrair do cofre |
| — | UA Cubatão (Hospital da Luz) | ✅ confirmado 2026-11-24 | Confirmada no escopo; informado "também HCC" — ⚠️ confirmar o significado (unidade hospitalar/extra-hospitalar?) |
| Santo Amaro | — | ⚠️ a validar | Consta no ciclo de visitas, mas não na matriz; não confirmado nesta data |

## Pendências de validação

1. Santo Amaro: é unidade própria ou é a AES João Dias (endereço "R. João Dias – Santo Amaro")?
2. Classificação "extra-hospitalar" e "HCC": quais unidades se enquadram (Carlos Chagas HCC, Cubatão, outras?).
3. Contagens elevadas de médicos: UA Vitória (246) e AES Guarulhos (200) — verificar plantonistas/duplicidades na matriz original.
4. Telefones de médicos no ramo `claude-md-docs-ifl1uu`: 757 fictícios misturados a 320 reais, alinhamento por posição; 31 números repetidos. Não usar até revalidar.
5. Escopo total: com Cubatão, o escopo passa a 15 unidades (14 do ciclo + Cubatão)? Confirmar.
