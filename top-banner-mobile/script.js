(function () {

    "use strict";

    /* ==========================================
        MOBILE TOP BANNER - REVIVE ADSERVER
        Size: 400px × 100px
    ========================================== */

    const CONFIG = {
        maxWidth: 400,
        height: 100,
        zoneId: "19",
        reviveId: "53126d71827fcba70ff68055b9a73ca1",
        reviveScript: "//localhost/revive/www/delivery/asyncjs.php",
        mobileBreakpoint: 768
    };

    /* ==========================================
        ADD CSS
    ========================================== */

    function addBannerStyles() {
        if (document.getElementById("mobile-banner-styles")) {
            return;
        }

        const style = document.createElement("style");
        style.id = "mobile-banner-styles";
        style.textContent = `
            .mobile-top-banner {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                width: 100%;
                height: ${CONFIG.height}px;
                z-index: 99999;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                background: transparent;
                overflow: hidden;
                padding-top: env(safe-area-inset-top);
                pointer-events: none;
            }

            .mobile-top-banner-inner {
                width: 100%;
                max-width: ${CONFIG.maxWidth}px;
                height: ${CONFIG.height}px;
                overflow: hidden;
                pointer-events: auto;
            }

            .mobile-top-banner-inner ins {
                display: block;
                width: 100%;
                max-width: ${CONFIG.maxWidth}px;
                height: ${CONFIG.height}px;
                margin: 0;
                padding: 0;
                overflow: hidden;
            }

            html {
                --mobile-banner-height: 0px;
            }

            body {
                padding-top: var(--mobile-banner-height);
            }

            @media (min-width: 769px) {
                .mobile-top-banner {
                    display: none !important;
                }
                body {
                    padding-top: 0 !important;
                }
            }

            @media (max-width: 768px) {
                .mobile-top-banner {
                    display: flex;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /* ==========================================
        CREATE BANNER
    ========================================== */

    function createMobileBanner() {
        if (document.querySelector(".mobile-top-banner")) {
            return;
        }

        const banner = document.createElement("div");
        banner.className = "mobile-top-banner";
        banner.setAttribute("role", "complementary");
        banner.setAttribute("aria-label", "Top banner advertisement");

        const bannerInner = document.createElement("div");
        bannerInner.className = "mobile-top-banner-inner";

        const ad = document.createElement("ins");
        ad.setAttribute("data-revive-zoneid", CONFIG.zoneId);
        ad.setAttribute("data-revive-id", CONFIG.reviveId);

        ad.style.display = "block";
        ad.style.width = "100%";
        ad.style.maxWidth = CONFIG.maxWidth + "px";
        ad.style.height = CONFIG.height + "px";
        ad.style.margin = "0";
        ad.style.padding = "0";
        ad.style.overflow = "hidden";

        bannerInner.appendChild(ad);
        banner.appendChild(bannerInner);

        document.body.insertBefore(banner, document.body.firstChild);

        document.documentElement.style.setProperty(
            "--mobile-banner-height",
            isMobile() ? CONFIG.height + "px" : "0px"
        );

        loadReviveScript();
    }

    /* ==========================================
        LOAD REVIVE SCRIPT
    ========================================== */

    function loadReviveScript() {
        const existingScript = document.querySelector('script[src*="asyncjs.php"]');

        if (existingScript) {
            return;
        }

        const script = document.createElement("script");
        script.async = true;
        script.src = CONFIG.reviveScript;

        script.onerror = function () {
            console.warn("Revive AdServer script could not be loaded.");
        };

        document.head.appendChild(script);
    }

    /* ==========================================
        MOBILE CHECK & VISIBILITY
    ========================================== */

    function isMobile() {
        return window.innerWidth <= CONFIG.mobileBreakpoint;
    }

    function updateBannerVisibility() {
        const banner = document.querySelector(".mobile-top-banner");
        if (!banner) return;

        if (isMobile()) {
            banner.style.display = "flex";
            document.documentElement.style.setProperty("--mobile-banner-height", CONFIG.height + "px");
        } else {
            banner.style.display = "none";
            document.documentElement.style.setProperty("--mobile-banner-height", "0px");
        }
    }

    let resizeTimer;
    function handleResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            updateBannerVisibility();
        }, 150);
    }

    /* ==========================================
        INITIALIZE
    ========================================== */

    function init() {
        addBannerStyles();
        createMobileBanner();
        updateBannerVisibility();

        window.addEventListener("resize", handleResize);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();