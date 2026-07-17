(function() {
    function init() {
        var hamburger = document.getElementById('hamburger');
        var navLinks = document.getElementById('navLinks');
        var navClose = document.getElementById('navClose');
        if (!hamburger || !navLinks) return;

        function openMenu() {
            hamburger.classList.add('active');
            navLinks.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
        function closeMenu() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        }
        function toggleMenu() {
            if (navLinks.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        }

        hamburger.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        };
        if (navClose) {
            navClose.onclick = function(e) {
                e.preventDefault();
                closeMenu();
            };
        }

        var links = navLinks.querySelectorAll('.nav-mobile-links a');
        for (var i = 0; i < links.length; i++) {
            links[i].onclick = function() { closeMenu(); };
        }

        document.addEventListener('click', function(e) {
            if (!navLinks.classList.contains('open')) return;
            if (navLinks.contains(e.target)) return;
            if (hamburger.contains(e.target)) return;
            closeMenu();
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                closeMenu();
            }
        });

        window.onscroll = function() {
            var nav = document.getElementById('nav');
            if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
        };
        window.onscroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    document.addEventListener('astro:page-load', init);
})();
