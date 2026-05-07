// =============================================
// SCRIPT PRINCIPAL
// Funciones:
//  1. Estrellitas del fondo del splash
//  2. Corazones del splash (suben por toda la pantalla)
//  3. Animaciones de scroll del contenido principal
//  4. Botón de apertura
//  5. Corazones de los laterales del contenido (se activan al abrir)
// =============================================


// --- 1. ESTRELLITAS ---
// Puntos que parpadean detrás de la foto del splash.

function crearEstrellas(cantidad = 80) {
  const contenedor = document.getElementById('stars-container');
  if (!contenedor) return;

  for (let i = 0; i < cantidad; i++) {
    const estrella = document.createElement('div');
    estrella.classList.add('star');

    estrella.style.left = `${Math.random() * 100}%`;
    estrella.style.top  = `${Math.random() * 100}%`;

    const tamano = Math.random() < 0.1 ? 3 : (Math.random() < 0.3 ? 2 : 1);
    estrella.style.width  = `${tamano}px`;
    estrella.style.height = `${tamano}px`;

    const duracion = 2 + Math.random() * 4;
    const retraso  = Math.random() * 5;
    const opacidad = 0.3 + Math.random() * 0.7;

    estrella.style.setProperty('--dur',      `${duracion}s`);
    estrella.style.setProperty('--delay',    `${retraso}s`);
    estrella.style.setProperty('--opacidad', opacidad);

    contenedor.appendChild(estrella);
  }
}


// --- 2. CORAZONES DEL SPLASH ---
// Usan la clase CSS ".heart" y la animación "subirCorazon".
// Se crean al cargar la página y viven DENTRO del div #hearts-container
// que está dentro del #splash. Solo visibles mientras el splash está abierto.

function crearCorazonesSplash(cantidad = 18) {
  const contenedor = document.getElementById('hearts-container');
  if (!contenedor) return;

  const emojis = ['♡', '♥', '🤍', '💗', '💕'];

  for (let i = 0; i < cantidad; i++) {
    const corazon = document.createElement('div');
    corazon.classList.add('heart'); // <- clase .heart del CSS, animación subirCorazon

    corazon.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    corazon.style.left = `${5 + Math.random() * 90}%`;

    const tamano = 0.8 + Math.random() * 1.4;
    corazon.style.fontSize = `${tamano}rem`;

    const duracion = 5 + Math.random() * 8;
    const retraso  = Math.random() * 10;
    corazon.style.setProperty('--dur',   `${duracion}s`);
    corazon.style.setProperty('--delay', `${retraso}s`);

    contenedor.appendChild(corazon);
  }
}


// --- 3. ANIMACIONES DE SCROLL ---
// Los elementos del contenido aparecen desde abajo cuando entran en pantalla.

function iniciarAnimacionesScroll() {
  const elementosAnimados = document.querySelectorAll(
    '.card, .razon-item, .hero__title, .hero__date, .hero__badge, .section-titulo'
  );

  elementosAnimados.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        // Si es un item de razones, salida escalonada según su posición en la lista
        const retraso = entrada.target.classList.contains('razon-item')
          ? Array.from(entrada.target.parentNode.children).indexOf(entrada.target) * 80
          : 0;

        setTimeout(() => {
          entrada.target.style.opacity = '1';
          entrada.target.style.transform = 'translateY(0)';
        }, retraso);

        observador.unobserve(entrada.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px'
  });

  elementosAnimados.forEach(el => observador.observe(el));
}


// --- 4. BOTÓN DE APERTURA ---
// Al hacer clic: splash se oculta, main aparece, se arrancan los corazones laterales.

function iniciarBotonAbertura() {
  const boton  = document.getElementById('btn-abrir');
  const splash = document.getElementById('splash');
  const main   = document.getElementById('main-content');

  if (!boton || !splash || !main) return;

  boton.addEventListener('click', () => {
    // Ocultar el splash con la transición CSS
    splash.classList.add('oculto');

    // Mostrar el contenido
    main.removeAttribute('aria-hidden');
    main.classList.add('visible');

    // Pequeño delay para que la transición empiece antes de activar el resto
    setTimeout(() => {
      iniciarAnimacionesScroll();
      crearCorazonesLaterales(); // Los corazones de los bordes del contenido
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 150);
  });
}


// --- 5. CORAZONES LATERALES DEL CONTENIDO ---
// Clase CSS diferente: ".heart-page", animación "subirCorazonPage".
// Se colocan en el borde izquierdo (0-10% del ancho) y derecho (90-100%).
// Son position:fixed así que se ven mientras scrolleas.
// IMPORTANTE: usan clases y keyframes completamente distintos a los del splash
// para que no haya ningún conflicto entre las dos animaciones.

function crearCorazonesLaterales(cantidad = 24) {
  const contenedor = document.getElementById('page-hearts');
  if (!contenedor) return;

  const emojis = ['♡', '♥', '💕', '💗'];

  for (let i = 0; i < cantidad; i++) {
    const corazon = document.createElement('div');
    corazon.classList.add('heart-page'); // <- clase distinta al splash

    corazon.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    // La mitad por la izquierda, la mitad por la derecha
    const enLaIzquierda = i < cantidad / 2;
    const posX = enLaIzquierda
      ? Math.random() * 10
      : 90 + Math.random() * 10;
    corazon.style.left = `${posX}%`;

    const tamano = 0.7 + Math.random() * 1.1;
    corazon.style.fontSize = `${tamano}rem`;

    // Tres tonos de rosa para que no sean todos iguales
    const tonos = ['#c9607a', '#e8829a', '#f9aec0'];
    corazon.style.color = tonos[i % 3];

    const duracion = 7 + Math.random() * 9;
    const retraso  = Math.random() * 12;
    corazon.style.setProperty('--dur',   `${duracion}s`);
    corazon.style.setProperty('--delay', `${retraso}s`);

    contenedor.appendChild(corazon);
  }

  // Los hacemos visibles con un pequeño retraso para que la transición quede suave
  setTimeout(() => contenedor.classList.add('visible'), 200);
}


// --- ARRANQUE ---
// Esperamos a que el DOM esté cargado y entonces iniciamos las dos cosas del splash.

document.addEventListener('DOMContentLoaded', () => {
  crearEstrellas(80);         // Estrellitas de fondo
  crearCorazonesSplash(18);   // Corazones del splash (suben por toda la pantalla)
  iniciarBotonAbertura();     // El botón que abre el contenido
});
