// MOBILE NAVIGATION

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function renderIcons() {
    if (window.lucide) {
        lucide.createIcons();
    }
}

menuToggle.addEventListener("click", function () {

    navLinks.classList.toggle("active");

    const isOpen = navLinks.classList.contains("active");

    menuToggle.setAttribute("aria-expanded", isOpen);

    menuToggle.innerHTML = isOpen
        ? '<i data-lucide="x"></i>'
        : '<i data-lucide="menu"></i>';

    renderIcons();

});

// CLOSE MENU AFTER CLICKING A LINK

const navItems = document.querySelectorAll(".nav-links a");

navItems.forEach(function (link) {

    link.addEventListener("click", function () {

        navLinks.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.innerHTML = '<i data-lucide="menu"></i>';

        renderIcons();

    });

});

// DYNAMIC ROLE TEXT

const roleText = document.getElementById("roleText");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (roleText && !prefersReducedMotion) {
    const roles = ["Web Developer", "Frontend Developer", "JavaScript Developer"];
    let roleIndex = 0;
    let characterIndex = roles[0].length;
    let deleting = true;

    function typeRole() {
        if (document.hidden) {
            window.setTimeout(typeRole, 500);
            return;
        }

        const role = roles[roleIndex];
        roleText.textContent = role.slice(0, characterIndex);

        if (!deleting && characterIndex === role.length) {
            deleting = true;
            window.setTimeout(typeRole, 1500);
            return;
        }

        if (deleting && characterIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }

        characterIndex += deleting ? -1 : 1;
        window.setTimeout(typeRole, deleting ? 55 : 95);
    }

    window.setTimeout(typeRole, 1800);
}

// SCROLL PROGRESS AND ACTIVE NAVIGATION

const scrollProgress = document.getElementById("scrollProgress");
let scrollUpdateScheduled = false;

function updateScrollProgress() {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    scrollProgress.style.transform = "scaleX(" + progress + ")";
    scrollUpdateScheduled = false;
}

window.addEventListener("scroll", function () {
    if (!scrollUpdateScheduled) {
        window.requestAnimationFrame(updateScrollProgress);
        scrollUpdateScheduled = true;
    }
}, { passive: true });

updateScrollProgress();

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
                return;
            }

            navItems.forEach(function (link) {
                const isCurrent = link.getAttribute("href") === "#" + entry.target.id;
                if (isCurrent) {
                    link.setAttribute("aria-current", "location");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        });
    }, {
        rootMargin: "-30% 0px -60% 0px"
    });

    document.querySelectorAll("main section[id]").forEach(function (section) {
        sectionObserver.observe(section);
    });
}

// POINTER-RESPONSIVE DETAILS

if (!prefersReducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".skill-card, .project-card").forEach(function (card) {
        card.addEventListener("pointermove", function (event) {
            const bounds = card.getBoundingClientRect();
            const x = ((event.clientX - bounds.left) / bounds.width) * 100;
            const y = ((event.clientY - bounds.top) / bounds.height) * 100;
            card.style.setProperty("--pointer-x", x + "%");
            card.style.setProperty("--pointer-y", y + "%");
        });
    });

    const portrait = document.querySelector(".hero-image img");
    if (portrait) {
        portrait.addEventListener("pointermove", function (event) {
            const bounds = portrait.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;
            portrait.style.transform = "perspective(800px) rotateY(" + (x * 5) + "deg) rotateX(" + (y * -5) + "deg)";
        });

        portrait.addEventListener("pointerleave", function () {
            portrait.style.transform = "";
        });
    }
}

// CONTACT FORM VALIDATION

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        formMessage.textContent = "Please fill in all fields.";
        formMessage.style.color = "red";
        return;
    }

    formMessage.textContent =
        "Thank you, " + name + "! Your message has been submitted successfully.";

    formMessage.style.color = "green";

    contactForm.reset();
});
