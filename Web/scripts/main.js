async function loadComponent(id, file) {
    const el = document.getElementById(id);
    if (!el) return;

    const html = await fetch(`components/${file}`).then(r => r.text());
    el.innerHTML = html;
}

loadComponent("header", "header.html");
loadComponent("menu", "menu.html");
loadComponent("footer", "footer.html");

document.addEventListener("DOMContentLoaded", () => {
    const infoBox = document.querySelector(".project-panel");
    const header = document.querySelector(".panel-header");

    header.addEventListener("click", () => {
        infoBox.classList.toggle("active");
    });
});


