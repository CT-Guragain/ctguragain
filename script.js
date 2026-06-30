// contact form handler
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();

    var name = document.getElementById('name').value.trim();
    var email = document.getElementById('email').value.trim();
    var message = document.getElementById('message').value.trim();
    var msg = document.getElementById('form-msg');

    if (!name || !email || !message) {
        msg.style.color = '#c0392b';
        msg.textContent = 'Please fill in all required fields.';
        return;
    }

    msg.style.color = '#2f855a';
    msg.textContent = 'Thanks ' + name + ', message received. I will get back to you soon.';

    // reset form after a couple seconds
    setTimeout(function() {
        document.getElementById('contact-form').reset();
        msg.textContent = '';
    }, 3000);
});

// smooth scroll for nav links
var navLinks = document.querySelectorAll('nav a');
navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// highlight the active section while scrolling
window.addEventListener('scroll', function() {
    var sections = document.querySelectorAll('main section');
    var links = document.querySelectorAll('nav a');

    var current = '';

    sections.forEach(function(section) {
        var top = section.offsetTop - 80;

        if (window.scrollY >= top) {
            current = '#' + section.getAttribute('id');
        }
    });

    links.forEach(function(link) {
        link.classList.remove('active');

        if (link.getAttribute('href') === current) {
            link.classList.add('active');
        }
    });
});
