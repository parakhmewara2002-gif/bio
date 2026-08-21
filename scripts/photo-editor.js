/*==========================================================
                PHOTO-EDITOR.JS
    Crop / Rotate / Zoom / Frame picker for the profile photo.
    Runs entirely in the browser — the final edited image is
    exported as a PNG data URL and handed off to the existing
    gallery.js state, exactly like a normal upload would be.
==========================================================*/

const PHOTO_EDITOR = {
    rawImageSrc: null,
    scale: 1,
    rotation: 0,
    offsetX: 0,
    offsetY: 0,
    frame: "rounded",
    dragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragOrigOffsetX: 0,
    dragOrigOffsetY: 0,
    naturalW: 0,
    naturalH: 0
};

const PHOTO_STAGE_SIZE = 260;
const PHOTO_OUTPUT_SIZE = 500;


function peEls() {

    return {
        overlay: document.getElementById("photoEditorOverlay"),
        stage: document.getElementById("photoEditorStage"),
        img: document.getElementById("photoEditorImage"),
        zoomSlider: document.getElementById("photoZoomSlider"),
        editBtn: document.getElementById("editPhotoBtn")
    };

}


function peApplyTransform() {

    const { img } = peEls();

    if (!img) return;

    img.style.transform =
        `translate(-50%, -50%) translate(${PHOTO_EDITOR.offsetX}px, ${PHOTO_EDITOR.offsetY}px) ` +
        `rotate(${PHOTO_EDITOR.rotation}deg) scale(${PHOTO_EDITOR.scale})`;

}


function peFitImageToStage() {

    // scale the image so its shorter side just covers the stage at 100% zoom
    const ratio = Math.max(
        PHOTO_STAGE_SIZE / PHOTO_EDITOR.naturalW,
        PHOTO_STAGE_SIZE / PHOTO_EDITOR.naturalH
    );

    const { img } = peEls();

    img.style.width = (PHOTO_EDITOR.naturalW * ratio) + "px";
    img.style.height = (PHOTO_EDITOR.naturalH * ratio) + "px";

    PHOTO_EDITOR.offsetX = 0;
    PHOTO_EDITOR.offsetY = 0;
    PHOTO_EDITOR.scale = 1;
    PHOTO_EDITOR.rotation = 0;

    peApplyTransform();

}


function peOpenEditor(dataUrl) {

    const { overlay, img, stage, zoomSlider } = peEls();

    if (!overlay || !img) return;

    PHOTO_EDITOR.rawImageSrc = dataUrl;

    img.onload = () => {

        PHOTO_EDITOR.naturalW = img.naturalWidth;
        PHOTO_EDITOR.naturalH = img.naturalHeight;
        peFitImageToStage();

    };

    img.src = dataUrl;

    zoomSlider.value = 100;

    document.querySelectorAll(".photo-frame-btn").forEach(b => {

        b.classList.toggle("active", b.dataset.frame === "rounded");

    });

    PHOTO_EDITOR.frame = "rounded";
    stage.className = "photo-editor-stage rounded";

    overlay.classList.remove("d-none");

}


function peCloseEditor() {

    const { overlay } = peEls();

    if (overlay) overlay.classList.add("d-none");

}


/*==========================================================
                DRAG TO PAN
==========================================================*/

function peInitDrag() {

    const { stage } = peEls();

    if (!stage) return;

    stage.addEventListener("pointerdown", (e) => {

        PHOTO_EDITOR.dragging = true;
        PHOTO_EDITOR.dragStartX = e.clientX;
        PHOTO_EDITOR.dragStartY = e.clientY;
        PHOTO_EDITOR.dragOrigOffsetX = PHOTO_EDITOR.offsetX;
        PHOTO_EDITOR.dragOrigOffsetY = PHOTO_EDITOR.offsetY;
        stage.setPointerCapture(e.pointerId);

    });

    stage.addEventListener("pointermove", (e) => {

        if (!PHOTO_EDITOR.dragging) return;

        PHOTO_EDITOR.offsetX = PHOTO_EDITOR.dragOrigOffsetX + (e.clientX - PHOTO_EDITOR.dragStartX);
        PHOTO_EDITOR.offsetY = PHOTO_EDITOR.dragOrigOffsetY + (e.clientY - PHOTO_EDITOR.dragStartY);
        peApplyTransform();

    });

    ["pointerup", "pointercancel", "pointerleave"].forEach(evt => {

        stage.addEventListener(evt, () => { PHOTO_EDITOR.dragging = false; });

    });

}


/*==========================================================
                EXPORT FINAL IMAGE TO CANVAS
==========================================================*/

function peExportImage() {

    const { img } = peEls();

    const canvas = document.createElement("canvas");
    canvas.width = PHOTO_OUTPUT_SIZE;
    canvas.height = PHOTO_OUTPUT_SIZE;

    const ctx = canvas.getContext("2d");

    // clip path based on selected frame
    ctx.save();
    ctx.beginPath();

    if (PHOTO_EDITOR.frame === "circle") {

        ctx.arc(PHOTO_OUTPUT_SIZE / 2, PHOTO_OUTPUT_SIZE / 2, PHOTO_OUTPUT_SIZE / 2, 0, Math.PI * 2);

    } else if (PHOTO_EDITOR.frame === "rounded") {

        const r = PHOTO_OUTPUT_SIZE * 0.08;
        const w = PHOTO_OUTPUT_SIZE, h = PHOTO_OUTPUT_SIZE;
        ctx.moveTo(r, 0);
        ctx.arcTo(w, 0, w, h, r);
        ctx.arcTo(w, h, 0, h, r);
        ctx.arcTo(0, h, 0, 0, r);
        ctx.arcTo(0, 0, w, 0, r);

    } else {

        ctx.rect(0, 0, PHOTO_OUTPUT_SIZE, PHOTO_OUTPUT_SIZE);

    }

    ctx.closePath();
    ctx.clip();

    // map the stage's visible transform onto the output canvas
    const exportRatio = PHOTO_OUTPUT_SIZE / PHOTO_STAGE_SIZE;

    ctx.translate(PHOTO_OUTPUT_SIZE / 2, PHOTO_OUTPUT_SIZE / 2);
    ctx.translate(PHOTO_EDITOR.offsetX * exportRatio, PHOTO_EDITOR.offsetY * exportRatio);
    ctx.rotate(PHOTO_EDITOR.rotation * Math.PI / 180);
    ctx.scale(PHOTO_EDITOR.scale, PHOTO_EDITOR.scale);

    const drawW = parseFloat(img.style.width) * exportRatio;
    const drawH = parseFloat(img.style.height) * exportRatio;

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

    ctx.restore();

    return canvas.toDataURL("image/png");

}


/*==========================================================
                APPLY — hand off to gallery.js state
==========================================================*/

function peApplyEdit() {

    const finalDataUrl = peExportImage();

    if (typeof GALLERY_STATE !== "undefined") {

        GALLERY_STATE.profilePhoto = finalDataUrl;

    }

    if (typeof biodata !== "undefined") {

        biodata.photos = biodata.photos || {};
        biodata.photos.profilePhoto = { preview: finalDataUrl };

    }

    const previewImg = document.getElementById("previewProfilePhoto");

    if (previewImg) previewImg.src = finalDataUrl;

    if (typeof autoSaveGallery === "function") autoSaveGallery();
    if (typeof refreshGalleryReview === "function") refreshGalleryReview();
    if (typeof synchronizeGalleryWithPDF === "function") synchronizeGalleryWithPDF();

    peCloseEditor();

}


/*==========================================================
                INIT
==========================================================*/

function initializePhotoEditor() {

    const { overlay, zoomSlider, editBtn } = peEls();

    if (!overlay) return;

    zoomSlider.addEventListener("input", () => {

        PHOTO_EDITOR.scale = parseInt(zoomSlider.value, 10) / 100;
        peApplyTransform();

    });

    document.querySelectorAll(".photo-frame-btn").forEach((btn) => {

        btn.addEventListener("click", () => {

            document.querySelectorAll(".photo-frame-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            PHOTO_EDITOR.frame = btn.dataset.frame;

            const { stage } = peEls();
            stage.className = "photo-editor-stage " + PHOTO_EDITOR.frame;

        });

    });

    const rotLeft = document.getElementById("photoRotateLeftBtn");
    const rotRight = document.getElementById("photoRotateRightBtn");

    if (rotLeft) rotLeft.addEventListener("click", () => {

        PHOTO_EDITOR.rotation -= 90;
        peApplyTransform();

    });

    if (rotRight) rotRight.addEventListener("click", () => {

        PHOTO_EDITOR.rotation += 90;
        peApplyTransform();

    });

    const closeBtn = document.getElementById("photoEditorCloseBtn");
    const cancelBtn = document.getElementById("photoEditorCancelBtn");
    const applyBtn = document.getElementById("photoEditorApplyBtn");

    if (closeBtn) closeBtn.addEventListener("click", peCloseEditor);
    if (cancelBtn) cancelBtn.addEventListener("click", peCloseEditor);
    if (applyBtn) applyBtn.addEventListener("click", peApplyEdit);

    if (editBtn) {

        editBtn.addEventListener("click", () => {

            const currentPhoto =
                (typeof GALLERY_STATE !== "undefined" && GALLERY_STATE.profilePhoto) ||
                PHOTO_EDITOR.rawImageSrc;

            if (!currentPhoto) {

                alert("Please upload a photo first, then tap Crop / Rotate / Zoom to adjust it.");
                return;

            }

            peOpenEditor(currentPhoto);

        });

    }

    peInitDrag();

}


document.addEventListener("DOMContentLoaded", initializePhotoEditor);
