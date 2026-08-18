/*==========================================================
                AUTOFILL.JS
    Parses pasted biodata text and fills matching form fields
==========================================================*/

const AUTOFILL_MONTHS = {
    jan: "01", january: "01",
    feb: "02", february: "02",
    mar: "03", march: "03",
    apr: "04", april: "04",
    may: "05",
    jun: "06", june: "06",
    jul: "07", july: "07",
    aug: "08", august: "08",
    sep: "09", sept: "09", september: "09",
    oct: "10", october: "10",
    nov: "11", november: "11",
    dec: "12", december: "12"
};

/*
    Each key is a normalized label (lowercase, letters/numbers only).
    Multiple synonyms can point to the same field id.
    type controls how the value gets applied.
*/
const AUTOFILL_FIELD_MAP = {

    // ---- Personal ----
    "name": { id: "fullName", type: "text" },
    "fullname": { id: "fullName", type: "text" },
    "dateofbirth": { id: "dob", type: "date" },
    "dob": { id: "dob", type: "date" },
    "timeofbirth": { id: "birthTime", type: "time" },
    "placeofbirth": { id: "placeOfBirth", type: "text" },
    "rashi": { id: "rashi", type: "text" },
    "gan": { id: "gan", type: "select" },
    "height": { id: "height", type: "text" },
    "complexion": { id: "complexion", type: "text" },
    "maritalstatus": { id: "maritalStatus", type: "select" },
    "caste": { id: "caste", type: "text" },
    "gotra": { id: "caste", type: "text" },
    "manglik": { id: "manglik", type: "select" },
    "manglikstatus": { id: "manglik", type: "select" },
    "language": { id: "language", type: "text" },
    "diet": { id: "diet", type: "select" },
    "hobbies": { id: "hobbies", type: "text" },
    "hobbiesinterests": { id: "hobbies", type: "text" },
    "other": { id: "other", type: "text" },

    // ---- Education ----
    "education": { id: "highestQualification", type: "text" },
    "qualification": { id: "highestQualification", type: "text" },
    "highestqualification": { id: "highestQualification", type: "text" },
    "college": { id: "college", type: "text" },
    "collegeuniversity": { id: "college", type: "text" },
    "12thboard": { id: "Board12th", type: "text" },
    "10thboard": { id: "Board10th", type: "text" },
    "specialskill": { id: "specialSkill", type: "text" },

    // ---- Work ----
    "occupation": { id: "profession", type: "text" },
    "profession": { id: "profession", type: "text" },
    "companyname": { id: "organization", type: "text" },
    "organization": { id: "organization", type: "text" },
    "company": { id: "organization", type: "text" },
    "workplace": { id: "workPlace", type: "text" },
    "worklocation": { id: "workPlace", type: "text" },
    "citylivingin": { id: "workPlace", type: "text" },
    "income": { id: "income", type: "text" },
    "annualincome": { id: "income", type: "text" },

    // ---- Family ----
    "father": { id: "fatherName", type: "text" },
    "fathersname": { id: "fatherName", type: "text" },
    "fatheroccupation": { id: "fatherOccupation", type: "text" },
    "fathersoccupation": { id: "fatherOccupation", type: "text" },
    "mother": { id: "motherName", type: "text" },
    "mothersname": { id: "motherName", type: "text" },
    "motheroccupation": { id: "motherOccupation", type: "text" },
    "mothersoccupation": { id: "motherOccupation", type: "text" },
    "siblings": { id: "siblingsDetails", type: "text" },

    // ---- Partner Preference ----
    "partnerqualification": { id: "preferredQualification", type: "text" },
    "partnerprofession": { id: "preferredProfession", type: "text" },
    "partnerlocation": { id: "preferredLocation", type: "text" },

    // ---- Contact ----
    "contactno": { id: "mobileNumber", type: "text" },
    "contactnumber": { id: "mobileNumber", type: "text" },
    "phone": { id: "mobileNumber", type: "text" },
    "mobile": { id: "mobileNumber", type: "text" },
    "residentialaddress": { id: "currentAddress", type: "text" },
    "currentaddress": { id: "currentAddress", type: "text" },
    "address": { id: "currentAddress", type: "text" },
    "permanentaddress": { id: "permanentAddress", type: "text" }

};

const AUTOFILL_SORTED_KEYS = Object.keys(AUTOFILL_FIELD_MAP)
    .sort((a, b) => b.length - a.length);


function matchAutofillField(normalizedLabel) {

    if (AUTOFILL_FIELD_MAP[normalizedLabel]) {

        return AUTOFILL_FIELD_MAP[normalizedLabel];

    }

    for (const key of AUTOFILL_SORTED_KEYS) {

        if (key.length >= 4 && normalizedLabel.includes(key)) {

            return AUTOFILL_FIELD_MAP[key];

        }

    }

    return null;

}


function normalizeAutofillLabel(label) {

    return label
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

}


function parseAutofillDate(value) {

    // dd Month yyyy  (e.g. "14 December 1997")
    let m = value.match(/(\d{1,2})[\s\-\/]+([A-Za-z]+)[\s\-\/]+(\d{4})/);

    if (m) {

        const day = m[1].padStart(2, "0");
        const monthKey = m[2].toLowerCase();
        const month = AUTOFILL_MONTHS[monthKey];

        if (month) {

            return `${m[3]}-${month}-${day}`;

        }

    }

    // dd/mm/yyyy or dd-mm-yyyy
    m = value.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);

    if (m) {

        return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;

    }

    return null;

}


function applyAutofillTime(value) {

    // matches "10:20 am", "10.20 AM", "10:20am"
    const m = value.match(/(\d{1,2})[:.](\d{2})\s*(am|pm)?/i);

    if (!m) return false;

    const hourEl = document.getElementById("birthHour");
    const minuteEl = document.getElementById("birthMinute");
    const periodEl = document.getElementById("birthPeriod");

    let hour = m[1].padStart(2, "0");
    const minute = m[2];
    const period = m[3] ? m[3].toUpperCase() : "";

    if (hourEl && setSelectByText(hourEl, hour)) autofillFireEvents(hourEl);
    if (minuteEl && setSelectByText(minuteEl, minute)) autofillFireEvents(minuteEl);
    if (periodEl && period && setSelectByText(periodEl, period)) autofillFireEvents(periodEl);

    return true;

}


function setSelectByText(selectEl, value) {

    const target = value.trim().toLowerCase();

    for (const opt of selectEl.options) {

        if (opt.value.trim().toLowerCase() === target ||
            opt.textContent.trim().toLowerCase() === target) {

            selectEl.value = opt.value;
            return true;

        }

    }

    return false;

}


function autofillFireEvents(el) {

    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));

}


function parseAutofillText(rawText) {

    const lines = rawText.split(/\r?\n/);

    const entries = [];
    let current = null;

    lines.forEach((rawLine) => {

        const line = rawLine.trim();

        if (!line) return;

        // "Label : Value" or "Label - Value"
        const match = line.match(/^([A-Za-z][A-Za-z0-9 .'()\/]{1,40}?)\s*[:：]\s*(.+)$/);

        if (match) {

            const normalized = normalizeAutofillLabel(match[1]);
            const field = matchAutofillField(normalized);
            const value = match[2].trim();

            if (field) {

                current = { field, value };
                entries.push(current);

            } else {

                // a labeled line we don't support (e.g. "Religion", "Blood Group") —
                // don't let unrelated continuation lines attach to the previous field
                current = null;

            }

            return;

        }

        // continuation line (e.g. second sibling, second address line)
        // belongs to the previous recognized field
        if (current && line.length < 120) {

            current.value += ", " + line;

        }

    });

    return entries;

}


function applyAutofillEntries(entries) {

    let filledCount = 0;
    const skippedLabels = [];

    entries.forEach(({ field, value }) => {

        if (!field || !value) return;

        if (field.type === "time") {

            if (applyAutofillTime(value)) filledCount++;
            return;

        }

        const el = document.getElementById(field.id);

        if (!el) return;

        let applied = false;

        if (field.type === "date") {

            const iso = parseAutofillDate(value);

            if (iso) {

                el.value = iso;
                applied = true;

            }

        } else if (field.type === "select") {

            applied = setSelectByText(el, value);

        } else {

            const max = el.getAttribute("maxlength");

            el.value = max ? value.slice(0, parseInt(max, 10)) : value;
            applied = true;

        }

        if (applied) {

            autofillFireEvents(el);
            filledCount++;

        } else {

            skippedLabels.push(field.id);

        }

    });

    return { filledCount, skippedLabels };

}


function initializeAutofill() {

    const btn = document.getElementById("autofillBtn");
    const clearBtn = document.getElementById("autofillClearBtn");
    const input = document.getElementById("autofillInput");
    const status = document.getElementById("autofillStatus");

    if (!btn || !input) return;

    btn.addEventListener("click", () => {

        const text = input.value.trim();

        if (!text) {

            status.textContent = "Paste your biodata text first.";
            status.className = "text-danger";
            return;

        }

        const entries = parseAutofillText(text);

        if (entries.length === 0) {

            status.textContent =
                "Couldn't recognize any fields. Make sure each line looks like 'Label : Value'.";
            status.className = "text-danger";
            return;

        }

        const { filledCount } = applyAutofillEntries(entries);

        status.textContent =
            `✅ ${filledCount} field${filledCount === 1 ? "" : "s"} filled. Please review each step before downloading — some fields may need manual entry.`;
        status.className = "text-success";

    });

    if (clearBtn) {

        clearBtn.addEventListener("click", () => {

            input.value = "";
            status.textContent = "";

        });

    }

}


document.addEventListener("DOMContentLoaded", initializeAutofill);
