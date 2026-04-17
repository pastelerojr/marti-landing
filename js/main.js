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
const playBtn = document.getElementById('custom-play-btn');

if (video && playBtn) {
  // Ajusta el volumen inicial a un 30% para que no asuste al usuario
  video.volume = 0.3;

  playBtn.addEventListener('click', () => {
    // Reproduce el video
    video.play();
    // Añade los controles nativos (volumen, pantalla completa, etc)
    video.setAttribute('controls', 'controls');
    // Oculta el botón personalizado
    playBtn.style.display = 'none';
  });

  // Opcional: si el usuario lo pausa, se queda con los controles nativos
  video.addEventListener('pause', () => {
    // Si quisieras que el botón vuelva a aparecer, sería aquí.
    // Pero es más limpio dejar los controles nativos una vez iniciado.
  });
}

// =========================================================================
// E. FALLBACK DEL BOTÓN DE MAIL
// =========================================================================
const mailBtn = document.getElementById('mail-btn');
if (mailBtn) {
  mailBtn.addEventListener('click', (e) => {
    // Intentamos copiar el email al portapapeles de forma automática
    const emailToCopy = "martinamanduciredes@gmail.com";
    navigator.clipboard.writeText(emailToCopy).then(() => {
      // Mostramos una alerta simpática. Si la app nativa falla o el usuario
      // no tiene una configurada en Windows, por lo menos ya tiene el mail copiado.
      alert(`Si tu aplicación de correo no se abre automáticamente, no te preocupes.\n\nEl correo ${emailToCopy} ha sido copiado a tu portapapeles.`);
    }).catch(err => {
      console.log('Error al copiar el texto: ', err);
    });
  });
}
