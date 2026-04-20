export type Language = "pt" | "en" | "es" | "fr";

const translations = {
  pt: {
    // Carousel Intro
    introSlide1Title: "Domina as tuas finanças",
    introSlide1Desc: "A Savvy ajuda-te a atingir a liberdade financeira.",
    introSlide2Title: "Controla os teus gastos",
    introSlide2Desc: "Regista tudo e sabe sempre para onde vai o teu dinheiro.",
    introSlide3Title: "Acompanha os ganhos",
    introSlide3Desc: "Acompanha o que ganhas para investires de forma inteligente.",
    introSlide4Title: "Análises precisas",
    introSlide4Desc: "Gráficos e estatísticas simples para perceberes os teus hábitos.",
    introSlide5Title: "Tudo pronto",
    introSlide5Desc: "A tua viagem para a independência começa aqui.",
    skip: "Saltar",
    next: "Seguinte",
    startNow: "Começar Agora",
    // Tabs
    tabHome: "Início",
    tabAnalysis: "Análise",
    tabTransactions: "Transações",
    tabTips: "Dicas",
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

    // Tips
    tipsTitle: "Dicas",
    tipsSubtitle: "Personalizadas com base nos teus hábitos",
    tipsSubtitleName: "Recomendações para ti",
    mainObjectiveLabel: "Objetivo principal",
    financialSummary: "Resumo Financeiro",
    savingsRate: "Taxa de Poupança",
    monthlySavings: "Poupança Mensal",
    totalEvolution: "Evolução Total",
    yourTips: "As tuas dicas de poupança",
    yourTipsName: "As tuas dicas",
    tipsNote:
      "As dicas são geradas automaticamente com base nas tuas transações e objetivos. Quanto mais dados registares, mais precisas serão as recomendações.",

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

    // Account section
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
    aiResponseSaving: "Com uma taxa de poupança atual de {rate}%, poderias otimizar cortando em gastos não essenciais. O teu objetivo principal é \"{objective}\". Tens alguma categoria específica onde sentes que gastas demasiado?",
    aiResponseSpending: "Este mês já gastaste {currency}{expenses}. Em comparação com os teus ganhos ({currency}{income}), o teu saldo livre é de {currency}{balance}. Posso ajudar a estabelecer um limite mensal se precisares!",
    aiResponseInvesting: "Tendo um património de {currency}{patrimony}, começar a investir parte do teu capital em ETFs ou contas-poupança de alto rendimento pode ajudar a bater a inflação. Qual é a tua tolerância ao risco?",
    aiResponseInvestingStart: "Para começar a investir, o ideal é construir primeiro um fundo de emergência. Tenta poupar cerca de 3 a 6 meses das tuas despesas habituais antes de entrares no mercado financeiro.",
    aiResponseDebt: "A melhor estratégia para reduzir dívidas é pagar primeiro a que tem a taxa de juro mais alta (método Avalanche) ou liquidar a de menor valor primeiro para ganhar motivação (método Bola de Neve).",
    aiResponseDefault1: "Essa é uma excelente perspetiva. Com um saldo limpo de {currency}{balance} este mês, estás no caminho certo para os teus objetivos reais.",
    aiResponseDefault2: "Posso ajudar com dicas de poupança, análise do teu orçamento ou estratégias de planeamento a longo prazo. O que preferes explorar mais com base nos teus dados?",
    aiResponseDefault3: "Notei que queres perceber mais sobre finanças. Podes sempre aplicar a regra 50/30/20 ao teu orçamento: 50% necessidades, 30% desejos e 20% para a tua poupança futura!",
    aiResponseDefault4: "Não tenho uma resposta matemática exata para isso, mas como o teu Assistente Pessoal sei que a chave do sucesso financeiro é a consistência no registo de cada transação!",

    // Dynamic Tips
    tipSavingsTarget: "{name}tenta poupar pelo menos 20% do teu rendimento mensalmente para atingir os teus objetivos.",
    tipHighExpenses: "Os teus gastos estão acima de 80% do teu rendimento. Considera reduzir despesas não essenciais.",
    tipTopCategory: "A tua categoria de maior gasto é {category}. Representa {percent}% do teu rendimento.",
    tipDebtPriority: "Tens dívidas em aberto. Prioriza o pagamento das dívidas com juros mais altos primeiro.",
    tipEntertainmentLimit: "Os gastos com lazer estão elevados. Considera definir um limite mensal para entretenimento.",
    tipSavingsSuccess: "Excelente! Estás a poupar mais de 30% do teu rendimento. Considera investir o excedente.",
    tipLongHorizon: "Com um horizonte de investimento longo, os teus excedentes mensais podem crescer significativamente com investimentos regulares.",
    tipNoData1: "Regista as tuas receitas e despesas regularmente para receberes dicas personalizadas.",
    tipNoData2: "Define um orçamento mensal para cada categoria e acompanha o progresso.",
  },

  en: {
    // Carousel Intro
    introSlide1Title: "Take control of your finances",
    introSlide1Desc: "Savvy helps you achieve financial freedom.",
    introSlide2Title: "Track your expenses",
    introSlide2Desc: "Log everything and know exactly where your money goes.",
    introSlide3Title: "Monitor your income",
    introSlide3Desc: "Keep an eye on what you earn to invest smartly.",
    introSlide4Title: "Analyze your finances",
    introSlide4Desc: "Simple charts and insights to understand your habits.",
    introSlide5Title: "Get started",
    introSlide5Desc: "Your journey to independence begins here.",
    skip: "Skip",
    next: "Next",
    startNow: "Start Now",
    // Tabs
    tabHome: "Home", tabAnalysis: "Analysis", tabTransactions: "Transactions", tabTips: "Tips", tabAI: "AI", tabSettings: "Settings",
    // AI Chat
    aiTitle: "Financial Assistant", aiSubtitle: "Ask me anything about finance", aiPlaceholder: "Type your question...", aiSend: "Send", aiTyping: "Thinking...",
    aiWelcome: "Hi! I'm your personal financial assistant. I can help you with savings tips, spending analysis, investment strategies and much more. What would you like to know?",
    aiError: "An error occurred. Please try again.",
    aiSuggestion1: "How can I save more?", aiSuggestion2: "Analyse my spending", aiSuggestion3: "Investment tips", aiSuggestion4: "How to reduce debt?",
    // Greetings
    morning: "Good morning", afternoon: "Good afternoon", evening: "Good evening", greetingSub: "Here's your financial summary",
    // Dashboard
    monthlyBalance: "Monthly Balance", income: "Income", expenses: "Expenses", balance: "Balance", recentTransactions: "Recent Transactions",
    noTransactions: "No transactions this month", noTransactionsHint: 'Tap "+" to record your first income or expense', currentPatrimony: "Current Assets", budgetUsed: "Budget used",
    // Add/Edit Transaction
    newRecord: "New Record", editRecord: "Edit Record", save: "SAVE", gainLabel: "Income", expenseLabel: "Expense", amountLabel: "AMOUNT", categoryLabel: "CATEGORY",
    descriptionLabel: "DESCRIPTION", dateLabel: "DATE", descriptionPlaceholder: "Description (optional)", invalidAmount: "Invalid amount", invalidAmountMsg: "Please enter a valid amount.",
    // Analytics
    analysisTitle: "Analysis", byMonth: "By Month", byCategory: "By Category", last6months: "Last 6 months", bestMonth: "Best Month", worstMonth: "Worst Month", topCategories: "Top spending categories",
    allTime: "All time", totalDistribution: "Total Distribution", noData: "Not enough data. Start recording your expenses!", noExpenses: "No expenses recorded this month",
    // Tips
    tipsTitle: "Tips", tipsSubtitle: "Personalized based on your habits", tipsSubtitleName: "Recommendations for you", mainObjectiveLabel: "Main objective",
    financialSummary: "Financial Summary", savingsRate: "Savings Rate", monthlySavings: "Monthly Savings", totalEvolution: "Total Evolution", yourTips: "Your saving tips",
    yourTipsName: "Your tips", tipsNote: "Tips are automatically generated based on your transactions and goals. The more data you record, the more accurate the recommendations will be.",
    // Transactions
    transactionsTitle: "Transactions", all: "All", noTransactionsList: "No transactions", noTransactionsListHint: 'Record your first income or expense by tapping "+"',
    deleteTransactionTitle: "Delete transaction", deleteConfirm: "Are you sure you want to delete this transaction?", cancel: "Cancel", delete: "Delete",
    // Settings
    settingsTitle: "Settings", sectionProfile: "PROFILE", nameLabel: "Name", monthlyIncomeLabel: "Monthly Income", initialPatrimonyLabel: "Initial Assets",
    mainObjectiveSettingsLabel: "Main Objective", sectionPreferences: "PREFERENCES", currencyLabel: "Currency", languageLabel: "Language", sectionAbout: "ABOUT", versionLabel: "Version",
    chooseCurrency: "Choose Currency", chooseLanguage: "Choose Language", chooseObjective: "Main Objective", notDefined: "Not defined",
    // Account
    sectionAccount: "ACCOUNT", accountEmail: "Email", accountEmailDesc: "Change your email address", accountPassword: "Password", accountPasswordDesc: "Change your password",
    accountName: "Display name", accountNameDesc: "Change your display name", accountDelete: "Delete account", accountDeleteDesc: "Permanently delete your account", accountSignOut: "Sign out",
    changeEmail: "Change Email", changePassword: "Change Password", changeName: "Change Name",
    newEmailLabel: "New email", newPasswordLabel: "New password", confirmPasswordLabel: "Confirm password", currentPasswordLabel: "Current password", newNameLabel: "New name",
    passwordMismatch: "Passwords do not match.", passwordTooShort: "Password must be at least 6 characters.", accountUpdated: "Updated successfully!", accountUpdateError: "Error updating. Please try again.",
    deleteAccountTitle: "Delete Account", deleteAccountMsg: "Are you sure? This action is irreversible and will delete all your data.", deleteAccountConfirm: "Delete permanently",
    signOutTitle: "Sign out", signOutMsg: "Are you sure you want to sign out?", signOutConfirm: "Sign out", backToLogin: "Back to Login", requiredFields: "Please fill in all fields.",
    // Forgot Password
    forgotPassword: "Forgot your password?", forgotPasswordTitle: "Reset password", forgotPasswordDesc: "Enter your account email. You'll receive a link to set a new password.",
    forgotPasswordSend: "Send link", forgotPasswordSuccess: "Email sent!", forgotPasswordSuccessMsg: "Check your inbox and follow the link to reset your password.",
    forgotPasswordError: "Error sending. Please check the email address.", forgotPasswordEmailPlaceholder: "Your email",
    resetPasswordTitle: "Reset password", resetPasswordSuccess: "Password updated successfully!", resetPasswordError: "Error updating password.", updatePasswordBtn: "Update password",
    langPt: "Portuguese", langEs: "Spanish", langFr: "French", langEn: "English",
    // Objectives
    objSave: "Save money", objDebt: "Reduce debt", objInvest: "Invest", objControl: "Control spending", objFreedom: "Financial freedom",
    objSaveShort: "Save", objDebtShort: "Reduce Debt", objInvestShort: "Invest", objControlShort: "Control Spending", objFreedomShort: "Financial Freedom",
    // Horizons
    horizonShort: "Short term (< 1 year)", horizonMedium: "Medium term (1-5 years)", horizonLong: "Long term (5+ years)",
    // Category labels
    catSalary: "Salary", catFreelance: "Freelance", catInvestment: "Investment", catGift: "Gift", catFood: "Food", catHousing: "Housing", catTransport: "Transport",
    catHealth: "Health", catEntertainment: "Entertainment", catShopping: "Shopping", catEducation: "Education", catUtilities: "Utilities", catTravel: "Travel", catOther: "Other",
    // Onboarding
    onbName: "Hi! What's your name?", onbNameSub: "Let's personalize your experience.", onbNamePlaceholder: "Your name", onbObjective: "What is your main financial goal?",
    onbObjectiveSub: "We'll customize your tips and recommendations.", onbIncome: "What is your approximate monthly income?", onbIncomeSub: "In euros. Helps us calibrate your goals.",
    onbPatrimony: "What is your current net worth?", onbPatrimonySub: "Savings, investments and other assets (in euros).",
    onbDebts: "Do you have debts? If so, what is the total?", onbDebtsSub: "Include loans, credit cards, etc. Enter 0 if you have none.",
    onbDependents: "Do you have financial dependents?", onbDependentsSub: "Children, spouse, parents or others who depend on you financially.",
    onbHorizon: "What is your investment horizon?", onbHorizonSub: "How long do you intend to hold your investments?",
    onbYes: "Yes", onbNo: "No", onbContinue: "Continue", onbStart: "Get Started",
    // Common
    ofLabel: "of", oopsTitle: "Oops!",
    // AI Responses
    aiResponseSaving: "With a current savings rate of {rate}%, you could optimize by cutting non-essential spending. Your main goal is \"{objective}\".",
    aiResponseSpending: "This month you've already spent {currency}{expenses}. Compared to your income ({currency}{income}), your free balance is {currency}{balance}.",
    aiResponseInvesting: "With assets of {currency}{patrimony}, starting to invest part of your capital in ETFs or high-yield savings accounts can help beat inflation.",
    aiResponseInvestingStart: "To start investing, ideally build an emergency fund first of about 3 to 6 months of your usual expenses.",
    aiResponseDebt: "The best strategy to reduce debt is to pay off the one with the highest interest rate first (Avalanche method).",
    aiResponseDefault1: "That's an excellent perspective. With a balance of {currency}{balance} this month, you're on the right track.",
    aiResponseDefault2: "I can help with savings tips, budget analysis, or long-term planning. What would you like to explore?",
    aiResponseDefault3: "You can always apply the 50/30/20 rule: 50% needs, 30% wants, and 20% for future savings!",
    aiResponseDefault4: "The key to financial success is consistency in recording every transaction!",
    // Tips
    tipSavingsTarget: "{name}try to save at least 20% of your income monthly.",
    tipHighExpenses: "Your spending is above 80% of your income. Consider reducing non-essential expenses.",
    tipTopCategory: "Your highest spending category is {category}. It represents {percent}% of your income.",
    tipDebtPriority: "Prioritize paying off debts with the highest interest rates first.",
    tipEntertainmentLimit: "Entertainment spending is high. Consider setting a monthly limit.",
    tipSavingsSuccess: "Excellent! You are saving more than 30%. Consider investing the surplus.",
    tipLongHorizon: "With a long investment horizon, your monthly surpluses can grow significantly.",
    tipNoData1: "Record your income and expenses regularly to receive personalized tips.",
    tipNoData2: "Set a monthly budget for each category.",
  },

  es: {
    // Carousel Intro
    introSlide1Title: "Toma el control de tus finanzas",
    introSlide1Desc: "Savvy te ayuda a alcanzar la libertad financiera.",
    introSlide2Title: "Controla tus gastos",
    introSlide2Desc: "Registra todo y sabe siempre a dónde va tu dinero.",
    introSlide3Title: "Supervisa tus ingresos",
    introSlide3Desc: "Vigila lo que ganas para invertir inteligentemente.",
    introSlide4Title: "Analiza tus finanzas",
    introSlide4Desc: "Gráficos e informes simples para entender tus hábitos.",
    introSlide5Title: "Empezar",
    introSlide5Desc: "Tu viaje hacia la independencia comienza aquí.",
    skip: "Saltar",
    next: "Siguiente",
    startNow: "Empezar ahora",
    // Tabs
    tabHome: "Inicio", tabAnalysis: "Análisis", tabTransactions: "Transacciones", tabTips: "Consejos", tabAI: "IA", tabSettings: "Ajustes",
    // AI Chat
    aiTitle: "Asistente Financiero", aiSubtitle: "Pregúntame sobre finanzas", aiPlaceholder: "Escribe tu pregunta...", aiSend: "Enviar", aiTyping: "Pensando...",
    aiWelcome: "¡Hola! Soy tu asistente financiero. Puedo ayudarte con consejos de ahorro y estrategias. ¿Qué quieres saber?",
    aiError: "Ocurrió un error. Intenta de nuevo.",
    aiSuggestion1: "¿Cómo puedo ahorrar más?", aiSuggestion2: "Analiza mis gastos", aiSuggestion3: "Consejos de inversión", aiSuggestion4: "¿Cómo reducir deudas?",
    // Greetings
    morning: "Buenos días", afternoon: "Buenas tardes", evening: "Buenas noches", greetingSub: "Aquí está tu resumen financiero",
    // Dashboard
    monthlyBalance: "Saldo del Mes", income: "Ingresos", expenses: "Gastos", balance: "Balance", recentTransactions: "Transacciones Recientes",
    noTransactions: "Sin transacciones este mes", noTransactionsHint: 'Toca el "+" para registrar tu primer ingreso o gasto', currentPatrimony: "Patrimonio Actual", budgetUsed: "Presupuesto usado",
    // Add/Edit Transaction
    newRecord: "Nuevo Registro", editRecord: "Editar Registro", save: "GUARDAR", gainLabel: "Ingreso", expenseLabel: "Gasto", amountLabel: "VALOR", categoryLabel: "CATEGORÍA",
    descriptionLabel: "DESCRIPCIÓN", dateLabel: "FECHA", descriptionPlaceholder: "Descripción (opcional)", invalidAmount: "Valor inválido", invalidAmountMsg: "Inserta un valor válido.",
    // Analytics
    analysisTitle: "Análisis", byMonth: "Por Mes", byCategory: "Por Categoría", last6months: "Últimos 6 meses", bestMonth: "Mejor Mes", worstMonth: "Peor Mes", topCategories: "Mayor gasto por categoria",
    allTime: "Historial completo", totalDistribution: "Distribución Total", noData: "Sin datos. ¡Registra tus gastos!", noExpenses: "Sin gastos este mes",
    // Tips
    tipsTitle: "Consejos", tipsSubtitle: "Personalizados para ti", tipsSubtitleName: "Recomendaciones", mainObjectiveLabel: "Objetivo principal",
    financialSummary: "Resumen Financiero", savingsRate: "Tasa de Ahorro", monthlySavings: "Ahorro Mensual", totalEvolution: "Evolución Total", yourTips: "Tus consejos",
    yourTipsName: "Tus consejos", tipsNote: "Generados automáticamente. Más datos = mejores recomendaciones.",
    // Transactions
    transactionsTitle: "Transacciones", all: "Todas", noTransactionsList: "Sin transacciones", noTransactionsListHint: 'Regístralos tocando el "+"',
    deleteTransactionTitle: "Eliminar transacción", deleteConfirm: "¿Seguro que quieres eliminar esto?", cancel: "Cancelar", delete: "Eliminar",
    // Settings
    settingsTitle: "Ajustes", sectionProfile: "PERFIL", nameLabel: "Nombre", monthlyIncomeLabel: "Ingreso Mensual", initialPatrimonyLabel: "Patrimonio Inicial",
    mainObjectiveSettingsLabel: "Objetivo Principal", sectionPreferences: "PREFERENCIAS", currencyLabel: "Moneda", languageLabel: "Idioma", sectionAbout: "SOBRE", versionLabel: "Versión",
    chooseCurrency: "Elegir Moneda", chooseLanguage: "Elegir Idioma", chooseObjective: "Objetivo Principal", notDefined: "No definido",
    // Account
    sectionAccount: "CUENTA", accountEmail: "Email", accountEmailDesc: "Cambiar correo electrónico", accountPassword: "Contraseña", accountPasswordDesc: "Cambiar contraseña",
    accountName: "Nombre", accountNameDesc: "Cambiar nombre", accountDelete: "Eliminar cuenta", accountDeleteDesc: "Eliminar permanentemente la cuenta", accountSignOut: "Cerrar sesión",
    changeEmail: "Cambiar Email", changePassword: "Cambiar Contraseña", changeName: "Cambiar Nombre",
    newEmailLabel: "Nuevo email", newPasswordLabel: "Nueva contraseña", confirmPasswordLabel: "Confirmar contraseña", currentPasswordLabel: "Contraseña actual", newNameLabel: "Nuevo nombre",
    passwordMismatch: "Las contraseñas no coinciden.", passwordTooShort: "Mínimo 6 caracteres.", accountUpdated: "¡Actualizado!", accountUpdateError: "Error. Intenta de nuevo.",
    deleteAccountTitle: "Eliminar Cuenta", deleteAccountMsg: "¿Seguro? Esta acción es irreversible.", deleteAccountConfirm: "Eliminar",
    signOutTitle: "Cerrar sesión", signOutMsg: "¿Seguro que quieres salir?", signOutConfirm: "Salir", backToLogin: "Volver al Login", requiredFields: "Por favor, complete todos los campos.",
    // Forgot Password
    forgotPassword: "¿Olvidó su contraseña?", forgotPasswordTitle: "Recuperar contraseña", forgotPasswordDesc: "Introduce tu email y recibirás un enlace.", forgotPasswordSend: "Enviar enlace", forgotPasswordSuccess: "¡Enviado!", forgotPasswordSuccessMsg: "Revisa tu bandeja de entrada.", forgotPasswordError: "Error. Verifica el email.", forgotPasswordEmailPlaceholder: "Tu email",
    resetPasswordTitle: "Restablecer contraseña", resetPasswordSuccess: "¡Contraseña actualizada!", resetPasswordError: "Error al actualizar la contraseña.", updatePasswordBtn: "Actualizar contraseña",
    langPt: "Portugués", langEs: "Español", langFr: "Francés", langEn: "Inglés",
    // Objectives
    objSave: "Ahorrar dinero", objDebt: "Reducir deudas", objInvest: "Invertir", objControl: "Controlar gastos", objFreedom: "Libertad financiera",
    objSaveShort: "Ahorrar", objDebtShort: "Reducir Deudas", objInvestShort: "Invertir", objControlShort: "Controlar Gastos", objFreedomShort: "Libertad Financiera",
    // Horizons
    horizonShort: "Corto plazo (< 1 año)", horizonMedium: "Medio plazo (1-5 años)", horizonLong: "Largo plazo (5+ años)",
    // Category labels
    catSalary: "Salario", catFreelance: "Freelance", catInvestment: "Inversión", catGift: "Regalo", catFood: "Comida", catHousing: "Vivienda", catTransport: "Transporte",
    catHealth: "Salud", catEntertainment: "Ocio", catShopping: "Compras", catEducation: "Educación", catUtilities: "Servicios", catTravel: "Viaje", catOther: "Otro",
    // Onboarding
    onbName: "¡Hola! ¿Cómo te llamas?", onbNameSub: "Vamos a personalizar tu experiencia.", onbNamePlaceholder: "Tu nombre", onbObjective: "¿Cuál es tu objetivo principal?",
    onbObjectiveSub: "Adapta tus consejos.", onbIncome: "¿Cuál es tu ingreso mensual?", onbIncomeSub: "Nos ayuda a calibrar metas.", onbPatrimony: "¿Tu patrimonio actual?",
    onbPatrimonySub: "Ahorros y activos.", onbDebts: "¿Tienes deudas?", onbDebtsSub: "0 si no tienes.", onbDependents: "¿Tienes dependientes?", onbDependentsSub: "Hijos, cónyuge, etc.",
    onbHorizon: "¿Tu horizonte de inversión?", onbHorizonSub: "¿Cuánto tiempo mantendrás tus inversiones?", onbYes: "Sí", onbNo: "No", onbContinue: "Continuar", onbStart: "Empezar",
    // Common
    ofLabel: "de", oopsTitle: "¡Oops!",
    // AI Responses
    aiResponseSaving: "Con una tasa de ahorro del {rate}%, podrías reducir gastos no esenciales. Tu objetivo es \"{objective}\".",
    aiResponseSpending: "Este mes has gastado {currency}{expenses}. Comparado con tus ingresos ({currency}{income}), tu saldo es {currency}{balance}.",
    aiResponseInvesting: "Con un patrimonio de {currency}{patrimony}, invertir en ETFs puede ayudar. ¿Cuál es tu tolerancia al riesgo?",
    aiResponseInvestingStart: "Para invertir, construye primero un fondo de emergencia de 3 a 6 meses de gastos.",
    aiResponseDebt: "La mejor estrategia es pagar primero la deuda con el interés más alto.",
    aiResponseDefault1: "Excelente perspectiva. Con un saldo de {currency}{balance}, vas por buen camino.",
    aiResponseDefault2: "Puedo ayudarte con consejos, análisis o planificación. ¿Qué prefieres?",
    aiResponseDefault3: "Aplica la regla 50/30/20: 50% necesidades, 30% deseos y 20% ahorro.",
    aiResponseDefault4: "La clave es la consistencia al registrar cada transacción.",
    // Tips
    tipSavingsTarget: "{name}intenta ahorrar al menos el 20% de tus ingresos.",
    tipHighExpenses: "Tus gastos superan el 80% de tus ingresos. Considera reducirlos.",
    tipTopCategory: "Tu mayor gasto es {category}. Representa el {percent}%.",
    tipDebtPriority: "Prioriza deudas con intereses más altos.",
    tipEntertainmentLimit: "Los gastos en ocio son elevados. Define un límite.",
    tipSavingsSuccess: "¡Excelente! Ahorras más del 30%.",
    tipLongHorizon: "Con un horizonte largo, tus excedentes pueden crecer mucho.",
    tipNoData1: "Registra ingresos y gastos para consejos.",
    tipNoData2: "Define un presupuesto por categoría.",
  },

  fr: {
    // Carousel Intro
    introSlide1Title: "Prenez le contrôle de vos finances",
    introSlide1Desc: "Savvy vous aide à atteindre la liberté financière.",
    introSlide2Title: "Suivez vos dépenses",
    introSlide2Desc: "Enregistrez tout et sachez exactement où va votre argent.",
    introSlide3Title: "Surveillez vos revenus",
    introSlide3Desc: "Gardez un œil sur ce que vous gagnez pour investir intelligemment.",
    introSlide4Title: "Analysez vos finances",
    introSlide4Desc: "Des graphiques simples pour comprendre vos habitudes.",
    introSlide5Title: "Commencer",
    introSlide5Desc: "Votre voyage vers l'indépendance commence ici.",
    skip: "Passer",
    next: "Suivant",
    startNow: "Commencer",
    // Tabs
    tabHome: "Accueil", tabAnalysis: "Analyse", tabTransactions: "Transactions", tabTips: "Conseils", tabAI: "IA", tabSettings: "Paramètres",
    // AI Chat
    aiTitle: "Assistant Financier", aiSubtitle: "Demandez-moi n'importe quoi", aiPlaceholder: "Votre question...", aiSend: "Envoyer", aiTyping: "Je pense...",
    aiWelcome: "Salut! Je suis votre assistant financier. Je peux vous aider avec des conseils d'épargne. Que voulez-vous savoir?",
    aiError: "Une erreur est survenue.",
    aiSuggestion1: "Comment épargner plus?", aiSuggestion2: "Analyse mes dépenses", aiSuggestion3: "Conseils d'investissement", aiSuggestion4: "Réduire les dettes?",
    // Greetings
    morning: "Bonjour", afternoon: "Bon après-midi", evening: "Bonsoir", greetingSub: "Voici votre résumé financier",
    // Dashboard
    monthlyBalance: "Solde", income: "Gains", expenses: "Dépenses", balance: "Bilan", recentTransactions: "Transactions Récentes",
    noTransactions: "Aucune transaction", noTransactionsHint: 'Appuyez sur "+" pour ajouter', currentPatrimony: "Patrimoine Actuel", budgetUsed: "Budget utilisé",
    // Add/Edit Transaction
    newRecord: "Nouveau", editRecord: "Modifier", save: "ENREGISTRER", gainLabel: "Gain", expenseLabel: "Dépense", amountLabel: "MONTANT", categoryLabel: "CATÉGORIE",
    descriptionLabel: "DESCRIPTION", dateLabel: "DATE", descriptionPlaceholder: "Description (facultatif)", invalidAmount: "Montant invalide", invalidAmountMsg: "Veuillez entrer un montant.",
    // Analytics
    analysisTitle: "Analyse", byMonth: "Par Mois", byCategory: "Par Catégorie", last6months: "6 derniers mois", bestMonth: "Meilleur Mois", worstMonth: "Pire Mois", topCategories: "Top catégories",
    allTime: "Historique", totalDistribution: "Distribution Totale", noData: "Pas assez de données.", noExpenses: "Aucune dépense",
    // Tips
    tipsTitle: "Conseils", tipsSubtitle: "Personnalisé pour vous", tipsSubtitleName: "Vos recommandations", mainObjectiveLabel: "Objectif principal",
    financialSummary: "Résumé Financier", savingsRate: "Taux d'Épargne", monthlySavings: "Épargne Mensuelle", totalEvolution: "Évolution Totale", yourTips: "Vos conseils",
    yourTipsName: "Vos conseils", tipsNote: "Généré automatiquement.",
    // Transactions
    transactionsTitle: "Transactions", all: "Toutes", noTransactionsList: "Aucune transaction", noTransactionsListHint: 'Appuyez sur "+"',
    deleteTransactionTitle: "Supprimer", deleteConfirm: "Êtes-vous sûr?", cancel: "Annuler", delete: "Supprimer",
    // Settings
    settingsTitle: "Paramètres", sectionProfile: "PROFIL", nameLabel: "Nom", monthlyIncomeLabel: "Revenu", initialPatrimonyLabel: "Patrimoine",
    mainObjectiveSettingsLabel: "Objectif Principal", sectionPreferences: "PRÉFÉRENCES", currencyLabel: "Devise", languageLabel: "Langue", sectionAbout: "À PROPOS", versionLabel: "Version",
    chooseCurrency: "Choisir Devise", chooseLanguage: "Choisir Langue", chooseObjective: "Objectif", notDefined: "Non défini",
    // Account
    sectionAccount: "COMPTE", accountEmail: "Email", accountEmailDesc: "Changer l'adresse email", accountPassword: "Mot de passe", accountPasswordDesc: "Changer le mot de passe",
    accountName: "Nom", accountNameDesc: "Changer votre nom", accountDelete: "Supprimer le compte", accountDeleteDesc: "Supprimer définitivement", accountSignOut: "Se déconnecter",
    changeEmail: "Changer Email", changePassword: "Changer Mot de passe", changeName: "Changer Nom",
    newEmailLabel: "Nouvel email", newPasswordLabel: "Nouveau mot de passe", confirmPasswordLabel: "Confirmer", currentPasswordLabel: "Mot de passe actuel", newNameLabel: "Nouveau nom",
    passwordMismatch: "Les mots de passe ne correspondent pas.", passwordTooShort: "Minimum 6 caracteres.", accountUpdated: "Mis à jour!", accountUpdateError: "Erreur. Réessayez.",
    deleteAccountTitle: "Supprimer le compte", deleteAccountMsg: "Êtes-vous sûr? Action irréversible.", deleteAccountConfirm: "Supprimer",
    signOutTitle: "Se déconnecter", signOutMsg: "Êtes-vous sûr?", signOutConfirm: "Se déconnecter", backToLogin: "Retour à la connexion", requiredFields: "Veuillez remplir tous les champs.",
    // Forgot Password
    forgotPassword: "Mot de passe oublié?", forgotPasswordTitle: "Réinitialiser", forgotPasswordDesc: "Entrez votre email pour recevoir un lien.", forgotPasswordSend: "Envoyer", forgotPasswordSuccess: "Envoyé!", forgotPasswordSuccessMsg: "Vérifiez votre boîte de réception.", forgotPasswordError: "Erreur. Vérifiez l'email.", forgotPasswordEmailPlaceholder: "Votre email",
    resetPasswordTitle: "Réinitialiser le mot de passe", resetPasswordSuccess: "Mot de passe mis à jour!", resetPasswordError: "Erreur lors de la mise à jour.", updatePasswordBtn: "Mettre à jour",
    langPt: "Portugais", langEs: "Espagnol", langFr: "Français", langEn: "Anglais",
    // Objectives
    objSave: "Économiser", objDebt: "Réduire les dettes", objInvest: "Investir", objControl: "Contrôler les dépenses", objFreedom: "Indépendance financière",
    objSaveShort: "Économiser", objDebtShort: "Réduire les dettes", objInvestShort: "Investir", objControlShort: "Dépenses", objFreedomShort: "Indépendance",
    // Horizons
    horizonShort: "Court terme (< 1 an)", horizonMedium: "Moyen terme (1-5 ans)", horizonLong: "Long terme (5+ ans)",
    // Category labels
    catSalary: "Salaire", catFreelance: "Freelance", catInvestment: "Investissement", catGift: "Cadeau", catFood: "Alimentation", catHousing: "Logement", catTransport: "Transport",
    catHealth: "Santé", catEntertainment: "Loisir", catShopping: "Shopping", catEducation: "Éducation", catUtilities: "Services", catTravel: "Voyage", catOther: "Autre",
    // Onboarding
    onbName: "Bonjour! Quel est votre nom?", onbNameSub: "Personnalisons votre expérience.", onbNamePlaceholder: "Votre nom", onbObjective: "Quel est votre objectif?",
    onbObjectiveSub: "Adaptons vos conseils.", onbIncome: "Quel est votre revenu mensuel?", onbIncomeSub: "Nous aide à calibrer.", onbPatrimony: "Votre patrimoine?",
    onbPatrimonySub: "Épargne et actifs.", onbDebts: "Des dettes?", onbDebtsSub: "0 si aucune.", onbDependents: "Des dépendants?", onbDependentsSub: "Enfants, etc.",
    onbHorizon: "Votre horizon d'investissement?", onbHorizonSub: "Combien de temps?", onbYes: "Oui", onbNo: "Non", onbContinue: "Continuer", onbStart: "Commencer",
    // Common
    ofLabel: "de", oopsTitle: "Oops!",
    // AI Responses
    aiResponseSaving: "Avec un taux d'épargne de {rate}%, vous pourriez optimiser en réduisant les dépenses. Votre objectif est \"{objective}\".",
    aiResponseSpending: "Ce mois-ci vous avez dépensé {currency}{expenses}. Par rapport à vos revenus ({currency}{income}), votre solde est de {currency}{balance}.",
    aiResponseInvesting: "Avec un patrimoine de {currency}{patrimony}, investir peut aider.",
    aiResponseInvestingStart: "Construisez un fonds d'urgence de 3 à 6 mois de dépenses.",
    aiResponseDebt: "La meilleure stratégie est de payer d'abord la dette au taux le plus élevé.",
    aiResponseDefault1: "Excellente perspective. Avec un solde de {currency}{balance}, vous êtes sur la bonne voie.",
    aiResponseDefault2: "Je peux vous aider avec des conseils ou l'analyse. Que voulez-vous explorer?",
    aiResponseDefault3: "Appliquez la règle 50/30/20: 50% besoins, 30% envies et 20% épargne.",
    aiResponseDefault4: "La clé est la régularité dans l'enregistrement.",
    // Tips
    tipSavingsTarget: "{name}essayez d'épargner au moins 20% de vos revenus.",
    tipHighExpenses: "Vos dépenses sont supérieures à 80%. Envisagez de les réduire.",
    tipTopCategory: "Votre catégorie la plus élevée est {category}. Elle représente {percent}%.",
    tipDebtPriority: "Priorisez le remboursement des dettes les plus coûteuses.",
    tipEntertainmentLimit: "Les dépenses de loisirs sont élevées. Fixez une limite.",
    tipSavingsSuccess: "Excellent! Vous épargnez plus de 30%.",
    tipLongHorizon: "Avec un horizon long, vos surplus peuvent croître considérablement.",
    tipNoData1: "Enregistrez vos revenus pour recevoir des conseils.",
    tipNoData2: "Fixez un budget par catégorie.",
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
