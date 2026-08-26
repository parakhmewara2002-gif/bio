/*==========================================================
                APP.JS
                STEP 20 - NAVBAR
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeNavbar();

});


/*==========================================================
                INITIALIZE NAVBAR
==========================================================*/

function initializeNavbar(){

    const navbar = document.querySelector(".custom-navbar");

    const navLinks = document.querySelectorAll(".nav-link");

    const navbarCollapse = document.querySelector(".navbar-collapse");

    const bsCollapse = navbarCollapse
        ? new bootstrap.Collapse(navbarCollapse, {
            toggle: false
        })
        : null;


    /*==========================================
            NAVBAR SHADOW ON SCROLL
    ==========================================*/

    window.addEventListener("scroll", () => {

        if(window.scrollY > 40){

            navbar.style.boxShadow =
                "0 8px 25px rgba(0,0,0,.20)";

        }

        else{

            navbar.style.boxShadow =
                "0 4px 18px rgba(0,0,0,.15)";

        }

    });


    /*==========================================
            SMOOTH SCROLL
    ==========================================*/

    navLinks.forEach(link => {

        link.addEventListener("click", function(e){

            const targetId = this.getAttribute("href");

            if(!targetId.startsWith("#")) return;

            const target = document.querySelector(targetId);

            if(target){

                e.preventDefault();

                target.scrollIntoView({

                    behavior:"smooth",

                    block:"start"

                });

            }

            /*==========================
                CLOSE MOBILE MENU
            ==========================*/

            if(window.innerWidth < 992 && bsCollapse){

                bsCollapse.hide();

            }

        });

    });


    /*==========================================
            ACTIVE MENU HIGHLIGHT
    ==========================================*/

    const sections = document.querySelectorAll("section");

    window.addEventListener("scroll", () => {

        let current = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 120;

            if(window.scrollY >= sectionTop){

                current = section.getAttribute("id");

            }

        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            if(link.getAttribute("href") === "#" + current){

                link.classList.add("active");

            }

        });

    });

}


/*==========================================================
            STEP 21 - SCROLL TO TOP BUTTON
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeScrollTopButton();

});


/*==========================================================
            INITIALIZE SCROLL BUTTON
==========================================================*/

function initializeScrollTopButton(){

    const scrollTopBtn = document.getElementById("scrollTopBtn");

    if(!scrollTopBtn){

        return;

    }

    /*==========================================
            SHOW / HIDE BUTTON
    ==========================================*/

    window.addEventListener("scroll", () => {

        if(window.scrollY > 300){

            scrollTopBtn.classList.add("show");

        }

        else{

            scrollTopBtn.classList.remove("show");

        }

    });

    /*==========================================
            SCROLL TO TOP
    ==========================================*/

    scrollTopBtn.addEventListener("click", () => {

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

}



/*==========================================================
            STEP 22 - FAQ & TOAST
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeFAQ();

    initializeToast();

    initializeLearnMoreButton();

});


/*==========================================================
                LEARN MORE BUTTON
==========================================================*/

function initializeLearnMoreButton(){

    const button = document.getElementById("learnMoreBtn");

    if(!button){

        return;

    }

    button.addEventListener("click", () => {

        const target = document.getElementById("features");

        if(target){

            target.scrollIntoView({ behavior: "smooth" });

        }

    });

}


/*==========================================================
                FAQ ACCORDION
==========================================================*/

function initializeFAQ(){

    const accordionButtons = document.querySelectorAll(".accordion-button");

    accordionButtons.forEach(button => {

        button.addEventListener("click", () => {

            button.blur();

        });

    });

}


/*==========================================================
                TOAST NOTIFICATION
==========================================================*/

function initializeToast(){

    const toastElement = document.getElementById("appToast");

    if(!toastElement){

        return;

    }

    const toast = new bootstrap.Toast(toastElement, {

        delay:3500

    });

    setTimeout(() => {

        toast.show();

    },800);

}



/*==========================================================
            STEP 23 - THEME TOGGLE
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeTheme();

});


/*==========================================================
                INITIALIZE THEME
==========================================================*/

function initializeTheme(){

    const themeButton = document.getElementById("themeBtn");

    if(!themeButton){

        return;

    }

    /*==========================================
            LOAD SAVED THEME
    ==========================================*/

    const savedTheme = localStorage.getItem("theme");

    if(savedTheme === "dark"){

        enableDarkTheme();

    }

    else{

        enableLightTheme();

    }

    /*==========================================
            BUTTON CLICK
    ==========================================*/

    themeButton.addEventListener("click", () => {

        if(document.body.classList.contains("dark-theme")){

            enableLightTheme();

        }

        else{

            enableDarkTheme();

        }

    });

}


/*==========================================================
                DARK THEME
==========================================================*/

function enableDarkTheme(){

    document.body.classList.add("dark-theme");

    localStorage.setItem("theme","dark");

    const button = document.getElementById("themeBtn");

    if(button){

        button.innerHTML = "☀️";

    }

}


/*==========================================================
                LIGHT THEME
==========================================================*/

function enableLightTheme(){

    document.body.classList.remove("dark-theme");

    localStorage.setItem("theme","light");

    const button = document.getElementById("themeBtn");

    if(button){

        button.innerHTML = "🌙";

    }

}



/*==========================================================
            STEP 24 - LANGUAGE TOGGLE
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeLanguage();

});


/*==========================================================
            INITIALIZE LANGUAGE
==========================================================*/

function initializeLanguage(){

    const languageButton = document.getElementById("languageBtn");

    if(!languageButton){

        return;

    }

    /*==========================================
            LOAD SAVED LANGUAGE
    ==========================================*/

    const savedLanguage = localStorage.getItem("language") || "en";

    updateLanguageButton(savedLanguage);

    /*==========================================
            BUTTON CLICK
    ==========================================*/

    languageButton.addEventListener("click", () => {

        let currentLanguage = localStorage.getItem("language") || "en";

        if(currentLanguage === "en"){

            currentLanguage = "hi";

        }

        else{

            currentLanguage = "en";

        }

        localStorage.setItem("language", currentLanguage);

        updateLanguageButton(currentLanguage);

        /*======================================
            PLACEHOLDER
            language.js will handle translation
        ======================================*/

        document.dispatchEvent(

            new CustomEvent("languageChanged",{

                detail:{

                    language:currentLanguage

                }

            })

        );

    });

}


/*==========================================================
            UPDATE LANGUAGE BUTTON
==========================================================*/

function updateLanguageButton(language){

    const languageButton = document.getElementById("languageBtn");

    if(!languageButton){

        return;

    }

    if(language === "hi"){

        languageButton.innerHTML = "English";

    }

    else{

        languageButton.innerHTML = "हिन्दी";

    }

}



/*==========================================================
            STEP 25 - HERO ANIMATIONS & PAGE LOADER
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeLoader();

    initializeScrollAnimations();

});


/*==========================================================
                    PAGE LOADER
==========================================================*/

function initializeLoader(){

    const loader = document.getElementById("pageLoader");

    if(!loader){

        return;

    }

    window.addEventListener("load", () => {

        setTimeout(() => {

            loader.classList.add("hide");

        },600);

    });

}


/*==========================================================
                SCROLL ANIMATIONS
==========================================================*/

function initializeScrollAnimations(){

    const animatedElements = document.querySelectorAll(

        ".hero-content," +

        ".hero-image," +

        ".feature-card," +

        ".preview-card," +

        ".step-card," +

        ".accordion-item," +

        ".footer-box"

    );

    if(animatedElements.length === 0){

        return;

    }

    const observer = new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if(entry.isIntersecting){

                    entry.target.classList.add("fade-up");

                    observer.unobserve(entry.target);

                }

            });

        },

        {

            threshold:0.15

        }

    );

    animatedElements.forEach(element => {

        observer.observe(element);

    });

}


/*==========================================================
                HERO BUTTON EFFECT
==========================================================*/

const createButton = document.getElementById("createBiodataBtn");

if(createButton){

    createButton.addEventListener("mouseenter", () => {

        createButton.style.transform = "translateY(-4px) scale(1.02)";

    });

    createButton.addEventListener("mouseleave", () => {

        createButton.style.transform = "";

    });

}


/*==========================================================
            HERO IMAGE PARALLAX EFFECT
==========================================================*/

const heroImage = document.querySelector(".hero-image img");

window.addEventListener("scroll", () => {

    if(!heroImage){

        return;

    }

    const scrollValue = window.scrollY;

    heroImage.style.transform =

        `translateY(${scrollValue * 0.08}px)`;

});





/*==========================================================
            STEP 26 - FINAL APPLICATION INITIALIZATION
==========================================================*/

/**
 * ---------------------------------------------------------
 * Application Information
 * ---------------------------------------------------------
 */

const APP = {

    name: "Biodata & Resume Studio",

    version: "1.0.0",

    author: "Biodata & Resume Studio",

    environment: "Production"

};


/*==========================================================
                APPLICATION START
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeApplication();

});


/*==========================================================
            MAIN APPLICATION INITIALIZER
==========================================================*/

function initializeApplication(){

    consoleBanner();

    console.log("Application Initialized Successfully.");

}


/*==========================================================
                CONSOLE BANNER
==========================================================*/

function consoleBanner(){

    console.clear();

    console.log(
`
==========================================================
            BIODATA & RESUME STUDIO
        Free Biodata & Resume Generator
==========================================================

Version      : ${APP.version}
Environment  : ${APP.environment}

Application Loaded Successfully.

==========================================================
`
    );

}


/*==========================================================
                UTILITY FUNCTIONS
==========================================================*/

/**
 * Get element by ID
 */

function getElement(id){

    return document.getElementById(id);

}


/**
 * Query Selector
 */

function query(selector){

    return document.querySelector(selector);

}


/**
 * Query Selector All
 */

function queryAll(selector){

    return document.querySelectorAll(selector);

}


/**
 * Show Element
 */

function show(element){

    if(element){

        element.style.display = "";

    }

}


/**
 * Hide Element
 */

function hide(element){

    if(element){

        element.style.display = "none";

    }

}


/**
 * Toggle Element
 */

function toggle(element){

    if(!element){

        return;

    }

    if(element.style.display === "none"){

        show(element);

    }

    else{

        hide(element);

    }

}


/**
 * Scroll To Element
 */

function scrollToElement(id){

    const element = getElement(id);

    if(!element){

        return;

    }

    element.scrollIntoView({

        behavior:"smooth",

        block:"start"

    });

}


/**
 * Generate Unique ID
 */

function generateId(){

    return Date.now().toString(36) +

        Math.random().toString(36).substring(2,8);

}


/**
 * Show Success Message
 */

function appShowSuccess(message){

    console.log("SUCCESS:", message);

}


/**
 * Show Error Message
 */

function appShowError(message){

    console.error("ERROR:", message);

}


/*==========================================================
                GLOBAL ERROR HANDLER
==========================================================*/

window.addEventListener("error",(event)=>{

    console.error(

        "Application Error:",

        event.message

    );

});


/*==========================================================
                END OF APP.JS
==========================================================*/