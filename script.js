"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const $ = (id) => document.getElementById(id);

    function showStatus(message) {
        const status = $("statusMessage");
        if (!status) return;
        status.textContent = message;
        status.classList.add("visible");
        window.clearTimeout(showStatus.timer);
        showStatus.timer = window.setTimeout(() => {
            status.classList.remove("visible");
        }, 2500);
    }

    /* DARK / LIGHT MODE */
    const themeToggle = $("themeToggle");

    function updateThemeButton() {
        const light = document.body.classList.contains("light-mode");
        themeToggle.textContent = light ? "☾" : "☀";
        themeToggle.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
        themeToggle.title = light ? "Switch to dark mode" : "Switch to light mode";
    }

    try {
        if (localStorage.getItem("profile-theme") === "light") {
            document.body.classList.add("light-mode");
        }
    } catch (_) {}
    updateThemeButton();

    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("light-mode");
        updateThemeButton();
        try {
            localStorage.setItem(
                "profile-theme",
                document.body.classList.contains("light-mode") ? "light" : "dark"
            );
        } catch (_) {}
    });

    /* PROFILE EXPANSION */
    const profileOverlay = $("profileOverlay");
    const profileImage = $("profileImage");
    const expandedProfileImage = $("expandedProfileImage");

    function openOverlay(overlay, focusElement) {
        overlay.classList.add("is-open");
        overlay.setAttribute("aria-hidden", "false");
        document.body.classList.add("overlay-open");
        if (focusElement) focusElement.focus();
    }

    function closeOverlay(overlay) {
        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
        if (!document.querySelector(".overlay.is-open")) {
            document.body.classList.remove("overlay-open");
        }
    }

    $("expandProfile").addEventListener("click", function () {
        expandedProfileImage.src = profileImage.src;
        $("expandedProfileTitle").textContent = $("profileName").textContent;
        $("expandedProfileNickname").textContent = $("profileNickname").textContent;
        $("expandedProfileMotto").textContent = $("profileMotto").textContent;
        openOverlay(profileOverlay, $("closeProfile"));
    });

    $("closeProfile").addEventListener("click", () => closeOverlay(profileOverlay));
    profileOverlay.addEventListener("click", (event) => {
        if (event.target === profileOverlay) closeOverlay(profileOverlay);
    });

    /* PROFILE DETAILS IN EXPANDED VIEW */
    const detailContainer = $("expandedProfileContent");
    [
        ["Age", "profileAge"],
        ["Birthday", "profileBirthday"],
        ["Currently living in", "profileAddress"],
        ["Hometown", "profileHometown"],
        ["Email", "profileEmail"],
        ["School", "profileSchool"],
        ["Course", "profileCourse"]
    ].forEach(([label, id]) => {
        const card = document.createElement("div");
        card.className = "expanded-detail-card";
        const labelEl = document.createElement("span");
        labelEl.textContent = label;
        const valueEl = document.createElement("p");
        valueEl.textContent = $(id).textContent;
        card.append(labelEl, valueEl);
        detailContainer.appendChild(card);
    });

    /* STATIC STRENGTHS */
    const strengths = [
        "Persistence",
        "Curiosity",
        "Attention to detail",
        "Resourcefulness",
        "Empathy",
        "Adaptability",
        "Creativity",
        "Practical thinker"
    ];
    const strengthList = $("strengthList");
    strengths.forEach((strength) => {
        const chip = document.createElement("div");
        chip.className = "strength-chip";
        const text = document.createElement("span");
        text.textContent = strength;
        chip.appendChild(text);
        strengthList.appendChild(chip);
    });

    /* INTERESTS: STARTING ITEMS */
    let interests = [
        { id: 1, type: "text", value: "I love chasing and catching sunsets." },
        { id: 2, type: "text", value: "I love road trips." },
        { id: 3, type: "text", value: "I like listening to music." },
        { id: 4, type: "text", value: "I love exploring things that feel right for me." },
        { id: 5, type: "text", value: "I like learning to play instruments." },
        { id: 6, type: "photo", value: "images/sunset1.jpg" }
    ];
    let nextInterestId = 7;
    const interestsOverlay = $("interestsOverlay");
    const textDialog = $("textDialog");
    let dialogReturnOverlay = null;

    function createInterestCard(interest) {
        const card = document.createElement("article");
        card.className = "interest-entry";

        if (interest.type === "photo") {
            const image = document.createElement("img");
            image.src = interest.value;
            image.alt = "Sunset interest photo";
            image.className = "interest-photo";
            image.onerror = function () {
                image.alt = "Photo not found: " + interest.value;
                image.classList.add("image-missing");
            };
            card.appendChild(image);
        } else {
            const paragraph = document.createElement("p");
            paragraph.textContent = interest.value;
            card.appendChild(paragraph);
        }

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "delete-button";
        remove.textContent = "×";
        remove.setAttribute("aria-label", "Delete interest");
        remove.addEventListener("click", function () {
            interests = interests.filter((item) => item.id !== interest.id);
            renderInterests();
            showStatus("Interest deleted.");
        });
        card.appendChild(remove);
        return card;
    }

    function renderInterests() {
        const mainList = $("interestList");
        const expandedList = $("expandedInterestList");
        mainList.replaceChildren();
        expandedList.replaceChildren();

        interests.forEach((interest) => {
            mainList.appendChild(createInterestCard(interest));
            expandedList.appendChild(createInterestCard(interest));
        });

        const empty = $("expandedInterestEmptyMessage");
        if (empty) empty.hidden = interests.length > 0;
    }

    function openInterestTextDialog() {
        dialogReturnOverlay = interestsOverlay.classList.contains("is-open") ? interestsOverlay : null;
        if (dialogReturnOverlay) closeOverlay(dialogReturnOverlay);
        $("interestInput").value = "";
        openOverlay(textDialog, $("interestInput"));
    }

    function closeTextDialog() {
        closeOverlay(textDialog);
        if (dialogReturnOverlay) {
            openOverlay(dialogReturnOverlay, $("closeInterestsOverlay"));
            dialogReturnOverlay = null;
        }
    }

    $("addInterestTextBtn").addEventListener("click", openInterestTextDialog);
    $("overlayAddInterestTextBtn").addEventListener("click", openInterestTextDialog);
    $("cancelTextDialog").addEventListener("click", closeTextDialog);
    $("cancelTextDialogX").addEventListener("click", closeTextDialog);

    $("interestTextForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const value = $("interestInput").value.trim();
        if (!value) return;
        interests.push({ id: nextInterestId++, type: "text", value });
        renderInterests();
        closeTextDialog();
        showStatus("Interest added.");
    });

    const interestPhotoInput = $("interestPhotoInput");
    function chooseInterestPhotos() {
        interestPhotoInput.click();
    }
    $("addInterestPhotoBtn").addEventListener("click", chooseInterestPhotos);
    $("overlayAddInterestPhotoBtn").addEventListener("click", chooseInterestPhotos);

    interestPhotoInput.addEventListener("change", function () {
        Array.from(this.files || []).forEach((file) => {
            if (!file.type.startsWith("image/")) return;
            const reader = new FileReader();
            reader.onload = function () {
                interests.push({ id: nextInterestId++, type: "photo", value: reader.result });
                renderInterests();
                showStatus("Photo added.");
            };
            reader.readAsDataURL(file);
        });
        this.value = "";
    });

    $("expandInterestsBtn").addEventListener("click", function () {
        renderInterests();
        openOverlay(interestsOverlay, $("closeInterestsOverlay"));
    });
    $("closeInterestsOverlay").addEventListener("click", () => closeOverlay(interestsOverlay));
    interestsOverlay.addEventListener("click", function (event) {
        if (event.target === interestsOverlay) closeOverlay(interestsOverlay);
    });

    /* HOBBY PHOTOS */
    let hobbyPhotos = [{ src: "images/hobby1.jpg", name: "A favorite hobby moment" }];
    let hobbyIndex = 0;
    const hobbyImage = $("hobbyImage");
    const slidePlaceholder = $("slidePlaceholder");
    const hobbyThumbnails = $("hobbyThumbnails");

    function renderHobbies() {
        hobbyThumbnails.replaceChildren();

        if (hobbyPhotos.length === 0) {
            hobbyImage.hidden = true;
            slidePlaceholder.hidden = false;
            $("prevBtn").disabled = true;
            $("nextBtn").disabled = true;
            $("hobbyCaption").textContent = "Your favorite hobby moments will appear here.";
            return;
        }

        hobbyIndex = Math.max(0, Math.min(hobbyIndex, hobbyPhotos.length - 1));
        const current = hobbyPhotos[hobbyIndex];
        hobbyImage.src = current.src;
        hobbyImage.alt = current.name;
        hobbyImage.hidden = false;
        slidePlaceholder.hidden = true;
        $("prevBtn").disabled = hobbyPhotos.length < 2;
        $("nextBtn").disabled = hobbyPhotos.length < 2;
        $("hobbyCaption").textContent = current.name + " · " + (hobbyIndex + 1) + " of " + hobbyPhotos.length;

        hobbyPhotos.forEach((photo, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "hobby-thumb";
            if (index === hobbyIndex) button.classList.add("active");
            button.setAttribute("aria-label", "Show hobby photo " + (index + 1));
            const image = document.createElement("img");
            image.src = photo.src;
            image.alt = "";
            button.appendChild(image);
            button.addEventListener("click", function () {
                hobbyIndex = index;
                renderHobbies();
            });
            hobbyThumbnails.appendChild(button);
        });
    }

    $("prevBtn").addEventListener("click", function () {
        if (!hobbyPhotos.length) return;
        hobbyIndex = (hobbyIndex - 1 + hobbyPhotos.length) % hobbyPhotos.length;
        renderHobbies();
    });
    $("nextBtn").addEventListener("click", function () {
        if (!hobbyPhotos.length) return;
        hobbyIndex = (hobbyIndex + 1) % hobbyPhotos.length;
        renderHobbies();
    });

    $("hobbyUpload").addEventListener("change", function () {
        Array.from(this.files || []).forEach((file) => {
            if (!file.type.startsWith("image/")) return;
            const reader = new FileReader();
            reader.onload = function () {
                hobbyPhotos.push({ src: reader.result, name: file.name });
                hobbyIndex = hobbyPhotos.length - 1;
                renderHobbies();
                showStatus("Hobby photo added.");
            };
            reader.readAsDataURL(file);
        });
        this.value = "";
    });

    /* HOBBY TEXT */
    let hobbyTexts = [
        "Daydreaming",
        "Playing video games",
        "Searching for food and places to eat",
        "Writing poems and stories",
        "Taking pictures randomly"
    ];
    const hobbyTextList = $("hobbyTextList");

    function renderHobbyTexts() {
        hobbyTextList.replaceChildren();
        hobbyTexts.forEach((hobby) => {
            const item = document.createElement("div");
            item.className = "hobby-text-item";
            const text = document.createElement("span");
            text.textContent = hobby;
            item.appendChild(text);
            hobbyTextList.appendChild(item);
        });
    }

    $("addHobbyTextBtn").addEventListener("click", function () {
        $("hobbyTextEditor").hidden = false;
        $("hobbyTextInput").focus();
    });
    $("cancelHobbyTextBtn").addEventListener("click", function () {
        $("hobbyTextInput").value = "";
        $("hobbyTextEditor").hidden = true;
    });
    $("saveHobbyTextBtn").addEventListener("click", function () {
        const value = $("hobbyTextInput").value.trim();
        if (!value) {
            $("hobbyTextInput").focus();
            return;
        }
        hobbyTexts.push(value);
        $("hobbyTextInput").value = "";
        $("hobbyTextEditor").hidden = true;
        renderHobbyTexts();
        showStatus("Hobby added.");
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            document.querySelectorAll(".overlay.is-open").forEach((overlay) => closeOverlay(overlay));
        }
    });

    renderInterests();
    renderHobbies();
    renderHobbyTexts();
});
