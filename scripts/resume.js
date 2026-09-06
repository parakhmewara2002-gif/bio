/*==========================================================
                RESUME.JS
    Handles the Resume Generator: step navigation,
    repeatable Education/Experience rows, live preview,
    and PDF download.
==========================================================*/

let resumeCurrentStep = 1;
const RESUME_TOTAL_STEPS = 5;


/*==========================================================
                OPEN / CLOSE RESUME FORM
==========================================================*/

function openResumeForm() {

    hideSection("hero");
    hideSection("features");
    hideSection("preview");
    hideSection("how-it-works");
    hideSection("faq");
    hideSection("footer");

    const formSection = document.getElementById("resumeFormSection");

    if (formSection) {

        formSection.classList.remove("d-none");

    }

    resumeCurrentStep = 1;
    showResumeStep(resumeCurrentStep);

    window.scrollTo({ top: 0, behavior: "smooth" });

}


function initializeResumeTemplatePicker() {

    document.querySelectorAll('input[name="resumeTemplate"]').forEach((radio) => {

        radio.addEventListener("change", renderResumePreview);

    });

}


function initializeCreateResumeButton() {

    const heroButton = document.getElementById("createResumeBtn");

    if (heroButton) {

        heroButton.addEventListener("click", openResumeForm);

    }

}


/*==========================================================
                STEP NAVIGATION
==========================================================*/

function showResumeStep(step) {

    document.querySelectorAll("[data-resume-step]").forEach((el) => {

        el.classList.add("d-none");
        el.classList.remove("active-step");

    });

    const current = document.querySelector(`[data-resume-step="${step}"]`);

    if (current) {

        current.classList.remove("d-none");
        current.classList.add("active-step");

    }

    const indicator = document.getElementById("resumeStepIndicator");

    if (indicator) {

        indicator.textContent = `${step} / ${RESUME_TOTAL_STEPS}`;

    }

    const prevBtn = document.getElementById("resumePreviousStepBtn");
    const nextBtn = document.getElementById("resumeNextStepBtn");

    if (prevBtn) prevBtn.disabled = step === 1;

    if (nextBtn) {

        nextBtn.innerHTML = step === RESUME_TOTAL_STEPS
            ? `Done <i class="fa-solid fa-check"></i>`
            : `Next <i class="fa-solid fa-arrow-right"></i>`;

    }

    if (step === RESUME_TOTAL_STEPS) {

        renderResumePreview();

    }

    window.scrollTo({ top: 0, behavior: "smooth" });

}


function initializeResumeStepNavigation() {

    const prevBtn = document.getElementById("resumePreviousStepBtn");
    const nextBtn = document.getElementById("resumeNextStepBtn");

    if (prevBtn) {

        prevBtn.addEventListener("click", () => {

            if (resumeCurrentStep > 1) {

                resumeCurrentStep--;
                showResumeStep(resumeCurrentStep);

            }

        });

    }

    if (nextBtn) {

        nextBtn.addEventListener("click", () => {

            if (resumeCurrentStep < RESUME_TOTAL_STEPS) {

                resumeCurrentStep++;
                showResumeStep(resumeCurrentStep);

            }

        });

    }

}


/*==========================================================
                REPEATABLE ROWS (Education / Experience)
==========================================================*/

function addResumeRepeatRow(templateId, listId) {

    const template = document.getElementById(templateId);
    const list = document.getElementById(listId);

    if (!template || !list) return;

    const clone = template.content.cloneNode(true);
    const block = clone.querySelector(".resume-repeat-block");

    block.querySelector(".resume-remove-block").addEventListener("click", () => {

        block.remove();

    });

    list.appendChild(clone);

}


/*==========================================================
                RESUME SECTION REORDERING
==========================================================*/

function renderResumeSectionOrderList() {

    const list = document.getElementById("resumeSectionOrderList");

    if (!list) return;

    list.innerHTML = "";

    RESUME_SECTION_ORDER.forEach((key, index) => {

        const li = document.createElement("li");
        li.className = "resume-section-order-item";
        li.setAttribute("draggable", "true");
        li.dataset.index = index;

        li.innerHTML = `
            <span class="resume-order-drag-handle" aria-hidden="true">⠿</span>
            <span class="resume-order-item-label">${RESUME_SECTION_LABELS[key] || key}</span>
            <span class="resume-section-order-buttons">
                <button type="button" class="resume-order-btn" data-dir="up" data-index="${index}" ${index === 0 ? "disabled" : ""} aria-label="Move ${RESUME_SECTION_LABELS[key]} up">↑</button>
                <button type="button" class="resume-order-btn" data-dir="down" data-index="${index}" ${index === RESUME_SECTION_ORDER.length - 1 ? "disabled" : ""} aria-label="Move ${RESUME_SECTION_LABELS[key]} down">↓</button>
            </span>
        `;

        list.appendChild(li);

    });

    list.querySelectorAll(".resume-order-btn").forEach((btn) => {

        btn.addEventListener("click", () => {

            const index = parseInt(btn.dataset.index, 10);
            const dir = btn.dataset.dir;
            const swapWith = dir === "up" ? index - 1 : index + 1;

            if (swapWith < 0 || swapWith >= RESUME_SECTION_ORDER.length) return;

            const temp = RESUME_SECTION_ORDER[index];
            RESUME_SECTION_ORDER[index] = RESUME_SECTION_ORDER[swapWith];
            RESUME_SECTION_ORDER[swapWith] = temp;

            renderResumeSectionOrderList();
            renderResumePreview();

        });

    });

    initializeResumeSectionDragDrop(list);

}


let resumeDragSourceIndex = null;


function initializeResumeSectionDragDrop(list) {

    const items = list.querySelectorAll(".resume-section-order-item");

    items.forEach((item) => {

        item.addEventListener("dragstart", () => {

            resumeDragSourceIndex = parseInt(item.dataset.index, 10);
            item.classList.add("dragging");

        });

        item.addEventListener("dragend", () => {

            item.classList.remove("dragging");

        });

        item.addEventListener("dragover", (e) => {

            e.preventDefault();
            item.classList.add("drag-over");

        });

        item.addEventListener("dragleave", () => {

            item.classList.remove("drag-over");

        });

        item.addEventListener("drop", (e) => {

            e.preventDefault();
            item.classList.remove("drag-over");

            const targetIndex = parseInt(item.dataset.index, 10);

            if (resumeDragSourceIndex === null || resumeDragSourceIndex === targetIndex) return;

            const moved = RESUME_SECTION_ORDER.splice(resumeDragSourceIndex, 1)[0];
            RESUME_SECTION_ORDER.splice(targetIndex, 0, moved);

            resumeDragSourceIndex = null;

            renderResumeSectionOrderList();
            renderResumePreview();

        });

    });

}


function initializeResumeRepeatButtons() {

    const addEduBtn = document.getElementById("resumeAddEducation");
    const addExpBtn = document.getElementById("resumeAddExperience");
    const addCustomBtn = document.getElementById("resumeAddCustom");

    if (addEduBtn) {

        addEduBtn.addEventListener("click", () => {

            addResumeRepeatRow("resumeEducationTemplate", "resumeEducationList");

        });

        // seed one row by default
        addResumeRepeatRow("resumeEducationTemplate", "resumeEducationList");

    }

    if (addExpBtn) {

        addExpBtn.addEventListener("click", () => {

            addResumeRepeatRow("resumeExperienceTemplate", "resumeExperienceList");

        });

        addResumeRepeatRow("resumeExperienceTemplate", "resumeExperienceList");

    }

    if (addCustomBtn) {

        addCustomBtn.addEventListener("click", () => {

            addResumeRepeatRow("resumeCustomSectionTemplate", "resumeCustomList");

        });

    }

}


/*==========================================================
                COLLECT FORM DATA
==========================================================*/

function collectResumeData() {

    const val = (id) => {
        const el = document.getElementById(id);
        return el ? el.value.trim() : "";
    };

    const education = [];

    document.querySelectorAll("#resumeEducationList .resume-repeat-block").forEach((block) => {

        const degree = block.querySelector(".resume-edu-degree").value.trim();
        const institution = block.querySelector(".resume-edu-institution").value.trim();
        const year = block.querySelector(".resume-edu-year").value.trim();
        const score = block.querySelector(".resume-edu-score").value.trim();

        if (degree || institution || year || score) {

            education.push({ degree, institution, year, score });

        }

    });

    const experience = [];

    document.querySelectorAll("#resumeExperienceList .resume-repeat-block").forEach((block) => {

        const title = block.querySelector(".resume-exp-title").value.trim();
        const company = block.querySelector(".resume-exp-company").value.trim();
        const duration = block.querySelector(".resume-exp-duration").value.trim();
        const description = block.querySelector(".resume-exp-description").value.trim();

        if (title || company || duration || description) {

            experience.push({ title, company, duration, description });

        }

    });

    const customSections = [];

    document.querySelectorAll("#resumeCustomList .resume-repeat-block").forEach((block) => {

        const title = block.querySelector(".resume-custom-title").value.trim();
        const content = block.querySelector(".resume-custom-content").value.trim();

        if (title || content) {

            customSections.push({ title, content });

        }

    });

    return {
        fullName: val("resumeFullName"),
        email: val("resumeEmail"),
        phone: val("resumePhone"),
        location: val("resumeLocation"),
        linkedin: val("resumeLinkedin"),
        summary: val("resumeSummary"),
        education,
        experience,
        skills: val("resumeSkills"),
        languages: val("resumeLanguages"),
        hobbies: val("resumeHobbies"),
        projects: val("resumeProjects"),
        certifications: val("resumeCertifications"),
        achievements: val("resumeAchievements"),
        references: val("resumeReferences"),
        customSections
    };

}


/*==========================================================
                LIVE PREVIEW (flowing HTML, not fixed-position)
==========================================================*/

function escapeResumeHtml(s) {

    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;

}


function getSelectedResumeTemplate() {

    const checked = document.querySelector('input[name="resumeTemplate"]:checked');
    return checked ? checked.value : "modern";

}


const RESUME_SECTION_LABELS = {
    summary: "Professional Summary",
    experience: "Work Experience",
    education: "Education",
    skills: "Skills",
    languages: "Languages",
    projects: "Projects",
    certifications: "Certifications",
    achievements: "Achievements",
    custom: "Custom Sections",
    hobbies: "Hobbies & Interests",
    references: "References"
};

let RESUME_SECTION_ORDER = [
    "summary", "experience", "education", "skills",
    "languages", "projects", "certifications",
    "achievements", "custom", "hobbies", "references"
];


function renderResumePreview() {

    const data = collectResumeData();
    const container = document.getElementById("resumePreview");

    if (!container) return;

    container.className = "resume-template-" + getSelectedResumeTemplate();

    const contactBits = [data.phone, data.email, data.location, data.linkedin]
        .filter(Boolean)
        .map(escapeResumeHtml)
        .join(" &nbsp;|&nbsp; ");

    let html = `
        <div class="resume-header">
            <h1>${escapeResumeHtml(data.fullName || "Your Name")}</h1>
            ${contactBits ? `<p class="resume-contact">${contactBits}</p>` : ""}
        </div>
    `;

    const sectionsHtml = {};

    sectionsHtml.summary = data.summary ? `
        <div class="resume-section">
            <h2>${RESUME_SECTION_LABELS.summary}</h2>
            <p>${escapeResumeHtml(data.summary)}</p>
        </div>
    ` : "";

    sectionsHtml.experience = data.experience.length ? (() => {

        let block = `<div class="resume-section"><h2>${RESUME_SECTION_LABELS.experience}</h2>`;

        data.experience.forEach((e) => {

            block += `
                <div class="resume-entry">
                    <div class="resume-entry-top">
                        <strong>${escapeResumeHtml(e.title || "")}</strong>
                        <span>${escapeResumeHtml(e.duration || "")}</span>
                    </div>
                    <div class="resume-entry-sub">${escapeResumeHtml(e.company || "")}</div>
                    ${e.description ? `<p>${escapeResumeHtml(e.description)}</p>` : ""}
                </div>
            `;

        });

        return block + `</div>`;

    })() : "";

    sectionsHtml.education = data.education.length ? (() => {

        let block = `<div class="resume-section"><h2>${RESUME_SECTION_LABELS.education}</h2>`;

        data.education.forEach((e) => {

            block += `
                <div class="resume-entry">
                    <div class="resume-entry-top">
                        <strong>${escapeResumeHtml(e.degree || "")}</strong>
                        <span>${escapeResumeHtml(e.year || "")}</span>
                    </div>
                    <div class="resume-entry-sub">
                        ${escapeResumeHtml(e.institution || "")}
                        ${e.score ? " &nbsp;|&nbsp; " + escapeResumeHtml(e.score) : ""}
                    </div>
                </div>
            `;

        });

        return block + `</div>`;

    })() : "";

    sectionsHtml.skills = data.skills ? `
        <div class="resume-section">
            <h2>${RESUME_SECTION_LABELS.skills}</h2>
            <div class="resume-skill-tags">
                ${data.skills.split(",").map(s => s.trim()).filter(Boolean).map(s => `<span>${escapeResumeHtml(s)}</span>`).join("")}
            </div>
        </div>
    ` : "";

    sectionsHtml.languages = data.languages ? `
        <div class="resume-section">
            <h2>${RESUME_SECTION_LABELS.languages}</h2>
            <div class="resume-skill-tags">
                ${data.languages.split(",").map(s => s.trim()).filter(Boolean).map(s => `<span>${escapeResumeHtml(s)}</span>`).join("")}
            </div>
        </div>
    ` : "";

    sectionsHtml.projects = data.projects ? `
        <div class="resume-section">
            <h2>${RESUME_SECTION_LABELS.projects}</h2>
            <p style="white-space:pre-line;">${escapeResumeHtml(data.projects)}</p>
        </div>
    ` : "";

    sectionsHtml.certifications = data.certifications ? `
        <div class="resume-section">
            <h2>${RESUME_SECTION_LABELS.certifications}</h2>
            <p style="white-space:pre-line;">${escapeResumeHtml(data.certifications)}</p>
        </div>
    ` : "";

    sectionsHtml.achievements = data.achievements ? `
        <div class="resume-section">
            <h2>${RESUME_SECTION_LABELS.achievements}</h2>
            <p style="white-space:pre-line;">${escapeResumeHtml(data.achievements)}</p>
        </div>
    ` : "";

    sectionsHtml.custom = data.customSections.some(s => s.title || s.content) ? data.customSections.map((sec) => {

        if (!sec.title && !sec.content) return "";

        return `
            <div class="resume-section">
                <h2>${escapeResumeHtml(sec.title || "Additional Information")}</h2>
                <p style="white-space:pre-line;">${escapeResumeHtml(sec.content)}</p>
            </div>
        `;

    }).join("") : "";

    sectionsHtml.hobbies = data.hobbies ? `
        <div class="resume-section">
            <h2>${RESUME_SECTION_LABELS.hobbies}</h2>
            <p>${escapeResumeHtml(data.hobbies)}</p>
        </div>
    ` : "";

    sectionsHtml.references = data.references ? `
        <div class="resume-section">
            <h2>${RESUME_SECTION_LABELS.references}</h2>
            <p style="white-space:pre-line;">${escapeResumeHtml(data.references)}</p>
        </div>
    ` : "";

    RESUME_SECTION_ORDER.forEach((key) => {

        html += sectionsHtml[key] || "";

    });

    container.innerHTML = html;

    if (typeof applyResumeCustomization === "function") applyResumeCustomization();

}


/*==========================================================
                PDF DOWNLOAD
==========================================================*/

async function downloadResumePDF() {

    const btn = document.getElementById("downloadResumePdfBtn");
    const original = btn ? btn.innerHTML : "";

    if (btn) {

        btn.disabled = true;
        btn.innerHTML = "Preparing...";

    }

    try {

        renderResumePreview();

        const node = document.getElementById("resumePreview");

        const canvas = await html2canvas(node, {
            scale: 2.5,
            useCORS: true,
            backgroundColor: "#ffffff"
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jspdf.jsPDF({ unit: "pt", format: "a4" });

        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        const margin = 24;
        const imgW = pageW - margin * 2;
        const imgH = (canvas.height * imgW) / canvas.width;

        if (imgH <= pageH - margin * 2) {

            pdf.addImage(imgData, "PNG", margin, margin, imgW, imgH);

        } else {

            let remaining = canvas.height;
            let srcY = 0;
            const pageCanvasH = ((pageH - margin * 2) * canvas.width) / imgW;
            let first = true;

            while (remaining > 0) {

                const sliceH = Math.min(pageCanvasH, remaining);
                const sliceCanvas = document.createElement("canvas");

                sliceCanvas.width = canvas.width;
                sliceCanvas.height = sliceH;

                sliceCanvas.getContext("2d").drawImage(
                    canvas, 0, srcY, canvas.width, sliceH,
                    0, 0, canvas.width, sliceH
                );

                const sliceImg = sliceCanvas.toDataURL("image/png");

                if (!first) pdf.addPage();

                pdf.addImage(sliceImg, "PNG", margin, margin, imgW, (sliceH * imgW) / canvas.width);

                srcY += sliceH;
                remaining -= sliceH;
                first = false;

            }

        }

        const data = collectResumeData();
        const fileName = `${(data.fullName || "Resume").replace(/[\\/:*?"<>|]/g, "_")}_Resume.pdf`;

        pdf.save(fileName);

    } catch (error) {

        console.error(error);
        alert("Unable to generate PDF. Please try again.");

    } finally {

        if (btn) {

            btn.disabled = false;
            btn.innerHTML = original;

        }

    }

}


function initializeResumeDownloadButton() {

    const btn = document.getElementById("downloadResumePdfBtn");

    if (btn) {

        btn.addEventListener("click", downloadResumePDF);

    }

}


/*==========================================================
                INIT
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeCreateResumeButton();
    initializeResumeStepNavigation();
    initializeResumeRepeatButtons();
    initializeResumeDownloadButton();
    initializeResumeTemplatePicker();
    renderResumeSectionOrderList();

    const navBrand = document.getElementById("navBrandHome");

    if (navBrand && typeof returnToLandingPage === "function") {

        navBrand.addEventListener("click", (e) => {

            e.preventDefault();
            returnToLandingPage();

        });

    }

});
