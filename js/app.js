 // Navegación suave
 document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Función para abrir el modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

// Función para cerrar el modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Cerrar el modal al hacer clic fuera de él
window.onclick = function (event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}

// Modo oscuro
const toggleButton = document.getElementById('themeToggle');
        const body = document.body;

        toggleButton.addEventListener('click', function () {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                toggleButton.textContent = 'Modo Claro';
            } else {
                toggleButton.textContent = 'Modo Oscuro';
            }
        });

// Formulario
document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevenir envío por defecto

    // Obtener valores del formulario
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const feedback = document.getElementById('formFeedback');

    // Validar formulario
    if (name === '' || email === '' || message === '') {
        feedback.textContent = 'Por favor, rellena todos los campos.';
        feedback.className = 'form-feedback error';
        return;
    }

    if (!validateEmail(email)) {
        feedback.textContent = 'Por favor, introduce un correo electrónico válido.';
        feedback.className = 'form-feedback error';
        return;
    }

    // Si todo es válido
    feedback.textContent = '¡Gracias por tu mensaje! Te responderé pronto.';
    feedback.className = 'form-feedback success';

    // Limpiar el formulario
    document.getElementById('contactForm').reset();
});

// Función para validar email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Habilidades
document.addEventListener('DOMContentLoaded', function () {
    const skillsSection = document.querySelector('.skills');
    const skillProgresses = document.querySelectorAll('.skill-progress');

    function animateSkills() {
        const sectionTop = skillsSection.getBoundingClientRect().top;
        const sectionHeight = skillsSection.offsetHeight;
        const viewportHeight = window.innerHeight;

        if (sectionTop < viewportHeight && sectionTop + sectionHeight > 0) {
            skillProgresses.forEach(progress => {
                const value = progress.getAttribute('data-progress');
                progress.style.width = value;
            });
            window.removeEventListener('scroll', animateSkills); // Remove listener after animation
        }
    }

    window.addEventListener('scroll', animateSkills);
});

// Scroll
window.addEventListener('load', function () {
    // Espera un poco antes de hacer scroll para asegurar que la animación no sea brusca
    setTimeout(function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 500); // Ajusta el tiempo según sea necesario
});

// Linterna modo oscuro
const light = document.createElement('div');
        light.id = 'light';
        document.body.appendChild(light);

        document.addEventListener('mousemove', (e) => {
            if (document.body.classList.contains('dark-mode')) { // Verifica si está en modo oscuro
                light.style.left = e.pageX - 100 + 'px'; // Ajusta según el tamaño del div
                light.style.top = e.pageY - 100 + 'px'; // Ajusta según el tamaño del div
            }
        });

// Modal del juego
document.addEventListener('DOMContentLoaded', (event) => {
    // Get modal element
    const modal1 = document.getElementById('game-modal');
    // Get open modal button
    const openModalButton = document.getElementById('open-game-modal');
    // Get close button
    const closeButton = document.querySelector('.close-button');

    // Open the modal
    openModalButton.addEventListener('click', () => {
        modal1.style.display = 'block';
    });

    // Close the modal
    closeButton.addEventListener('click', () => {
        modal1.style.display = 'none';
    });

    // Close the modal if the user clicks anywhere outside the modal
    window.addEventListener('click', (event) => {
        if (event.target === modal1) {
            modal1.style.display = 'none';
        }
    });
});
