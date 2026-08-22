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

    if (data.summary) {

        html += `
            <div class="resume-section">
                <h2>Professional Summary</h2>
                <p>${escapeResumeHtml(data.summary)}</p>
            </div>
        `;

    }

    if (data.experience.length) {

        html += `<div class="resume-section"><h2>Work Experience</h2>`;

        data.experience.forEach((e) => {

            html += `
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

        html += `</div>`;

    }

    if (data.education.length) {

        html += `<div class="resume-section"><h2>Education</h2>`;

        data.education.forEach((e) => {

            html += `
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

        html += `</div>`;

    }

    if (data.skills) {

        const skillTags = data.skills.split(",").map(s => s.trim()).filter(Boolean);

        html += `
            <div class="resume-section">
                <h2>Skills</h2>
                <div class="resume-skill-tags">
                    ${skillTags.map(s => `<span>${escapeResumeHtml(s)}</span>`).join("")}
                </div>
            </div>
        `;

    }

    if (data.languages) {

        const langTags = data.languages.split(",").map(s => s.trim()).filter(Boolean);

        html += `
            <div class="resume-section">
                <h2>Languages</h2>
                <div class="resume-skill-tags">
                    ${langTags.map(s => `<span>${escapeResumeHtml(s)}</span>`).join("")}
                </div>
            </div>
        `;

    }

    if (data.projects) {

        html += `
            <div class="resume-section">
                <h2>Projects</h2>
                <p style="white-space:pre-line;">${escapeResumeHtml(data.projects)}</p>
            </div>
        `;

    }

    if (data.certifications) {

        html += `
            <div class="resume-section">
                <h2>Certifications</h2>
                <p style="white-space:pre-line;">${escapeResumeHtml(data.certifications)}</p>
            </div>
        `;

    }

    if (data.achievements) {

        html += `
            <div class="resume-section">
                <h2>Achievements</h2>
                <p style="white-space:pre-line;">${escapeResumeHtml(data.achievements)}</p>
            </div>
        `;

    }

    data.customSections.forEach((sec) => {

        if (!sec.title && !sec.content) return;

        html += `
            <div class="resume-section">
                <h2>${escapeResumeHtml(sec.title || "Additional Information")}</h2>
                <p style="white-space:pre-line;">${escapeResumeHtml(sec.content)}</p>
            </div>
        `;

    });

    if (data.hobbies) {

        html += `
            <div class="resume-section">
                <h2>Hobbies &amp; Interests</h2>
                <p>${escapeResumeHtml(data.hobbies)}</p>
            </div>
        `;

    }

    if (data.references) {

        html += `
            <div class="resume-section">
                <h2>References</h2>
                <p style="white-space:pre-line;">${escapeResumeHtml(data.references)}</p>
            </div>
        `;

    }

    container.innerHTML = html;

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

    const navBrand = document.getElementById("navBrandHome");

    if (navBrand && typeof returnToLandingPage === "function") {

        navBrand.addEventListener("click", (e) => {

            e.preventDefault();
            returnToLandingPage();

        });

    }

});
