/*==========================================================
                SHOWCASE.JS
    Wires up the "Interactive Template Showcase" section's
    Quick Use buttons, and fixes the orphan previewCreateBtn
    (had no click handler since the original site upload).
==========================================================*/

function initializeShowcaseButtons() {

    document.querySelectorAll(".showcase-card").forEach((card) => {

        card.addEventListener("click", () => {

            const type = card.dataset.showcaseType;
            const template = card.dataset.showcaseTemplate;

            if (type === "biodata" && typeof openBiodataForm === "function") {

                openBiodataForm();

                const radio = document.querySelector(`input[name="biodataTemplate"][value="${template}"]`);

                if (radio) {

                    radio.checked = true;
                    radio.dispatchEvent(new Event("change", { bubbles: true }));

                }

            } else if (type === "resume" && typeof openResumeForm === "function") {

                openResumeForm();

                const radio = document.querySelector(`input[name="resumeTemplate"][value="${template}"]`);

                if (radio) {

                    radio.checked = true;
                    radio.dispatchEvent(new Event("change", { bubbles: true }));

                }

            }

        });

    });

}


function initializePreviewCreateButton() {

    const btn = document.getElementById("previewCreateBtn");

    if (btn && typeof openBiodataForm === "function") {

        btn.addEventListener("click", openBiodataForm);

    }

}


function initializeFinalCtaButtons() {

    const biodataBtn = document.getElementById("finalCtaBiodataBtn");
    const resumeBtn = document.getElementById("finalCtaResumeBtn");

    if (biodataBtn && typeof openBiodataForm === "function") {

        biodataBtn.addEventListener("click", openBiodataForm);

    }

    if (resumeBtn && typeof openResumeForm === "function") {

        resumeBtn.addEventListener("click", openResumeForm);

    }

}


document.addEventListener("DOMContentLoaded", () => {

    initializeShowcaseButtons();
    initializePreviewCreateButton();
    initializeFinalCtaButtons();

});
