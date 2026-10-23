
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const $ = (id) => document.getElementById(id);

    /* THEME */

    const themeToggle = $("themeToggle");

    function updateTheme() {
        const isLight = document.body.classList.contains("light-mode");
        themeToggle.textContent = isLight ? "☾" : "☀";
        themeToggle.setAttribute(
            "aria-label",
            isLight ? "Switch to dark mode" : "Switch to light mode"
        );
        themeToggle.title = isLight ? "Dark mode" : "Light mode";
    }

    try {
        if (localStorage.getItem("profile-theme") === "light") {
            document.body.classList.add("light-mode");
        }
    } catch (error) {
        // The theme toggle still works when storage is unavailable.
    }

    updateTheme();

    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("light-mode");
        updateTheme();

        try {
            localStorage.setItem(
                "profile-theme",
                document.body.classList.contains("light-mode") ? "light" : "dark"
            );
        } catch (error) {
            // Theme changes remain active for this page session.
        }
    });

    /* STATUS MESSAGE */

    let statusTimer;

    function showStatus(message) {
        const status = $("statusMessage");
        status.textContent = message;
        status.classList.add("visible");

        clearTimeout(statusTimer);

        statusTimer = setTimeout(function () {
            status.classList.remove("visible");
        }, 2600);
    }

    /* PROFILE DATA */

    const profile = {
        name: "Hazel Mae Gelardo Calvo",
        nickname: "Elay",
        age: "20 years old",
        birthday: "January 11, 2006",
        address: "Barangay Ermita, Cebu City",
        hometown: "Tabon, Dalaguete, Cebu",
        email: "calvohazelmae@gmail.com",
        school: "University of Cebu",
        course: "BS Information Technology",
        motto: "Everything happens for a reason."
    };

    $("profileName").textContent = profile.name;
    $("profileNickname").textContent = profile.nickname;
    $("profileAge").textContent = profile.age;
    $("profileBirthday").textContent = profile.birthday;
    $("profileAddress").textContent = profile.address;
    $("profileHometown").textContent = profile.hometown;
    $("profileEmail").textContent = profile.email;
    $("profileSchool").textContent = profile.school;
    $("profileCourse").textContent = profile.course;
    $("profileMotto").textContent = profile.motto;

    $("expandedProfileTitle").textContent = profile.name;
    $("expandedProfileNickname").textContent = profile.nickname;
    $("expandedProfileMotto").textContent = profile.motto;

    const expandedProfileContent = $("expandedProfileContent");

    [
        ["Age", profile.age],
        ["Birthday", profile.birthday],
        ["Currently living in", profile.address],
        ["Hometown", profile.hometown],
        ["Email", profile.email],
        ["School", profile.school],
        ["Course", profile.course]
    ].forEach(function (item) {
        const card = document.createElement("div");
        card.className = "expanded-detail-card";

        const label = document.createElement("span");
        label.textContent = item[0];

        const value = document.createElement("p");
        value.textContent = item[1];

        card.append(label, value);
        expandedProfileContent.appendChild(card);
    });

    /* OVERLAY CONTROLS */

    let lastFocus = null;

    function openOverlay(overlay, trigger, focusTarget) {
        lastFocus = trigger || document.activeElement;
        overlay.classList.add("is-open");
        overlay.setAttribute("aria-hidden", "false");
        document.body.classList.add("overlay-open");

        if (focusTarget) {
            focusTarget.focus();
        }
    }

    function closeOverlay(overlay, restoreFocus = true) {
        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");

        const anotherOpen = document.querySelector(".overlay.is-open");
        document.body.classList.toggle("overlay-open", Boolean(anotherOpen));

        if (restoreFocus && lastFocus && lastFocus.isConnected) {
            lastFocus.focus();
        }
    }

    /* PROFILE PHOTO */

    const profileImage = $("profileImage");
    const expandedProfileImage = $("expandedProfileImage");

    expandedProfileImage.src = profileImage.src;

    const profileOverlay = $("profileOverlay");

    $("expandProfile").addEventListener("click", function () {
        expandedProfileImage.src = profileImage.src;
        openOverlay(profileOverlay, this, $("closeProfile"));
    });

    $("closeProfile").addEventListener("click", function () {
        closeOverlay(profileOverlay);
    });

    profileOverlay.addEventListener("click", function (event) {
        if (event.target === profileOverlay) {
            closeOverlay(profileOverlay);
        }
    });

    /* MY STRENGTHS */

    const strengths = [
        "Persistence", "Curiosity", "Attention to detail", "Resourcefulness",
        "Empathy", "Adaptability", "Creativity", "Practical thinker"
    ].map(function (text) { return { text: text }; });

    const strengthList = $("strengthList");

    function renderStrengths() {
        strengthList.replaceChildren();

        strengths.forEach(function (strength) {
            const chip = document.createElement("div");
            chip.className = "strength-chip";

            const text = document.createElement("span");
            text.textContent = strength.text;

            chip.appendChild(text);
            strengthList.appendChild(chip);
        });
    }

    renderStrengths();

    /* MY INTERESTS: TEXT AND PHOTOS ARE SEPARATE ITEMS */

    let interests = [];
    let interestId = 0;

    const interestsOverlay = $("interestsOverlay");
    const textDialog = $("textDialog");
    const interestInput = $("interestInput");
    const interestTextForm = $("interestTextForm");

    function addInterest(type, value) {
        interests.push({
            id: ++interestId,
            type: type,
            value: value
        });

        renderInterests();
    }

    [
        ["text", "I love chasing and catching sunsets."],
        ["text", "I love road trips."],
        ["text", "I like listening to music."],
        ["text", "I love exploring things that feel right for me."],
        ["text", "I like learning to play instruments."]
    ].forEach(function (item) {
        interests.push({ id: ++interestId, type: item[0], value: item[1] });
    });
    interests.push({
        id: ++interestId,
        type: "photo",
        value: "images/sunset1.jpg"
    });

    function deleteInterest(id) {
        const item = interests.find((interest) => interest.id === id);

        interests = interests.filter((interest) => interest.id !== id);
        renderInterests();

        if (item) {
            showStatus(item.type === "text" ? "Text deleted." : "Photo deleted.");
        }
    }

    function makeDeleteButton(item) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "interest-entry-delete";
        button.textContent = "×";
        button.title = "Delete";
        button.setAttribute(
            "aria-label",
            "Delete " + (item.type === "text" ? "interest text" : "interest photo")
        );

        button.addEventListener("click", function () {
            deleteInterest(item.id);
        });

        return button;
    }

    function createInterestCard(item) {
        const card = document.createElement("article");
        card.className = "interest-entry";
        card.dataset.interestId = String(item.id);

        const icon = document.createElement("span");
        icon.className = "interest-entry-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = item.type === "text" ? "☷" : "▧";

        const main = document.createElement("div");
        main.className = "interest-entry-main";

        const copy = document.createElement("div");
        copy.className = "interest-entry-copy";

        const description = document.createElement("p");
        description.textContent = item.type === "text" ? item.value : "Photo";

        copy.appendChild(description);
        main.append(icon, copy);

        const remove = makeDeleteButton(item);

        if (item.type === "text") {
            card.classList.add("interest-entry-text-only");
            card.append(main, remove);
            return card;
        }

        card.classList.add("interest-entry-photo-only");

        const photo = document.createElement("img");
        photo.className = "interest-entry-photo";
        photo.src = item.value;
        photo.alt = "Interest photo";
        photo.loading = "lazy";

        photo.addEventListener("click", function () {
            showImagePreview(item.value);
        });

        const photoRow = document.createElement("div");
        photoRow.className = "photo-entry-row";
        photoRow.append(photo, remove);

        card.append(main, photoRow);
        return card;
    }

    function renderInterests() {
        const normalList = $("interestList");
        const expandedList = $("expandedInterestList");

        normalList.replaceChildren();
        expandedList.replaceChildren();

        interests.forEach(function (item) {
            normalList.appendChild(createInterestCard(item));
            expandedList.appendChild(createInterestCard(item));
        });

        const empty = interests.length === 0;
        const emptyMain = $("interestEmptyMessage");
        if (emptyMain) emptyMain.hidden = !empty;
        $("expandedInterestEmptyMessage").hidden = !empty;
    }

    function openTextDialog(trigger) {
        interestTextForm.reset();

        openOverlay(textDialog, trigger, interestInput);
    }

    function closeTextDialog() {
        closeOverlay(textDialog);
        interestTextForm.reset();
    }

    $("addInterestTextBtn").addEventListener("click", function () {
        openTextDialog(this);
    });

    $("overlayAddInterestTextBtn").addEventListener("click", function () {
        openTextDialog(this);
    });

    interestTextForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const text = interestInput.value.trim();

        if (!text) {
            interestInput.focus();
            return;
        }

        addInterest("text", text);
        closeTextDialog();
        showStatus("Interest text added.");
    });

    $("cancelTextDialog").addEventListener("click", closeTextDialog);
    $("cancelTextDialogX").addEventListener("click", closeTextDialog);

    textDialog.addEventListener("click", function (event) {
        if (event.target === textDialog) {
            closeTextDialog();
        }
    });

    const interestPhotoInput = $("interestPhotoInput");

    function chooseInterestPhotos() {
        interestPhotoInput.click();
    }

    $("addInterestPhotoBtn").addEventListener("click", chooseInterestPhotos);
    $("overlayAddInterestPhotoBtn").addEventListener("click", chooseInterestPhotos);

    interestPhotoInput.addEventListener("change", function () {
        const input = this;
        const files = Array.from(input.files || []);
        const imageFiles = files.filter((file) => file.type.startsWith("image/"));

        if (!imageFiles.length) {
            if (files.length) showStatus("Please choose image files.");
            input.value = "";
            return;
        }

        let finished = 0;
        let succeeded = 0;

        imageFiles.forEach(function (file) {
            const reader = new FileReader();

            reader.onload = function () {
                addInterest("photo", reader.result);
                succeeded++;
                finished++;
                finishImport();
            };

            reader.onerror = function () {
                finished++;
                finishImport();
            };

            reader.readAsDataURL(file);
        });

        function finishImport() {
            if (finished !== imageFiles.length) return;

            input.value = "";

            if (succeeded > 0) {
                showStatus(succeeded === 1 ? "Photo added." : succeeded + " photos added.");
            }

            if (succeeded < imageFiles.length) {
                showStatus("Some photos could not be loaded.");
            }
        }
    });

    $("expandInterestsBtn").addEventListener("click", function () {
        openOverlay(interestsOverlay, this, $("closeInterestsOverlay"));
    });

    $("closeInterestsOverlay").addEventListener("click", function () {
        closeOverlay(interestsOverlay);
    });

    interestsOverlay.addEventListener("click", function (event) {
        if (event.target === interestsOverlay) {
            closeOverlay(interestsOverlay);
        }
    });

    /* FULL-SIZE INTEREST PHOTO PREVIEW */

    let imagePreviewOverlay = null;

    function showImagePreview(src) {
        if (!imagePreviewOverlay) {
            imagePreviewOverlay = document.createElement("div");
            imagePreviewOverlay.className = "overlay image-preview-overlay";
            imagePreviewOverlay.setAttribute("aria-hidden", "true");

            const card = document.createElement("div");
            card.className = "overlay-card image-preview-card";

            const close = document.createElement("button");
            close.type = "button";
            close.className = "overlay-close";
            close.textContent = "×";
            close.setAttribute("aria-label", "Close photo preview");

            const image = document.createElement("img");
            image.className = "image-preview";
            image.alt = "Expanded interest photo";

            close.addEventListener("click", function () {
                closeOverlay(imagePreviewOverlay);
            });

            imagePreviewOverlay.addEventListener("click", function (event) {
                if (event.target === imagePreviewOverlay) {
                    closeOverlay(imagePreviewOverlay);
                }
            });

            card.append(close, image);
            imagePreviewOverlay.appendChild(card);
            document.body.appendChild(imagePreviewOverlay);
        }

        imagePreviewOverlay.querySelector(".image-preview").src = src;
        openOverlay(
            imagePreviewOverlay,
            document.activeElement,
            imagePreviewOverlay.querySelector(".overlay-close")
        );
    }

    /* MY HOBBIES SLIDESHOW */

    let hobbyPhotos = [
        { url: "images/hobby1.jpg", name: "A favorite hobby moment" }
    ];
    let hobbyIndex = 0;
    let hobbyTexts = [
        "Daydreaming",
        "Playing video games",
        "Searching for food and places to eat",
        "Writing poems and stories",
        "Taking pictures randomly"
    ];

    const hobbyUpload = $("hobbyUpload");
    const hobbyImage = $("hobbyImage");
    const slidePlaceholder = $("slidePlaceholder");
    const prevBtn = $("prevBtn");
    const nextBtn = $("nextBtn");

    function renderHobbies() {
        const thumbnails = $("hobbyThumbnails");
        thumbnails.replaceChildren();

        if (hobbyPhotos.length === 0) {
            hobbyImage.hidden = true;
            hobbyImage.removeAttribute("src");
            slidePlaceholder.hidden = false;
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            $("hobbyCaption").textContent =
                "Your favorite hobby moments will appear here.";
            return;
        }

        const photo = hobbyPhotos[hobbyIndex];

        hobbyImage.src = photo.url;
        hobbyImage.alt = photo.name || "Hobby photo";
        hobbyImage.hidden = false;
        slidePlaceholder.hidden = true;
        $("hobbyCaption").textContent = photo.name || "A favorite hobby moment.";

        const multiple = hobbyPhotos.length > 1;
        prevBtn.disabled = !multiple;
        nextBtn.disabled = !multiple;

        hobbyPhotos.forEach(function (item, index) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "hobby-thumb" +
                (index === hobbyIndex ? " active" : "");
            button.setAttribute("aria-label", "Show hobby photo " + (index + 1));

            const image = document.createElement("img");
            image.src = item.url;
            image.alt = "";

            button.appendChild(image);

            button.addEventListener("click", function () {
                hobbyIndex = index;
                renderHobbies();
            });

            thumbnails.appendChild(button);
        });
    }

    function previousHobby() {
        if (hobbyPhotos.length < 2) return;

        hobbyIndex = (hobbyIndex - 1 + hobbyPhotos.length) % hobbyPhotos.length;
        renderHobbies();
    }

    function nextHobby() {
        if (hobbyPhotos.length < 2) return;

        hobbyIndex = (hobbyIndex + 1) % hobbyPhotos.length;
        renderHobbies();
    }

    prevBtn.addEventListener("click", previousHobby);
    nextBtn.addEventListener("click", nextHobby);

    hobbyUpload.addEventListener("change", function () {
        const input = this;
        const files = Array.from(input.files || []);
        const imageFiles = files.filter((file) => file.type.startsWith("image/"));

        if (!imageFiles.length) {
            if (files.length) showStatus("Please choose image files.");
            input.value = "";
            return;
        }

        const loaded = new Array(imageFiles.length);
        let finished = 0;

        imageFiles.forEach(function (file, index) {
            const reader = new FileReader();

            reader.onload = function () {
                loaded[index] = { url: reader.result, name: file.name };
                finished++;
                finishHobbyImport();
            };

            reader.onerror = function () {
                finished++;
                finishHobbyImport();
            };

            reader.readAsDataURL(file);
        });

        function finishHobbyImport() {
            if (finished !== imageFiles.length) return;

            const validPhotos = loaded.filter(Boolean);

            if (validPhotos.length) {
                hobbyPhotos.push(...validPhotos);
                hobbyIndex = hobbyPhotos.length - validPhotos.length;
                renderHobbies();
                showStatus(
                    validPhotos.length === 1
                        ? "Hobby photo added."
                        : validPhotos.length + " hobby photos added."
                );
            }

            if (validPhotos.length < imageFiles.length) {
                showStatus("Some hobby photos could not be loaded.");
            }

            input.value = "";
        }
    });

    $("addHobbyPhotoBtn").addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            hobbyUpload.click();
        }
    });

    /* SWIPE HOBBY PHOTOS ON TOUCHSCREENS */

    let touchStartX = 0;
    let touchStartY = 0;

    $("slideImageWrap").addEventListener("touchstart", function (event) {
        if (!event.changedTouches.length) return;

        touchStartX = event.changedTouches[0].clientX;
        touchStartY = event.changedTouches[0].clientY;
    }, { passive: true });

    $("slideImageWrap").addEventListener("touchend", function (event) {
        if (!event.changedTouches.length || hobbyPhotos.length < 2) return;

        const touch = event.changedTouches[0];
        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;

        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
            if (dx < 0) {
                nextHobby();
            } else {
                previousHobby();
            }
        }
    }, { passive: true });

    /* ESCAPE CLOSES THE TOPMOST OPEN OVERLAY */

    document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") return;

        const overlays = Array.from(document.querySelectorAll(".overlay.is-open"));
        const topmost = overlays[overlays.length - 1];

        if (topmost) closeOverlay(topmost);
    });

    /* INITIAL RENDER */


    function renderHobbyTexts() {
        const list = $("hobbyTextList");
        if (!list) return;
        list.replaceChildren();
        hobbyTexts.forEach(function (text) {
            const item = document.createElement("div");
            item.className = "hobby-text-item";
            const label = document.createElement("span");
            label.textContent = text;
            item.appendChild(label);
            list.appendChild(item);
        });
    }

    const addHobbyTextBtn = $("addHobbyTextBtn");
    const hobbyTextEditor = $("hobbyTextEditor");
    const hobbyTextInput = $("hobbyTextInput");

    if (addHobbyTextBtn && hobbyTextEditor) {
        addHobbyTextBtn.addEventListener("click", function () {
            hobbyTextEditor.hidden = false;
            hobbyTextInput.focus();
        });

        $("cancelHobbyTextBtn").addEventListener("click", function () {
            hobbyTextInput.value = "";
            hobbyTextEditor.hidden = true;
        });

        $("saveHobbyTextBtn").addEventListener("click", function () {
            const text = hobbyTextInput.value.trim();
            if (!text) {
                hobbyTextInput.focus();
                return;
            }
            hobbyTexts.push(text);
            hobbyTextInput.value = "";
            hobbyTextEditor.hidden = true;
            renderHobbyTexts();
            showStatus("Hobby added.");
        });
    }

    renderHobbyTexts();

    renderInterests();
    renderHobbies();
});
