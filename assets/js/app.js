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
function toggleSubmenu(){
  const sub = document.getElementById("submenu");
  const isOpen = sub.style.display === "block";
  sub.style.display = isOpen ? "none" : "block";
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

/*script de solicitudes*/
const solicitudForm = document.getElementById("solicitud")
if(solicitudForm){
  solicitudForm.addEventListener("submit", async (e)=>{
    e.preventDefault()
    const form = e.target
    const formData = new FormData(form)
    try{
      const res = await fetch("/api/submit",{
        method:"POST",
        body:formData
      })
      if(res.ok){
        alert("Solicitud enviada correctamente")
        form.reset()
      }else{
        alert("Error enviando solicitud")
      }
    }catch(error){
      alert("No se pudo conectar con el servidor")
    }
  })
}

/*script del login*/
const loginForm = document.getElementById("login")
if(loginForm){
  loginForm.addEventListener("submit", async e=>{
    e.preventDefault()
    const password = e.target.password.value
    const res = await fetch("/api/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({password})
    })
    const data = await res.json()
    if(data.ok){
      localStorage.setItem("admin_token",data.token)
      window.location.href="/admin/panel.html"
    }else{
      alert("Contraseña incorrecta")
    }
  })
}

/* =========================
   ADMIN PANEL
========================= */
if(window.location.pathname.includes("/admin/panel")){
  if(localStorage.getItem("admin_token") !== "servitec-admin"){
    window.location.href="/admin/login.html"
  }
  async function cargarSolicitudes(){
    const res = await fetch("/api/admin")
    const data = await res.json()
    const contador = document.getElementById("contador")
       if(contador){
          contador.textContent = "Solicitudes: " + data.length
       }
    const tbody = document.querySelector("#tabla tbody")
     if(!tbody) return
    tbody.innerHTML = ""
    data.forEach(row=>{
      const tr = document.createElement("tr")
      tr.innerHTML = `
        <td>${new Date(row.fecha).toLocaleString()}</td>
        <td>${row.nombre}</td>
        <td>${row.telefono}</td>
        <td>${row.correo}</td>
        <td>${row.mensaje || ""}</td>
        <td>
        <a href="https://wa.me/${row.telefono}" target="_blank">📞</a>
        </td>
      `
      tbody.appendChild(tr)
    })
  }
  cargarSolicitudes()
}

/* =========================
   LOGOUT
========================= */
function logout(){
  localStorage.removeItem("admin_token")
  window.location.href="../index.html"

}
