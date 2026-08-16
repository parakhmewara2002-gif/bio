/*==========================================================
                    PDF.JS
        HTML2CANVAS + JSPDF VERSION
==========================================================*/

/*==========================================================
                PDF CONFIGURATION
==========================================================*/

const PDF_CONFIG = {

    FILE_NAME: "Matrimonial_Biodata.pdf",

    PAGE_FORMAT: "a4",

    PAGE_ORIENTATION: "portrait",

    UNIT: "mm",

    MARGIN: 10,

    SCALE: 2,

    IMAGE_TYPE: "JPEG",

    IMAGE_QUALITY: 1.0,

    DEBUG: true

};


/*==========================================================
                PDF MODULE
==========================================================*/

const PDF_MODULE = {

    initialized: false,

    generating: false

};




/*==========================================================
                LOGGER
==========================================================*/

function pdfLog(message, data = ""){

    if(!PDF_CONFIG.DEBUG){

        return;

    }

    console.group("[PDF]");

    console.log(message);

    if(data !== ""){

        console.log(data);

    }

    console.groupEnd();

}


/*==========================================================
                INITIALIZATION
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initializePDFModule();

    }

);


/*==========================================================
                INITIALIZE
==========================================================*/

function initializePDFModule(){

    initializeDownloadButton();

    initializePrintButton();

    initializeShareButton();

    PDF_MODULE.initialized = true;

    pdfLog("PDF Module Initialized");

}


/*==========================================================
                BUTTONS
==========================================================*/

function initializeDownloadButton(){

    const button = document.getElementById(

        "downloadPdfBtn"

    );

    if(!button){

        return;

    }

    button.addEventListener("click", () => {

        downloadPDF();

    });

}



function initializePrintButton(){

    const button = document.getElementById(

        "printPdfBtn"

    );

    if(!button){

        return;

    }

    button.addEventListener(

        "click",

        printPDF

    );

}



function initializeShareButton(){

    const button = document.getElementById(

        "sharePdfBtn"

    );

    if(!button){

        return;

    }

    button.addEventListener(

        "click",

        sharePDF

    );

}


/*==========================================================
                HELPERS
==========================================================*/

function getPreviewContainer(){

    return document.querySelector(

        ".biodata-preview-container"

    );

}


function getPreviewPage1(){

    return document.querySelector(".preview-page");

}



function showPreviewContainer(){

    const container = getPreviewContainer();

    if(!container){

        return;

    }

    container.style.visibility = "visible";

    container.style.position = "fixed";
    container.style.left = "0";
    container.style.top = "0";

    container.style.width = "1023px";
    container.style.height = "1537px";

    container.style.overflow = "hidden";

    container.style.zIndex = "999999";
    container.style.pointerEvents = "none";

}


function hidePreviewContainer(){

    const container = getPreviewContainer();

    if(!container){

        return;

    }

    container.style.visibility = "hidden";

    container.style.zIndex = "-1";

}


/*==========================================================
                PREPARE PDF
==========================================================*/

function preparePDF(){

    if(typeof renderPreviewContainer === "function"){

        renderPreviewContainer();

    }

    showPreviewContainer();

}


/*==========================================================
                CLEANUP
==========================================================*/

function cleanupPDF(){

    hidePreviewContainer();

}


/*==========================================================
                CREATE CANVAS
==========================================================*/
async function createCanvasPage1(){

    preparePDF();

    await new Promise(resolve=>requestAnimationFrame(resolve));
    await new Promise(resolve=>requestAnimationFrame(resolve));

    const page=getPreviewPage1();

    if(!page){

        cleanupPDF();

        throw new Error("Preview Page 1 not found.");

    }

    const canvas=await html2canvas(page,{

        scale:PDF_CONFIG.SCALE,

        useCORS:true,

        allowTaint:true,

        backgroundColor:"#ffffff",

        logging:false,

        scrollX:0,

        scrollY:0,

        windowWidth:page.scrollWidth,

        windowHeight:page.scrollHeight

    });

    cleanupPDF();

    return canvas;

}





/*==========================================================
                GENERATE PDF
==========================================================*/


async function generatePDF(){

    if(PDF_MODULE.generating){

        return null;

    }

    PDF_MODULE.generating = true;

    try{

        const canvas = await createCanvasPage1();

        const pdf = new jspdf.jsPDF({

            orientation: "portrait",

            unit: "mm",

            format: "a4"

        });

        const imgData = canvas.toDataURL(

            "image/jpeg",

            1.0

        );

        pdf.addImage(

            imgData,

            "JPEG",

            0,

            0,

            210,

            297

        );

        PDF_MODULE.generating = false;

        return pdf;

    }

    catch(error){

        PDF_MODULE.generating = false;

        console.error(error);

        return null;

    }

}

/*==========================================================
                DOWNLOAD PDF
==========================================================*/



async function downloadPDF() {

    try {

        // Generate PDF (free — no payment step)
        const pdf = await generatePDF();

        if (!pdf) {

            return;

        }

        const fullName =
            (biodata.personal.fullName || "Unknown").trim();

        const education =
            (biodata.education.highestQualification || "Education").trim();

        const fileName =
            `${fullName}_${education}.pdf`
                .replace(/[\\/:*?"<>|]/g, "_");

        pdf.save(fileName);

    }
    catch (error) {

        console.error(error);

        alert("Unable to download PDF.");

    }

}



/*==========================================================
                GET PDF BLOB
==========================================================*/

async function getPDFBlob(){

    const pdf = await generatePDF();

    if(!pdf){

        return null;

    }

    return pdf.output(

        "blob"

    );

}






/*==========================================================
                    PRINT PDF
==========================================================*/

async function printPDF() {

    try {

        const blob = await getPDFBlob();

        if (!blob) {
            return;
        }

        const blobURL = URL.createObjectURL(blob);

        const printWindow = window.open(blobURL);

        if (!printWindow) {

            alert("Please allow popups to print the PDF.");

            URL.revokeObjectURL(blobURL);

            return;

        }

        printWindow.onload = function () {

            printWindow.focus();

            printWindow.print();

            setTimeout(() => {

                URL.revokeObjectURL(blobURL);

            }, 5000);

        };

    }
    catch (error) {

        console.error(error);

        alert("Unable to print PDF.");

    }

}


/*==========================================================
                    SHARE PDF
==========================================================*/

async function sharePDF() {

    try {

        const blob = await getPDFBlob();

        if (!blob) {

            return;

        }

        const file = new File(

            [blob],

            PDF_CONFIG.FILE_NAME,

            {

                type: "application/pdf"

            }

        );

        if (

            navigator.canShare &&

            navigator.canShare({

                files: [file]

            })

        ) {

            await navigator.share({

                title: "Matrimonial Biodata",

                text: "Please find my matrimonial biodata attached.",

                files: [file]

            });

            return;

        }

        downloadPDF();

    }

    catch (error) {

        console.error(error);

        downloadPDF();

    }

}


/*==========================================================
                    OPEN PDF
==========================================================*/

async function openPDF() {

    try {

        const blob = await getPDFBlob();

        if (!blob) {

            return;

        }

        const blobURL = URL.createObjectURL(blob);

        window.open(blobURL, "_blank");

        setTimeout(() => {

            URL.revokeObjectURL(blobURL);

        }, 10000);

    }

    catch (error) {

        console.error(error);

    }

}


/*==========================================================
                DOWNLOAD AS BLOB URL
==========================================================*/

async function downloadBlobURL() {

    const blob = await getPDFBlob();

    if (!blob) {

        return;

    }

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = PDF_CONFIG.FILE_NAME;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    setTimeout(() => {

        URL.revokeObjectURL(url);

    }, 5000);

}


/*==========================================================
                CHECK PDF SUPPORT
==========================================================*/

function isPDFSupported() {

    return (

        typeof html2canvas !== "undefined" &&

        typeof jspdf !== "undefined"

    );

}


/*==========================================================
                SHOW ERROR
==========================================================*/

function showPDFError(message) {

    console.error(message);

    alert(message);

}


/*==========================================================
                EXPORT FUNCTIONS
==========================================================*/

window.downloadPDF = downloadPDF;

window.generatePDF = generatePDF;

window.printPDF = printPDF;

window.sharePDF = sharePDF;

window.openPDF = openPDF;





/*==========================================================
                IMAGE OPTIMIZATION
==========================================================*/

function optimizeCanvas(canvas) {

    if (!canvas) {
        return null;
    }

    const optimizedCanvas = document.createElement("canvas");

    optimizedCanvas.width = canvas.width;
    optimizedCanvas.height = canvas.height;

    const ctx = optimizedCanvas.getContext("2d");

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
        canvas,
        0,
        0,
        optimizedCanvas.width,
        optimizedCanvas.height
    );

    return optimizedCanvas;

}


/*==========================================================
                WAIT
==========================================================*/

function wait(milliseconds) {

    return new Promise(resolve => {

        setTimeout(resolve, milliseconds);

    });

}


/*==========================================================
                SAFE EXECUTION
==========================================================*/

async function executeSafely(task) {

    try {

        return await task();

    }

    catch (error) {

        console.error(error);

        showPDFError(error.message);

        return null;

    }

}


/*==========================================================
                RESET MODULE
==========================================================*/

function resetPDFModule() {

    PDF_MODULE.generating = false;

}


/*==========================================================
                DESTROY MODULE
==========================================================*/

function destroyPDFModule() {

    cleanupPDF();

    resetPDFModule();

}


/*==========================================================
                CHECK LIBRARIES
==========================================================*/

function verifyLibraries() {

    if (typeof html2canvas === "undefined") {

        throw new Error(
            "html2canvas library is missing."
        );

    }

    if (typeof jspdf === "undefined") {

        throw new Error(
            "jsPDF library is missing."
        );

    }

}


/*==========================================================
                INITIAL CHECK
==========================================================*/

window.addEventListener(

    "load",

    () => {

        try {

            verifyLibraries();

            pdfLog("Libraries loaded successfully.");

        }

        catch (error) {

            console.error(error);

            alert(error.message);

        }

    }

);


/*==========================================================
                FILE NAME
==========================================================*/

function setPDFFileName(fileName) {

    if (!fileName) {

        return;

    }

    PDF_CONFIG.FILE_NAME = fileName;

}


/*==========================================================
                QUALITY
==========================================================*/

function setPDFQuality(scale = 2, quality = 1.0) {

    PDF_CONFIG.SCALE = scale;

    PDF_CONFIG.IMAGE_QUALITY = quality;

}


/*==========================================================
                DEBUG
==========================================================*/

function enablePDFDebug() {

    PDF_CONFIG.DEBUG = true;

}


function disablePDFDebug() {

    PDF_CONFIG.DEBUG = false;

}


/*==========================================================
                VERSION
==========================================================*/

const PDF_VERSION = "2.0.0";

pdfLog("PDF Module Version : " + PDF_VERSION);


/*==========================================================
                GLOBAL EXPORTS
==========================================================*/

window.PDF_CONFIG = PDF_CONFIG;
window.PDF_MODULE = PDF_MODULE;

window.setPDFFileName = setPDFFileName;
window.setPDFQuality = setPDFQuality;

window.enablePDFDebug = enablePDFDebug;
window.disablePDFDebug = disablePDFDebug;

window.destroyPDFModule = destroyPDFModule;

pdfLog("PDF Module Ready.");



console.log("pdf.js loaded");
