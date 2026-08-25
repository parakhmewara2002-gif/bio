/*==========================================================
                MOBILE-PREVIEW.JS
    Floating "Preview" button (mobile only) that shows a
    scaled, read-only snapshot of the current biodata/resume
    at any step — no need to click through to the final step.
==========================================================*/

const MOBILE_PREVIEW_WIDTHS = {
    classic: 1024,
    flowing: 794,
    resume: 680
};


function mpGetActiveFormSection() {

    const biodataSection = document.getElementById("biodataFormSection");
    const resumeSection = document.getElementById("resumeFormSection");

    if (biodataSection && !biodataSection.classList.contains("d-none")) return "biodata";
    if (resumeSection && !resumeSection.classList.contains("d-none")) return "resume";

    return null;

}


function mpUpdateFabVisibility() {

    const fab = document.getElementById("mobilePreviewFab");

    if (!fab) return;

    const active = mpGetActiveFormSection();

    fab.classList.toggle("d-none", !active);

}


function mpBuildScaledClone(sourceEl, naturalWidth, bodyId) {

    const wrap = document.createElement("div");
    wrap.className = "scaled-preview-wrap";

    const clone = sourceEl.cloneNode(true);

    // clones of hidden containers may carry inline visibility/position
    // styles meant for off-screen PDF capture — reset them for on-screen display
    clone.style.position = "static";
    clone.style.visibility = "visible";
    clone.style.left = "auto";
    clone.style.top = "auto";
    clone.style.margin = "0 auto";

    wrap.appendChild(clone);

    const bodyWidth = document.getElementById(bodyId || "mobilePreviewBody").clientWidth - 32;
    const scale = Math.min(1, bodyWidth / naturalWidth);

    wrap.style.width = naturalWidth + "px";
    wrap.style.transform = `scale(${scale})`;
    wrap.style.marginBottom = (naturalWidth * scale * 0.02) + "px";

    return wrap;

}


function showMobilePreview() {

    const overlay = document.getElementById("mobilePreviewOverlay");
    const body = document.getElementById("mobilePreviewBody");

    if (!overlay || !body) return;

    const active = mpGetActiveFormSection();

    body.innerHTML = "";

    if (active === "biodata") {

        const template = typeof getSelectedBiodataTemplate === "function"
            ? getSelectedBiodataTemplate()
            : "classic";

        if (template === "classic") {

            if (typeof renderPreviewContainer === "function") renderPreviewContainer();

            const page = document.querySelector(".preview-page");

            if (page) body.appendChild(mpBuildScaledClone(page, MOBILE_PREVIEW_WIDTHS.classic));

        } else {

            if (typeof renderModernBiodataPreview === "function") renderModernBiodataPreview();

            const page = document.getElementById("biodataModernPreview");

            if (page) body.appendChild(mpBuildScaledClone(page, MOBILE_PREVIEW_WIDTHS.flowing));

        }

    } else if (active === "resume") {

        if (typeof renderResumePreview === "function") renderResumePreview();

        const page = document.getElementById("resumePreview");

        if (page) body.appendChild(mpBuildScaledClone(page, MOBILE_PREVIEW_WIDTHS.resume));

    } else {

        body.innerHTML = "<p style='padding:20px;color:#888;'>Start filling in the form to see a preview.</p>";

    }

    overlay.classList.remove("d-none");

}


function hideMobilePreview() {

    const overlay = document.getElementById("mobilePreviewOverlay");

    if (overlay) overlay.classList.add("d-none");

}


function initializeMobilePreview() {

    const fab = document.getElementById("mobilePreviewFab");
    const closeBtn = document.getElementById("mobilePreviewCloseBtn");
    const overlay = document.getElementById("mobilePreviewOverlay");

    if (fab) fab.addEventListener("click", showMobilePreview);
    if (closeBtn) closeBtn.addEventListener("click", hideMobilePreview);

    if (overlay) {

        overlay.addEventListener("click", (e) => {

            if (e.target === overlay) hideMobilePreview();

        });

    }

    // re-check FAB visibility whenever the form sections toggle
    // (create/return-to-home buttons, step navigation doesn't hide sections so this is cheap)
    document.body.addEventListener("click", () => {

        setTimeout(mpUpdateFabVisibility, 50);

    });

    mpUpdateFabVisibility();

}


document.addEventListener("DOMContentLoaded", initializeMobilePreview);


/*==========================================================
        DESKTOP LIVE PREVIEW PANEL (resizable side panel)
==========================================================*/

let dpRenderTimer = null;


function dpUpdatePanelVisibility() {

    const panel = document.getElementById("desktopPreviewPanel");

    if (!panel) return;

    const active = mpGetActiveFormSection();

    panel.classList.toggle("d-none", !active);
    document.body.classList.toggle("has-desktop-preview", !!active);

    if (active) dpRenderPreview();

}


function dpRenderPreview() {

    const body = document.getElementById("desktopPreviewBody");

    if (!body) return;

    const active = mpGetActiveFormSection();

    body.innerHTML = "";

    if (active === "biodata") {

        const template = typeof getSelectedBiodataTemplate === "function"
            ? getSelectedBiodataTemplate()
            : "classic";

        if (template === "classic") {

            if (typeof renderPreviewContainer === "function") renderPreviewContainer();

            const page = document.querySelector(".preview-page");

            if (page) body.appendChild(mpBuildScaledClone(page, MOBILE_PREVIEW_WIDTHS.classic, "desktopPreviewBody"));

        } else {

            if (typeof renderModernBiodataPreview === "function") renderModernBiodataPreview();

            const page = document.getElementById("biodataModernPreview");

            if (page) body.appendChild(mpBuildScaledClone(page, MOBILE_PREVIEW_WIDTHS.flowing, "desktopPreviewBody"));

        }

    } else if (active === "resume") {

        if (typeof renderResumePreview === "function") renderResumePreview();

        const page = document.getElementById("resumePreview");

        if (page) body.appendChild(mpBuildScaledClone(page, MOBILE_PREVIEW_WIDTHS.resume, "desktopPreviewBody"));

    }

}


function dpScheduleRender() {

    clearTimeout(dpRenderTimer);
    dpRenderTimer = setTimeout(dpRenderPreview, 400);

}


function dpInitResizeHandle() {

    const handle = document.getElementById("desktopPreviewResizeHandle");
    const panel = document.getElementById("desktopPreviewPanel");

    if (!handle || !panel) return;

    let dragging = false;

    handle.addEventListener("pointerdown", (e) => {

        dragging = true;
        handle.classList.add("dragging");
        handle.setPointerCapture(e.pointerId);

    });

    handle.addEventListener("pointermove", (e) => {

        if (!dragging) return;

        const newWidth = Math.min(640, Math.max(280, window.innerWidth - e.clientX));

        panel.style.width = newWidth + "px";
        document.body.style.setProperty("--preview-panel-width", newWidth + "px");

    });

    ["pointerup", "pointercancel"].forEach((evt) => {

        handle.addEventListener(evt, () => {

            dragging = false;
            handle.classList.remove("dragging");

        });

    });

}


function dpInitCollapseToggle() {

    const btn = document.getElementById("desktopPreviewToggleBtn");

    if (!btn) return;

    btn.addEventListener("click", () => {

        const collapsed = document.body.classList.toggle("desktop-preview-collapsed");

        btn.textContent = collapsed ? "⟨" : "⟩";
        btn.setAttribute("aria-label", collapsed ? "Expand live preview" : "Collapse live preview");

    });

}


function initializeDesktopPreview() {

    dpInitResizeHandle();
    dpInitCollapseToggle();

    // re-check visibility + re-render whenever the user interacts with the page
    // (covers step navigation, template switches, and typing in form fields)
    document.body.addEventListener("input", dpScheduleRender);
    document.body.addEventListener("change", dpScheduleRender);
    document.body.addEventListener("click", () => setTimeout(dpUpdatePanelVisibility, 60));

    dpUpdatePanelVisibility();

}


document.addEventListener("DOMContentLoaded", initializeDesktopPreview);

