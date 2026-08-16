/*==========================================================
                    STORAGE.JS
            STEP 1 - MODULE SETUP
==========================================================*/

/*
============================================================
                STORAGE CONFIGURATION
============================================================
*/

const STORAGE = {

    version : "1.0.0",

    debug : true,

    storageKey : "matrimonial_biodata"

};


/*
============================================================
                STORAGE CONSTANTS
============================================================
*/

const STORAGE_CONSTANTS = {

    LOCAL_STORAGE :

        STORAGE.storageKey,

    DRAFT_FILE :

        "matrimonial_biodata.json"

};


/*
============================================================
                INITIALIZATION
============================================================
*/


document.addEventListener(

    "DOMContentLoaded",

    () => {

        initializeStorageModule();

        initializeStorage();

    }

);


/*
============================================================
            INITIALIZE STORAGE MODULE
============================================================
*/


function initializeStorage(){

    if(STORAGE.debug){

        storageLog(

            "Storage Module Initialized"

        );

    }

    if(loadBiodata()){

        restoreForm();

    }

    initializeAutoSave();

    initializeExportButton();

    initializeImportButton();

    initializeClearButton();

}


/*
============================================================
                DEBUG LOGGER
============================================================
*/

function storageLog(

    message,

    data = ""

){

    if(!STORAGE.debug){

        return;

    }

    console.group(

        "[Storage]"

    );

    console.log(message);

    if(data !== ""){

        console.log(data);

    }

    console.groupEnd();

}



/*==========================================================
            STEP 2 - SAVE BIODATA
==========================================================*/

/*
============================================================
            SAVE BIODATA TO LOCAL STORAGE
============================================================
*/

function saveBiodata(){

    try{

        const biodataJson = JSON.stringify(

            biodata

        );

        setStorage(

            STORAGE.storageKey,

            biodataJson

        );

        storageLog(

            "Biodata Saved Successfully",

            biodata

        );

        return true;

    }

    catch(error){

        console.error(

            "Unable to Save Biodata",

            error

        );

        return false;

    }

}




/*
============================================================
            CHECK SAVED BIODATA
============================================================
*/

function hasSavedBiodata(){

    return getStorage(

        STORAGE.storageKey

    ) !== null;

}



/*
============================================================
            GET RAW STORAGE DATA
============================================================
*/

function getSavedBiodata(){

    return localStorage.getItem(

        STORAGE.storageKey

    );

}



/*
============================================================
            STORAGE INFORMATION
============================================================
*/

function storageInfo(){

    storageLog(

        "Storage Key",

        STORAGE.storageKey

    );

    storageLog(

        "Data Exists",

        hasSavedBiodata()

    );

}



/*==========================================================
            STEP 3 - AUTO SAVE
==========================================================*/

/*
============================================================
            INITIALIZE AUTO SAVE
============================================================
*/

function initializeAutoSave(){

    const fields = document.querySelectorAll(

        "input, select, textarea"

    );

    fields.forEach(field => {

        /*
        ============================================
                INPUT EVENT
        ============================================
        */

        field.addEventListener(

            "input",

            autoSaveBiodata

        );

        /*
        ============================================
                CHANGE EVENT
        ============================================
        */

        field.addEventListener(

            "change",

            autoSaveBiodata

        );

    });

}


/*
============================================================
            AUTO SAVE BIODATA
============================================================
*/



function autoSaveBiodata(){

    try{

        savePersonalData();

        saveEducationData();

        saveWorkData();

        saveFamilyData();

        savePartnerData();

        saveContactData();

        saveDeclarationData();   // <-- ADD THIS

        saveBiodata();

    }

    catch(error){

        console.error(
            "Auto Save Failed",
            error
        );

    }

}




/*==========================================================
            STEP 4 - LOAD BIODATA
==========================================================*/

/*
============================================================
            LOAD BIODATA FROM LOCAL STORAGE
============================================================
*/

function loadBiodata(){

    try{

        const savedData = getStorage(

            STORAGE.storageKey

        );

        /*
        ============================================
                NO SAVED DATA
        ============================================
        */

        if(!savedData){

            storageLog(

                "No Saved Biodata Found"

            );

            return false;

        }

        /*
        ============================================
                PARSE JSON
        ============================================
        */

        const parsedData = JSON.parse(

            savedData

        );

        /*
        ============================================
                LOAD INTO BIODATA OBJECT
        ============================================
        */

        biodata.personal =
            parsedData.personal || {};

        biodata.education =
            parsedData.education || {};

        biodata.work =
            parsedData.work || {};

        biodata.family =
            parsedData.family || {};

        biodata.partner =
            parsedData.partner || {};

        biodata.contact =
            parsedData.contact || {};

        biodata.declaration =
            parsedData.declaration || {};

        biodata.photos =
            parsedData.photos || {};

        storageLog(

            "Biodata Loaded Successfully",

            biodata

        );

        return true;

    }

    catch(error){

        console.error(

            "Unable to Load Biodata",

            error

        );

        return false;

    }

}



/*
============================================================
            CHECK STORAGE DATA
============================================================
*/

function checkSavedBiodata(){

    if(loadBiodata()){

        storageLog(

            "Saved Biodata Available"

        );

    }

    else{

        storageLog(

            "Starting Fresh"

        );

    }

}



/*==========================================================
            STEP 5 - RESTORE FORM
==========================================================*/

/*
============================================================
            RESTORE COMPLETE FORM
============================================================
*/


function restoreForm(){

    restoreSection(biodata.personal);

    restoreSection(biodata.education);

    restoreSection(biodata.work);

    restoreSection(biodata.family);

    restoreSection(biodata.partner);

    restoreSection(biodata.contact);

    restoreSection(biodata.declaration);

    restorePhotos();

    currentStep = 1;
    showStep(currentStep);

    storageLog(
        "Form Restored Successfully"
    );

}




/*
============================================================
            RESTORE FORM SECTION
============================================================
*/

function restoreSection(section){

    if(!section){

        return;

    }

    /*
    ============================================================
            RESTORE TIME OF BIRTH
    ============================================================
    */

    if(section.timeOfBirth){

        const parts = section.timeOfBirth.split(" ");

        const time = parts[0].split(":");

        document.getElementById("birthHour").value = time[0];

        document.getElementById("birthMinute").value = time[1];

        document.getElementById("birthPeriod").value = parts[1];
    }

    for(const id in section){

        if(id === "timeOfBirth"){

            continue;

        }

        const element = document.getElementById(id);

        if(!element){

            continue;

        }

        if(

            element.tagName === "INPUT" ||

            element.tagName === "SELECT" ||

            element.tagName === "TEXTAREA"

        ){

            element.value = section[id];



        }

    }

}





/*
============================================================
            RESTORE PHOTO PREVIEWS
============================================================
*/

function restorePhotos(){

    const photoMap = {

        profilePhoto : "previewProfilePhoto",

    };

    for(const key in photoMap){

        if(

            biodata.photos[key] &&

            biodata.photos[key].preview

        ){

            const image = document.getElementById(

                photoMap[key]

            );

            if(image){

                image.src =

                    biodata.photos[key].preview;

                if(key === "profilePhoto"){

                    GALLERY_STATE.profilePhoto =

                        biodata.photos[key].preview;

                }

            }

        }

    }

}







/*==========================================================
            STEP 6 - STORAGE HELPERS
==========================================================*/

/*
============================================================
            CHECK STORAGE SUPPORT
============================================================
*/

function isStorageAvailable(){

    try{

        const testKey = "__storage_test__";

        localStorage.setItem(

            testKey,

            "test"

        );

        localStorage.removeItem(

            testKey

        );

        return true;

    }

    catch(error){

        console.error(

            "Local Storage Not Available",

            error

        );

        return false;

    }

}


/*
============================================================
            GET STORAGE VALUE
============================================================
*/

function getStorage(key){

    if(!isStorageAvailable()){

        return null;

    }

    return localStorage.getItem(key);

}


/*
============================================================
            SET STORAGE VALUE
============================================================
*/

function setStorage(

    key,

    value

){

    if(!isStorageAvailable()){

        return false;

    }

    try{

        localStorage.setItem(

            key,

            value

        );

        return true;

    }

    catch(error){

        console.error(

            "Unable to Save Storage",

            error

        );

        return false;

    }

}


/*
============================================================
            REMOVE STORAGE ITEM
============================================================
*/

function removeStorage(key){

    if(!isStorageAvailable()){

        return false;

    }

    try{

        localStorage.removeItem(key);

        return true;

    }

    catch(error){

        console.error(

            "Unable to Remove Storage",

            error

        );

        return false;

    }

}


/*
============================================================
            CLEAR APPLICATION STORAGE
============================================================
*/

function clearStorage(){

    if(!isStorageAvailable()){

        return false;

    }

    try{

        localStorage.removeItem(

            STORAGE.storageKey

        );

        storageLog(

            "Application Storage Cleared"

        );

        return true;

    }

    catch(error){

        console.error(

            "Unable to Clear Storage",

            error

        );

        return false;

    }

}



/*==========================================================
            STEP 7 - EXPORT DRAFT
==========================================================*/

/*
============================================================
            EXPORT BIODATA DRAFT
============================================================
*/

function exportDraft(){

    try{

        /*
        ============================================
                CONVERT TO JSON
        ============================================
        */

        const jsonData = JSON.stringify(

            biodata,

            null,

            4

        );

        /*
        ============================================
                CREATE JSON FILE
        ============================================
        */

        const blob = new Blob(

            [jsonData],

            {

                type : "application/json"

            }

        );

        /*
        ============================================
                CREATE DOWNLOAD LINK
        ============================================
        */

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download =

            STORAGE_CONSTANTS.DRAFT_FILE;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        storageLog(

            "Draft Exported Successfully"

        );

        return true;

    }

    catch(error){

        console.error(

            "Unable to Export Draft",

            error

        );

        return false;

    }

}




/*
============================================================
            EXPORT BUTTON INITIALIZATION
============================================================
*/

function initializeExportButton(){

    const button = document.getElementById(

        "exportDraftBtn"

    );

    if(!button){

        return;

    }

    button.addEventListener(

        "click",

        exportDraft

    );

}



/*==========================================================
            STEP 8 - IMPORT DRAFT
==========================================================*/

/*
============================================================
            IMPORT BIODATA DRAFT
============================================================
*/

function importDraft(event){

    const file = event.target.files[0];

    if(!file){

        return;

    }

    if(file.type !== "application/json"){

        alert("Please select a valid JSON file.");

        event.target.value = "";

        return;

    }

    const reader = new FileReader();

    reader.onload = function(e){

        try{

            const importedData = JSON.parse(

                e.target.result

            );

            biodata.personal =
                importedData.personal || {};

            biodata.education =
                importedData.education || {};

            biodata.work =
                importedData.work || {};

            biodata.family =
                importedData.family || {};

            biodata.partner =
                importedData.partner || {};

            biodata.contact =
                importedData.contact || {};

            biodata.declaration =
                importedData.declaration || {};

            biodata.photos =
                importedData.photos || {};

            saveBiodata();

            restoreForm();

            storageLog(

                "Draft Imported Successfully",

                biodata

            );

            alert(

                "Draft imported successfully."

            );

        }

        catch(error){

            console.error(

                "Invalid JSON File",

                error

            );

            alert(

                "Invalid biodata JSON file."

            );

        }

    };

    reader.readAsText(file);

}



/*
============================================================
        INITIALIZE IMPORT BUTTON
============================================================
*/

function initializeImportButton(){

    const input = document.getElementById(

        "importDraftInput"

    );

    if(!input){

        return;

    }

    input.addEventListener(

        "change",

        importDraft

    );

}






/*==========================================================
            STEP 9 - CLEAR DRAFT
==========================================================*/

/*
============================================================
            CLEAR DRAFT
============================================================
*/

function clearDraft(){

    try{

        /*
        ============================================
                REMOVE LOCAL STORAGE
        ============================================
        */

        clearStorage();

        /*
        ============================================
                RESET BIODATA OBJECT
        ============================================
        */

        biodata.personal = {};

        biodata.education = {};

        biodata.work = {};

        biodata.family = {};

        biodata.partner = {};

        biodata.contact = {};

        biodata.declaration = {};

        biodata.photos = {};

        GALLERY_STATE.profilePhoto = null;

        /*
        ============================================
                RESET FORM
        ============================================
        */

        resetBiodataForm();

        /*
        ============================================
                RESET PHOTO PREVIEWS
        ============================================
        */

        resetPhotoPreviews();

        storageLog(

            "Draft Cleared Successfully"

        );

        return true;

    }

    catch(error){

        console.error(

            "Unable to Clear Draft",

            error

        );

        return false;

    }

}




/*
============================================================
            RESET COMPLETE FORM
============================================================
*/

function resetBiodataForm(){

    const form = document.getElementById(

        "multiStepForm"

    );

    if(form){

        form.reset();

    }

}



/*
============================================================
            RESET PHOTO PREVIEWS
============================================================
*/

function resetPhotoPreviews(){

    const previews = [

        "previewProfilePhoto"

    ];

    previews.forEach(id => {

        const image = document.getElementById(id);

        if(image){

            image.src =

                "assets/images/defaults/default-profile.png";

        }

    });

}



/*
============================================================
            INITIALIZE CLEAR BUTTON
============================================================
*/

function initializeClearButton(){

    const button = document.getElementById(

        "clearDraftBtn"

    );

    if(!button){

        return;

    }

    button.addEventListener(

        "click",

        () => {

            const confirmClear = confirm(

                "Are you sure you want to clear the saved draft?"

            );

            if(confirmClear){

                clearDraft();

            }

        }

    );

}





/*==========================================================
            STEP 10 - FINAL CLEANUP
==========================================================*/

/*
============================================================
                MODULE INFORMATION
============================================================
*/

const STORAGE_MODULE = {

    name : "Storage Module",

    version : "1.0.0",

    author : "Mayank Kumar",

    initialized : false

};


/*
============================================================
                STORAGE SUMMARY
============================================================
*/

function storageSummary(){

    storageLog(

        "Storage Module",

        {

            version :

                STORAGE_MODULE.version,

            storageKey :

                STORAGE.storageKey,

            initialized :

                STORAGE_MODULE.initialized

        }

    );

}


/*
============================================================
                ERROR HANDLER
============================================================
*/

function storageErrorHandler(error){

    console.error(

        "[Storage Error]",

        error

    );

}


/*
============================================================
            INITIALIZE STORAGE MODULE
============================================================
*/

function initializeStorageModule(){

    try{

        STORAGE_MODULE.initialized = true;

        storageSummary();

    }

    catch(error){

        storageErrorHandler(error);

    }

}



