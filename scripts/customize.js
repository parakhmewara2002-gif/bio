/*==========================================================
                CUSTOMIZE.JS
    Accent color + font size customization for the flowing
    Biodata templates (Modern/Royal/Minimal/etc) and Resume.
    Colors are applied as inline styles after each render pass
    so they reliably override the template's own CSS.
==========================================================*/

const CUSTOMIZE_STATE = {
    biodataAccent: "",
    biodataFontSize: "medium",
    biodataFontFamily: "",
    resumeAccent: "",
    resumeFontSize: "medium",
    resumeFontFamily: ""
};


function applyBiodataCustomization() {

    const container = document.getElementById("biodataModernPreview");

    if (!container) return;

    // font size class (template class is set separately by renderModernBiodataPreview)
    container.classList.remove("customize-font-small", "customize-font-large");

    if (CUSTOMIZE_STATE.biodataFontSize === "small") container.classList.add("customize-font-small");
    if (CUSTOMIZE_STATE.biodataFontSize === "large") container.classList.add("customize-font-large");

    container.style.fontFamily = CUSTOMIZE_STATE.biodataFontFamily || "";

    const accent = CUSTOMIZE_STATE.biodataAccent;

    if (!accent) return; // template default — nothing to override

    container.querySelectorAll(".bmp-title, .bmp-name, .bmp-section h3, .bmp-blessing")
        .forEach(el => { el.style.color = accent; });

    container.querySelectorAll(".bmp-divider").forEach(el => {
        el.style.background = `linear-gradient(90deg, transparent, ${accent}, transparent)`;
    });

    container.querySelectorAll(".bmp-photo").forEach(el => { el.style.borderColor = accent; });

}


function applyResumeCustomization() {

    const container = document.getElementById("resumePreview");

    if (!container) return;

    container.classList.remove("customize-font-small", "customize-font-large");

    if (CUSTOMIZE_STATE.resumeFontSize === "small") container.classList.add("customize-font-small");
    if (CUSTOMIZE_STATE.resumeFontSize === "large") container.classList.add("customize-font-large");

    container.style.fontFamily = CUSTOMIZE_STATE.resumeFontFamily || "";

    const accent = CUSTOMIZE_STATE.resumeAccent;

    if (!accent) return;

    container.querySelectorAll(".resume-header h1, .resume-section h2, .resume-entry-top strong")
        .forEach(el => { el.style.color = accent; });

    container.querySelectorAll(".resume-skill-tags span").forEach(el => {
        el.style.background = accent;
        el.style.color = "#ffffff";
    });

}


function initializeCustomizePanel(targetPrefix, stateAccentKey, stateFontKey) {

    const swatchWrap = document.querySelector(`.customize-swatches[data-target="${targetPrefix}Accent"]`);
    const sizeWrap = document.querySelector(`.customize-size-buttons[data-target="${targetPrefix}FontSize"]`);
    const customColorInput = document.getElementById(`${targetPrefix}AccentCustom`);
    const fontFamilySelect = document.getElementById(`${targetPrefix}FontFamily`);
    const stateFontFamilyKey = `${targetPrefix}FontFamily`;

    if (fontFamilySelect) {

        fontFamilySelect.addEventListener("change", () => {

            CUSTOMIZE_STATE[stateFontFamilyKey] = fontFamilySelect.value;

        });

    }

    if (swatchWrap) {

        swatchWrap.querySelectorAll(".customize-swatch").forEach((btn) => {

            btn.addEventListener("click", () => {

                swatchWrap.querySelectorAll(".customize-swatch").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                CUSTOMIZE_STATE[stateAccentKey] = btn.dataset.color || "";

            });

        });

    }

    if (customColorInput) {

        customColorInput.addEventListener("input", () => {

            if (swatchWrap) swatchWrap.querySelectorAll(".customize-swatch").forEach(b => b.classList.remove("active"));

            CUSTOMIZE_STATE[stateAccentKey] = customColorInput.value;

        });

    }

    if (sizeWrap) {

        sizeWrap.querySelectorAll(".customize-size-btn").forEach((btn) => {

            btn.addEventListener("click", () => {

                sizeWrap.querySelectorAll(".customize-size-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                CUSTOMIZE_STATE[stateFontKey] = btn.dataset.size;

            });

        });

    }

}


document.addEventListener("DOMContentLoaded", () => {

    initializeCustomizePanel("biodata", "biodataAccent", "biodataFontSize");
    initializeCustomizePanel("resume", "resumeAccent", "resumeFontSize");

});
