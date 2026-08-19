/*==========================================================
                    FORM.JS
            STEP 2 - FORM CONTROLLER
==========================================================*/

/*
============================================================
                GLOBAL VARIABLES
============================================================
*/

let currentStep = 1;

const totalSteps = 9;

/*
============================================================
                COMPLETE BIODATA
============================================================
*/


const biodata = {

    personal:{},

    education:{},

    work:{},

    family:{},

    partner:{},

    contact: {

        mobileNumber: "",

        currentAddress: "",

        permanentAddress: ""

    },

    declaration: {

        senderName: "",

        senderMobile: ""

    },

    photos:{}

};




/*
============================================================
                INITIALIZATION
============================================================
*/

document.addEventListener("DOMContentLoaded", () => {

    initializeForm();

});


/*
============================================================
                INITIALIZE FORM
============================================================
*/

function initializeForm(){

    const nextButton = document.getElementById("nextStepBtn");

    const previousButton = document.getElementById("previousStepBtn");

    if(nextButton){

        nextButton.addEventListener("click", nextStep);

    }

    if(previousButton){

        previousButton.addEventListener("click", previousStep);

    }

    showStep(currentStep);

}


/*
============================================================
                SHOW STEP
============================================================
*/

function showStep(step){

    const steps = document.querySelectorAll(".form-step");

    steps.forEach((section) => {

        section.classList.add("d-none");

        section.classList.remove("active-step");

    });

    const currentSection = document.querySelector(

        `.form-step[data-step="${step}"]`

    );

    if(currentSection){

        currentSection.classList.remove("d-none");

        currentSection.classList.add("active-step");

    }

    updateProgressBar();

    updateNavigationButtons();

}


/*
============================================================
                NEXT STEP
============================================================
*/


function nextStep(){
    /*
    ============================================
            VALIDATE CURRENT STEP
    ============================================
    */
   console.log("nextStep() called");

   if(!validateCurrentStep(currentStep)){

        return;

   }

    /*
    ============================================
            SAVE CURRENT STEP DATA
    ============================================
    */

    switch(currentStep){

        case 1:
            savePersonalData();
            break;

        case 2:
            saveEducationData();
            break;

        case 3:
            saveWorkData();
            break;

        case 4:
            saveFamilyData();
            break;

        case 5:
            savePartnerData();
            break;

        case 6:
            saveContactData();
            break;

        case 7:

            if(!savePhotoData()){
                return;
            }

            break;

        case 8:
            saveDeclarationData();
            break;
    }

    if(currentStep === totalSteps){

        completeForm();

        return;

    }

    if(currentStep === 8){

        if(!validateCompleteForm()){

            return;

        }

        populateReview();

    }

    currentStep++;

    showStep(currentStep);

}



/*
============================================================
                PREVIOUS STEP
============================================================
*/

function previousStep(){

    if(currentStep <= 1){

        return;

    }

    currentStep--;

    showStep(currentStep);

}


/*
============================================================
                UPDATE PROGRESS BAR
============================================================
*/

function updateProgressBar(){

    const progressBar = document.getElementById("formProgressBar");

    if(!progressBar){

        return;

    }

    const percentage = (currentStep / totalSteps) * 100;

    progressBar.style.width = percentage + "%";

    progressBar.innerHTML = currentStep + " / " + totalSteps;

}


/*
============================================================
                UPDATE BUTTONS
============================================================
*/

function updateNavigationButtons(){

    const previousButton = document.getElementById("previousStepBtn");

    const nextButton = document.getElementById("nextStepBtn");

    if(previousButton){

        previousButton.disabled = currentStep === 1;

    }

    if(nextButton){

        if(currentStep === totalSteps){

            nextButton.innerHTML = `
                Finish
                <i class="fa-solid fa-check"></i>
            `;
        }

        else{

            nextButton.innerHTML = `
                Next
                <i class="fa-solid fa-arrow-right"></i>
            `;
        }

    }

}



/*==========================================================
            STEP 6 - STORE EDUCATION DATA
==========================================================*/

/*
============================================================
                TEMPORARY FORM DATA
============================================================
*/


/*
============================================================
            SAVE EDUCATION INFORMATION
============================================================
*/


function saveEducationData(){

    biodata.education = {

        highestQualification : getInputValue("highestQualification"),

        college : getInputValue("college"),

        Board12th : getInputValue("Board12th"),

        Board10th : getInputValue("Board10th"),

        specialSkill : getInputValue("specialSkill"),

        educationOther : getInputValue("educationOther")

    };

    debugLog(
        "Education Data Saved",
        biodata.education
    );

}


function saveWorkData(){

    biodata.work = {

        profession : getInputValue("profession"),

        organization : getInputValue("organization"),

        workPlace : getInputValue("workPlace"),

        income : getInputValue("income")

    };

    debugLog(

        "Work Data Saved",

        biodata.work

    );

}



/*
============================================================
            GET INPUT VALUE
============================================================
*/

function getInputValue(id){

    const element = document.getElementById(id);

    if(!element){

        return "";

    }

    return element.value.trim();

}




/*==========================================================
            STEP 8 - STORE FAMILY DATA
==========================================================*/

/*
============================================================
            SAVE FAMILY INFORMATION
============================================================
*/

function saveFamilyData(){

    biodata.family = {

        fatherName : getInputValue("fatherName"),

        fatherOccupation : getInputValue("fatherOccupation"),

        motherName : getInputValue("motherName"),

        motherOccupation : getInputValue("motherOccupation"),

        siblingsDetails : getInputValue("siblingsDetails")

    };

    debugLog(
        "Family Data Saved",
        biodata.family
    );

}





/*==========================================================
            STEP 10 - STORE PARTNER PREFERENCE DATA
==========================================================*/

/*
============================================================
            SAVE PARTNER PREFERENCE
============================================================
*/

function savePartnerData(){

    biodata.partner = {

        preferredQualification : getInputValue("preferredQualification"),

        preferredProfession : getInputValue("preferredProfession"),

        preferredLocation : getInputValue("preferredLocation"),

        otherExpectations : getInputValue("otherExpectations")

    };

    debugLog(
        "Partner Preference Saved",
        biodata.partner
    );
}




/*==========================================================
            STEP 12 - STORE CONTACT DETAILS
==========================================================*/

/*
============================================================
            SAVE CONTACT INFORMATION
============================================================
*/

function saveContactData(){

    biodata.contact = {

        mobileNumber : getInputValue("mobileNumber"),

        currentAddress : getInputValue("currentAddress"),

        permanentAddress : getInputValue("permanentAddress"),

    };

    debugLog(
        "Contact Details Saved",
        biodata.contact
    );

}

/*
============================================================
            SAVE DECLARATION INFORMATION
============================================================
*/

function saveDeclarationData(){

    biodata.declaration = {

        declaration: document.getElementById("declaration").value,

        senderName: getInputValue("senderName"),

        senderMobile: getInputValue("senderMobile")

    };

    debugLog(
        "Declaration Data Saved",
        biodata.declaration
    );

}



/*
============================================================
                SAVE PERSONAL DETAILS
============================================================
*/

function savePersonalData(){

    biodata.personal = {

        fullName : getInputValue("fullName"),

        dob : getInputValue("dob"),

        timeOfBirth:

            getInputValue("birthHour")

            + ":"

            + getInputValue("birthMinute")

            + " "

            + getInputValue("birthPeriod"),

        placeOfBirth : getInputValue("placeOfBirth"),

        rashi : getInputValue("rashi"),

        gan : getInputValue("gan"),

        height : getInputValue("height"),

        complexion : getInputValue("complexion"),

        maritalStatus : getInputValue("maritalStatus"),

        caste : getInputValue("caste"),

        manglik : getInputValue("manglik"),

        language : getInputValue("language"),

        diet : getInputValue("diet"),

        hobbies : getInputValue("hobbies"),

        other : getInputValue("other")

    };

}



/*
============================================================
                REVIEW PAGE
============================================================
*/




function populateReview(){

    fillReviewSection(
        "reviewPersonal",
        biodata.personal
    );

    fillReviewSection(
        "reviewEducation",
        biodata.education
    );

    fillReviewSection(
        "reviewWork",
        biodata.work
    );

    fillReviewSection(
        "reviewFamily",
        biodata.family
    );

    fillReviewSection(
        "reviewPartner",
        biodata.partner
    );

    fillReviewSection(
        "reviewContact",
        {
            mobileNumber: biodata.contact.mobileNumber
        }
    );

    fillReviewSection(
    "reviewDeclaration",
        {
            declaration: biodata.declaration.declaration,
            senderName: biodata.declaration.senderName,
            senderMobile: biodata.declaration.senderMobile
        }
    );

    fillReviewSection(
        "reviewAddress",
        {
            currentAddress: biodata.contact.currentAddress,
            permanentAddress: biodata.contact.permanentAddress
        }
    );

    populatePhotoReview();

}





/*
============================================================
                REVIEW HELPER
============================================================
*/

function fillReviewSection(

    containerId,

    data

){

    const container = document.getElementById(containerId);

    if(!container){

        return;

    }

    let html = "";

    for(const key in data){

        html += `

            <div class="review-item">

                <strong>

                    ${formatLabel(key)}

                </strong>

                :

                ${data[key] || "-"}

            </div>

        `;

    }

    if(html === ""){

        html = "<p>No data available.</p>";

    }

    container.innerHTML = html;

}


/*
============================================================
                PHOTO REVIEW
============================================================
*/

function populatePhotoReview(){

    const container = document.getElementById("reviewPhotos");

    if(!container){

        return;

    }

    container.innerHTML = "";

    for(const key in biodata.photos){

        const photo = biodata.photos[key];

        const image = document.createElement("img");

        image.src = photo.preview;

        image.className =

            "img-fluid rounded shadow-sm";

        container.appendChild(image);

    }

}


/*
============================================================
                LABEL FORMAT
============================================================
*/

function formatLabel(text){

    return text

        .replace(/([A-Z])/g," $1")

        .replace(/^./,str => str.toUpperCase());

}




/*==========================================================
            STEP 17 - OPEN BIODATA FORM
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeCreateBiodataButton();

});


/*
============================================================
        INITIALIZE CREATE BIODATA BUTTON
============================================================
*/




function initializeCreateBiodataButton(){

    const heroButton =
        document.getElementById("createBiodataBtn");

    const previewButton =
        document.getElementById("previewCreateBtn");

    if(heroButton){

        heroButton.addEventListener(
            "click",
            openBiodataForm
        );

    }

    if(previewButton){

        previewButton.addEventListener(
            "click",
            openBiodataForm
        );

    }

}





/*
============================================================
            OPEN BIODATA FORM
============================================================
*/

function openBiodataForm(){

    /*
    ============================================
            HIDE LANDING PAGE SECTIONS
    ============================================
    */

    hideSection("hero");

    hideSection("features");

    hideSection("preview");

    hideSection("how-it-works");

    hideSection("faq");

    hideSection("footer");


    /*
    ============================================
            SHOW FORM SECTION
    ============================================
    */

    const formSection = document.getElementById(

        "biodataFormSection"

    );

    if(formSection){

        formSection.classList.remove("d-none");

    }


    /*
    ============================================
            RESET FORM
    ============================================
    */

    currentStep = 1;

    showStep(currentStep);


    /*
    ============================================
            SCROLL TO TOP
    ============================================
    */

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}


/*
============================================================
            HIDE SECTION
============================================================
*/

function hideSection(id){

    const section = document.getElementById(id);

    if(section){

        section.style.display = "none";

    }

}


/*
============================================================
            SHOW SECTION
============================================================
*/

function showSection(id){

    const section = document.getElementById(id);

    if(section){

        section.style.display = "";

    }

}


/*
============================================================
        RETURN TO LANDING PAGE
============================================================
*/

function returnToLandingPage(){

    showSection("hero");

    showSection("features");

    showSection("preview");

    showSection("how-it-works");

    showSection("faq");

    showSection("footer");

    const formSection = document.getElementById(

        "biodataFormSection"

    );

    if(formSection){

        formSection.classList.add("d-none");

    }

    const resumeSection = document.getElementById(

        "resumeFormSection"

    );

    if(resumeSection){

        resumeSection.classList.add("d-none");

    }

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}





/*==========================================================
            STEP 18 - FINAL CLEANUP
==========================================================*/

/*
============================================================
                FORM CONFIGURATION
============================================================
*/

const FORM_CONFIG = {

    totalSteps: 9,

    version: "1.0.0",

    autoSave: false,

    debug: true

};


/*
============================================================
                RESET COMPLETE FORM
============================================================
*/

function resetCompleteForm(){

    const form = document.querySelector("#multiStepForm");

    if(form){

        form.reset?.();

    }

    currentStep = 1;

    showStep(currentStep);

    resetFormData();

}


/*
============================================================
                RESET STORED DATA
============================================================
*/

function resetFormData(){

    biodata.personal = {};

    biodata.education = {};

    biodata.work = {}

    biodata.family = {};

    biodata.partner = {};

    biodata.contact = {};

    biodata.declaration = {};

    biodata.photos = {};

}


/*
============================================================
                FORM COMPLETED
============================================================
*/

function completeForm(){

    console.log("================================");

    console.log("Biodata Form Completed");

    console.log("================================");

    debugLog("Biodata Form Completed", biodata);

}


/*
============================================================
                SAFE GET ELEMENT
============================================================
*/

function safeElement(id){

    const element = document.getElementById(id);

    if(!element){

        if(FORM_CONFIG.debug){

            console.warn(

                "Element not found:",

                id

            );

        }

        return null;

    }

    return element;

}


/*
============================================================
                DEBUG LOG
============================================================
*/

function debugLog(title,data){

    if(!FORM_CONFIG.debug){

        return;

    }

    console.group(title);

    console.log(data);

    console.groupEnd();

}


/*
============================================================
                EXPORT DATA
============================================================
*/

function exportFormData(){

    return JSON.parse(

        JSON.stringify(biodata)

    );

}


/*
============================================================
                FINAL INITIALIZATION
============================================================
*/

document.addEventListener("DOMContentLoaded",()=>{

    debugLog(

        "Form Module",

        "Initialized Successfully"

    );

});



