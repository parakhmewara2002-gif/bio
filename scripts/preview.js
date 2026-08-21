// =========================================
// preview.js
// =========================================

function renderPreviewContainer() {

    /* ==========================
            Religious Header
    ========================== */

    document.getElementById("previewHeaderBlessing").textContent =
        getSelectedHeaderBlessing();

    /* ==========================
            Personal Details
    ========================== */

    document.getElementById("previewName").textContent =
        biodata.personal.fullName || "";

    document.getElementById("previewDOB").textContent =
        biodata.personal.dob || "";

    document.getElementById("previewTime").textContent =
        biodata.personal.timeOfBirth || "";

    document.getElementById("previewPlace").textContent =
        biodata.personal.placeOfBirth || "";

    document.getElementById("previewRashi").textContent =
        biodata.personal.rashi || "";

    document.getElementById("previewGan").textContent =
        biodata.personal.gan || "";

    document.getElementById("previewHeight").textContent =
        biodata.personal.height || "";

    document.getElementById("previewComplexion").textContent =
        biodata.personal.complexion || "";

    document.getElementById("previewMaritalStatus").textContent =
        biodata.personal.maritalStatus || "";

    document.getElementById("previewCaste").textContent =
        biodata.personal.caste || "";

    document.getElementById("previewManglik").textContent =
        biodata.personal.manglik || "";

    document.getElementById("previewLanguage").textContent =
        biodata.personal.language || "";

    document.getElementById("previewDiet").textContent =
        biodata.personal.diet || "";

    document.getElementById("previewHobbies").textContent =
        biodata.personal.hobbies || "";

    document.getElementById("previewOther").textContent =
        biodata.personal.other || "";



    /* ==========================
            Education & Career
    ========================== */

    document.getElementById("previewHighestQualification").textContent =
        biodata.education.highestQualification || "";

    document.getElementById("previewCollege").textContent =
        biodata.education.college || "";

    document.getElementById("previewBoard12th").textContent =
        biodata.education.Board12th || "";

    document.getElementById("previewBoard10th").textContent =
        biodata.education.Board10th || "";

    document.getElementById("previewSpecialSkill").textContent =
        biodata.education.specialSkill || "";

    document.getElementById("previewEducationOther").textContent =
        biodata.education.educationOther || "";

    /* ==========================
            Work & Career
    ========================== */

    document.getElementById("previewProfession").textContent =
        biodata.work.profession || "";

    document.getElementById("previewOrganization").textContent =
        biodata.work.organization || "";

    document.getElementById("previewWorkPlace").textContent =
        biodata.work.workPlace || "";

    document.getElementById("previewIncome").textContent =
        biodata.work.income || "";



    /* ==========================
            Family Details
    ========================== */

    document.getElementById("previewFatherName").textContent =
        biodata.family.fatherName || "";

    document.getElementById("previewFatherOccupation").textContent =
        biodata.family.fatherOccupation || "";

    document.getElementById("previewMotherName").textContent =
        biodata.family.motherName || "";

    document.getElementById("previewMotherOccupation").textContent =
        biodata.family.motherOccupation || "";

    document.getElementById("previewSiblingsDetails").textContent =
        biodata.family.siblingsDetails || "";



    /* ==========================
            Partner Preference
    ========================== */

    document.getElementById("previewPartnerQualification").textContent =
        biodata.partner.preferredQualification || "";

    document.getElementById("previewPartnerProfession").textContent =
        biodata.partner.preferredProfession || "";

    document.getElementById("previewPartnerLocation").textContent =
        biodata.partner.preferredLocation || "";

    document.getElementById("previewPartnerOther").textContent =
        biodata.partner.otherExpectations || "";



    /* ==========================
            Contact Details
    ========================== */

    document.getElementById("previewMobile").textContent =
        biodata.contact.mobileNumber || "";

    document.getElementById("previewSenderName").textContent =
        biodata.declaration.senderName || "";

    document.getElementById("previewSenderMobile").textContent =
        biodata.declaration.senderMobile || "";


    /* ==========================
            Address
    ========================== */

    document.getElementById("previewCurrentAddress").textContent =
        biodata.contact.currentAddress || "";

    document.getElementById("previewPermanentAddress").textContent =
        biodata.contact.permanentAddress || "";



    /* ==========================
            Profile Photo
    ========================== */

    document.getElementById("previewPhoto").src =
        biodata.photos.profilePhoto?.preview ||
        "assets/images/defaults/default-profile.png";

    applyPositions();
}









function applyPositions() {

    Object.entries(POSITIONS).forEach(([id, p]) => {

        const e = document.getElementById(id);

        if (!e) return;

        e.style.position = "absolute";

        e.style.left = p.left + "px";

        e.style.top = p.top + "px";

        if (p.width)
            e.style.width = p.width + "px";

        if (p.height)
            e.style.height = p.height + "px";

        if (p.fontSize)
            e.style.fontSize = p.fontSize + "px";

        if (p.fontWeight)
            e.style.fontWeight = p.fontWeight;

        e.style.lineHeight = "1.3";

        if (p.align)
            e.style.textAlign = p.align;

        /*=========================================
                RELIGIOUS HEADER STYLE
        =========================================*/

        if (id === "previewHeaderBlessing") {

            e.style.color = "#8a1f2d";
            e.style.fontFamily = "'Noto Sans Devanagari', 'Mangal', sans-serif";
            e.style.textAlign = "center";

        }

        /*=========================================
                PREMIUM NAME STYLE
        =========================================*/

        if (id === "previewName") {

            e.style.fontFamily = "'Playfair Display', serif";

            e.style.fontSize = "30px";

            e.style.fontWeight = "650";

            e.style.color = "#003153";

            e.style.letterSpacing = "1.5px";

            e.style.textAlign = "left";

            e.style.fontStyle = "italic";

            e.style.textShadow = "0 1px 0 #fff, 0 2px 3px rgba(0,0,0,0.35)";

            e.style.textTransform = "uppercase";
        }

        /*=========================================
                MULTI-LINE SUPPORT
        =========================================*/

        if (p.multiline) {

            e.style.whiteSpace = "normal";

            e.style.wordBreak = "break-word";

            e.style.overflowWrap = "break-word";

            e.style.overflow = "hidden";

            e.style.lineHeight = "1.3";

            if (p.height) {

                e.style.height = p.height + "px";

            }

        }

        else {

            e.style.whiteSpace = "nowrap";

            e.style.overflow = "visible";

            e.style.display = "block";

            e.style.webkitLineClamp = "";

            e.style.webkitBoxOrient = "";

        }

    });

    autoFitAllText();

}




/*=========================================
        AUTO-FIT TEXT (prevents overflow
        when longer values are entered)
=========================================*/

function autoFitText(e, p) {

    if (!e || !p) return;

    if (p.multiline) {

        if (!p.height) return;

        let size = p.fontSize || 18;
        const minFontSize = Math.max(10, Math.round(size * 0.55));

        e.style.fontSize = size + "px";

        // shrink until the text block fits inside its box height
        while (e.scrollHeight > p.height && size > minFontSize) {

            size -= 1;
            e.style.fontSize = size + "px";

        }

    } else {

        if (!p.width) return;

        let size = parseFloat(e.style.fontSize) || p.fontSize || 18;
        const minFontSize = Math.max(10, Math.round(size * 0.55));

        e.style.fontSize = size + "px";

        // shrink until the single line fits inside its box width
        while (e.scrollWidth > p.width && size > minFontSize) {

            size -= 1;
            e.style.fontSize = size + "px";

        }

        // last-resort safety net: if it still doesn't fit at the
        // smallest readable size, clip cleanly instead of overlapping
        // neighbouring content (e.g. the photo box)
        if (e.scrollWidth > p.width) {

            e.style.overflow = "hidden";
            e.style.textOverflow = "ellipsis";

        }

    }

}


function autoFitAllText() {

    Object.entries(POSITIONS).forEach(([id, p]) => {

        const e = document.getElementById(id);

        if (!e) return;

        autoFitText(e, p);

    });

}




/*==========================================================
        MODERN BIODATA TEMPLATE (flowing HTML alternative)
==========================================================*/

function escapeBiodataHtml(s) {

    const d = document.createElement("div");
    d.textContent = s || "";
    return d.innerHTML;

}


function getSelectedBiodataTemplate() {

    const checked = document.querySelector('input[name="biodataTemplate"]:checked');
    return checked ? checked.value : "classic";

}


function bmpRow(label, value) {

    if (!value) return "";
    return `<tr><td>${escapeBiodataHtml(label)}</td><td>${escapeBiodataHtml(value)}</td></tr>`;

}


function renderModernBiodataPreview() {

    const container = document.getElementById("biodataModernPreview");

    if (!container || typeof biodata === "undefined") return;

    const selectedTemplate = typeof getSelectedBiodataTemplate === "function"
        ? getSelectedBiodataTemplate()
        : "modern";

    container.className = "biodata-flow-template-" + selectedTemplate;

    const p = biodata.personal || {};
    const edu = biodata.education || {};
    const work = biodata.work || {};
    const fam = biodata.family || {};
    const partner = biodata.partner || {};
    const contact = biodata.contact || {};

    const photoUrl = biodata.photos && biodata.photos.profilePhoto
        ? biodata.photos.profilePhoto.preview
        : "";

    const blessing = typeof getSelectedHeaderBlessing === "function"
        ? getSelectedHeaderBlessing()
        : "|| ॐ गं गणपतये नमः ||";

    const miniLine = [
        p.dob,
        p.height,
        work.profession
    ].filter(Boolean).map(escapeBiodataHtml).join(" &nbsp;|&nbsp; ");

    let html = `
        <div class="bmp-header">
            <div class="bmp-blessing">${escapeBiodataHtml(blessing)}</div>
            <div class="bmp-title">BIODATA</div>
            <div class="bmp-divider"></div>
        </div>

        <div class="bmp-top">
            ${photoUrl ? `<img class="bmp-photo" src="${photoUrl}">` : `<div class="bmp-photo"></div>`}
            <div>
                <div class="bmp-name">${escapeBiodataHtml(p.fullName) || "Full Name"}</div>
                <div class="bmp-mini">${miniLine}</div>
            </div>
        </div>

        <div class="bmp-section">
            <h3>Personal Details</h3>
            <table class="bmp-table">
                ${bmpRow("Date of Birth", p.dob)}
                ${bmpRow("Time of Birth", p.timeOfBirth)}
                ${bmpRow("Place of Birth", p.placeOfBirth)}
                ${bmpRow("Height", p.height)}
                ${bmpRow("Complexion", p.complexion)}
                ${bmpRow("Caste", p.caste)}
                ${bmpRow("Rashi", p.rashi)}
                ${bmpRow("Gan", p.gan)}
                ${bmpRow("Manglik Status", p.manglik)}
                ${bmpRow("Marital Status", p.maritalStatus)}
                ${bmpRow("Diet", p.diet)}
                ${bmpRow("Language", p.language)}
                ${bmpRow("Hobbies", p.hobbies)}
                ${bmpRow("Other", p.other)}
            </table>
        </div>

        <div class="bmp-section">
            <h3>Education & Career</h3>
            <table class="bmp-table">
                ${bmpRow("Qualification", edu.highestQualification)}
                ${bmpRow("College", edu.college)}
                ${bmpRow("Profession", work.profession)}
                ${bmpRow("Organization", work.organization)}
                ${bmpRow("Work Place", work.workPlace)}
                ${bmpRow("Income", work.income)}
            </table>
        </div>

        <div class="bmp-section">
            <h3>Family Details</h3>
            <table class="bmp-table">
                ${bmpRow("Father's Name", fam.fatherName)}
                ${bmpRow("Father's Occupation", fam.fatherOccupation)}
                ${bmpRow("Mother's Name", fam.motherName)}
                ${bmpRow("Mother's Occupation", fam.motherOccupation)}
                ${bmpRow("Siblings", fam.siblingsDetails)}
            </table>
        </div>

        ${(partner.preferredQualification || partner.preferredProfession || partner.preferredLocation) ? `
        <div class="bmp-section">
            <h3>Partner Preference</h3>
            <table class="bmp-table">
                ${bmpRow("Qualification", partner.preferredQualification)}
                ${bmpRow("Profession", partner.preferredProfession)}
                ${bmpRow("Location", partner.preferredLocation)}
            </table>
        </div>` : ""}

        <div class="bmp-section">
            <h3>Contact Details</h3>
            <table class="bmp-table">
                ${bmpRow("Mobile", contact.mobileNumber)}
                ${bmpRow("Current Address", contact.currentAddress)}
                ${bmpRow("Permanent Address", contact.permanentAddress)}
            </table>
        </div>
    `;

    container.innerHTML = html;

}
