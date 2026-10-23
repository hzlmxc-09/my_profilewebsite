
"use strict";

const $ = (id) => document.getElementById(id);

const themeToggle = $("themeToggle");
const profileImage = $("profileImage");
const expandedProfileImage = $("expandedProfileImage");
const profileOverlay = $("profileOverlay");
const interestsOverlay = $("interestsOverlay");
const toast = $("toast");

let toastTimeout;
let strengths = [
    "Caring",
    "Understanding",
    "Creative",
    "Determined"
];

let interests = [];
let hobbyPhotos = [];
let currentHobbyIndex = 0;
let lastFocusedElement = null;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function openOverlay(overlay) {
    lastFocusedElement = document.activeElement;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const closeButton = overlay.querySelector(".overlay-close");
    if (closeButton) closeButton.focus();
}

function closeOverlay(overlay) {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");

    if (!document.querySelector(".overlay.open")) {
        document.body.style.overflow = "";
    }

    if (lastFocusedElement) lastFocusedElement.focus();
}

function closeAllOverlays() {
    document.querySelectorAll(".overlay.open").forEach((overlay) => {
        overlay.classList.remove("open");
        overlay.setAttribute("aria-hidden", "true");
    });

    document.body.style.overflow = "";
}

function getProfileDetails() {
    return [
        ["Age", $("profileAge").textContent],
        ["Birthday", $("profileBirthday").textContent],
        ["Currently living in", $("profileAddress").textContent],
        ["Hometown", $("profileHometown").textContent],
        ["Email", $("profileEmail").textContent],
        ["School", $("profileSchool").textContent],
        ["Course", $("profileCourse").textContent]
    ];
}

function renderExpandedProfile() {
    expandedProfileImage.src = profileImage.src;
    $("expandedProfileTitle").textContent = $("profileName").textContent;
    $("expandedProfileNickname").textContent = $("profileNickname").textContent;
    $("expandedProfileMotto").textContent = $("profileMotto").textContent;

    const details = $("expandedProfileDetails");
    details.replaceChildren();

    getProfileDetails().forEach(([label, value]) => {
        const row = document.createElement("div");
        row.className = "detail-row";

        const icon = document.createElement("span");
        icon.className = "detail-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = "✧";

        const labelElement = document.createElement("span");
        labelElement.className = "detail-label";
        labelElement.textContent = label;

        const valueElement = document.createElement("span");
        valueElement.className = "detail-value";
        valueElement.textContent = value;

        row.append(icon, labelElement, valueElement);
        details.appendChild(row);
    });
}

$("expandProfile").addEventListener("click", () => {
    renderExpandedProfile();
    openOverlay(profileOverlay);
});

$("closeProfile").addEventListener("click", () => {
    closeOverlay(profileOverlay);
});

$("expandInterestsBtn").addEventListener("click", () => {
    renderInterests();
    openOverlay(interestsOverlay);
});

$("closeInterests").addEventListener("click", () => {
    closeOverlay(interestsOverlay);
});

document.querySelectorAll(".overlay").forEach((overlay) => {
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            closeOverlay(overlay);
        }
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeAllOverlays();
    }
});

themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light-mode");
    themeToggle.textContent = isLight ? "☾" : "☀";
    themeToggle.setAttribute(
        "aria-label",
        isLight ? "Switch to dark mode" : "Switch to light mode"
    );
    themeToggle.title = isLight ? "Switch to dark mode" : "Switch to light mode";
});

function renderStrengths() {
    const list = $("strengthList");
    list.replaceChildren();

    strengths.forEach((strength, index) => {
        const chip = document.createElement("div");
        chip.className = "strength-chip";

        const text = document.createElement("span");
        text.textContent = strength;

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "delete-button";
        remove.textContent = "×";
        remove.setAttribute("aria-label", `Delete ${strength}`);
        remove.addEventListener("click", () => {
            strengths.splice(index, 1);
            renderStrengths();
        });

        chip.append(text, remove);
        list.appendChild(chip);
    });

    $("strengthEmptyMessage").hidden = strengths.length > 0;
}

$("addStrengthBtn").addEventListener("click", () => {
    $("strengthForm").hidden = false;
    $("strengthInput").focus();
});

$("cancelStrengthBtn").addEventListener("click", () => {
    $("strengthForm").hidden = true;
    $("strengthInput").value = "";
});

$("strengthForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const input = $("strengthInput");
    const value = input.value.trim();

    if (!value) {
        showToast("Please enter a strength first.");
        input.focus();
        return;
    }

    strengths.push(value);
    input.value = "";
    $("strengthForm").hidden = true;
    renderStrengths();
    showToast("Strength added!");
});

function renderInterests() {
    const list = $("interestList");
    const expandedList = $("expandedInterestList");

    list.replaceChildren();
    expandedList.replaceChildren();

    interests.forEach((interest, index) => {
        const card = document.createElement("article");
        card.className = "interest-item";

        if (interest.type === "image") {
            card.classList.add("interest-item-image");

            const image = document.createElement("img");
            image.src = interest.src;
            image.alt = interest.name || "Interest photo";
            card.appendChild(image);
        } else {
            card.classList.add("interest-item-text");

            const paragraph = document.createElement("p");
            paragraph.textContent = interest.text;
            card.appendChild(paragraph);
        }

        const footer = document.createElement("div");
        footer.className = "interest-item-footer";

        const label = document.createElement("span");
        label.textContent = interest.type === "image" ? "Photo" : "Note";

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "delete-button";
        remove.textContent = "×";
        remove.setAttribute("aria-label", "Delete this interest");
        remove.addEventListener("click", () => {
            interests.splice(index, 1);
            renderInterests();
            showToast("Interest deleted.");
        });

        footer.append(label, remove);
        card.appendChild(footer);
        list.appendChild(card);

        const expandedCard = card.cloneNode(true);
        const expandedRemove = expandedCard.querySelector(".delete-button");

        expandedRemove.addEventListener("click", () => {
            interests.splice(index, 1);
            renderInterests();
            showToast("Interest deleted.");
        });

        expandedList.appendChild(expandedCard);
    });

    $("interestEmptyMessage").hidden = interests.length > 0;
}

$("addInterestTextBtn").addEventListener("click", () => {
    if (document.querySelector(".interest-editor-wrap")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "interest-editor-wrap";

    const textarea = document.createElement("textarea");
    textarea.className = "interest-editor";
    textarea.maxLength = 1000;
    textarea.placeholder = "Write something you love...";
    textarea.setAttribute("aria-label", "Write an interest");

    const actions = document.createElement("div");
    actions.className = "editor-actions";

    const save = document.createElement("button");
    save.type = "button";
    save.className = "primary-button";
    save.textContent = "Save";

    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "subtle-button";
    cancel.textContent = "Cancel";

    save.addEventListener("click", () => {
        const text = textarea.value.trim();

        if (!text) {
            showToast("Please write something first.");
            textarea.focus();
            return;
        }

        interests.push({ type: "text", text });
        renderInterests();
        wrapper.remove();
        showToast("Interest added!");
    });

    cancel.addEventListener("click", () => wrapper.remove());

    actions.append(save, cancel);
    wrapper.append(textarea, actions);
    $("interestsPanel");
    $("addInterestTextBtn").parentElement.after(wrapper);
    textarea.focus();
});

$("addInterestPhotoBtn").addEventListener("click", () => {
    $("interestPhotoInput").click();
});

$("interestPhotoInput").addEventListener("change", (event) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    imageFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onload = () => {
            interests.push({
                type: "image",
                src: reader.result,
                name: file.name
            });
            renderInterests();
        };

        reader.readAsDataURL(file);
    });

    if (imageFiles.length) {
        showToast("Photo added!");
    }

    event.target.value = "";
});

const hobbyUpload = $("hobbyUpload");

hobbyUpload.addEventListener("change", (event) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    imageFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onload = () => {
            hobbyPhotos.push({
                src: reader.result,
                name: file.name
            });

            renderHobbies();
            showToast("Hobby photo added!");
        };

        reader.readAsDataURL(file);
    });

    event.target.value = "";
});

function renderHobbies() {
    const image = $("hobbyImage");
    const placeholder = $("slidePlaceholder");
    const thumbnails = $("hobbyThumbnails");
    const previous = $("prevBtn");
    const next = $("nextBtn");

    thumbnails.replaceChildren();

    if (!hobbyPhotos.length) {
        image.hidden = true;
        placeholder.hidden = false;
        previous.disabled = true;
        next.disabled = true;
        $("hobbyCaption").textContent =
            "Your favorite hobby moments will appear here.";
        return;
    }

    currentHobbyIndex = Math.max(
        0,
        Math.min(currentHobbyIndex, hobbyPhotos.length - 1)
    );

    const current = hobbyPhotos[currentHobbyIndex];

    image.src = current.src;
    image.alt = current.name || "Hobby photo";
    image.hidden = false;
    placeholder.hidden = true;

    previous.disabled = hobbyPhotos.length < 2;
    next.disabled = hobbyPhotos.length < 2;

    $("hobbyCaption").textContent =
        `${current.name} · ${currentHobbyIndex + 1} of ${hobbyPhotos.length}`;

    hobbyPhotos.forEach((photo, index) => {
        const thumbnail = document.createElement("button");
        thumbnail.type = "button";
        thumbnail.className = "hobby-thumbnail";
        thumbnail.classList.toggle("active", index === currentHobbyIndex);
        thumbnail.setAttribute("aria-label", `Show photo ${index + 1}`);

        const thumbImage = document.createElement("img");
        thumbImage.src = photo.src;
        thumbImage.alt = "";

        thumbnail.appendChild(thumbImage);

        thumbnail.addEventListener("click", () => {
            currentHobbyIndex = index;
            renderHobbies();
        });

        thumbnails.appendChild(thumbnail);
    });
}

$("prevBtn").addEventListener("click", () => {
    if (!hobbyPhotos.length) return;

    currentHobbyIndex =
        (currentHobbyIndex - 1 + hobbyPhotos.length) % hobbyPhotos.length;

    renderHobbies();
});

$("nextBtn").addEventListener("click", () => {
    if (!hobbyPhotos.length) return;

    currentHobbyIndex = (currentHobbyIndex + 1) % hobbyPhotos.length;
    renderHobbies();
});

renderStrengths();
renderInterests();
renderHobbies();
