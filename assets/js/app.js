/* =========================
   THEME (persistente)
========================= */
const savedTheme = localStorage.getItem("theme");
const themeBtn = document.querySelector(".theme-btn");
if (savedTheme === "dark" && !document.body.classList.contains("casas")) {
  document.body.classList.add("dark");
  if (themeBtn) {
    themeBtn.textContent = "🌙";
  }
}

function toggleTheme(){
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  if (themeBtn) {
    themeBtn.textContent = isDark ? "🌙" : "☀️";
  }
}

/* =========================
   MENU LATERAL (mobile-safe)
========================= */
function toggleMenu(){
  const menu = document.getElementById("menu");
  if (!menu) return;

  const isOpen = menu.classList.toggle("open");

  if(isOpen){
    document.body.classList.add("menu-open");
  } else {
    document.body.classList.remove("menu-open");
  }
}

// Cerrar menú al hacer click en un enlace
document.querySelectorAll(".menu a").forEach(link=>{
  link.addEventListener("click", ()=>{
    const menu = document.getElementById("menu");
    if(!menu) return;

    menu.classList.remove("open");
    document.body.classList.remove("menu-open");
  });
});

// Cerrar menú con ESC
document.addEventListener("keydown", e=>{
  if(e.key === "Escape"){
    const menu = document.getElementById("menu");
    if(!menu) return;

    menu.classList.remove("open");
    document.body.classList.remove("menu-open");
  }
});

/* =========================
   SCROLL ANIMATIONS
========================= */
const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("show");
      observer.unobserve(entry.target); // anima solo una vez
    }
  });
},{ threshold:0.2 });

document.querySelectorAll(".fade").forEach(el=>observer.observe(el));

/* =========================
   AUTO-CLOSE MENU ON SCROLL (PC ONLY)
========================= */

let lastScroll = 0;

window.addEventListener("scroll", ()=>{

  const menu = document.getElementById("menu");
  if(!menu) return;

  const isDesktop = window.innerWidth >= 1024;
  const currentScroll = window.scrollY;

  if(isDesktop && menu.classList.contains("open")){

    if(Math.abs(currentScroll - lastScroll) > 20){
      menu.classList.remove("open");
      document.body.classList.remove("menu-open");
    }

  }

  lastScroll = currentScroll;
});