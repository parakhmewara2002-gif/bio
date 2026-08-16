// =========================================
// preview.js
// =========================================

function renderPreviewContainer() {

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

}






