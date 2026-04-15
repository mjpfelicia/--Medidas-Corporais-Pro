# 📊 Medidas Corporais Pro

> Aplicação profissional de acompanhamento e análise de composição corporal com cálculos científicos e previsões inteligentes.

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple?logo=bootstrap)](https://getbootstrap.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 🎯 Visão Geral

Medidas Corporais Pro é uma aplicação web completa para:
- **Registrar medições corporais** com múltiplas métricas (peso, altura, cintura, braço, coxa, panturrilha)
- **Calcular composição corporal** usando fórmulas científicas validadas
- **Comparar com padrões ideais** para seu gênero, idade e altura
- **Acompanhar progresso** em relação às metas personalizadas
- **Prever chegada às metas** com base no ritmo atual
- **Gerenciar perfil** com dados demográficos e nível de atividade

Todos os dados são salvos localmente no seu navegador (localStorage) – sua privacidade é garantida! 🔒

---

## ✨ Funcionalidades Principais

### 🔐 Autenticação & Perfil
- ✅ Cadastro e login com email/senha
- ✅ Perfil completo: nome, gênero, idade, altura, nível de atividade
- ✅ Dados persistidos localmente (seguro e privado)
- ✅ Logout com limpeza de sessão

### 📝 Medições Corporais
- ✅ Registro detalhado: peso, altura, cintura, pescoço, quadril (mulheres)
- ✅ Novas medidas: braço, coxa, panturrilha para análise completa
- ✅ Validação automática de dados
- ✅ Histórico completo de medições com datas

### 🧮 Cálculos Científicos
- ✅ **IMC** (Índice de Massa Corporal)
- ✅ **Fórmula Navy** (gordura corporal - mais precisa que IMC)
- ✅ **BMR** (Taxa Metabólica Basal - Mifflin-St Jeor)
- ✅ **TDEE** (Gasto Energético Diário Total com nível de atividade)
- ✅ **Cintura/Altura** (Melhor preditor de saúde)
- ✅ **Massa Muscular** (Katch-McArdle)
- ✅ **Classificação de Gordura** (Essencial, Atleta, Fitness, Normal, Obeso)

### 📐 Medidas Ideais
Sistema intelligente que calcula medidas corporais ideais baseado em:
- Altura (proporcional)
- Gênero (diferentes padrões H/M)
- Fórmulas biomecânicas estabelecidas

**Medidas calculadas:**
- Peso ideal (Fórmula de Devine)
- Cintura ideal (35-40% da altura)
- Braço ideal (11-12.5% da altura)
- Coxa ideal (27-30% da altura)
- Panturrilha ideal (13-14% da altura)
- Quadril ideal (mulheres: 44-46% da altura)

### 🎯 Sistema de Metas
- ✅ Define metas para peso, gordura corporal e cintura
- ✅ Visualiza progresso em tempo real
- ✅ Barra de progresso visual (0-100%)
- ✅ Previsão de chegada à meta (dias e data)
- ✅ Indicador "realista" (avisa se meta está muito distante >1 ano)

### 📊 Dashboard Inteligente
- ✅ Status rápido: peso atual + classificação IMC
- ✅ Emojis visuais para status (✅ normal, ⚠️ aviso, etc)
- ✅ Dicas personalizadas baseadas no status

### 📈 Métricas Avançadas
Página completa com todas as análises:
- Composição corporal (gordura, massa magra, músculo)
- Comparação com padrões ideais
- Evolução histórica (variação desde primeira medição)
- Previsões de metas com progresso visual
- Metabolismo (TMB e gasto diário)

### 📱 Layout Responsivo
- ✅ Desktop: layout 2 colunas otimizado
- ✅ Tablet: adaptação fluida
- ✅ Mobile: interface vertical compacta
- ✅ Menu hamburgo em dispositivos pequenos

---

## 🚀 Como Começar

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/Medidas-Corporais-Pro.git cd Medidas-Corporais-Pro

# Instale dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

### Acesso
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 📖 Como Usar

### 1️⃣ Criar Conta
Clique em "Registrar" na tela de login. Escolha um email e senha (armazenados localmente, criptografados).

### 2️⃣ Completar Perfil
Acesse a aba **"Perfil"** e preencha:
- Nome, gênero, idade, altura
- Nível de atividade (sedentário → extremamente ativo)

Esses dados são usados para cálculos personalizados.

### 3️⃣ Adicionar Medições
Acesse **"Medições"** e registre periodicamente:
- **Obrigatório**: Peso, altura, data
- **Recomendado**: Cintura, pescoço (para fórmula Navy mais precisa)
- **Opcional**: Braço, coxa, panturrilha (comparação com corpo ideal)

> 💡 **Dica**: Meça no mesmo horário, sempre nu ou roupa leve, para consistência.

### 4️⃣ Definir Metas
Na aba **"Metas"**, defina seus objetivos:
- Peso alvo (ex: 75 kg)
- Gordura corporal alvo (ex: 20%)
- Cintura alvo (ex: 85 cm)

### 5️⃣ Acompanhar Progresso
- **Dashboard**: Visão rápida do status atual
- **Perfil**: Todas as métricas + comparação com ideal
- **Metas**: Progresso visual + previsão de chegada
- **Progresso**: Gráfico histórico das mudanças

---

## 🔧 Tecnologias

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **React** | 19 | Componentes, hooks (useState, useEffect) |
| **Bootstrap** | 5 | Layout responsivo e componentes UI |
| **Bootstrap Icons** | 1.x | Ícones visuais |
| **JavaScript ES6+** | - | Lógica e cálculos científicos |

### Sem dependências de banco de dados
- ✅ Todos os dados salvos no `localStorage` do navegador
- ✅ Privacidade total - nada sai do seu dispositivo
- ✅ Funciona offline após carregamento inicial

---

## 📁 Estrutura do Projeto

```
src/
├── pages/
│   ├── Login.jsx              # Autenticação (login/registro)
│   ├── Dashboard.jsx          # Visão geral rápida
│   ├── Measurements.jsx       # Registrar medições
│   ├── Profile.jsx            # Perfil + Métricas Avançadas
│   ├── Goals.jsx              # Definir metas
│   └── Progress.jsx           # Gráfico histórico
│
├── components/
│   ├── layout/
│   │   └── Header.jsx         # Navegação
│   ├── dashboard/
│   │   ├── MetricCard.jsx
│   │   ├── ProgressChart.jsx
│   │   └── AdvancedMetrics.jsx    # Cálculos + previsões
│   └── common/
│       └── PageContainer.jsx
│
├── hooks/
│   ├── useAuth.js             # Gerenciamento de autenticação
│   ├── useUserProfile.js      # Dados do usuário
│   ├── useMeasurements.js     # Histórico de medições
│   └── useGoals.js            # Metas personalizadas
│
├── utils/
│   └── fitnessCalculations.js # Todas as fórmulas científicas
│
└── styles/
    ├── app.css
    ├── login.css
    ├── profile.css
    ├── goals.css
    └── advanced-metrics.css
```

---

## 🧬 Fórmulas Científicas Implementadas

### 1. Gordura Corporal - Fórmula Navy
A fórmula Navy é mais precisa que IMC quando você tem medidas de cintura/pescoço.

**Homens:**
```
Gordura = 86.010 × log₁₀(cintura - pescoço) - 70.041 × log₁₀(altura) + 36.76
```

**Mulheres:**
```
Gordura = 163.205 × log₁₀(cintura + quadril - pescoço) - 97.684 × log₁₀(altura) - 78.387
```

### 2. Taxa Metabólica Basal (TMB) - Mifflin-St Jeor
Calorias que seu corpo gasta em repouso.

```
Homens: TMB = 10×peso + 6.25×altura - 5×idade + 5
Mulheres: TMB = 10×peso + 6.25×altura - 5×idade - 161
```

### 3. TDEE (Gasto Energético Diário)
```
TDEE = TMB × Fator de Atividade
```

**Fatores:**
- Sedentário: 1.2
- Levemente ativo: 1.375
- Moderadamente ativo: 1.55
- Muito ativo: 1.725
- Extremamente ativo: 1.9

### 4. Peso Ideal - Fórmula de Devine
```
Homens: 50kg + 2.3kg × (altura em polegadas - 60)
Mulheres: 45.5kg + 2.3kg × (altura em polegadas - 60)
```

---

## 📊 Exemplos de Uso

### Cenário 1: Acompanhamento de Perda de Peso
1. Registra medições semanais
2. Vê progresso em relação à meta (ex: 75kg)
3. Recebe previsão: "Chegará em 45 dias"
4. Acompanha evolução de gordura corporal e músculo

### Cenário 2: Ganho de Massa Muscular
1. Define meta de peso (ex: 82kg) e gordura baixa (ex: 15%)
2. Cada medição compara com corpo ideal
3. Vê se está ganhando músculos (peso sobe, gordura desce)
4. Ajusta treino baseado nos dados

### Cenário 3: Saúde Geral
1. Acompanha cintura/altura (melhor preditor de saúde)
2. Vê mudanças em TDEE (gasto calórico)
3. Compara com faixas saudáveis por idade/gênero

---

## 🎨 Temas e Design

- **Gradientes coloridos:** Login (roxo), Perfil (azul), Metas (laranja/vermelho)
- **Emojis**: Visual intuitivo e amigável
- **Cards responsivos**: Adapta-se a qualquer tamanho de tela
- **Barras de progresso**: Visualização clara das metas

---

## 🔒 Privacidade & Segurança

✅ **Dados 100% locais** - nunca saem do seu navegador  
✅ **localStorage criptografado** (básico)  
✅ **Sem servidor** - sem coleta de dados pessoais  
✅ **Código aberto** - verifique a segurança você mesmo  

### ⚠️ Nota de Segurança
Este é um aplicativo de educação/pessoal. Para uso profissional (clínicas), considere adicionar backend com banco de dados seguro.

---

## 📋 Roadmap Futuro

### 🔄 Curto Prazo (v2.0)
- [ ] Gráficos históricos interativos (Recharts)
- [ ] Exportar dados (CSV, PDF)
- [ ] Tema claro/escuro
- [ ] Notificações de medição periódica
- [ ] Modo offline completo (PWA)

### 🚀 Médio Prazo (v3.0)
- [ ] Backend Node.js + MongoDB
- [ ] Sincronizar entre dispositivos
- [ ] Compartilhar com profissionais (nutricionista/treinador)
- [ ] Integração com Google Fit / Apple Health
- [ ] Cálculos mais avançados (composição muscular por IA)

### ⭐ Longo Prazo (v4.0)
- [ ] App mobile (React Native)
- [ ] Integração com wearables
- [ ] Planos de assinatura
- [ ] Comunidade e desafios

---

## 🤝 Como Contribuir

Contribuições são bem-vindas! 

```bash
# 1. Fork o projeto
# 2. Crie sua branch (git checkout -b feature/MeuBranch)
# 3. Commit suas mudanças (git commit -m 'Adiciona feature')
# 4. Push para a branch (git push origin feature/MeuBranch)
# 5. Abra um Pull Request
```

---

## 📝 Changelog

### v1.0.0 (Atual)
- ✅ Sistema completo de autenticação
- ✅ Cálculos científicos avançados
- ✅ Medidas ideais personalizadas
- ✅ Sistema de metas com previsões
- ✅ Dashboard inteligente
- ✅ Layout responsivo

---

## ❓ FAQ

**P: Posso usar sem criar conta?**  
R: Não, a conta é necessária para manter histórico. Use qualquer email/senha e será armazenado localmente.

**P: Meus dados são seguros?**  
R: Sim! Tudo fica no localStorage do seu navegador. Nada é enviado para servidores.

**P: Posso sincronizar entre dispositivos?**  
R: Atualmente não. Cada dispositivo tem seus dados. Planejamos sincronização na v3.0.

**P: Como funciona a previsão de metas?**  
R: Calcula a velocidade de mudança (kg/dia ou %/dia) comparando primeira e última medição, depois extrapola até a meta.

**P: Qual é a melhor frequência de medição?**  
R: Recomendamos semanal ou quinzenal. Diário é desnecessário (variações normais de água/comida).

---

## 📞 Suporte

- 📧 Email: seu-email@example.com
- 💬 Issues: [GitHub Issues](https://github.com/seu-usuario/Medidas-Corporais-Pro/issues)
- 📖 Documentação: [Wiki](https://github.com/seu-usuario/Medidas-Corporais-Pro/wiki)

---

## 📄 Licença

Este projeto está sob licença **MIT**. Veja [LICENSE](LICENSE) para detalhes.

---

## 🙏 Agradecimentos

- Bootstrap 5 & Bootstrap Icons por UI/UX
- React por framework incrível
- Comunidade open-source

---

**Desenvolvido com ❤️ para ajudar você a alcançar seus objetivos!**

Última atualização: Março 2026
