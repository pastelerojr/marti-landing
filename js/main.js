// =========================================================================
// SCRIPT PRINCIPAL: INTERACTIVIDAD Y ANIMACIONES (GSAP)
// =========================================================================

// 1. REGISTRO DE PLUGINS DE GSAP
// Para usar ScrollTrigger (que anima elementos al hacer scroll), 
// debemos decirle a GSAP que lo registre.
gsap.registerPlugin(ScrollTrigger);

// =========================================================================
// A. NAVBAR: CAMBIO DE ESTADO AL HACER SCROLL
// =========================================================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  // Si bajamos más de 50 píxeles, añadimos la clase 'scrolled'
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// =========================================================================
// B. MENÚ MÓVIL (HAMBURGUESA)
// =========================================================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

// Al hacer click en el botón de hamburguesa, alternamos el menú
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active'); // Anima la cruz
  mobileMenu.classList.toggle('active'); // Muestra/oculta el menú
  
  // Evitamos que el usuario haga scroll en el fondo si el menú está abierto
  if (mobileMenu.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// Al hacer click en un enlace del menú móvil, lo cerramos
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// =========================================================================
// C. ANIMACIONES CON GSAP Y SCROLLTRIGGER
// =========================================================================

// 1. Animación del Hero (Portada) al cargar la página
// Usamos gsap.from() para decir "anímate DESDE este estado hacia el estado normal en CSS"
const heroTimeline = gsap.timeline();

heroTimeline.from('.hero-title', {
  y: 80,
  scale: 0.5,
  opacity: 0,
  duration: 1.2,
  ease: "power3.out", // Vuelve a la aparición suave sin rebote
  delay: 0.2
})
.from('.hero-subtitle', {
  y: 30,
  opacity: 0,
  duration: 1,
  ease: "power3.out"
}, "-=0.6") // El "-=0.6" hace que esta animación empiece antes de que termine la anterior
.from('.hero-section .btn-primary', {
  y: 20,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out"
}, "-=0.6");

// 2. Efecto Parallax en el fondo del Hero
// Al hacer scroll, la imagen de fondo se mueve a una velocidad distinta al contenido
gsap.to('.parallax-bg', {
  yPercent: 30, // Se mueve un 30% en el eje Y
  ease: "none",
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top top", // Empieza cuando la sección toca la parte superior
    end: "bottom top", // Termina cuando el final de la sección toca la parte superior
    scrub: true // El scrub hace que la animación siga exactamente el movimiento del scroll
  }
});

// 3. Scroll-triggered Reveal (Revelado al hacer scroll)
// Seleccionamos todos los elementos con la clase 'gs-reveal' y los animamos uno por uno
const revealElements = document.querySelectorAll('.gs-reveal');

revealElements.forEach((el) => {
  gsap.from(el, {
    scrollTrigger: {
      trigger: el,
      start: "top 85%", // La animación empieza cuando el elemento llega al 85% de la pantalla (desde arriba)
      toggleActions: "play none none reverse" // Se reproduce al entrar, se revierte al salir hacia arriba
    },
    y: 60, // Viene desde un poco más abajo para más impacto
    opacity: 0,
    duration: 1,
    ease: "back.out(1.7)" // Hace un efecto de rebote divertido (dopamina)
  });
});

// =========================================================================
// D. CUSTOM VIDEO PLAYER (Presentación)
// =========================================================================
const video = document.getElementById('presentation-video');

if (video) {
  // Volumen inicial cuando el usuario lo desmutee
  video.volume = 0.5;

  // Reproducir automáticamente sin sonido cuando entra en pantalla
  ScrollTrigger.create({
    trigger: "#presentation-video-wrapper",
    start: "top 75%", // Se activa cuando asoma un poco por debajo
    onEnter: () => { if (video.paused) video.play(); },
    onLeave: () => video.pause(),
    onEnterBack: () => { if (video.paused) video.play(); },
    onLeaveBack: () => video.pause(),
  });
}

// =========================================================================
// E. ENVÍO DE FORMULARIO DE CONTACTO (AJAX sin redirección)
// =========================================================================
const contactForm = document.getElementById('ajax-contact-form');
const formMessage = document.getElementById('form-message');
const formButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que la página recargue o redirija
    
    // Cambiar estado del botón
    const originalText = formButton.innerText;
    formButton.innerText = "Enviando...";
    formButton.disabled = true;

    // Enviar datos vía AJAX
    fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Éxito
            formMessage.innerHTML = "¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.";
            formMessage.style.display = "block";
            formMessage.style.color = "#4ade80"; // Verde brillante
            formMessage.style.border = "1px solid rgba(74, 222, 128, 0.3)";
            contactForm.reset();
        } else {
            // Error de servidor
            formMessage.innerHTML = "Hubo un error al enviar el mensaje. Inténtalo de nuevo.";
            formMessage.style.display = "block";
            formMessage.style.color = "#f87171"; // Rojo
            formMessage.style.border = "1px solid rgba(248, 113, 113, 0.3)";
        }
    })
    .catch(error => {
        // Error de red
        formMessage.innerHTML = "Hubo un problema de red. Inténtalo de nuevo.";
        formMessage.style.display = "block";
        formMessage.style.color = "#f87171";
        formMessage.style.border = "1px solid rgba(248, 113, 113, 0.3)";
    })
    .finally(() => {
        formButton.innerText = originalText;
        formButton.disabled = false;
        
        // Ocultar mensaje después de 6 segundos
        setTimeout(() => {
            formMessage.style.display = "none";
        }, 6000);
    });
  });
}
