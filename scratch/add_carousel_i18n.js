const fs = require('fs');
const path = require('path');

const i18nPath = path.join(__dirname, '../utils/i18n.ts');
let i18nContent = fs.readFileSync(i18nPath, 'utf8');

const newPt = `
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
    startNow: "Começar Agora",`;

const newEn = `
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
    startNow: "Start Now",`;

const newEs = `
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
    startNow: "Empezar ahora",`;

const newFr = `
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
    startNow: "Commencer",`;

i18nContent = i18nContent.replace(/pt:\s*\{/, "pt: {" + newPt);
i18nContent = i18nContent.replace(/en:\s*\{/, "en: {" + newEn);
i18nContent = i18nContent.replace(/es:\s*\{/, "es: {" + newEs);
i18nContent = i18nContent.replace(/fr:\s*\{/, "fr: {" + newFr);

fs.writeFileSync(i18nPath, i18nContent, 'utf8');
console.log('i18n updated successfully');
