// Nav — executes immediately on every page load
(function() {
    function init() {
        var hamburger = document.getElementById('hamburger');
        var navLinks = document.getElementById('navLinks');
        var navClose = document.getElementById('navClose');
        if (!hamburger || !navLinks) return;

        hamburger.onclick = function(e) {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        };
        if (navClose) {
            navClose.onclick = function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            };
        }
        var links = navLinks.querySelectorAll('nav a');
        for (var i = 0; i < links.length; i++) {
            links[i].onclick = function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            };
        }
        window.onscroll = function() {
            var nav = document.getElementById('nav');
            if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
        };
        // trigger scroll once to set initial state
        window.onscroll();
    }

    // Run on first load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Run on every SPA navigation
    document.addEventListener('astro:page-load', init);

    // Also run on astro:after-swap as backup
    document.addEventListener('astro:after-swap', init);
})();
