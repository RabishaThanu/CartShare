// ==============================
// Select Elements
// ==============================

const nameInput = document.querySelector(".name-card input");
const cartInput = document.querySelectorAll(".cart-input")[0];
const roomInput = document.querySelectorAll(".cart-input")[1];

const createBtn = document.querySelector(".create-btn");
const joinBtn = document.querySelector(".join-btn");
const recentBtn = document.querySelector(".recent button");

// ==============================
// Generate Room Code
// ==============================

function generateRoomCode() {

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";

    for (let i = 0; i < 5; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return code;
}

// ==============================
// Create Cart
// ==============================

createBtn.addEventListener("click", function () {

    const userName = nameInput.value.trim();
    const cartName = cartInput.value.trim();

    if (userName === "") {
        alert("Please enter your name.");
        return;
    }

    if (cartName === "") {
        alert("Please enter a cart name.");
        return;
    }

    const roomCode = generateRoomCode();
    alert("Generated Room: " + roomCode);
    console.log("Generated Room:", roomCode);

    sessionStorage.setItem("userName", userName);
    localStorage.setItem("cartName", cartName);
    localStorage.setItem("roomCode", roomCode);

    localStorage.setItem("recentRoom", roomCode);

    window.location.href = "dashboard.html";

});

// ==============================
// Join Cart
// ==============================

joinBtn.addEventListener("click", function () {

    const userName = nameInput.value.trim();
    const roomCode = roomInput.value.trim().toUpperCase();

    if (userName === "") {
        alert("Please enter your name.");
        return;
    }

    if (roomCode === "") {
        alert("Please enter the room code.");
        return;
    }

    sessionStorage.setItem("userName", userName);
    localStorage.setItem("roomCode", roomCode);

    localStorage.setItem("recentRoom", roomCode);

    window.location.href = "dashboard.html";

});

// ==============================
// Recent Cart Button
// ==============================

const recentRoom = localStorage.getItem("recentRoom");

if (recentRoom) {

    recentBtn.innerHTML = `${recentRoom} <i class="bi bi-arrow-right"></i>`;

    recentBtn.addEventListener("click", function () {

        localStorage.setItem("roomCode", recentRoom);

        window.location.href = "dashboard.html";

    });

} else {

    recentBtn.style.display = "none";

}