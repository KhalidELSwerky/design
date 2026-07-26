/* ==========================================================================
   AURA LUXURY INTERIOR STUDIO - MASTER JS
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Loading Screen Animation
    const loadingScreen = document.getElementById("loading-screen");
    const loaderBar = document.querySelector(".loader-bar");
    const loaderPercentage = document.querySelector(".loader-percentage");
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                gsap.to(loadingScreen, {
                    opacity: 0,
                    visibility: "hidden",
                    duration: 0.8,
                    ease: "power2.out",
                    onComplete: () => {
                        initAnimations();
                    }
                });
            }, 300);
        }
        loaderBar.style.width = `${progress}%`;
        loaderPercentage.textContent = `${progress}%`;
    }, 100);

    // 2. Locomotive Scroll & GSAP Integration
    gsap.registerPlugin(ScrollTrigger);

    const locoScroll = new LocomotiveScroll({
        el: document.querySelector("#main-container"),
        smooth: true,
        lerp: 0.08
    });

    locoScroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy("#main-container", {
        scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
        },
        pinType: document.querySelector("#main-container").style.transform ? "transform" : "fixed"
    });

    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();

    // 3. Custom Luxury Cursor
    const cursor = document.querySelector(".luxury-cursor");
    const follower = document.querySelector(".luxury-cursor-follower");

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    });

    function renderCursor() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        follower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;
        requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Hover effects on interactive elements
    document.querySelectorAll("a, button, .portfolio-item, .service-card").forEach(el => {
        el.addEventListener("mouseenter", () => {
            cursor.style.transform += " scale(2.5)";
            follower.style.transform += " scale(1.5)";
            follower.style.borderColor = "var(--gold)";
        });
        el.addEventListener("mouseleave", () => {
            cursor.style.transform = cursor.style.transform.replace(" scale(2.5)", "");
            follower.style.transform = follower.style.transform.replace(" scale(1.5)", "");
        });
    });

    // 4. Header Sticky & Mobile Menu
    const header = document.getElementById("header");
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        });
    });

    // 5. Dark / Light Mode Toggle
    const themeToggle = document.getElementById("theme-toggle");
    const htmlTag = document.documentElement;
    const themeIcon = themeToggle.querySelector("i");

    themeToggle.addEventListener("click", () => {
        if (htmlTag.classList.contains("dark")) {
            htmlTag.classList.remove("dark");
            htmlTag.classList.add("light");
            themeIcon.classList.remove("fa-moon");
            themeIcon.classList.add("fa-sun");
        } else {
            htmlTag.classList.remove("light");
            htmlTag.classList.add("dark");
            themeIcon.classList.remove("fa-sun");
            themeIcon.classList.add("fa-moon");
        }
    });

    // 6. Portfolio Filtering
    const filterBtns = document.querySelectorAll(".filter-btn");
    const portfolioItems = document.querySelectorAll(".portfolio-item");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            portfolioItems.forEach(item => {
                const category = item.getAttribute("data-category");
                if (filterValue === "all" || category.includes(filterValue)) {
                    item.style.display = "block";
                    gsap.fromTo(item, {opacity: 0, scale: 0.9}, {opacity: 1, scale: 1, duration: 0.5});
                } else {
                    item.style.display = "none";
                }
            });
            locoScroll.update();
        });
    });

    // 7. Testimonials Slider
    const track = document.querySelector(".testimonial-track");
    const slides = Array.from(track.children);
    const nextBtn = document.getElementById("next-testimonial");
    const prevBtn = document.getElementById("prev-testimonial");
    let currentSlide = 0;

    function updateSlidePosition() {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    nextBtn.addEventListener("click", () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlidePosition();
    });

    prevBtn.addEventListener("click", () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlidePosition();
    });

    // Auto slide
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlidePosition();
    }, 6000);

    // 8. Animated Counters
    const counters = document.querySelectorAll(".counter");
    let animated = false;

    window.addEventListener("scroll", () => {
        const aboutSection = document.getElementById("about");
        const rect = aboutSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && !animated) {
            counters.forEach(counter => {
                const target = +counter.getAttribute("data-target");
                let count = 0;
                const speed = target / 50;
                const updateCount = () => {
                    count += speed;
                    if (count < target) {
                        counter.innerText = Math.ceil(count);
                        setTimeout(updateCount, 30);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
            animated = true;
        }
    });

    // 9. Back To Top & WhatsApp Visibility
    const backToTopBtn = document.getElementById("back-to-top");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add("visible");
        } else {
            backToTopBtn.classList.remove("visible");
        }
    });

    backToTopBtn.addEventListener("click", () => {
        locoScroll.scrollTo(0);
    });

    // 10. Fullscreen Project Modal View
    const modal = document.getElementById("project-modal");
    const modalClose = document.querySelector(".modal-close");
    const modalBody = document.querySelector(".modal-body-content");

    const projectData = {
        "1": {
            title: "The Manhattan Sky Penthouse",
            client: "Private Collector",
            location: "New York, USA",
            area: "6,500 sq. ft.",
            year: "2025",
            desc: "An ultra-luxurious penthouse overlooking Central Park, featuring custom Italian marble bookmatching, integrated smart architectural lighting, and bespoke minimalist furnishings.",
            images: [
                "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
            ]
        },
        "2": {
            title: "Aether Haute Horlogerie",
            client: "Aether Luxury Group",
            location: "Geneva, Switzerland",
            area: "3,200 sq. ft.",
            year: "2025",
            desc: "A flagship boutique designed to evoke absolute precision and timeless elegance through brushed bronze, smoked glass, and precise spotlight engineering.",
            images: [
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80"
            ]
        },
        "3": {
            title: "The Kensington Manor",
            client: "Private Aristocracy",
            location: "London, UK",
            area: "12,000 sq. ft.",
            year: "2024",
            desc: "A historic estate restoration harmonizing classical Georgian architecture with contemporary bespoke millwork and rare silk wallcoverings.",
            images: [
                "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80"
            ]
        },
        "4": {
            title: "Vanguard Global Headquarters",
            client: "Vanguard Holdings",
            location: "Singapore",
            area: "25,000 sq. ft.",
            year: "2025",
            desc: "An executive corporate headquarters featuring floating boardroom tables, acoustic felt panelling, and biophilic interior garden walls.",
            images: [
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80"
            ]
        },
        "5": {
            title: "Kyoto Zen Sanctuary",
            client: "Private Client",
            location: "Kyoto, Japan",
            area: "4,800 sq. ft.",
            year: "2024",
            desc: "A minimalist residence emphasizing natural hinoki wood, sliding shoji screens, stone water basins, and seamless indoor-outdoor transitions.",
            images: [
                "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
            ]
        },
        "6": {
            title: "Villa Saint-Jean-Cap-Ferrat",
            client: "Private Family Office",
            location: "French Riviera, France",
            area: "9,000 sq. ft.",
            year: "2025",
            desc: "A Mediterranean cliffside sanctuary showcasing travertine limestone flooring, unobstructed sea views, and custom teak outdoor lounging suites.",
            images: [
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80"
            ]
        }
    };

    document.querySelectorAll(".portfolio-item").forEach(item => {
        item.addEventListener("click", () => {
            const id = item.getAttribute("data-project-id");
            const data = projectData[id];
            if (data) {
                modalBody.innerHTML = `
                    <span class="section-tag">Project Showcase</span>
                    <h2>${data.title}</h2>
                    <p class="lead-text">${data.desc}</p>
                    <div class="project-meta-grid">
                        <div class="pm-item">
                            <span>Client</span>
                            <h5>${data.client}</h5>
                        </div>
                        <div class="pm-item">
                            <span>Location</span>
                            <h5>${data.location}</h5>
                        </div>
                        <div class="pm-item">
                            <span>Area</span>
                            <h5>${data.area}</h5>
                        </div>
                        <div class="pm-item">
                            <span>Completion</span>
                            <h5>${data.year}</h5>
                        </div>
                    </div>
                    <div class="modal-gallery">
                        <img src="${data.images[0]}" alt="${data.title}">
                        <img src="${data.images[1]}" alt="${data.title}">
                    </div>
                `;
                modal.classList.add("active");
                document.body.style.overflow = "hidden";
            }
        });
    });

    modalClose.addEventListener("click", () => {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    });

    // 11. GSAP Scroll Animations Setup
    function initAnimations() {
        gsap.utils.toArray(".fade-up").forEach(element => {
            gsap.fromTo(element, {
                opacity: 0,
                y: 50
            }, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    scroller: "#main-container",
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });
        });
    }

});