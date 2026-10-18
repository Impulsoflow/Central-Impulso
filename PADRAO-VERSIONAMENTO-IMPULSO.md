# IMPULSOFLOW — Versionamento obrigatório de pesquisas

Desde 17/10/2026, toda pesquisa ativa deverá exibir um selo discreto com a **versão do formulário em todas as telas**, inclusive no celular.

## Regra para cada melhoria publicada
1. Aumentar a versão SemVer: PATCH para correções, MINOR para melhorias compatíveis e MAJOR para mudanças incompatíveis.
2. Atualizar no mesmo commit o rodapé `#impulso-form-version`, a meta `impulso-form-version`, o arquivo `version.json` e o histórico `VERSOES.md`.
3. Rodar `node scripts/check-form-version.cjs` e `node scripts/check-release-bump.cjs`. Os repositórios têm verificação automática no GitHub Actions para impedir alterações de formulário sem incremento de versão.
4. **Versão do formulário é diferente da versão do Apps Script.** Nunca mudar o backend, banco ou credenciais apenas por incrementar o rodapé.
5. Registrar URL, data, commit, testes e plano de reversão para cada atualização.
6. Aplicar esta regra a cada uma das próximas pesquisas, quando forem revisadas. Não alterar as respostas de clientes nem a metodologia ao incluir o número de versão.

## Versões-base publicadas
- Gestão do Tempo: `https://impulsoflow.github.io/GestaoDoTempo/` — Formulário **v1.0.0**
- DISC autoavaliação: `https://impulsoflow.github.io/DISC/` — Formulário **v1.0.0**
- DISC convidados 360°: `https://impulsoflow.github.io/ConvidadoDisc/` — Formulário **v1.0.0**

Repositório histórico `GestaoRoger`: manter somente como redirecionamento para o endereço oficial, depois arquivar sem exclusão dos arquivos.
