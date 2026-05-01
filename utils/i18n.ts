export type Language = "pt" | "en" | "es" | "fr";

const translations = {
  pt: {
    // Carousel Intro
    introSlide1Title: "O Teu Dinheiro Inteligente",
    introSlide1Desc: "A Savvy faz a gestão automática por ti. Inteligência que trabalha sozinha.",
    introSlide2Title: "Assistente IA 24/7",
    introSlide2Desc: "Dicas personalizadas em tempo real que realmente poupam o teu dinheiro.",
    introSlide3Title: "Património 360º",
    introSlide3Desc: "Tudo o que possuis consolidado num só lugar. Visão total e estratégica.",
    introSlide4Title: "Insights Estratégicos",
    introSlide4Desc: "Gráficos que explicam o teu comportamento, não apenas números frios.",
    introSlide5Title: "Liberdade Conquistada",
    introSlide5Desc: "Onde os teus objetivos se tornam realidade. O futuro começa aqui.",
    skip: "Saltar",
    next: "Seguinte",
    startNow: "Começar Agora",
    
    // Tabs
    tabHome: "Início",
    tabAnalysis: "Análise",
    tabTransactions: "Transações",
    tabAI: "IA",
    tabSettings: "Definições",

    // AI Chat
    aiTitle: "Assistente Financeiro",
    aiSubtitle: "Pergunta-me qualquer coisa sobre finanças",
    aiPlaceholder: "Escreve a tua pergunta...",
    aiSend: "Enviar",
    aiTyping: "A pensar...",
    aiWelcome: "Olá! Sou o teu assistente financeiro pessoal. Posso ajudar-te com dicas de poupança, análise de gastos, estratégias de investimento e muito mais. O que gostarias de saber?",
    aiError: "Ocorreu um erro. Tenta novamente.",
    aiSuggestion1: "Como posso poupar mais?",
    aiSuggestion2: "Analisa os meus gastos",
    aiSuggestion3: "Dicas para investir",
    aiSuggestion4: "Como reduzir dívidas?",

    // Greetings
    morning: "Bom dia",
    afternoon: "Boa tarde",
    evening: "Boa noite",
    greetingSub: "Aqui está o teu resumo financeiro",

    // Dashboard
    monthlyBalance: "Saldo do Mês",
    income: "Ganhos",
    expenses: "Gastos",
    balance: "Balanço",
    recentTransactions: "Transações Recentes",
    noTransactions: "Sem transações este mês",
    noTransactionsHint: 'Toca no "+" para registar o teu primeiro ganho ou gasto',
    currentPatrimony: "Património Atual",
    budgetUsed: "Orçamento usado",

    // Add/Edit Transaction
    newRecord: "Novo Registo",
    editRecord: "Editar Registo",
    save: "GUARDAR",
    gainLabel: "Ganho",
    expenseLabel: "Gasto",
    amountLabel: "MONTANTE",
    categoryLabel: "CATEGORIA",
    descriptionLabel: "DESCRIÇÃO",
    dateLabel: "DIA",
    descriptionPlaceholder: "Descrição (opcional)",
    invalidAmount: "Valor inválido",
    invalidAmountMsg: "Por favor insere um valor válido.",

    // Analytics
    analysisTitle: "Análise",
    byMonth: "Por Mês",
    byCategory: "Por Categoria",
    last6months: "Últimos 6 meses",
    bestMonth: "Melhor Mês",
    worstMonth: "Pior Mês",
    topCategories: "Maior gasto por categoria",
    allTime: "Histórico completo",
    totalDistribution: "Distribuição Total",
    noData: "Sem dados suficientes. Regista os teus gastos!",
    noExpenses: "Sem gastos registados este mês",

    // Transactions
    transactionsTitle: "Transações",
    all: "Todas",
    noTransactionsList: "Sem transações",
    noTransactionsListHint: 'Regista o teu primeiro ganho ou gasto tocando em "+"',
    deleteTransactionTitle: "Eliminar transação",
    deleteConfirm: "Tens a certeza que queres eliminar esta transação?",
    cancel: "Cancelar",
    delete: "Eliminar",

    // Settings
    settingsTitle: "Definições",
    sectionProfile: "PERFIL",
    nameLabel: "Nome",
    monthlyIncomeLabel: "Rendimento Mensal",
    initialPatrimonyLabel: "Património Inicial",
    mainObjectiveSettingsLabel: "Objetivo Principal",
    sectionPreferences: "PREFERÊNCIAS",
    currencyLabel: "Moeda",
    languageLabel: "Idioma",
    sectionAbout: "SOBRE",
    versionLabel: "Versão",
    chooseCurrency: "Escolher Moeda",
    chooseLanguage: "Escolher Idioma",
    chooseObjective: "Objetivo Principal",
    notDefined: "Não definido",

    // Account
    sectionAccount: "CONTA",
    accountEmail: "Email",
    accountEmailDesc: "Alterar o endereço de email",
    accountPassword: "Palavra-passe",
    accountPasswordDesc: "Alterar a palavra-passe",
    accountName: "Nome de utilizador",
    accountNameDesc: "Alterar o nome apresentado",
    accountDelete: "Eliminar conta",
    accountDeleteDesc: "Apagar permanentemente a conta",
    accountSignOut: "Terminar sessão",
    changeEmail: "Alterar Email",
    changePassword: "Alterar Palavra-passe",
    changeName: "Alterar Nome",
    newEmailLabel: "Novo email",
    newPasswordLabel: "Nova palavra-passe",
    confirmPasswordLabel: "Confirmar palavra-passe",
    currentPasswordLabel: "Palavra-passe atual",
    newNameLabel: "Novo nome",
    passwordMismatch: "As palavras-passe não coincidem.",
    passwordTooShort: "A palavra-passe deve ter pelo menos 6 caracteres.",
    accountUpdated: "Atualizado com sucesso!",
    accountUpdateError: "Erro ao atualizar. Tenta novamente.",
    deleteAccountTitle: "Eliminar Conta",
    deleteAccountMsg: "Tens a certeza? Esta ação é irreversível e irá apagar todos os teus dados.",
    deleteAccountConfirm: "Eliminar permanentemente",
    signOutTitle: "Terminar sessão",
    signOutMsg: "Tens a certeza que queres sair?",
    signOutConfirm: "Sair",
    backToLogin: "Voltar para o Login",
    requiredFields: "Por favor preencha todos os campos.",

    // Forgot password
    forgotPassword: "Esqueceste a palavra-passe?",
    forgotPasswordTitle: "Recuperar palavra-passe",
    forgotPasswordDesc: "Introduz o email da tua conta. Vais receber um link para criar uma nova palavra-passe.",
    forgotPasswordSend: "Enviar link",
    forgotPasswordSuccess: "Email enviado!",
    forgotPasswordSuccessMsg: "Verifica a tua caixa de entrada e segue o link para redefinir a palavra-passe.",
    forgotPasswordError: "Erro ao enviar. Verifica o endereço de email.",
    forgotPasswordEmailPlaceholder: "O teu email",
    resetPasswordTitle: "Redefinir palavra-passe",
    resetPasswordSuccess: "Palavra-passe atualizada com sucesso!",
    resetPasswordError: "Erro ao atualizar a palavra-passe.",
    updatePasswordBtn: "Atualizar palavra-passe",

    // Languages
    langPt: "Português",
    langEs: "Español",
    langFr: "Français",
    langEn: "English",

    // Objectives
    objSave: "Poupar dinheiro",
    objDebt: "Reduzir dívidas",
    objInvest: "Investir",
    objControl: "Controlar gastos",
    objFreedom: "Independência financeira",
    objSaveShort: "Poupar",
    objDebtShort: "Reduzir Dívidas",
    objInvestShort: "Investir",
    objControlShort: "Controlar Gastos",
    objFreedomShort: "Independência Financeira",

    // Horizons
    horizonShort: "Curto prazo (< 1 ano)",
    horizonMedium: "Médio prazo (1-5 anos)",
    horizonLong: "Longo prazo (5+ anos)",

    // Category labels
    catSalary: "Salário",
    catFreelance: "Freelance",
    catInvestment: "Investimento",
    catGift: "Presente",
    catFood: "Alimentação",
    catHousing: "Habitação",
    catTransport: "Transporte",
    catHealth: "Saúde",
    catEntertainment: "Lazer",
    catShopping: "Compras",
    catEducation: "Educação",
    catUtilities: "Serviços",
    catTravel: "Viagem",
    catOther: "Outro",

    // Onboarding
    onbName: "Olá! Como te chamas?",
    onbNameSub: "Vamos personalizar a tua experiência.",
    onbNamePlaceholder: "O teu nome",
    onbObjective: "Qual é o teu objetivo financeiro principal?",
    onbObjectiveSub: "Adapta as tuas dicas e recomendações.",
    onbIncome: "Qual é o teu rendimento mensal aproximado?",
    onbIncomeSub: "Em euros. Ajuda-nos a calibrar as tuas metas.",
    onbPatrimony: "Qual é o teu património atual?",
    onbPatrimonySub: "Poupanças, investimentos e outros ativos (em euros).",
    onbDebts: "Tens dívidas? Se sim, qual o valor total?",
    onbDebtsSub: "Inclui empréstimos, cartões de crédito, etc. Coloca 0 se não tens.",
    onbDependents: "Tens dependentes financeiros?",
    onbDependentsSub: "Filhos, cônjuge, pais ou outros que dependem de ti financeiramente.",
    onbHorizon: "Qual é o teu horizonte de investimento?",
    onbHorizonSub: "Por quanto tempo pretendes manter os teus investimentos?",
    onbYes: "Sim",
    onbNo: "Não",
    onbContinue: "Continuar",
    onbStart: "Começar",

    // Common
    ofLabel: "de",
    oopsTitle: "Oops!",

    // AI Responses
    aiResponseSaving: "Com uma taxa de poupança atual de {rate}%, poderias otimizar cortando em gastos não essenciais.",
    aiResponseSpending: "Este mês já gastaste {currency}{expenses}.",
    aiResponseInvesting: "Tendo um património de {currency}{patrimony}, começar a investir pode ajudar.",
    aiResponseInvestingStart: "Para começar a investir, o ideal é construir primeiro um fundo de emergência.",
    aiResponseDebt: "A melhor estratégia para reduzir dívidas é pagar primeiro a que tem a taxa de juro mais alta.",
    aiResponseDefault1: "Essa é uma excelente perspetiva.",
    aiResponseDefault2: "Posso ajudar com análise do teu orçamento ou estratégias de planeamento.",
    aiResponseDefault3: "Podes sempre aplicar a regra 50/30/20!",
    aiResponseDefault4: "A chave do sucesso financeiro é a consistência!",
  },

  en: {
    // Carousel Intro
    introSlide1Title: "Your Money, Smarter",
    introSlide1Desc: "Savvy manages your spending automatically.",
    introSlide2Title: "24/7 AI Assistant",
    introSlide2Desc: "Personalized real-time tips that actually save you money.",
    introSlide3Title: "360º Wealth View",
    introSlide3Desc: "Everything you own consolidated in one place.",
    introSlide4Title: "Strategic Insights",
    introSlide4Desc: "Charts that explain your behavior.",
    introSlide5Title: "Freedom Achieved",
    introSlide5Desc: "Your future starts here.",
    skip: "Skip",
    next: "Next",
    startNow: "Start Now",
    // Tabs
    tabHome: "Home", tabAnalysis: "Analysis", tabTransactions: "Transactions", tabAI: "AI", tabSettings: "Settings",
    // AI Chat
    aiTitle: "Financial Assistant", aiSubtitle: "Ask me anything about finance", aiPlaceholder: "Type your question...", aiSend: "Send", aiTyping: "Thinking...",
    aiWelcome: "Hi! I'm your personal financial assistant.",
    aiError: "An error occurred.",
    aiSuggestion1: "How can I save more?", aiSuggestion2: "Analyse my spending", aiSuggestion3: "Investment tips", aiSuggestion4: "How to reduce debt?",
    // Greetings
    morning: "Good morning", afternoon: "Good afternoon", evening: "Good evening", greetingSub: "Here's your financial summary",
    // Dashboard
    monthlyBalance: "Monthly Balance", income: "Income", expenses: "Expenses", balance: "Balance", recent Transactions: "Recent Transactions",
    noTransactions: "No transactions", noTransactionsHint: 'Tap "+"', currentPatrimony: "Current Assets", budgetUsed: "Budget used",
    // Add/Edit Transaction
    newRecord: "New Record", editRecord: "Edit Record", save: "SAVE", gainLabel: "Income", expenseLabel: "Expense", amountLabel: "AMOUNT", categoryLabel: "CATEGORY",
    descriptionLabel: "DESCRIPTION", dateLabel: "DATE", descriptionPlaceholder: "Description (optional)", invalidAmount: "Invalid amount", invalidAmountMsg: "Please enter a valid amount.",
    // Analytics
    analysisTitle: "Analysis", byMonth: "By Month", byCategory: "By Category", last6months: "Last 6 months", bestMonth: "Best Month", worstMonth: "Worst Month", topCategories: "Top categories",
    allTime: "All time", totalDistribution: "Total Distribution", noData: "Not enough data.", noExpenses: "No expenses",
    // Transactions
    transactionsTitle: "Transactions", all: "All", noTransactionsList: "No transactions", noTransactionsListHint: 'Tap "+"',
    deleteTransactionTitle: "Delete", deleteConfirm: "Are you sure?", cancel: "Cancel", delete: "Delete",
    // Settings
    settingsTitle: "Settings", sectionProfile: "PROFILE", nameLabel: "Name", monthlyIncomeLabel: "Monthly Income", initialPatrimonyLabel: "Initial Assets",
    mainObjectiveSettingsLabel: "Main Objective", sectionPreferences: "PREFERENCES", currencyLabel: "Currency", languageLabel: "Language", sectionAbout: "ABOUT", versionLabel: "Version",
    chooseCurrency: "Choose Currency", chooseLanguage: "Choose Language", chooseObjective: "Main Objective", notDefined: "Not defined",
    // Account
    sectionAccount: "ACCOUNT", accountEmail: "Email", accountEmailDesc: "Change email", accountPassword: "Password", accountPasswordDesc: "Change password",
    accountName: "Display name", accountNameDesc: "Change name", accountDelete: "Delete account", accountDeleteDesc: "Permanently delete", accountSignOut: "Sign out",
    changeEmail: "Change Email", changePassword: "Change Password", changeName: "Change Name",
    newEmailLabel: "New email", newPasswordLabel: "New password", confirmPasswordLabel: "Confirm", currentPasswordLabel: "Current password", newNameLabel: "New name",
    passwordMismatch: "No match.", passwordTooShort: "Min 6 chars.", accountUpdated: "Updated!", accountUpdateError: "Error.",
    deleteAccountTitle: "Delete Account", deleteAccountMsg: "Irreversible.", deleteAccountConfirm: "Delete",
    signOutTitle: "Sign out", signOutMsg: "Are you sure?", signOutConfirm: "Sign out", backToLogin: "Login", requiredFields: "Required.",
    // Forgot Password
    forgotPassword: "Forgot password?", forgotPasswordTitle: "Reset", forgotPasswordDesc: "Enter email.",
    forgotPasswordSend: "Send", forgotPasswordSuccess: "Sent!", forgotPasswordSuccessMsg: "Check inbox.",
    forgotPasswordError: "Error.", forgotPasswordEmailPlaceholder: "Your email",
    resetPasswordTitle: "Reset", resetPasswordSuccess: "Success!", resetPasswordError: "Error.", updatePasswordBtn: "Update",
    langPt: "Portuguese", langEs: "Spanish", langFr: "French", langEn: "English",
    // Objectives
    objSave: "Save money", objDebt: "Reduce debt", objInvest: "Investing", objControl: "Control spending", objFreedom: "Financial freedom",
    objSaveShort: "Save", objDebtShort: "Reduce Debt", objInvestShort: "Invest", objControlShort: "Control Spending", objFreedomShort: "Financial Freedom",
    // Horizons
    horizonShort: "Short term", horizonMedium: "Medium term", horizonLong: "Long term",
    // Category labels
    catSalary: "Salary", catFreelance: "Freelance", catInvestment: "Investment", catGift: "Gift", catFood: "Food", catHousing: "Housing", catTransport: "Transport",
    catHealth: "Health", catEntertainment: "Entertainment", catShopping: "Shopping", catEducation: "Education", catUtilities: "Utilities", catTravel: "Travel", catOther: "Other",
    // Onboarding
    onbName: "Hi! What's your name?", onbNameSub: "Welcome.", onbNamePlaceholder: "Name", onbObjective: "Goal?",
    onbObjectiveSub: "Customize.", onbIncome: "Income?", onbIncomeSub: "Euros.",
    onbPatrimony: "Net worth?", onbPatrimonySub: "Assets.",
    onbDebts: "Debts?", onbDebtsSub: "0 if none.",
    onbDependents: "Dependents?", onbDependentsSub: "Kids, etc.",
    onbHorizon: "Horizon?", onbHorizonSub: "How long?",
    onbYes: "Yes", onbNo: "No", onbContinue: "Continue", onbStart: "Start",
    // Common
    ofLabel: "of", oopsTitle: "Oops!",
    // AI Responses
    aiResponseSaving: "You could optimize spending.",
    aiResponseSpending: "Spent {currency}{expenses}.",
    aiResponseInvesting: "Investing can help.",
    aiResponseInvestingStart: "Build emergency fund.",
    aiResponseDebt: "Avalanche method is best.",
    aiResponseDefault1: "Great perspective.",
    aiResponseDefault2: "I can help with analysis.",
    aiResponseDefault3: "Try 50/30/20!",
    aiResponseDefault4: "Be consistent!",
  },

  es: {
    // Carousel Intro
    introSlide1Title: "Toma el control",
    introSlide1Desc: "Savvy te ayuda.",
    introSlide2Title: "Gastos",
    introSlide2Desc: "Registra todo.",
    introSlide3Title: "Ingresos",
    introSlide3Desc: "Vigila lo que ganas.",
    introSlide4Title: "Analiza",
    introSlide4Desc: "Gráficos simples.",
    introSlide5Title: "Empezar",
    introSlide5Desc: "Comienza aquí.",
    skip: "Saltar",
    next: "Siguiente",
    startNow: "Empezar ahora",
    // Tabs
    tabHome: "Inicio", tabAnalysis: "Análisis", tabTransactions: "Transacciones", tabAI: "IA", tabSettings: "Ajustes",
    // AI Chat
    aiTitle: "Asistente", aiSubtitle: "Pregúntame", aiPlaceholder: "Escribe...", aiSend: "Enviar", aiTyping: "Pensando...",
    aiWelcome: "¡Hola!",
    aiError: "Error.",
    aiSuggestion1: "¿Cómo ahorrar?", aiSuggestion2: "Analiza gastos", aiSuggestion3: "Consejos", aiSuggestion4: "¿Deudas?",
    // Greetings
    morning: "Buenos días", afternoon: "Buenas tardes", evening: "Buenas noches", greetingSub: "Resumen",
    // Dashboard
    monthlyBalance: "Saldo", income: "Ingresos", expenses: "Gastos", balance: "Balance", recentTransactions: "Transacciones",
    noTransactions: "Sin datos", noTransactionsHint: 'Toca "+"', currentPatrimony: "Patrimonio", budgetUsed: "Presupuesto",
    // Add/Edit Transaction
    newRecord: "Nuevo", editRecord: "Editar", save: "GUARDAR", gainLabel: "Ingreso", expenseLabel: "Gasto", amountLabel: "VALOR", categoryLabel: "CATEGORÍA",
    descriptionLabel: "DESC", dateLabel: "FECHA", descriptionPlaceholder: "Opcional", invalidAmount: "Invalido", invalidAmountMsg: "Inserta valor.",
    // Analytics
    analysisTitle: "Análisis", byMonth: "Mes", byCategory: "Categoría", last6months: "6 meses", bestMonth: "Mejor", worstMonth: "Peor", topCategories: "Top",
    allTime: "Todo", totalDistribution: "Total", noData: "Sin datos", noExpenses: "Sin gastos",
    // Transactions
    transactionsTitle: "Transacciones", all: "Todas", noTransactionsList: "Sin datos", noTransactionsListHint: 'Toca "+"',
    deleteTransactionTitle: "Eliminar", deleteConfirm: "¿Seguro?", cancel: "Cancelar", delete: "Eliminar",
    // Settings
    settingsTitle: "Ajustes", sectionProfile: "PERFIL", nameLabel: "Nombre", monthlyIncomeLabel: "Ingreso", initialPatrimonyLabel: "Patrimonio",
    mainObjectiveSettingsLabel: "Objetivo", sectionPreferences: "PREFERENCIAS", currencyLabel: "Moneda", languageLabel: "Idioma", sectionAbout: "SOBRE", versionLabel: "Versión",
    chooseCurrency: "Elegir", chooseLanguage: "Elegir", chooseObjective: "Objetivo", notDefined: "No definido",
    // Account
    sectionAccount: "CUENTA", accountEmail: "Email", accountEmailDesc: "Cambiar", accountPassword: "Contraseña", accountPasswordDesc: "Cambiar",
    accountName: "Nombre", accountNameDesc: "Cambiar", accountDelete: "Eliminar", accountDeleteDesc: "Permanente", accountSignOut: "Salir",
    changeEmail: "Cambiar", changePassword: "Cambiar", changeName: "Cambiar",
    newEmailLabel: "Nuevo", newPasswordLabel: "Nueva", confirmPasswordLabel: "Confirmar", currentPasswordLabel: "Actual", newNameLabel: "Nuevo",
    passwordMismatch: "No coinciden.", passwordTooShort: "Min 6.", accountUpdated: "¡Listo!", accountUpdateError: "Error.",
    deleteAccountTitle: "Eliminar", deleteAccountMsg: "Irreversible.", deleteAccountConfirm: "Eliminar",
    signOutTitle: "Salir", signOutMsg: "¿Seguro?", signOutConfirm: "Salir", backToLogin: "Login", requiredFields: "Obligatorio.",
    // Forgot Password
    forgotPassword: "¿Olvidó?", forgotPasswordTitle: "Recuperar", forgotPasswordDesc: "Email.", forgotPasswordSend: "Enviar", forgotPasswordSuccess: "¡Listo!", forgotPasswordSuccessMsg: "Revisa.", forgotPasswordError: "Error.", forgotPasswordEmailPlaceholder: "Email",
    resetPasswordTitle: "Restablecer", resetPasswordSuccess: "¡Listo!", resetPasswordError: "Error.", updatePasswordBtn: "Actualizar",
    langPt: "Portugués", langEs: "Español", langFr: "Francés", langEn: "Inglés",
    // Objectives
    objSave: "Ahorrar", objDebt: "Deudas", objInvest: "Invertir", objControl: "Gastos", objFreedom: "Libertad",
    objSaveShort: "Ahorrar", objDebtShort: "Deudas", objInvestShort: "Invertir", objControlShort: "Gastos", objFreedomShort: "Libertad",
    // Horizons
    horizonShort: "Corto", horizonMedium: "Medio", horizonLong: "Largo",
    // Category labels
    catSalary: "Salario", catFreelance: "Freelance", catInvestment: "Inversión", catGift: "Regalo", catFood: "Comida", catHousing: "Vivienda", catTransport: "Transporte",
    catHealth: "Salud", catEntertainment: "Ocio", catShopping: "Compras", catEducation: "Educación", catUtilities: "Servicios", catTravel: "Viaje", catOther: "Otro",
    // Onboarding
    onbName: "¡Hola!", onbNameSub: "Personaliza.", onbNamePlaceholder: "Nombre", onbObjective: "Objetivo?",
    onbObjectiveSub: "Consejos.", onbIncome: "Ingreso?", onbIncomeSub: "Euros.", onbPatrimony: "Patrimonio?",
    onbPatrimonySub: "Activos.", onbDebts: "Deudas?", onbDebtsSub: "0 si no.", onbDependents: "Dependientes?", onbDependentsSub: "Hijos.",
    onbHorizon: "Horizonte?", onbHorizonSub: "Tiempo?", onbYes: "Sí", onbNo: "No", onbContinue: "Continuar", onbStart: "Empezar",
    // Common
    ofLabel: "de", oopsTitle: "¡Oops!",
    // AI Responses
    aiResponseSaving: "Puedes ahorrar.",
    aiResponseSpending: "Gastado {currency}{expenses}.",
    aiResponseInvesting: "Invertir ayuda.",
    aiResponseInvestingStart: "Fondo emergencia.",
    aiResponseDebt: "Avalanche.",
    aiResponseDefault1: "Bien.",
    aiResponseDefault2: "Ayudo.",
    aiResponseDefault3: "50/30/20.",
    aiResponseDefault4: "Consistencia.",
  },

  fr: {
    // Carousel Intro
    introSlide1Title: "Prenez le contrôle",
    introSlide1Desc: "Savvy vous aide.",
    introSlide2Title: "Dépenses",
    introSlide2Desc: "Enregistrez tout.",
    introSlide3Title: "Revenus",
    introSlide3Desc: "Gagnez plus.",
    introSlide4Title: "Analyse",
    introSlide4Desc: "Graphiques simples.",
    introSlide5Title: "Commencer",
    introSlide5Desc: "Commencez ici.",
    skip: "Passer",
    next: "Suivant",
    startNow: "Commencer",
    // Tabs
    tabHome: "Accueil", tabAnalysis: "Analyse", tabTransactions: "Transactions", tabAI: "IA", tabSettings: "Paramètres",
    // AI Chat
    aiTitle: "Assistant", aiSubtitle: "Demandez", aiPlaceholder: "Écrivez...", aiSend: "Envoyer", aiTyping: "Je pense...",
    aiWelcome: "Salut!",
    aiError: "Erreur.",
    aiSuggestion1: "Épargner?", aiSuggestion2: "Analyse", aiSuggestion3: "Conseils", aiSuggestion4: "Dettes?",
    // Greetings
    morning: "Bonjour", afternoon: "Bon après-midi", evening: "Bonsoir", greetingSub: "Résumé",
    // Dashboard
    monthlyBalance: "Solde", income: "Gains", expenses: "Dépenses", balance: "Bilan", recentTransactions: "Transactions",
    noTransactions: "Aucune", noTransactionsHint: 'Appuyez "+"', currentPatrimony: "Patrimoine", budgetUsed: "Budget",
    // Add/Edit Transaction
    newRecord: "Nouveau", editRecord: "Modifier", save: "ENREGISTRER", gainLabel: "Gain", expenseLabel: "Dépense", amountLabel: "MONTANT", categoryLabel: "CATÉGORIE",
    descriptionLabel: "DESC", dateLabel: "DATE", descriptionPlaceholder: "Facultatif", invalidAmount: "Invalide", invalidAmountMsg: "Montant.",
    // Analytics
    analysisTitle: "Analyse", byMonth: "Mois", byCategory: "Catégorie", last6months: "6 mois", bestMonth: "Meilleur", worstMonth: "Pire", topCategories: "Top",
    allTime: "Historique", totalDistribution: "Distribution", noData: "Pas assez.", noExpenses: "Aucune",
    // Transactions
    transactionsTitle: "Transactions", all: "Toutes", noTransactionsList: "Aucune", noTransactionsListHint: 'Appuyez "+"',
    deleteTransactionTitle: "Supprimer", deleteConfirm: "Sûr?", cancel: "Annuler", delete: "Supprimer",
    // Settings
    settingsTitle: "Paramètres", sectionProfile: "PROFIL", nameLabel: "Nom", monthlyIncomeLabel: "Revenu", initialPatrimonyLabel: "Patrimoine",
    mainObjectiveSettingsLabel: "Objectif", sectionPreferences: "PRÉFÉRENCES", currencyLabel: "Devise", languageLabel: "Langue", sectionAbout: "À PROPOS", versionLabel: "Version",
    chooseCurrency: "Choisir", chooseLanguage: "Choisir", chooseObjective: "Objectif", notDefined: "Non défini",
    // Account
    sectionAccount: "COMPTE", accountEmail: "Email", accountEmailDesc: "Changer", accountPassword: "Mot de passe", accountPasswordDesc: "Changer",
    accountName: "Nom", accountNameDesc: "Changer", accountDelete: "Supprimer", accountDeleteDesc: "Définitif", accountSignOut: "Déconnexion",
    changeEmail: "Changer", changePassword: "Changer", changeName: "Changer",
    newEmailLabel: "Nouveau", newPasswordLabel: "Nouveau", confirmPasswordLabel: "Confirmer", currentPasswordLabel: "Actuel", newNameLabel: "Nouveau",
    passwordMismatch: "Erreur.", passwordTooShort: "Min 6.", accountUpdated: "Mis à jour!", accountUpdateError: "Erreur.",
    deleteAccountTitle: "Supprimer", deleteAccountMsg: "Irréversible.", deleteAccountConfirm: "Supprimer",
    signOutTitle: "Déconnexion", signOutMsg: "Sûr?", signOutConfirm: "Déconnexion", backToLogin: "Connexion", requiredFields: "Requis.",
    // Forgot Password
    forgotPassword: "Oublié?", forgotPasswordTitle: "Reset", forgotPasswordDesc: "Email.", forgotPasswordSend: "Envoyer", forgotPasswordSuccess: "Envoyé!", forgotPasswordSuccessMsg: "Check inbox.",
    forgotPasswordError: "Erreur.", forgotPasswordEmailPlaceholder: "Email",
    resetPasswordTitle: "Reset", resetPasswordSuccess: "Mis à jour!", resetPasswordError: "Erreur.", updatePasswordBtn: "Mettre à jour",
    langPt: "Portugais", langEs: "Espagnol", langFr: "Français", langEn: "Anglais",
    // Objectives
    objSave: "Économiser", objDebt: "Dettes", objInvest: "Investir", objControl: "Dépenses", objFreedom: "Indépendance",
    objSaveShort: "Économiser", objDebtShort: "Dettes", objInvestShort: "Investir", objControlShort: "Dépenses", objFreedomShort: "Indépendance",
    // Horizons
    horizonShort: "Court", horizonMedium: "Moyen", horizonLong: "Long",
    // Category labels
    catSalary: "Salaire", catFreelance: "Freelance", catInvestment: "Investissement", catGift: "Cadeau", catFood: "Alimentation", catHousing: "Logement", catTransport: "Transport",
    catHealth: "Santé", catEntertainment: "Loisir", catShopping: "Shopping", catEducation: "Éducation", catUtilities: "Services", catTravel: "Voyage", catOther: "Autre",
    // Onboarding
    onbName: "Bonjour!", onbNameSub: "Bienvenue.", onbNamePlaceholder: "Nom", onbObjective: "Objectif?",
    onbObjectiveSub: "Conseils.", onbIncome: "Revenu?", onbIncomeSub: "Euros.", onbPatrimony: "Patrimoine?",
    onbPatrimonySub: "Actifs.", onbDebts: "Dettes?", onbDebtsSub: "0 si non.", onbDependents: "Dépendants?", onbDependentsSub: "Enfants.",
    onbHorizon: "Horizon?", onbHorizonSub: "Temps?", onbYes: "Oui", onbNo: "Non", onbContinue: "Continuer", onbStart: "Commencer",
    // Common
    ofLabel: "de", oopsTitle: "Oops!",
    // AI Responses
    aiResponseSaving: "Épargnez.",
    aiResponseSpending: "Dépensé {currency}{expenses}.",
    aiResponseInvesting: "Investir ajuda.",
    aiResponseInvestingStart: "Fonds d'urgence.",
    aiResponseDebt: "Avalanche.",
    aiResponseDefault1: "Bien.",
    aiResponseDefault2: "Aide.",
    aiResponseDefault3: "50/30/20.",
    aiResponseDefault4: "Consistance.",
  },
};

export type Translations = typeof translations.pt;

export function getTranslations(language: string): Translations {
  const lang = (["en", "es", "fr"].includes(language) ? language : "pt") as Language;
  return translations[lang];
}

export function getGreetingT(t: Translations, name: string): string {
  const hour = new Date().getHours();
  const firstName = name?.trim().split(" ")[0] || "";
  let base: string;
  if (hour < 12) base = t.morning;
  else if (hour < 19) base = t.afternoon;
  else base = t.evening;
  return firstName ? `${base}, ${firstName}` : base;
}
