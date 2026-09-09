// ==========================================================================
// 1. CONFIGURAÇÃO DO BANCO DE DADOS LOCAL SIMULADO
// ==========================================================================
const CONFIG = {
    APP_PASSWORD: "1234", // Senha padrão para acessar o catálogo
    
    CATALOG_DATA: [
        {
            id: 1,
            title: "Interestelar",
            category: "movies",
            description: "Uma equipe de exploradores viaja através de um buraco de minhoca no espaço na tentativa de garantir a sobrevivência da humanidade.",
            videoUrl: "https://w3schools.com"
        },
        {
            id: 2,
            title: "Stranger Things",
            category: "series",
            description: "Quando um garoto desaparece, uma cidade pequena descobre um mistério envolvendo experimentos secretos, forças sobrenaturais e uma garotinha estranha.",
            videoUrl: "https://w3schools.com"
        },
        {
            id: 3,
            title: "Planeta Terra",
            category: "docs",
            description: "Um mergulho profundo nos lugares mais bonitos e selvagens do nosso planeta, mostrando a vida animal como você nunca viu.",
            videoUrl: "https://w3schools.com"
        },
        {
            id: 4,
            title: "Matrix",
            category: "movies",
            description: "Um jovem hacker descobre a verdade chocante sobre o mundo real e lidera uma rebelião cibernética contra as máquinas.",
            videoUrl: "https://w3schools.com"
        }
    ]
};

// ==========================================================================
// 2. SISTEMA DE AUTENTICAÇÃO E LOGIN
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const loginModal = document.getElementById("loginModal");
    const passwordInput = document.getElementById("devicePassword");
    const passwordConfirmInput = document.getElementById("devicePasswordConfirm");
    const loginBtn = document.getElementById("loginBtn");
    const loginError = document.getElementById("loginError");
    const logoutBtn = document.getElementById("logoutBtn");

    // Mantém logado se já tiver entrado antes
    if (localStorage.getItem("isLoggedIn") === "true") {
        loginModal.classList.remove("show");
    }

    loginBtn.addEventListener("click", () => {
        const pass = passwordInput.value;
        const confirmPass = passwordConfirmInput.value;
        loginError.textContent = "";

        if (pass === "" || confirmPass === "") {
            loginError.textContent = "❌ Preencha todos os campos.";
            return;
        }

        if (pass !== confirmPass) {
            loginError.textContent = "❌ As senhas não são iguais.";
            return;
        }

        if (pass === CONFIG.APP_PASSWORD) {
            localStorage.setItem("isLoggedIn", "true");
            loginModal.classList.remove("show");
            passwordInput.value = "";
            passwordConfirmInput.value = "";
        } else {
            loginError.textContent = "❌ Senha incorreta!";
        }
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");
        loginModal.classList.add("show");
    });
});

// ==========================================================================
// 3. RENDERIZAÇÃO DO CATÁLOGO, FILTROS E FAVORITOS (MINHA LISTA)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const catalogGrid = document.getElementById("catalog");
    const myListGrid = document.getElementById("myList");
    const searchInput = document.getElementById("searchInput");
    const menuButtons = document.querySelectorAll(".menu button");

    let currentFilter = "home";
    let favoriteIds = JSON.parse(localStorage.getItem("myFavorites")) || [];

    function createCard(item) {
        const card = document.createElement("div");
        card.className = "catalog-item";
        card.style.position = "relative";
        card.style.background = "#181818";
        card.style.padding = "15px";
        card.style.borderRadius = "4px";
        card.style.cursor = "pointer";

        const isFav = favoriteIds.includes(item.id);

        card.innerHTML = `
            <div style="height: 120px; background: #2a2a2a; display: flex; align-items: center; justify-content: center; border-radius: 4px; font-weight: bold; margin-bottom: 10px;">
                🎬 ${item.title}
            </div>
            <h3 style="font-size: 1rem; margin-bottom: 5px;">${item.title}</h3>
            <button class="fav-btn" style="background: none; border: none; color: ${isFav ? 'gold' : '#888'}; font-size: 1.2rem; cursor: pointer; position: absolute; bottom: 10px; right: 10px;">
                ${isFav ? '★' : '☆'}
            </button>
        `;

        card.addEventListener("click", (e) => {
            if (!e.target.classList.contains("fav-btn")) {
                window.openPlayer(item);
            }
        });

        const favBtn = card.querySelector(".fav-btn");
        favBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleFavorite(item.id);
        });

        return card;
    }

    function toggleFavorite(id) {
        if (favoriteIds.includes(id)) {
            favoriteIds = favoriteIds.filter(favId => favId !== id);
        } else {
            favoriteIds.push(id);
        }
        localStorage.setItem("myFavorites", JSON.stringify(favoriteIds));
        renderAll();
    }

    function renderAll() {
        if (!catalogGrid || !myListGrid) return;
        catalogGrid.innerHTML = "";
        myListGrid.innerHTML = "";
        const searchTerm = searchInput.value.toLowerCase();

        CONFIG.CATALOG_DATA.forEach(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm);
            const matchesMenu = currentFilter === "home" || item.category === currentFilter;

            if (matchesSearch && matchesMenu && currentFilter !== "mylist") {
                catalogGrid.appendChild(createCard(item));
            }
        });

        CONFIG.CATALOG_DATA.forEach(item => {
            if (favoriteIds.includes(item.id)) {
                if (item.title.toLowerCase().includes(searchTerm)) {
                    myListGrid.appendChild(createCard(item));
                }
            }
        });
    }

    menuButtons.forEach(button => {
        button.addEventListener("click", () => {
            currentFilter = button.getAttribute("data-view");
            renderAll();
        });
    });

    searchInput.addEventListener("input", renderAll);
    renderAll();
});

// ==========================================================================
// 4. PLAYER DE VÍDEO (MODAL)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const playerModal = document.getElementById("playerModal");
    const playerTitle = document.getElementById("playerTitle");
    const playerDescription = document.getElementById("playerDescription");
    const videoPlayer = document.getElementById("videoPlayer");
    const closePlayer = document.getElementById("closePlayer");

    window.openPlayer = function(item) {
        playerTitle.textContent = item.title;
        playerDescription.textContent = item.description;
        videoPlayer.src = item.videoUrl;
        playerModal.classList.add("show");
        videoPlayer.play().catch(() => {});
    };

    function handleClosePlayer() {
        playerModal.classList.remove("show");
        videoPlayer.pause();
        videoPlayer.src = "";
    }

    closePlayer.addEventListener("click", handleClosePlayer);
    playerModal.addEventListener("click", (e) => {
        if (e.target === playerModal) {
            handleClosePlayer();
        }
    });
});
