const menuLinks = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("section");

// Sembunyikan semua section dulu
function hideAll() {
    sections.forEach(sec => sec.classList.remove("active"));
}

// Klik navbar → tampilkan section sesuai ID
menuLinks.forEach(link => {
    link.addEventListener("click", () => {
        const target = link.getAttribute("href").substring(1);

        hideAll();
        document.getElementById(target).classList.add("active");
    });
});

// Default tampil menu ABOUT saat pertama buka
document.getElementById("about").classList.add("active");
