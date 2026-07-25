// =========================================
// Get Data
// =========================================

const roomCode = localStorage.getItem("roomCode") || "------";

const cart = JSON.parse(localStorage.getItem(`cart_${roomCode}`)) || [];

const cartName = localStorage.getItem("cartName") || "Shopping Cart";
function capitalize(text) {

    return text
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

}

// =========================================
// Elements
// =========================================

const cartNameEl = document.getElementById("cartName");
const receiptDate = document.getElementById("receiptDate");
const receiptRef = document.getElementById("receiptRef");

const receiptItems = document.getElementById("receiptItems");

const totalItems = document.getElementById("totalItems");
const grandTotal = document.getElementById("grandTotal");

const backBtn = document.getElementById("backBtn");
const printBtn = document.getElementById("printBtn");

// =========================================
// Header
// =========================================

cartNameEl.textContent = cartName;

receiptRef.textContent = roomCode;

receiptDate.textContent = new Date().toLocaleString([],{

    year:"numeric",

    month:"short",

    day:"numeric",

    hour:"2-digit",

    minute:"2-digit"

});

// =========================================
// Render Receipt Table
// =========================================

let total = 0;
let itemCount = 0;

receiptItems.innerHTML = "";

cart.forEach(item => {

    const subtotal = item.price * item.qty;

    total += subtotal;
    itemCount += item.qty;

    receiptItems.innerHTML += `
        <tr>
            <td>${capitalize(item.name)}</td>
            <td>${item.qty}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>${capitalize(item.user)}</td>
            <td>₹${subtotal.toFixed(2)}</td>
        </tr>
    `;

});

// =========================================
// Summary
// =========================================

totalItems.textContent=itemCount;

grandTotal.textContent = "₹" + total.toFixed(2);

// =========================================
// Buttons
// =========================================

backBtn.addEventListener("click",()=>{

    window.location.href="dashboard.html";

});

printBtn.addEventListener("click",()=>{

    window.print();

});