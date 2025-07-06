document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const generatorForm = document.getElementById('generatorForm');
    const lotteryTypeSelect = document.getElementById('lotteryType');
    const customSettings = document.getElementById('customSettings');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const resultsCard = document.getElementById('resultsCard');
    const languageSelect = document.getElementById('languageSelect');

    // Lottery type configurations
    const lotteryConfigs = {
        // US Lotteries
        powerball: { min: 1, max: 69, count: 5, specialMin: 1, specialMax: 26, specialName: 'Powerball' },
        megaMillions: { min: 1, max: 70, count: 5, specialMin: 1, specialMax: 25, specialName: 'Mega Ball' },
        lottoAmerica: { min: 1, max: 52, count: 5, specialMin: 1, specialMax: 10, specialName: 'Star Ball' },
        cash4life: { min: 1, max: 60, count: 5, specialMin: 1, specialMax: 4, specialName: 'Cash Ball' },
        luckyForLife: { min: 1, max: 48, count: 5, specialMin: 1, specialMax: 18, specialName: 'Lucky Ball' },
        hotLotto: { min: 1, max: 47, count: 5, specialMin: 1, specialMax: 19, specialName: 'Hot Ball' },
        // European Lotteries
        euroMillions: { min: 1, max: 50, count: 5, specialMin: 1, specialMax: 12, specialName: 'Lucky Stars' },
        euroJackpot: { min: 1, max: 50, count: 5, specialMin: 1, specialMax: 12, specialName: 'Euro Numbers' },
        lotto6aus49: { min: 1, max: 49, count: 6, specialMin: 1, specialMax: 9, specialName: 'Superzahl' },
        ukLotto: { min: 1, max: 59, count: 6, specialMin: 1, specialMax: 59, specialName: 'Bonus Ball' },
        irishLotto: { min: 1, max: 47, count: 6, specialMin: 1, specialMax: 47, specialName: 'Bonus Ball' },
        spanishLotto: { min: 1, max: 49, count: 6, specialMin: 1, specialMax: 49, specialName: 'Reintegro' },
        frenchLotto: { min: 1, max: 49, count: 5, specialMin: 1, specialMax: 10, specialName: 'Chance Number' },
        italianLotto: { min: 1, max: 90, count: 5, specialMin: 1, specialMax: 90, specialName: 'Jolly' },
        dutchLotto: { min: 1, max: 45, count: 6, specialMin: 1, specialMax: 6, specialName: 'Joker' },
        belgianLotto: { min: 1, max: 45, count: 6, specialMin: 1, specialMax: 6, specialName: 'Bonus' },
        swissLotto: { min: 1, max: 42, count: 6, specialMin: 1, specialMax: 6, specialName: 'Lucky Number' },
        austrianLotto: { min: 1, max: 45, count: 6, specialMin: 1, specialMax: 45, specialName: 'Bonus' },
        polishLotto: { min: 1, max: 49, count: 6, specialMin: 1, specialMax: 49, specialName: 'Super Number' },
        czechLotto: { min: 1, max: 49, count: 6, specialMin: 1, specialMax: 49, specialName: 'Bonus' },
        hungarianLotto: { min: 1, max: 90, count: 5, specialMin: 1, specialMax: 90, specialName: 'Joker' },
        romanianLotto: { min: 1, max: 49, count: 6, specialMin: 1, specialMax: 49, specialName: 'Noroc' },
        bulgarianLotto: { min: 1, max: 49, count: 6, specialMin: 1, specialMax: 49, specialName: 'Bonus' },
        greekLotto: { min: 1, max: 49, count: 6, specialMin: 1, specialMax: 49, specialName: 'Joker' },
        portugueseLotto: { min: 1, max: 49, count: 6, specialMin: 1, specialMax: 13, specialName: 'Joker' },
        // Canadian Lotteries
        lottoMax: { min: 1, max: 50, count: 7, specialMin: 1, specialMax: 50, specialName: 'Bonus' },
        lotto649: { min: 1, max: 49, count: 6, specialMin: 1, specialMax: 49, specialName: 'Bonus' },
        ontario49: { min: 1, max: 49, count: 6, specialMin: 1, specialMax: 49, specialName: 'Bonus' },
        atlantic49: { min: 1, max: 49, count: 6, specialMin: 1, specialMax: 49, specialName: 'Bonus' },
        western649: { min: 1, max: 49, count: 6, specialMin: 1, specialMax: 49, specialName: 'Bonus' },
        pacific649: { min: 1, max: 49, count: 6, specialMin: 1, specialMax: 49, specialName: 'Bonus' },
        // Australian Lotteries
        ozLotto: { min: 1, max: 47, count: 7, specialMin: 1, specialMax: 47, specialName: 'Supplementary' },
        powerballAu: { min: 1, max: 35, count: 7, specialMin: 1, specialMax: 20, specialName: 'Powerball' },
        saturdayLotto: { min: 1, max: 45, count: 6, specialMin: 1, specialMax: 45, specialName: 'Supplementary' },
        mondayLotto: { min: 1, max: 45, count: 6, specialMin: 1, specialMax: 45, specialName: 'Supplementary' },
        wednesdayLotto: { min: 1, max: 45, count: 6, specialMin: 1, specialMax: 45, specialName: 'Supplementary' },
        setForLife: { min: 1, max: 44, count: 8, specialMin: 1, specialMax: 44, specialName: 'Bonus' },
        // UK Lotteries
        thunderball: { min: 1, max: 39, count: 5, specialMin: 1, specialMax: 14, specialName: 'Thunderball' },
        euroMillionsUk: { min: 1, max: 50, count: 5, specialMin: 1, specialMax: 12, specialName: 'Lucky Stars' },
        lottoHotpicks: { min: 1, max: 59, count: 5, specialMin: 1, specialMax: 59, specialName: 'Bonus' },
        setForLifeUk: { min: 1, max: 47, count: 5, specialMin: 1, specialMax: 10, specialName: 'Life Ball' },
        // Indian Lotteries (defaults)
        keralaLottery: { min: 1, max: 90, count: 6, specialMin: 1, specialMax: 90, specialName: 'Bonus' },
        maharashtraLottery: { min: 1, max: 90, count: 6, specialMin: 1, specialMax: 90, specialName: 'Bonus' },
        westBengalLottery: { min: 1, max: 90, count: 6, specialMin: 1, specialMax: 90, specialName: 'Bonus' },
        punjabLottery: { min: 1, max: 90, count: 6, specialMin: 1, specialMax: 90, specialName: 'Bonus' },
        tamilNaduLottery: { min: 1, max: 90, count: 6, specialMin: 1, specialMax: 90, specialName: 'Bonus' },
        karnatakaLottery: { min: 1, max: 90, count: 6, specialMin: 1, specialMax: 90, specialName: 'Bonus' },
        // South African Lotteries
        powerballSa: { min: 1, max: 50, count: 5, specialMin: 1, specialMax: 20, specialName: 'Powerball' },
        lottoSa: { min: 1, max: 52, count: 6, specialMin: 1, specialMax: 52, specialName: 'Bonus' },
        dailyLotto: { min: 1, max: 36, count: 5, specialMin: 1, specialMax: 36, specialName: 'Bonus' },
        sportstake: { min: 1, max: 99, count: 6, specialMin: 1, specialMax: 99, specialName: 'Bonus' },
        // Brazilian Lotteries
        megaSena: { min: 1, max: 60, count: 6, specialMin: 1, specialMax: 60, specialName: 'Bonus' },
        quina: { min: 1, max: 80, count: 5, specialMin: 1, specialMax: 80, specialName: 'Bonus' },
        lotofacil: { min: 1, max: 25, count: 15, specialMin: 1, specialMax: 25, specialName: 'Bonus' },
        lotomania: { min: 0, max: 99, count: 50, specialMin: 0, specialMax: 99, specialName: 'Bonus' },
        duplaSena: { min: 1, max: 50, count: 6, specialMin: 1, specialMax: 50, specialName: 'Bonus' },
        loteca: { min: 1, max: 14, count: 14, specialMin: 1, specialMax: 14, specialName: 'Bonus' },
        // Japanese Lotteries
        takarakuji: { min: 1, max: 43, count: 6, specialMin: 1, specialMax: 43, specialName: 'Bonus' },
        numbers: { min: 0, max: 9, count: 4, specialMin: 0, specialMax: 9, specialName: 'Bonus' },
        miniLotto: { min: 1, max: 31, count: 5, specialMin: 1, specialMax: 31, specialName: 'Bonus' },
        wide: { min: 1, max: 31, count: 2, specialMin: 1, specialMax: 31, specialName: 'Bonus' },
        // Singapore
        toto: { min: 1, max: 49, count: 6, specialMin: 1, specialMax: 49, specialName: 'Additional' },
        '4d': { min: 0, max: 9, count: 4, specialMin: 0, specialMax: 9, specialName: 'Bonus' },
        sweep: { min: 1, max: 10000000, count: 1, specialMin: 1, specialMax: 10000000, specialName: 'Sweep Number' },
        // Malaysia
        magnum4d: { min: 0, max: 9, count: 4, specialMin: 0, specialMax: 9, specialName: 'Bonus' },
        damacai: { min: 0, max: 9, count: 4, specialMin: 0, specialMax: 9, specialName: 'Bonus' },
        toto4d: { min: 0, max: 9, count: 4, specialMin: 0, specialMax: 9, specialName: 'Bonus' },
        sandakan4d: { min: 0, max: 9, count: 4, specialMin: 0, specialMax: 9, specialName: 'Bonus' },
        // Default fallback for all other types
        lotto: { min: 1, max: 59, count: 6, specialMin: 1, specialMax: 1, specialName: 'Bonus Ball' }
    };

    // Translation system
    const translations = {
        en: {
            title: 'Lottery Number Generator',
            subtitle: 'Generate random numbers for various lottery games',
            aiLuckyPick: 'AI Lucky Pick',
            birthdayPlaceholder: 'Your Birthday (optional)',
            zodiacPlaceholder: 'Zodiac (optional)',
            aiLuckyPickBtn: 'AI Lucky Pick',
            selectLotteryType: 'Select Lottery Type',
            minNumber: 'Minimum Number',
            maxNumber: 'Maximum Number',
            numberCount: 'Number of Numbers',
            specialNumber: 'Special Number (Optional)',
            setCount: 'Number of Sets',
            generateBtn: 'Generate Numbers',
            resetBtn: 'Reset',
            generatedNumbers: 'Generated Numbers',
            downloadNumbers: 'Download Numbers',
            aboutTitle: 'About Lottery Number Generator',
            aboutText: 'This tool helps you generate random lottery numbers for various games. Features include:',
            multipleTypes: 'Multiple lottery types',
            customSettings: 'Custom number settings',
            multipleSets: 'Multiple number sets',
            pdfDownload: 'PDF download',
            usageTips: 'Usage Tips',
            tip1: 'Select your preferred lottery type',
            tip2: 'Customize number ranges if needed',
            tip3: 'Generate multiple sets for variety',
            tip4: 'Download your numbers for future reference',
            lotteryInfo: 'Lottery Info & Results',
            nextDraw: 'Next Draw:',
            estimatedJackpot: 'Estimated Jackpot:',
            officialResults: 'Official Results',
            howToPlay: 'How to Play',
            noInfoAvailable: 'No info available for this lottery. Please check the official website.',
            save: 'Save',
            share: 'Share',
            personalizedLuckyPick: 'Personalized Lucky Pick',
            randomLuckyPick: 'Random Lucky Pick',
            set: 'Set #',
            advertisement: 'Advertisement'
        },
        es: {
            title: 'Generador de Números de Lotería',
            subtitle: 'Genera números aleatorios para varios juegos de lotería',
            aiLuckyPick: 'Selección Afortunada IA',
            birthdayPlaceholder: 'Tu Cumpleaños (opcional)',
            zodiacPlaceholder: 'Zodiaco (opcional)',
            aiLuckyPickBtn: 'Selección Afortunada IA',
            selectLotteryType: 'Seleccionar Tipo de Lotería',
            minNumber: 'Número Mínimo',
            maxNumber: 'Número Máximo',
            numberCount: 'Cantidad de Números',
            specialNumber: 'Número Especial (Opcional)',
            setCount: 'Cantidad de Conjuntos',
            generateBtn: 'Generar Números',
            resetBtn: 'Reiniciar',
            generatedNumbers: 'Números Generados',
            downloadNumbers: 'Descargar Números',
            aboutTitle: 'Acerca del Generador de Números de Lotería',
            aboutText: 'Esta herramienta te ayuda a generar números aleatorios de lotería para varios juegos. Características incluyen:',
            multipleTypes: 'Múltiples tipos de lotería',
            customSettings: 'Configuración personalizada de números',
            multipleSets: 'Múltiples conjuntos de números',
            pdfDownload: 'Descarga en PDF',
            usageTips: 'Consejos de Uso',
            tip1: 'Selecciona tu tipo de lotería preferido',
            tip2: 'Personaliza rangos de números si es necesario',
            tip3: 'Genera múltiples conjuntos para variedad',
            tip4: 'Descarga tus números para referencia futura',
            lotteryInfo: 'Información y Resultados de Lotería',
            nextDraw: 'Próximo Sorteo:',
            estimatedJackpot: 'Premio Estimado:',
            officialResults: 'Resultados Oficiales',
            howToPlay: 'Cómo Jugar',
            noInfoAvailable: 'No hay información disponible para esta lotería. Por favor consulta el sitio web oficial.',
            save: 'Guardar',
            share: 'Compartir',
            personalizedLuckyPick: 'Selección Afortunada Personalizada',
            randomLuckyPick: 'Selección Afortunada Aleatoria',
            set: 'Conjunto #',
            advertisement: 'Publicidad'
        },
        fr: {
            title: 'Générateur de Numéros de Loterie',
            subtitle: 'Générez des numéros aléatoires pour divers jeux de loterie',
            aiLuckyPick: 'Choix Chanceux IA',
            birthdayPlaceholder: 'Votre Anniversaire (optionnel)',
            zodiacPlaceholder: 'Zodiaque (optionnel)',
            aiLuckyPickBtn: 'Choix Chanceux IA',
            selectLotteryType: 'Sélectionner le Type de Loterie',
            minNumber: 'Numéro Minimum',
            maxNumber: 'Numéro Maximum',
            numberCount: 'Nombre de Numéros',
            specialNumber: 'Numéro Spécial (Optionnel)',
            setCount: 'Nombre d\'Ensembles',
            generateBtn: 'Générer les Numéros',
            resetBtn: 'Réinitialiser',
            generatedNumbers: 'Numéros Générés',
            downloadNumbers: 'Télécharger les Numéros',
            aboutTitle: 'À Propos du Générateur de Numéros de Loterie',
            aboutText: 'Cet outil vous aide à générer des numéros aléatoires de loterie pour divers jeux. Fonctionnalités incluent:',
            multipleTypes: 'Types de loterie multiples',
            customSettings: 'Paramètres de numéros personnalisés',
            multipleSets: 'Ensembles de numéros multiples',
            pdfDownload: 'Téléchargement PDF',
            usageTips: 'Conseils d\'Utilisation',
            tip1: 'Sélectionnez votre type de loterie préféré',
            tip2: 'Personnalisez les plages de numéros si nécessaire',
            tip3: 'Générez plusieurs ensembles pour la variété',
            tip4: 'Téléchargez vos numéros pour référence future',
            lotteryInfo: 'Informations et Résultats de Loterie',
            nextDraw: 'Prochain Tirage:',
            estimatedJackpot: 'Jackpot Estimé:',
            officialResults: 'Résultats Officiels',
            howToPlay: 'Comment Jouer',
            noInfoAvailable: 'Aucune information disponible pour cette loterie. Veuillez consulter le site web officiel.',
            save: 'Sauvegarder',
            share: 'Partager',
            personalizedLuckyPick: 'Choix Chanceux Personnalisé',
            randomLuckyPick: 'Choix Chanceux Aléatoire',
            set: 'Ensemble #',
            advertisement: 'Publicité'
        },
        hi: {
            title: 'लॉटरी नंबर जनरेटर',
            subtitle: 'विभिन्न लॉटरी खेलों के लिए यादृच्छिक संख्याएं उत्पन्न करें',
            aiLuckyPick: 'एआई लकी पिक',
            birthdayPlaceholder: 'आपका जन्मदिन (वैकल्पिक)',
            zodiacPlaceholder: 'राशि (वैकल्पिक)',
            aiLuckyPickBtn: 'एआई लकी पिक',
            selectLotteryType: 'लॉटरी प्रकार चुनें',
            minNumber: 'न्यूनतम संख्या',
            maxNumber: 'अधिकतम संख्या',
            numberCount: 'संख्याओं की संख्या',
            specialNumber: 'विशेष संख्या (वैकल्पिक)',
            setCount: 'सेट की संख्या',
            generateBtn: 'संख्याएं उत्पन्न करें',
            resetBtn: 'रीसेट',
            generatedNumbers: 'उत्पन्न संख्याएं',
            downloadNumbers: 'संख्याएं डाउनलोड करें',
            aboutTitle: 'लॉटरी नंबर जनरेटर के बारे में',
            aboutText: 'यह टूल आपको विभिन्न लॉटरी खेलों के लिए यादृच्छिक संख्याएं उत्पन्न करने में मदद करता है। विशेषताएं शामिल हैं:',
            multipleTypes: 'कई लॉटरी प्रकार',
            customSettings: 'कस्टम संख्या सेटिंग्स',
            multipleSets: 'कई संख्या सेट',
            pdfDownload: 'पीडीएफ डाउनलोड',
            usageTips: 'उपयोग युक्तियां',
            tip1: 'अपना पसंदीदा लॉटरी प्रकार चुनें',
            tip2: 'आवश्यकतानुसार संख्या श्रेणियों को अनुकूलित करें',
            tip3: 'विविधता के लिए कई सेट उत्पन्न करें',
            tip4: 'भविष्य के संदर्भ के लिए अपनी संख्याएं डाउनलोड करें',
            lotteryInfo: 'लॉटरी जानकारी और परिणाम',
            nextDraw: 'अगला ड्रॉ:',
            estimatedJackpot: 'अनुमानित जैकपॉट:',
            officialResults: 'आधिकारिक परिणाम',
            howToPlay: 'कैसे खेलें',
            noInfoAvailable: 'इस लॉटरी के लिए कोई जानकारी उपलब्ध नहीं है। कृपया आधिकारिक वेबसाइट देखें।',
            save: 'सहेजें',
            share: 'साझा करें',
            personalizedLuckyPick: 'व्यक्तिगत लकी पिक',
            randomLuckyPick: 'यादृच्छिक लकी पिक',
            set: 'सेट #',
            advertisement: 'विज्ञापन'
        },
        zh: {
            title: '彩票号码生成器',
            subtitle: '为各种彩票游戏生成随机号码',
            aiLuckyPick: 'AI幸运选择',
            birthdayPlaceholder: '您的生日（可选）',
            zodiacPlaceholder: '星座（可选）',
            aiLuckyPickBtn: 'AI幸运选择',
            selectLotteryType: '选择彩票类型',
            minNumber: '最小号码',
            maxNumber: '最大号码',
            numberCount: '号码数量',
            specialNumber: '特殊号码（可选）',
            setCount: '组数',
            generateBtn: '生成号码',
            resetBtn: '重置',
            generatedNumbers: '生成的号码',
            downloadNumbers: '下载号码',
            aboutTitle: '关于彩票号码生成器',
            aboutText: '此工具帮助您为各种彩票游戏生成随机号码。功能包括：',
            multipleTypes: '多种彩票类型',
            customSettings: '自定义号码设置',
            multipleSets: '多组号码',
            pdfDownload: 'PDF下载',
            usageTips: '使用提示',
            tip1: '选择您喜欢的彩票类型',
            tip2: '根据需要自定义号码范围',
            tip3: '生成多组号码以获得多样性',
            tip4: '下载您的号码以供将来参考',
            lotteryInfo: '彩票信息和结果',
            nextDraw: '下次开奖：',
            estimatedJackpot: '预估奖金：',
            officialResults: '官方结果',
            howToPlay: '如何玩',
            noInfoAvailable: '此彩票暂无信息。请查看官方网站。',
            save: '保存',
            share: '分享',
            personalizedLuckyPick: '个性化幸运选择',
            randomLuckyPick: '随机幸运选择',
            set: '组 #',
            advertisement: '广告'
        }
    };

    // Translation function
    function translatePage(lang) {
        const currentTranslations = translations[lang] || translations.en;
        
        // Update all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (currentTranslations[key]) {
                element.textContent = currentTranslations[key];
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (currentTranslations[key]) {
                element.placeholder = currentTranslations[key];
            }
        });

        // Update specific elements
        const elementsToUpdate = {
            'resultsCard .card-header h5': 'generatedNumbers',
            'downloadBtn': 'downloadNumbers',
            'lotteryInfoCard .card-header h5': 'lotteryInfo',
            'aboutTitle': 'aboutTitle',
            'aboutText': 'aboutText',
            'usageTips': 'usageTips',
            'advertisement': 'advertisement'
        };

        Object.entries(elementsToUpdate).forEach(([selector, key]) => {
            const element = document.querySelector(selector);
            if (element && currentTranslations[key]) {
                element.textContent = currentTranslations[key];
            }
        });
    }

    // Language change event
    languageSelect.addEventListener('change', function() {
        translatePage(this.value);
    });

    // Initialize with default language
    translatePage('en');

    // Fun Extras Functionality
    const lotteryTrivia = [
        "The first recorded lottery was in China during the Han Dynasty (205-187 BC).",
        "The word 'lottery' comes from the Dutch word 'lot' meaning 'fate'.",
        "The largest lottery jackpot ever won was $1.586 billion in Powerball (2016).",
        "In ancient Rome, lotteries were used to distribute gifts during Saturnalia.",
        "The first US lottery was held in 1612 to fund the Jamestown colony.",
        "Some people believe that 7 is the luckiest number in lottery games.",
        "The odds of winning Powerball are 1 in 292,201,338.",
        "Lottery tickets are sold in over 100 countries worldwide.",
        "The first computerized lottery was introduced in 1980.",
        "Some lottery winners choose to remain anonymous.",
        "The most common lottery numbers are 1, 2, 3, 4, 5, 6 (but they rarely win).",
        "Lottery games generate over $80 billion annually worldwide.",
        "The oldest continuously running lottery is the Dutch Staatsloterij (1726).",
        "Some people use numerology to pick lottery numbers.",
        "The largest lottery organization is the European Lottery Association."
    ];

    const luckyColors = {
        red: [1, 7, 13, 19, 25, 31, 37, 43, 49],
        blue: [2, 8, 14, 20, 26, 32, 38, 44, 50],
        green: [3, 9, 15, 21, 27, 33, 39, 45, 51],
        yellow: [4, 10, 16, 22, 28, 34, 40, 46, 52],
        purple: [5, 11, 17, 23, 29, 35, 41, 47, 53],
        orange: [6, 12, 18, 24, 30, 36, 42, 48, 54]
    };

    const luckyDays = {
        monday: [1, 8, 15, 22, 29, 36, 43, 50],
        tuesday: [2, 9, 16, 23, 30, 37, 44, 51],
        wednesday: [3, 10, 17, 24, 31, 38, 45, 52],
        thursday: [4, 11, 18, 25, 32, 39, 46, 53],
        friday: [5, 12, 19, 26, 33, 40, 47, 54],
        saturday: [6, 13, 20, 27, 34, 41, 48, 55],
        sunday: [7, 14, 21, 28, 35, 42, 49, 56]
    };

    const luckyAnimals = {
        dragon: [1, 8, 15, 22, 29, 36, 43, 50],
        tiger: [2, 9, 16, 23, 30, 37, 44, 51],
        rabbit: [3, 10, 17, 24, 31, 38, 45, 52],
        snake: [4, 11, 18, 25, 32, 39, 46, 53],
        horse: [5, 12, 19, 26, 33, 40, 47, 54],
        goat: [6, 13, 20, 27, 34, 41, 48, 55],
        monkey: [7, 14, 21, 28, 35, 42, 49, 56]
    };

    // Initialize fun extras
    function initializeFunExtras() {
        loadHotColdNumbers();
        loadTrivia();
        loadStatistics();
    }

    // Hot & Cold Numbers
    function loadHotColdNumbers() {
        const hotNumbers = [7, 11, 23, 32, 44, 49, 3, 19, 27, 38];
        const coldNumbers = [1, 13, 25, 37, 50, 2, 15, 28, 41, 47];

        const hotContainer = document.getElementById('hotNumbers');
        const coldContainer = document.getElementById('coldNumbers');

        if (hotContainer) {
            hotContainer.innerHTML = hotNumbers.map(num => 
                `<span class="badge bg-danger">${num}</span>`
            ).join('');
        }

        if (coldContainer) {
            coldContainer.innerHTML = coldNumbers.map(num => 
                `<span class="badge bg-info">${num}</span>`
            ).join('');
        }
    }

    // Lottery Trivia
    function loadTrivia() {
        const triviaContainer = document.getElementById('lotteryTrivia');
        if (triviaContainer) {
            const randomTrivia = lotteryTrivia[Math.floor(Math.random() * lotteryTrivia.length)];
            triviaContainer.innerHTML = `<i class="fas fa-lightbulb me-2"></i>${randomTrivia}`;
        }
    }

    // New trivia button
    document.getElementById('newTriviaBtn')?.addEventListener('click', function() {
        loadTrivia();
        this.innerHTML = '<i class="fas fa-refresh me-1"></i>New Fact';
        this.classList.add('btn-success');
        setTimeout(() => {
            this.classList.remove('btn-success');
        }, 1000);
    });

    // Lucky Number Generator
    document.getElementById('luckyColorBtn')?.addEventListener('click', function() {
        const colors = Object.keys(luckyColors);
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const numbers = luckyColors[randomColor];
        const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
        
        showLuckyResult(`Your lucky color is <strong>${randomColor}</strong>!<br>Lucky number: <span class="badge bg-${randomColor}">${randomNumber}</span>`);
    });

    document.getElementById('luckyDayBtn')?.addEventListener('click', function() {
        const days = Object.keys(luckyDays);
        const randomDay = days[Math.floor(Math.random() * days.length)];
        const numbers = luckyDays[randomDay];
        const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
        
        showLuckyResult(`Your lucky day is <strong>${randomDay}</strong>!<br>Lucky number: <span class="badge bg-primary">${randomNumber}</span>`);
    });

    document.getElementById('luckyAnimalBtn')?.addEventListener('click', function() {
        const animals = Object.keys(luckyAnimals);
        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
        const numbers = luckyAnimals[randomAnimal];
        const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
        
        showLuckyResult(`Your lucky animal is <strong>${randomAnimal}</strong>!<br>Lucky number: <span class="badge bg-warning">${randomNumber}</span>`);
    });

    function showLuckyResult(content) {
        const resultDiv = document.getElementById('luckyResult');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-star me-2"></i>${content}
                </div>
            `;
            resultDiv.style.display = 'block';
            
            // Animate the result
            resultDiv.style.transform = 'scale(0.8)';
            setTimeout(() => {
                resultDiv.style.transform = 'scale(1)';
            }, 100);
        }
    }

    // Statistics Tracking
    function loadStatistics() {
        const today = new Date().toDateString();
        const stats = JSON.parse(localStorage.getItem('lotteryStats') || '{}');
        
        if (!stats[today]) {
            stats[today] = { numbers: 0, sets: 0 };
        }

        document.getElementById('totalNumbers').textContent = stats[today].numbers;
        document.getElementById('totalSets').textContent = stats[today].sets;
    }

    function updateStatistics(numbersGenerated, setsGenerated) {
        const today = new Date().toDateString();
        const stats = JSON.parse(localStorage.getItem('lotteryStats') || '{}');
        
        if (!stats[today]) {
            stats[today] = { numbers: 0, sets: 0 };
        }

        stats[today].numbers += numbersGenerated;
        stats[today].sets += setsGenerated;
        
        localStorage.setItem('lotteryStats', JSON.stringify(stats));
        loadStatistics();
    }

    // Enhanced number generation with statistics
    const originalGenerateNumbers = generateNumbers;
    generateNumbers = function(type, setCount) {
        const results = originalGenerateNumbers(type, setCount);
        
        // Calculate total numbers generated
        const totalNumbers = results.reduce((sum, set) => sum + set.mainNumbers.length + 1, 0);
        updateStatistics(totalNumbers, setCount);
        
        return results;
    };

    // Add animation to number generation
    function animateNumberGeneration() {
        const numbers = document.querySelectorAll('.badge');
        numbers.forEach((number, index) => {
            setTimeout(() => {
                number.style.transform = 'scale(1.2) rotate(5deg)';
                number.style.transition = 'all 0.3s ease';
                setTimeout(() => {
                    number.style.transform = 'scale(1) rotate(0deg)';
                }, 300);
            }, index * 100);
        });
    }

    // Enhanced render results with animation
    renderResults = function(results) {
        const container = document.getElementById('resultsContainer');
        container.innerHTML = results.map((set, index) => `
            <div class="number-set mb-4 p-3 border rounded position-relative">
                <h6 class="mb-3">Set #${index + 1}</h6>
                <div class="d-flex flex-wrap gap-2 mb-2">
                    ${set.mainNumbers.map(number => `
                        <span class="badge bg-primary p-2">${number}</span>
                    `).join('')}
                </div>
                <div class="mt-2">
                    <span class="badge bg-danger p-2">${set.specialName}: ${set.specialNumber}</span>
                </div>
                ${getShareLinks(set.mainNumbers, set.specialNumber, set.specialName)}
            </div>
        `).join('');
        // Add save event listeners
        container.querySelectorAll('.save-btn').forEach((btn, i) => {
            btn.addEventListener('click', function() {
                const setDiv = btn.closest('.number-set');
                html2canvas(setDiv).then(canvas => {
                    const link = document.createElement('a');
                    link.download = `lottery-set-${i+1}.png`;
                    link.href = canvas.toDataURL();
                    link.click();
                });
            });
        });
        setTimeout(animateNumberGeneration, 100);
    };

    // Add confetti effect for lucky picks
    function addConfetti() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.animation = 'fall 3s linear forwards';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
    }

    // Add CSS animation for confetti
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);

    // Add confetti to AI Lucky Pick
    const originalAILuckyPick = document.getElementById('aiLuckyPickBtn').onclick;
    document.getElementById('aiLuckyPickBtn').onclick = function(e) {
        if (originalAILuckyPick) {
            originalAILuckyPick.call(this, e);
        }
        setTimeout(addConfetti, 500);
    };

    // Initialize fun extras on page load
    initializeFunExtras();

    // User Engagement Features
    function initializeUserEngagement() {
        // Lottery Reminders
        document.getElementById('setReminderBtn')?.addEventListener('click', function() {
            const email = document.getElementById('reminderEmail').value;
            const lottery = document.getElementById('reminderLottery').value;
            
            if (!email) {
                showNotification('Please enter your email address', 'warning');
                return;
            }
            
            // Save reminder preference
            const reminders = JSON.parse(localStorage.getItem('lotteryReminders') || '[]');
            reminders.push({ email, lottery, date: new Date().toISOString() });
            localStorage.setItem('lotteryReminders', JSON.stringify(reminders));
            
            showNotification('Reminder set successfully! You\'ll be notified before draws.', 'success');
            this.innerHTML = '<i class="fas fa-check me-1"></i>Reminder Set';
            this.classList.add('btn-success');
        });

        // Calendar Integration
        document.getElementById('addToGoogleBtn')?.addEventListener('click', function() {
            const selectedLottery = lotteryTypeSelect.value;
            const info = lotteryInfoData[selectedLottery];
            if (info) {
                const event = {
                    title: `${selectedLottery.charAt(0).toUpperCase() + selectedLottery.slice(1)} Draw`,
                    description: `Next ${selectedLottery} draw with estimated jackpot of ${info.jackpot}`,
                    location: 'Online',
                    start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
                    end: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString()
                };
                
                const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&dates=${event.start.replace(/[-:]/g, '').split('.')[0]}/${event.end.replace(/[-:]/g, '').split('.')[0]}`;
                window.open(googleUrl, '_blank');
            }
        });

        document.getElementById('addToOutlookBtn')?.addEventListener('click', function() {
            const selectedLottery = lotteryTypeSelect.value;
            const info = lotteryInfoData[selectedLottery];
            if (info) {
                const event = {
                    subject: `${selectedLottery.charAt(0).toUpperCase() + selectedLottery.slice(1)} Draw`,
                    body: `Next ${selectedLottery} draw with estimated jackpot of ${info.jackpot}`,
                    start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    end: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString()
                };
                
                const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.subject)}&body=${encodeURIComponent(event.body)}&startdt=${event.start}&enddt=${event.end}`;
                window.open(outlookUrl, '_blank');
            }
        });

        document.getElementById('downloadIcalBtn')?.addEventListener('click', function() {
            const selectedLottery = lotteryTypeSelect.value;
            const info = lotteryInfoData[selectedLottery];
            if (info) {
                const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Multi-Tools Hub//Lottery Generator//EN
BEGIN:VEVENT
UID:${Date.now()}@lotterygenerator.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${selectedLottery.charAt(0).toUpperCase() + selectedLottery.slice(1)} Draw
DESCRIPTION:Next ${selectedLottery} draw with estimated jackpot of ${info.jackpot}
LOCATION:Online
END:VEVENT
END:VCALENDAR`;
                
                const blob = new Blob([icalContent], { type: 'text/calendar' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${selectedLottery}-draw.ics`;
                link.click();
                URL.revokeObjectURL(url);
            }
        });

        // Quick Actions
        document.getElementById('checkResultsBtn')?.addEventListener('click', function() {
            const selectedLottery = lotteryTypeSelect.value;
            const info = lotteryInfoData[selectedLottery];
            if (info && info.resultsUrl) {
                window.open(info.resultsUrl, '_blank');
            } else {
                showNotification('Results link not available for this lottery', 'info');
            }
        });

        document.getElementById('favoriteNumbersBtn')?.addEventListener('click', function() {
            const currentNumbers = document.querySelectorAll('.number-set');
            if (currentNumbers.length > 0) {
                const favorites = JSON.parse(localStorage.getItem('favoriteNumbers') || '[]');
                const newFavorite = {
                    id: Date.now(),
                    date: new Date().toISOString(),
                    lottery: lotteryTypeSelect.value,
                    numbers: Array.from(currentNumbers).map(set => {
                        const mainNumbers = Array.from(set.querySelectorAll('.badge.bg-primary')).map(badge => badge.textContent);
                        const specialNumber = set.querySelector('.badge.bg-danger')?.textContent.split(': ')[1];
                        return { mainNumbers, specialNumber };
                    })
                };
                
                favorites.push(newFavorite);
                localStorage.setItem('favoriteNumbers', JSON.stringify(favorites));
                showNotification('Numbers saved to favorites!', 'success');
                this.innerHTML = '<i class="fas fa-heart me-1"></i>Saved!';
                this.classList.add('btn-success');
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-heart me-1"></i>Save Favorites';
                    this.classList.remove('btn-success');
                }, 2000);
            } else {
                showNotification('Generate some numbers first!', 'warning');
            }
        });

        // Social Sharing
        document.getElementById('shareFacebookBtn')?.addEventListener('click', function() {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent('Check out this amazing lottery number generator! Generate random numbers for 200+ global lotteries.');
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
        });

        document.getElementById('shareTwitterBtn')?.addEventListener('click', function() {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent('Amazing lottery number generator! Generate random numbers for 200+ global lotteries 🎰');
            window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
        });

        document.getElementById('shareWhatsAppBtn')?.addEventListener('click', function() {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent('Check out this lottery number generator! Generate random numbers for 200+ global lotteries 🎰');
            window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
        });

        document.getElementById('shareEmailBtn')?.addEventListener('click', function() {
            const url = window.location.href;
            const subject = encodeURIComponent('Amazing Lottery Number Generator');
            const body = encodeURIComponent(`Hi! I found this great lottery number generator that supports 200+ global lotteries. Check it out: ${url}`);
            window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
        });

        // Check for saved favorites on page load
        loadSavedFavorites();
    }

    // Load saved favorites
    function loadSavedFavorites() {
        const favorites = JSON.parse(localStorage.getItem('favoriteNumbers') || '[]');
        if (favorites.length > 0) {
            // Add a small indicator that favorites exist
            const favoriteBtn = document.getElementById('favoriteNumbersBtn');
            if (favoriteBtn) {
                favoriteBtn.innerHTML = `<i class="fas fa-heart me-1"></i>Save Favorites (${favorites.length})`;
            }
        }
    }

    // Show favorites modal
    function showFavoritesModal() {
        const favorites = JSON.parse(localStorage.getItem('favoriteNumbers') || '[]');
        if (favorites.length === 0) {
            showNotification('No saved favorites yet!', 'info');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Saved Favorites</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${favorites.map(fav => `
                            <div class="card mb-3">
                                <div class="card-body">
                                    <h6>${fav.lottery} - ${new Date(fav.date).toLocaleDateString()}</h6>
                                    ${fav.numbers.map((set, index) => `
                                        <div class="mb-2">
                                            <strong>Set ${index + 1}:</strong>
                                            <div class="d-flex flex-wrap gap-1 mt-1">
                                                ${set.mainNumbers.map(num => `<span class="badge bg-primary">${num}</span>`).join('')}
                                                <span class="badge bg-danger">${set.specialNumber}</span>
                                            </div>
                                        </div>
                                    `).join('')}
                                    <button class="btn btn-sm btn-outline-danger" onclick="deleteFavorite(${fav.id})">
                                        <i class="fas fa-trash me-1"></i>Delete
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        new bootstrap.Modal(modal).show();
        modal.addEventListener('hidden.bs.modal', () => modal.remove());
    }

    // Delete favorite
    window.deleteFavorite = function(id) {
        const favorites = JSON.parse(localStorage.getItem('favoriteNumbers') || '[]');
        const updatedFavorites = favorites.filter(fav => fav.id !== id);
        localStorage.setItem('favoriteNumbers', JSON.stringify(updatedFavorites));
        showNotification('Favorite deleted!', 'success');
        location.reload(); // Refresh to update the count
    };

    // Add favorites button to quick actions
    const quickActionsDiv = document.querySelector('.row.g-2');
    if (quickActionsDiv) {
        const viewFavoritesBtn = document.createElement('div');
        viewFavoritesBtn.className = 'col-md-6';
        viewFavoritesBtn.innerHTML = `
            <button class="btn btn-outline-warning w-100" id="viewFavoritesBtn">
                <i class="fas fa-star me-1"></i>View Favorites
            </button>
        `;
        quickActionsDiv.appendChild(viewFavoritesBtn);
        
        document.getElementById('viewFavoritesBtn')?.addEventListener('click', showFavoritesModal);
    }

    // Initialize user engagement features
    initializeUserEngagement();

    // Accessibility Features
    function initializeAccessibility() {
        // Skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'sr-only sr-only-focusable';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = 'position: absolute; top: -40px; left: 6px; z-index: 1000; background: #007bff; color: white; padding: 8px; text-decoration: none;';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content landmark
        const mainContent = document.querySelector('.container');
        if (mainContent) {
            mainContent.id = 'main-content';
            mainContent.setAttribute('role', 'main');
        }

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            // Escape key to close modals/prompts
            if (e.key === 'Escape') {
                const pwaPrompt = document.getElementById('pwaInstallPrompt');
                if (pwaPrompt && pwaPrompt.style.display === 'block') {
                    pwaPrompt.style.display = 'none';
                }
            }

            // Ctrl/Cmd + Enter to generate numbers
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('generatorForm').dispatchEvent(new Event('submit'));
            }

            // Ctrl/Cmd + L for AI Lucky Pick
            if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
                e.preventDefault();
                document.getElementById('aiLuckyPickBtn').click();
            }

            // Ctrl/Cmd + R to reset
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                document.getElementById('resetBtn').click();
            }
        });

        // Focus management for dynamic content
        function announceToScreenReader(message) {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            announcement.textContent = message;
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                announcement.remove();
            }, 1000);
        }

        // Enhanced form submission with accessibility
        const originalSubmit = generatorForm.onsubmit;
        generatorForm.onsubmit = function(e) {
            e.preventDefault();
            const type = lotteryTypeSelect.value;
            const setCount = parseInt(document.getElementById('setCount').value);
            const results = generateNumbers(type, setCount);
            renderResults(results);
            resultsCard.style.display = 'block';
            
            // Announce results to screen readers
            announceToScreenReader(`Generated ${setCount} set${setCount > 1 ? 's' : ''} of lottery numbers for ${type}`);
            
            // Focus on results
            setTimeout(() => {
                const firstResult = document.querySelector('.number-set');
                if (firstResult) {
                    firstResult.focus();
                }
            }, 100);
        };

        // Enhanced AI Lucky Pick with accessibility
        const originalAILuckyPick = document.getElementById('aiLuckyPickBtn').onclick;
        document.getElementById('aiLuckyPickBtn').onclick = function(e) {
            if (originalAILuckyPick) {
                originalAILuckyPick.call(this, e);
            }
            announceToScreenReader('AI Lucky Pick generated. Check the results below.');
            setTimeout(addConfetti, 500);
        };

        // Add focus indicators for better keyboard navigation
        const focusableElements = document.querySelectorAll('button, input, select, textarea, a[href], [tabindex]');
        focusableElements.forEach(element => {
            element.addEventListener('focus', function() {
                this.style.outline = '2px solid #007bff';
                this.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', function() {
                this.style.outline = '';
                this.style.outlineOffset = '';
            });
        });

        // High contrast mode support
        function toggleHighContrast() {
            document.body.classList.toggle('high-contrast');
            localStorage.setItem('highContrast', document.body.classList.contains('high-contrast'));
        }

        // Add high contrast toggle button
        const contrastBtn = document.createElement('button');
        contrastBtn.className = 'btn btn-outline-secondary btn-sm position-fixed';
        contrastBtn.style.cssText = 'top: 10px; right: 10px; z-index: 1000;';
        contrastBtn.innerHTML = '<i class="fas fa-adjust"></i>';
        contrastBtn.setAttribute('aria-label', 'Toggle high contrast mode');
        contrastBtn.onclick = toggleHighContrast;
        document.body.appendChild(contrastBtn);

        // Load high contrast preference
        if (localStorage.getItem('highContrast') === 'true') {
            document.body.classList.add('high-contrast');
        }

        // Add high contrast CSS
        const highContrastCSS = `
            .high-contrast {
                filter: contrast(150%) brightness(110%);
            }
            .high-contrast .btn {
                border-width: 3px !important;
            }
            .high-contrast .badge {
                border: 2px solid #000 !important;
            }
        `;
        const style = document.createElement('style');
        style.textContent = highContrastCSS;
        document.head.appendChild(style);

        // Enhanced error handling with accessibility
        window.addEventListener('error', function(e) {
            announceToScreenReader('An error occurred. Please try again.');
        });

        // Add loading states for better UX
        function showLoadingState(element) {
            const originalText = element.textContent;
            element.disabled = true;
            element.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating...';
            
            setTimeout(() => {
                element.disabled = false;
                element.innerHTML = originalText;
            }, 2000);
        }

        // Apply loading state to generate button
        document.querySelector('button[type="submit"]').addEventListener('click', function() {
            showLoadingState(this);
        });

        // Add keyboard shortcuts help
        const shortcutsHelp = document.createElement('div');
        shortcutsHelp.className = 'alert alert-info mt-3';
        shortcutsHelp.innerHTML = `
            <h6><i class="fas fa-keyboard me-2"></i>Keyboard Shortcuts</h6>
            <ul class="mb-0 small">
                <li><kbd>Ctrl/Cmd + Enter</kbd> - Generate numbers</li>
                <li><kbd>Ctrl/Cmd + L</kbd> - AI Lucky Pick</li>
                <li><kbd>Ctrl/Cmd + R</kbd> - Reset form</li>
                <li><kbd>Escape</kbd> - Close prompts</li>
            </ul>
        `;
        document.querySelector('.card-body').appendChild(shortcutsHelp);
    }

    // Initialize accessibility features
    initializeAccessibility();

    // Helper: get config or fallback
    function getLotteryConfig(type) {
        return lotteryConfigs[type] || { min: 1, max: 49, count: 6, specialMin: 1, specialMax: 49, specialName: 'Bonus' };
    }

    // Show/hide custom settings
    lotteryTypeSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customSettings.style.display = 'block';
        } else {
            customSettings.style.display = 'none';
            updateCustomSettings(this.value);
        }
    });

    // Update custom settings based on lottery type
    function updateCustomSettings(type) {
        const config = lotteryConfigs[type];
        if (config) {
            document.getElementById('minNumber').value = config.min;
            document.getElementById('maxNumber').value = config.max;
            document.getElementById('numberCount').value = config.count;
            document.getElementById('specialNumber').value = config.specialMin;
        }
    }

    // Generate random number between min and max
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Generate unique random numbers
    function generateUniqueNumbers(min, max, count) {
        const numbers = new Set();
        while (numbers.size < count) {
            numbers.add(getRandomNumber(min, max));
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    // Generate lottery numbers
    function generateNumbers(type, setCount) {
        const results = [];
        const config = type === 'custom' ? {
            min: parseInt(document.getElementById('minNumber').value),
            max: parseInt(document.getElementById('maxNumber').value),
            count: parseInt(document.getElementById('numberCount').value),
            specialMin: parseInt(document.getElementById('specialNumber').value),
            specialMax: parseInt(document.getElementById('specialNumber').value),
            specialName: 'Special Number'
        } : getLotteryConfig(type);

        for (let i = 0; i < setCount; i++) {
            const mainNumbers = generateUniqueNumbers(config.min, config.max, config.count);
            const specialNumber = getRandomNumber(config.specialMin, config.specialMax);
            results.push({
                mainNumbers,
                specialNumber,
                specialName: config.specialName
            });
        }

        return results;
    }

    // Helper: create share links
    function getShareLinks(numbers, special, specialName) {
        const numStr = `Numbers: ${numbers.join(', ')} | ${specialName}: ${special}`;
        const text = encodeURIComponent(`Check out my lucky lottery numbers!\n${numStr}\nTry it: https://yourdomain.com/tools/miscellaneous/lottery-number-generator.html`);
        return `
            <div class="d-flex gap-2 mt-2">
                <button class="btn btn-outline-success btn-sm save-btn"><i class="fas fa-download me-1"></i>Save</button>
                <a href="https://wa.me/?text=${text}" target="_blank" class="btn btn-outline-success btn-sm"><i class="fab fa-whatsapp me-1"></i>WhatsApp</a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=https://yourdomain.com/tools/miscellaneous/lottery-number-generator.html&quote=${text}" target="_blank" class="btn btn-outline-primary btn-sm"><i class="fab fa-facebook me-1"></i>Facebook</a>
                <a href="https://twitter.com/intent/tweet?text=${text}" target="_blank" class="btn btn-outline-info btn-sm"><i class="fab fa-twitter me-1"></i>Twitter</a>
            </div>
        `;
    }

    // Form submission
    generatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const type = lotteryTypeSelect.value;
        const setCount = parseInt(document.getElementById('setCount').value);
        const results = generateNumbers(type, setCount);
        renderResults(results);
        resultsCard.style.display = 'block';
    });

    // Download results
    downloadBtn.addEventListener('click', function() {
        const element = document.getElementById('resultsCard');
        const opt = {
            margin: 1,
            filename: 'lottery-numbers.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    });

    // Reset form
    resetBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
            generatorForm.reset();
            customSettings.style.display = 'none';
            resultsCard.style.display = 'none';
        }
    });

    // AI Lucky Pick Feature
    document.getElementById('aiLuckyPickBtn').addEventListener('click', function() {
        const type = lotteryTypeSelect.value;
        const birthday = document.getElementById('userBirthday').value;
        const zodiac = document.getElementById('userZodiac').value;
        const config = getLotteryConfig(type);

        // Seeded random for fun: use birthday/zodiac if present
        let seed = Date.now();
        if (birthday) {
            seed += new Date(birthday).getTime();
        }
        if (zodiac) {
            seed += zodiac.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        }
        function seededRandom(min, max) {
            seed = (seed * 9301 + 49297) % 233280;
            const rnd = seed / 233280;
            return Math.floor(min + rnd * (max - min + 1));
        }
        function seededUniqueNumbers(min, max, count) {
            const numbers = new Set();
            while (numbers.size < count) {
                numbers.add(seededRandom(min, max));
            }
            return Array.from(numbers).sort((a, b) => a - b);
        }
        const mainNumbers = seededUniqueNumbers(config.min, config.max, config.count);
        const specialNumber = seededRandom(config.specialMin, config.specialMax);
        // Render result
        const resultDiv = document.getElementById('aiLuckyPickResult');
        resultDiv.innerHTML = `
            <div class="number-set mb-2 p-2 border rounded bg-light position-relative">
                <div class="d-flex flex-wrap gap-2 mb-2">
                    ${mainNumbers.map(number => `<span class='badge bg-success p-2'>${number}</span>`).join('')}
                </div>
                <div class="mt-2">
                    <span class="badge bg-warning text-dark p-2">${config.specialName}: ${specialNumber}</span>
                </div>
                <div class="small text-muted mt-1">${birthday || zodiac ? 'Personalized Lucky Pick' : 'Random Lucky Pick'}</div>
                ${getShareLinks(mainNumbers, specialNumber, config.specialName)}
            </div>
        `;
        resultDiv.style.display = 'block';
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add save event listener
        const saveBtn = resultDiv.querySelector('.save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                const setDiv = saveBtn.closest('.number-set');
                html2canvas(setDiv).then(canvas => {
                    const link = document.createElement('a');
                    link.download = `lucky-pick.png`;
                    link.href = canvas.toDataURL();
                    link.click();
                });
            });
        }
    });

    // Sample lottery info data (extend as needed)
    const lotteryInfoData = {
        powerball: {
            drawDate: 'Wednesday & Saturday, 10:59 PM ET',
            jackpot: '$100 Million (est.)',
            resultsUrl: 'https://www.powerball.com/',
            rulesUrl: 'https://www.powerball.com/how-to-play'
        },
        megaMillions: {
            drawDate: 'Tuesday & Friday, 11:00 PM ET',
            jackpot: '$80 Million (est.)',
            resultsUrl: 'https://www.megamillions.com/',
            rulesUrl: 'https://www.megamillions.com/How-to-Play.aspx'
        },
        euroMillions: {
            drawDate: 'Tuesday & Friday, 8:45 PM CET',
            jackpot: '€50 Million (est.)',
            resultsUrl: 'https://www.national-lottery.com/euromillions/results',
            rulesUrl: 'https://www.national-lottery.com/euromillions/how-to-play'
        },
        ukLotto: {
            drawDate: 'Wednesday & Saturday, 8:00 PM GMT',
            jackpot: '£5 Million (est.)',
            resultsUrl: 'https://www.national-lottery.com/lotto/results',
            rulesUrl: 'https://www.national-lottery.com/lotto/how-to-play'
        },
        lottoMax: {
            drawDate: 'Friday, 10:30 PM ET',
            jackpot: 'CA$60 Million (est.)',
            resultsUrl: 'https://www.lottomaxnumbers.com/',
            rulesUrl: 'https://www.lottomaxnumbers.com/how-to-play'
        },
        ozLotto: {
            drawDate: 'Tuesday, 8:30 PM AEST',
            jackpot: 'AU$10 Million (est.)',
            resultsUrl: 'https://www.ozlotteries.com/oz-lotto/results',
            rulesUrl: 'https://www.ozlotteries.com/oz-lotto/how-to-play'
        },
        // ... add more as needed ...
    };

    function showLotteryInfo(type) {
        const info = lotteryInfoData[type];
        const card = document.getElementById('lotteryInfoCard');
        const content = document.getElementById('lotteryInfoContent');
        if (info) {
            content.innerHTML = `
                <ul class="list-unstyled mb-2">
                    <li><strong>Next Draw:</strong> ${info.drawDate}</li>
                    <li><strong>Estimated Jackpot:</strong> ${info.jackpot}</li>
                </ul>
                <a href="${info.resultsUrl}" target="_blank" class="btn btn-primary btn-sm me-2"><i class="fas fa-trophy me-1"></i>Official Results</a>
                <a href="${info.rulesUrl}" target="_blank" class="btn btn-outline-secondary btn-sm"><i class="fas fa-book me-1"></i>How to Play</a>
            `;
            card.style.display = 'block';
        } else {
            content.innerHTML = `<div class='text-muted'>No info available for this lottery. Please check the official website.</div>`;
            card.style.display = 'block';
        }
    }

    // Show info on type change
    lotteryTypeSelect.addEventListener('change', function() {
        showLotteryInfo(this.value);
    });
    // Show info on page load
    showLotteryInfo(lotteryTypeSelect.value);

    // Initialize
    updateCustomSettings(lotteryTypeSelect.value);

    // PWA Functionality
    let deferredPrompt;

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('../../assets/js/sw.js')
                .then((registration) => {
                    console.log('SW registered: ', registration);
                })
                .catch((registrationError) => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

    // PWA Install Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install prompt after 3 seconds
        setTimeout(() => {
            const installPrompt = document.getElementById('pwaInstallPrompt');
            if (installPrompt && !localStorage.getItem('pwaInstallDismissed')) {
                installPrompt.style.display = 'block';
            }
        }, 3000);
    });

    // Install button click
    document.getElementById('installBtn')?.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
            document.getElementById('pwaInstallPrompt').style.display = 'none';
        }
    });

    // Dismiss install prompt
    document.getElementById('dismissInstall')?.addEventListener('click', () => {
        document.getElementById('pwaInstallPrompt').style.display = 'none';
        localStorage.setItem('pwaInstallDismissed', 'true');
    });

    // Mobile-specific features
    if ('ontouchstart' in window) {
        // Add touch feedback
        document.querySelectorAll('.btn, .badge').forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            element.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
        });

        // Optimize for mobile scrolling
        document.addEventListener('touchmove', function(e) {
            if (e.target.closest('.form-select, .form-control')) {
                e.stopPropagation();
            }
        }, { passive: true });
    }

    // Add vibration feedback (if supported)
    function vibrate() {
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }

    // Add vibration to button clicks
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', vibrate);
    });

    // Mobile-friendly number generation animation
    function animateNumberGeneration() {
        const numbers = document.querySelectorAll('.badge');
        numbers.forEach((number, index) => {
            setTimeout(() => {
                number.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    number.style.transform = 'scale(1)';
                }, 200);
            }, index * 100);
        });
    }

    // Mobile swipe gestures for quick actions
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - generate new numbers
                if (document.getElementById('generatorForm')) {
                    document.getElementById('generatorForm').dispatchEvent(new Event('submit'));
                }
            } else {
                // Swipe right - AI lucky pick
                if (document.getElementById('aiLuckyPickBtn')) {
                    document.getElementById('aiLuckyPickBtn').click();
                }
            }
        }
    }

    // Add offline support
    window.addEventListener('online', function() {
        document.body.classList.remove('offline');
        showNotification('You are back online!', 'success');
    });

    window.addEventListener('offline', function() {
        document.body.classList.add('offline');
        showNotification('You are offline. Some features may not work.', 'warning');
    });

    // Simple notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Add keyboard shortcuts for mobile
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && document.activeElement.tagName === 'SELECT') {
            e.preventDefault();
            document.getElementById('generatorForm').dispatchEvent(new Event('submit'));
        }
    });

    // Optimize for mobile performance
    if ('connection' in navigator) {
        if (navigator.connection.effectiveType === 'slow-2g' || navigator.connection.effectiveType === '2g') {
            // Disable animations for slow connections
            document.body.style.setProperty('--animation-duration', '0s');
        }
    }

    // Add mobile-specific error handling
    window.addEventListener('error', function(e) {
        if (e.error && e.error.message.includes('QuotaExceededError')) {
            showNotification('Storage limit reached. Please clear some data.', 'warning');
        }
    });

    // Mobile-friendly copy to clipboard
    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('Copied to clipboard!', 'success');
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showNotification('Copied to clipboard!', 'success');
            } catch (err) {
                showNotification('Failed to copy to clipboard', 'error');
            }
            document.body.removeChild(textArea);
        }
    }

    // Add copy button to results
    function addCopyButtons() {
        document.querySelectorAll('.number-set').forEach(set => {
            if (!set.querySelector('.copy-btn')) {
                const copyBtn = document.createElement('button');
                copyBtn.className = 'btn btn-outline-info btn-sm copy-btn';
                copyBtn.innerHTML = '<i class="fas fa-copy me-1"></i>Copy';
                copyBtn.onclick = () => {
                    const numbers = Array.from(set.querySelectorAll('.badge')).map(badge => badge.textContent).join(', ');
                    copyToClipboard(numbers);
                };
                set.appendChild(copyBtn);
            }
        });
    }

    // Call addCopyButtons after rendering results
    renderResults = function(results) {
        renderResults(results);
        setTimeout(addCopyButtons, 100);
    };

}); 
