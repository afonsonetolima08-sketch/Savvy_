const fs = require('fs');

const path = 'c:/Users/HP/OneDrive/Ambiente de Trabalho/savvy/Savvy-main/Savvy-main/artifacts/savvy/utils/i18n.ts';
let code = fs.readFileSync(path, 'utf8');

// Update the type definition
code = code.replace(/export type Language = "pt" \| "en";/, 'export type Language = "pt" | "en" | "es" | "fr";');

// Update lang string labels in pt and en
code = code.replace(/langPt: "Português",\s+langEn: "English",/, 'langPt: "Português",\n    langEs: "Español",\n    langFr: "Français",\n    langEn: "English",');
code = code.replace(/langPt: "Portuguese",\s+langEn: "English",/, 'langPt: "Portuguese",\n    langEs: "Spanish",\n    langFr: "French",\n    langEn: "English",');

// Wait, doing this via string manipulation could break if the template isn't exact.
// Since the file is mostly just a giant object, I'll extract the english translation 
// object, then use Node VM to evaluate it, then generate Spanish and French objects,
// then inject them.

// Let's just create an entire Spanish and French dictionary.
const es = `
  es: {
    tabHome: "Inicio", tabAnalysis: "Análisis", tabTransactions: "Transacciones", tabTips: "Consejos", tabAI: "IA", tabSettings: "Ajustes",
    aiTitle: "Asistente Financiero", aiSubtitle: "Pregúntame sobre finanzas", aiPlaceholder: "Escribe tu pregunta...", aiSend: "Enviar", aiTyping: "Pensando...",
    aiWelcome: "¡Hola! Soy tu asistente financiero. Puedo ayudarte con consejos de ahorro y estrategias. ¿Qué quieres saber?", aiError: "Ocurrió un error. Intenta de nuevo.",
    aiSuggestion1: "¿Cómo puedo ahorrar más?", aiSuggestion2: "Analiza mis gastos", aiSuggestion3: "Consejos de inversión", aiSuggestion4: "¿Cómo reducir deudas?",
    morning: "Buenos días", afternoon: "Buenas tardes", evening: "Buenas noches", greetingSub: "Aquí está tu resumen financiero",
    monthlyBalance: "Saldo del Mes", income: "Ingresos", expenses: "Gastos", balance: "Balance", recentTransactions: "Transacciones Recientes", noTransactions: "Sin transacciones este mes",
    noTransactionsHint: 'Toca el "+" para registrar tu primer ingreso o gasto', currentPatrimony: "Patrimonio Actual", budgetUsed: "Presupuesto usado",
    newRecord: "Nuevo Registro", editRecord: "Editar Registro", save: "Guardar", gainLabel: "Ingreso", expenseLabel: "Gasto", amountLabel: "VALOR", categoryLabel: "CATEGORÍA",
    descriptionLabel: "DESCRIPCIÓN", dateLabel: "FECHA", descriptionPlaceholder: "Descripción (opcional)", invalidAmount: "Valor inválido", invalidAmountMsg: "Inserta un valor válido.",
    analysisTitle: "Análisis", byMonth: "Por Mes", byCategory: "Por Categoría", last6months: "Últimos 6 meses", bestMonth: "Mejor Mes", worstMonth: "Peor Mes", topCategories: "Mayor gasto por categoría",
    allTime: "Historial completo", totalDistribution: "Distribución Total", noData: "Sin datos. ¡Registra tus gastos!", noExpenses: "Sin gastos este mes",
    tipsTitle: "Consejos", tipsSubtitle: "Personalizados para ti", tipsSubtitleName: "Recomendaciones", mainObjectiveLabel: "Objetivo principal", financialSummary: "Resumen Financiero",
    savingsRate: "Tasa de Ahorro", monthlySavings: "Ahorro Mensual", totalEvolution: "Evolución Total", yourTips: "Tus consejos", yourTipsName: "Tus consejos",
    tipsNote: "Generados automáticamente. Más datos = mejores recomendaciones.", transactionsTitle: "Transacciones", all: "Todas", noTransactionsList: "Sin transacciones",
    noTransactionsListHint: 'Regístralos tocando el "+"', deleteTransactionTitle: "Eliminar transacción", deleteConfirm: "¿Seguro que quieres eliminar esto?", cancel: "Cancelar", delete: "Eliminar",
    settingsTitle: "Ajustes", sectionProfile: "PERFIL", nameLabel: "Nombre", monthlyIncomeLabel: "Ingreso Mensual", initialPatrimonyLabel: "Patrimonio Inicial",
    mainObjectiveSettingsLabel: "Objetivo Principal", sectionPreferences: "PREFERENCIAS", currencyLabel: "Moneda", languageLabel: "Idioma", sectionAbout: "SOBRE", versionLabel: "Versión",
    chooseCurrency: "Elegir Moneda", chooseLanguage: "Elegir Idioma", chooseObjective: "Objetivo Principal", notDefined: "No definido",
    langPt: "Portugués", langEs: "Español", langFr: "Francés", langEn: "Inglés",
    objSave: "Ahorrar dinero", objDebt: "Reducir deudas", objInvest: "Invertir", objControl: "Controlar gastos", objFreedom: "Libertad financiera",
    objSaveShort: "Ahorrar", objDebtShort: "Reducir Deudas", objInvestShort: "Invertir", objControlShort: "Controlar Gastos", objFreedomShort: "Libertad Financiera",
    horizonShort: "Corto plazo (< 1 año)", horizonMedium: "Medio plazo (1-5 años)", horizonLong: "Largo plazo (5+ años)",
    catSalary: "Salario", catFreelance: "Freelance", catInvestment: "Inversión", catGift: "Regalo", catFood: "Comida", catHousing: "Vivienda", catTransport: "Transporte",
    catHealth: "Salud", catEntertainment: "Ocio", catShopping: "Compras", catEducation: "Educación", catUtilities: "Servicios", catTravel: "Viaje", catOther: "Otro",
    onbName: "¡Hola! ¿Cómo te llamas?", onbNameSub: "Vamos a personalizar tu experiencia.", onbNamePlaceholder: "Tu nombre", onbObjective: "¿Cuál es tu objetivo principal?",
    onbObjectiveSub: "Adapta tus consejos.", onbIncome: "¿Cuál es tu ingreso mensual?", onbIncomeSub: "Nos ayuda a calibrar metas.", onbPatrimony: "¿Tu patrimonio actual?",
    onbPatrimonySub: "Ahorros y activos.", onbDebts: "¿Tienes deudas?", onbDebtsSub: "0 si no tienes.", onbDependents: "¿Tienes dependientes?", onbDependentsSub: "Hijos, cónyuge, etc.",
    onbHorizon: "¿Tu horizonte de inversión?", onbHorizonSub: "¿Cuánto tiempo mantendrás tus inversiones?", onbYes: "Sí", onbNo: "No", onbContinue: "Continuar", onbStart: "Empezar",
  },
`;

const fr = `
  fr: {
    tabHome: "Accueil", tabAnalysis: "Analyse", tabTransactions: "Transactions", tabTips: "Conseils", tabAI: "IA", tabSettings: "Paramètres",
    aiTitle: "Assistant Financier", aiSubtitle: "Demandez-moi n'importe quoi", aiPlaceholder: "Votre question...", aiSend: "Envoyer", aiTyping: "Je pense...",
    aiWelcome: "Salut! Je suis votre assistant financier. Je peux vous aider avec des conseils d'épargne. Que voulez-vous savoir?", aiError: "Une erreur est survenue.",
    aiSuggestion1: "Comment épargner plus?", aiSuggestion2: "Analyse mes dépenses", aiSuggestion3: "Conseils d'investissement", aiSuggestion4: "Réduire les dettes?",
    morning: "Bonjour", afternoon: "Bon après-midi", evening: "Bonsoir", greetingSub: "Voici votre résumé financier",
    monthlyBalance: "Solde", income: "Gains", expenses: "Dépenses", balance: "Bilan", recentTransactions: "Transactions Récentes", noTransactions: "Aucune transaction",
    noTransactionsHint: 'Appuyez sur "+" pour ajouter', currentPatrimony: "Patrimoine Actuel", budgetUsed: "Budget utilisé",
    newRecord: "Nouveau", editRecord: "Modifier", save: "Enregistrer", gainLabel: "Gain", expenseLabel: "Dépense", amountLabel: "MONTANT", categoryLabel: "CATÉGORIE",
    descriptionLabel: "DESCRIPTION", dateLabel: "DATE", descriptionPlaceholder: "Description (facultatif)", invalidAmount: "Montant invalide", invalidAmountMsg: "Veuillez entrer un montant.",
    analysisTitle: "Analyse", byMonth: "Par Mois", byCategory: "Par Catégorie", last6months: "6 derniers mois", bestMonth: "Meilleur Mois", worstMonth: "Pire Mois", topCategories: "Top catégories",
    allTime: "Historique", totalDistribution: "Distribution Totale", noData: "Pas assez de données.", noExpenses: "Aucune dépense",
    tipsTitle: "Conseils", tipsSubtitle: "Personnalisé pour vous", tipsSubtitleName: "Vos recommandations", mainObjectiveLabel: "Objectif principal", financialSummary: "Résumé Financier",
    savingsRate: "Taux d'Épargne", monthlySavings: "Épargne Mensuelle", totalEvolution: "Évolution Totale", yourTips: "Vos conseils", yourTipsName: "Vos conseils",
    tipsNote: "Généré automatiquement.", transactionsTitle: "Transactions", all: "Toutes", noTransactionsList: "Aucune transaction",
    noTransactionsListHint: 'Appuyez sur "+"', deleteTransactionTitle: "Supprimer", deleteConfirm: "Êtes-vous sûr?", cancel: "Annuler", delete: "Supprimer",
    settingsTitle: "Paramètres", sectionProfile: "PROFIL", nameLabel: "Nom", monthlyIncomeLabel: "Revenu", initialPatrimonyLabel: "Patrimoine",
    mainObjectiveSettingsLabel: "Objectif Principal", sectionPreferences: "PRÉFÉRENCES", currencyLabel: "Devise", languageLabel: "Langue", sectionAbout: "À PROPOS", versionLabel: "Version",
    chooseCurrency: "Choisir Devise", chooseLanguage: "Choisir Langue", chooseObjective: "Objectif", notDefined: "Non défini",
    langPt: "Portugais", langEs: "Espagnol", langFr: "Français", langEn: "Anglais",
    objSave: "Économiser", objDebt: "Réduire les dettes", objInvest: "Investir", objControl: "Contrôler les dépenses", objFreedom: "Indépendance financière",
    objSaveShort: "Économiser", objDebtShort: "Réduire les dettes", objInvestShort: "Investir", objControlShort: "Dépenses", objFreedomShort: "Indépendance",
    horizonShort: "Court terme (< 1 an)", horizonMedium: "Moyen terme (1-5 ans)", horizonLong: "Long terme (5+ ans)",
    catSalary: "Salaire", catFreelance: "Freelance", catInvestment: "Investissement", catGift: "Cadeau", catFood: "Alimentation", catHousing: "Logement", catTransport: "Transport",
    catHealth: "Santé", catEntertainment: "Loisir", catShopping: "Shopping", catEducation: "Éducation", catUtilities: "Services", catTravel: "Voyage", catOther: "Autre",
    onbName: "Bonjour! Quel est votre nom?", onbNameSub: "Personnalisons votre expérience.", onbNamePlaceholder: "Votre nom", onbObjective: "Quel est votre objectif?",
    onbObjectiveSub: "Adaptons vos conseils.", onbIncome: "Quel est votre revenu mensuel?", onbIncomeSub: "Nous aide à calibrer.", onbPatrimony: "Votre patrimoine?",
    onbPatrimonySub: "Épargne et actifs.", onbDebts: "Des dettes?", onbDebtsSub: "0 si aucune.", onbDependents: "Des dépendants?", onbDependentsSub: "Enfants, etc.",
    onbHorizon: "Votre horizon d'investissement?", onbHorizonSub: "Combien de temps?", onbYes: "Oui", onbNo: "Non", onbContinue: "Continuer", onbStart: "Commencer",
  },
`;

code = code.replace(/onbStart: "Get Started",\s*\},/g, 'onbStart: "Get Started",\n  },' + es + fr);

code = code.replace(/const lang = \(language === "en" \? "en" : "pt"\) as Language;/g, 'const lang = (["en", "es", "fr"].includes(language) ? language : "pt") as Language;');

fs.writeFileSync(path, code);
console.log('Success');
