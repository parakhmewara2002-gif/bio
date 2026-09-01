/*==========================================================
                LANGUAGE.JS (v2 — rebuilt from scratch)
    A working Hindi/English toggle for the landing page.
    Elements tagged with data-i18n="key" get their text
    swapped based on the selected language. Persists choice
    in localStorage. Does not touch form field values.
==========================================================*/

const I18N_STRINGS = {

    en: {
        nav_home: "Home",
        nav_features: "Features",
        nav_preview: "Preview",
        nav_faq: "FAQ",

        hero_badge: "✨ Welcome to Biodata & Resume Studio ✨",
        hero_title_1: "Create Your",
        hero_title_highlight: "Biodata or Resume",
        hero_title_2: "In Minutes",
        hero_subtitle: "Design a beautiful, professional biodata or resume — free, no login, with Hindi & English support and instant PDF download.",
        hero_card_biodata_title: "Create Biodata",
        hero_card_biodata_desc: "Matrimonial biodata with photo, family details & astrological info",
        hero_card_resume_title: "Create Resume",
        hero_card_resume_desc: "Professional resume with education, experience & skills",

        section_why_choose: "Why Choose Us?",
        section_sample_preview: "Sample Biodata Preview",
        section_how_it_works: "How It Works",
        section_faq: "Frequently Asked Questions"
    },

    hi: {
        nav_home: "होम",
        nav_features: "विशेषताएं",
        nav_preview: "पूर्वावलोकन",
        nav_faq: "सामान्य प्रश्न",

        hero_badge: "✨ Biodata & Resume Studio में आपका स्वागत है ✨",
        hero_title_1: "अपना",
        hero_title_highlight: "बायोडाटा या रिज़्यूमे",
        hero_title_2: "मिनटों में बनाएं",
        hero_subtitle: "एक सुंदर, पेशेवर बायोडाटा या रिज़्यूमे बनाएं — बिल्कुल मुफ़्त, बिना लॉगिन के, हिंदी और अंग्रेज़ी दोनों में, तुरंत PDF डाउनलोड के साथ।",
        hero_card_biodata_title: "बायोडाटा बनाएं",
        hero_card_biodata_desc: "फोटो, परिवार के विवरण और ज्योतिष जानकारी के साथ वैवाहिक बायोडाटा",
        hero_card_resume_title: "रिज़्यूमे बनाएं",
        hero_card_resume_desc: "शिक्षा, अनुभव और कौशल के साथ पेशेवर रिज़्यूमे",

        section_why_choose: "हमें क्यों चुनें?",
        section_sample_preview: "नमूना बायोडाटा पूर्वावलोकन",
        section_how_it_works: "यह कैसे काम करता है",
        section_faq: "अक्सर पूछे जाने वाले प्रश्न"
    }

};


function getStoredLanguage() {

    try {
        return localStorage.getItem("biodataStudioLanguage");
    } catch (e) {
        return null;
    }

}


function storeLanguage(lang) {

    try {
        localStorage.setItem("biodataStudioLanguage", lang);
    } catch (e) {
        // localStorage unavailable — choice just won't persist
    }

}


function applyLanguage(lang) {

    const dict = I18N_STRINGS[lang] || I18N_STRINGS.en;

    document.querySelectorAll("[data-i18n]").forEach((el) => {

        const key = el.getAttribute("data-i18n");

        if (dict[key]) {

            el.textContent = dict[key];

        }

    });

    document.documentElement.setAttribute("lang", lang === "hi" ? "hi" : "en");

    const label = document.getElementById("languageToggleLabel");

    if (label) label.textContent = lang === "hi" ? "EN" : "हिं";

}


function initializeLanguageToggle() {

    const stored = getStoredLanguage() || "en";

    applyLanguage(stored);

    const toggle = document.getElementById("languageToggle");

    if (toggle) {

        toggle.addEventListener("click", () => {

            const current = document.documentElement.getAttribute("lang") === "hi" ? "hi" : "en";
            const next = current === "hi" ? "en" : "hi";

            applyLanguage(next);
            storeLanguage(next);

        });

    }

}


document.addEventListener("DOMContentLoaded", initializeLanguageToggle);
