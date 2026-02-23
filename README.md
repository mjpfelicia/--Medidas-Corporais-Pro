# BodyTrack - Acompanhamento Corporal

Aplicação web em React para registrar e acompanhar a evolução de medidas corporais (peso, % gordura, massa muscular, cintura). Os dados são salvos no localStorage do navegador.

## 🚀 Funcionalidades Atuais

- Cadastro de medições (data, peso, altura, cintura) com cálculo automático de IMC, % gordura e massa muscular (fórmulas simples)
- Dashboard com cards mostrando última medição e variação em relação à primeira
- Exibição de metas fixas (exemplo) com barras de progresso
- Layout responsivo com Bootstrap 5 e ícones

## 🛠️ Tecnologias

- React (hooks: useState, useEffect, useMemo)
- Bootstrap 5 + Bootstrap Icons
- localStorage para persistência


🔮 Próximas Etapas (Roadmap)

Curto Prazo
Gráficos de evolução (Recharts ou Chart.js) – visualizar histórico de peso, gordura e massa muscular.

Metas personalizadas – usuário define metas (peso, % gordura) e acompanha progresso.

Exportar dados (CSV/JSON) – backup e análise externa.

Tema claro/escuro – melhoria na experiência do usuário.

Validações inline – substituir alerts por mensagens amigáveis no formulário.

Médio Prazo
Backend + Autenticação (Firebase/Supabase) – dados na nuvem, login com email ou Google.

Compartilhamento com profissional – gerar link para treinador/nutricionista visualizar progresso.

Lembretes/notificações – push ou e-mail para medir regularmente.

Cálculos mais precisos – permitir entrada manual de % gordura (ex: de balança com bioimpedância).

Histórico de metas – gráficos de meta vs realizado.
Longo Prazo
App mobile com React Native (aproveitando a lógica já criada).

Integração com wearables (Google Fit, Apple Health, Garmin).

Planos/assinaturas para funcionalidades premium.

Relatórios em PDF para impressão.



📄 Licença
MIT