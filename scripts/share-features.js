/*==========================================================
                SHARE-FEATURES.JS
    WhatsApp share (text message — the PDF itself must be
    attached manually since there is no server to host it)
    and Contact QR Code generation for Biodata and Resume.
==========================================================*/

function sfOpenWhatsApp(message) {

    const url = "https://wa.me/?text=" + encodeURIComponent(message);
    window.open(url, "_blank", "noopener");

}


function sfInitWhatsAppButtons() {

    const biodataBtn = document.getElementById("whatsappShareBiodataBtn");
    const resumeBtn = document.getElementById("whatsappShareResumeBtn");

    if (biodataBtn) {

        biodataBtn.addEventListener("click", () => {

            const name = (typeof biodata !== "undefined" && biodata.personal && biodata.personal.fullName)
                ? biodata.personal.fullName
                : "";

            const message = name
                ? `Here is ${name}'s biodata, created with Biodata & Resume Studio. Please find the PDF attached.`
                : "Here is my biodata, created with Biodata & Resume Studio. Please find the PDF attached.";

            sfOpenWhatsApp(message);

        });

    }

    if (resumeBtn) {

        resumeBtn.addEventListener("click", () => {

            const nameEl = document.getElementById("resumeFullName");
            const name = nameEl ? nameEl.value.trim() : "";

            const message = name
                ? `Here is ${name}'s resume, created with Biodata & Resume Studio. Please find the PDF attached.`
                : "Here is my resume, created with Biodata & Resume Studio. Please find the PDF attached.";

            sfOpenWhatsApp(message);

        });

    }

}


/*==========================================================
                QR CODE GENERATION
==========================================================*/

function sfRenderQrCode(container, data) {

    container.innerHTML = "";

    if (!data) {

        container.innerHTML = "<p class='text-muted small mb-0'>Add a phone number or email first to generate a QR code.</p>";
        container.classList.remove("d-none");
        return;

    }

    try {

        const qr = qrcode(0, "M");
        qr.addData(data);
        qr.make();

        container.innerHTML = qr.createSvgTag(4, 8);
        container.classList.remove("d-none");

    } catch (e) {

        container.innerHTML = "<p class='text-muted small mb-0'>Could not generate QR code.</p>";
        container.classList.remove("d-none");

    }

}


function sfInitQrCodeButtons() {

    const biodataBtn = document.getElementById("qrCodeBiodataBtn");
    const resumeBtn = document.getElementById("qrCodeResumeBtn");

    if (biodataBtn) {

        biodataBtn.addEventListener("click", () => {

            const container = document.getElementById("qrCodeBiodataPreview");

            if (container.classList.contains("d-none")) {

                const phone = (typeof biodata !== "undefined" && biodata.contact && biodata.contact.mobileNumber)
                    ? biodata.contact.mobileNumber.replace(/[\s\-]/g, "")
                    : "";

                sfRenderQrCode(container, phone ? `tel:${phone}` : "");

            } else {

                container.classList.add("d-none");

            }

        });

    }

    if (resumeBtn) {

        resumeBtn.addEventListener("click", () => {

            const container = document.getElementById("qrCodeResumePreview");

            if (container.classList.contains("d-none")) {

                const emailEl = document.getElementById("resumeEmail");
                const phoneEl = document.getElementById("resumePhone");

                const email = emailEl ? emailEl.value.trim() : "";
                const phone = phoneEl ? phoneEl.value.trim().replace(/[\s\-]/g, "") : "";

                const data = email ? `mailto:${email}` : (phone ? `tel:${phone}` : "");

                sfRenderQrCode(container, data);

            } else {

                container.classList.add("d-none");

            }

        });

    }

}


document.addEventListener("DOMContentLoaded", () => {

    sfInitWhatsAppButtons();
    sfInitQrCodeButtons();

});
