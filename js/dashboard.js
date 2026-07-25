// =========================================
// CARTSHARE DASHBOARD
// =========================================

// ---------- Local Storage ----------

const currentRoom = localStorage.getItem("roomCode");

let cart = JSON.parse(localStorage.getItem(`cart_${currentRoom}`)) || [];

let activity = JSON.parse(localStorage.getItem(`activity_${currentRoom}`)) || [];

// ---------- Current User ----------

const currentUser = sessionStorage.getItem("userName") || "Guest";

// ---------- Elements ----------

const itemName = document.getElementById("itemName");
const itemPrice = document.getElementById("itemPrice");
const itemQty = document.getElementById("itemQty");

const addBtn = document.getElementById("addBtn");

const cartItems = document.getElementById("cartItems");
const cartBadge = document.getElementById("cartBadge");

const itemCount = document.getElementById("itemCount");
const uniqueCount = document.getElementById("uniqueCount");
const totalCost = document.getElementById("totalCost");

const shippingText = document.getElementById("shippingText");
const shippingAmount = document.getElementById("shippingAmount");
const progressFill = document.querySelector(".progress-fill");

const payerList = document.getElementById("payerList");

const activityList = document.getElementById("activityList");

const roomCode = document.getElementById("roomCode");
const copyBtn = document.getElementById("copyBtn");


const checkoutBtn = document.getElementById("checkoutBtn");
const logoutBtn = document.getElementById("logoutBtn");

const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");

const profileName = document.getElementById("profileName");
const profileInitial = document.getElementById("profileInitial");
const dropdownInitial = document.getElementById("dropdownInitial");

// ==========================
// CAPITALIZE TEXT
// ==========================

function capitalize(text) {

    return text
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

}

// ==========================
// TOAST NOTIFICATION
// ==========================

const toast = document.getElementById("toast");
const toastIcon = document.getElementById("toastIcon");
const toastMessage = document.getElementById("toastMessage");

function showToast(message, type = "success") {

    toast.className = "toast";

    toast.classList.add(type);
    toast.classList.add("show");

    switch (type) {

        case "success":
            toastIcon.className = "bi bi-check-circle-fill";
            break;

        case "error":
            toastIcon.className = "bi bi-x-circle-fill";
            break;

        case "info":
            toastIcon.className = "bi bi-info-circle-fill";
            break;
    }

    toastMessage.textContent = message;

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// ==========================
// DELETE MODAL
// ==========================

const deleteModal = document.getElementById("deleteModal");
const deleteText = document.getElementById("deleteText");
const confirmDelete = document.getElementById("confirmDelete");
const cancelDelete = document.getElementById("cancelDelete");

let deleteItemId = null;

// =========================================
// EDIT MODAL
// =========================================

const editModal = document.getElementById("editModal");

const editItemName = document.getElementById("editItemName");
const editItemPrice = document.getElementById("editItemPrice");
const editItemQty = document.getElementById("editItemQty");
const editItemUser = document.getElementById("editItemUser");

const saveEdit = document.getElementById("saveEdit");
const cancelEdit = document.getElementById("cancelEdit");

let editItemId = null;

function openEditModal(id) {

    const item = cart.find(i => i.id === id);

    if (!item) return;

    editItemId = id;

    editItemName.value = item.name;
    editItemPrice.value = item.price;
    editItemQty.value = item.qty;
    editItemUser.value = item.user;

    editModal.classList.add("show");
}

function closeEditModal() {

    editModal.classList.remove("show");

    editItemId = null;
}

cancelEdit.addEventListener("click", closeEditModal);

function saveEditedItem() {

    if (editItemId === null) return;

    const item = cart.find(i => i.id === editItemId);

    if (!item) return;

    item.name = editItemName.value.trim();
    item.price = Number(editItemPrice.value);
    item.qty = Number(editItemQty.value);
    item.user = editItemUser.value.trim();

    saveCart();

    refresh();

    closeEditModal();

    showToast("Item updated successfully!", "success");
}

// =========================================
// EVENTS
// =========================================

addBtn.addEventListener("click", addItem);
copyBtn.addEventListener("click", copyRoomCode);
checkoutBtn.addEventListener("click", checkout);
logoutBtn.addEventListener("click", logout);


// =========================================
// INIT
// =========================================

function init() {

    roomCode.textContent = currentRoom;
 
    profileName.textContent = capitalize(currentUser);

    const firstLetter = currentUser.charAt(0).toUpperCase();

    profileInitial.textContent = firstLetter;
    dropdownInitial.textContent = firstLetter;

    renderCart();

    renderSummary();

    renderActivity();

    updateShipping();

}


// =========================================
// ADD ITEM
// =========================================

function addItem() {

    const name = itemName.value.trim();
    const price = Number(itemPrice.value);
    const qty = Number(itemQty.value);

    if (name === "") {
        showToast("Enter item name", "error");
        return;
    }

    if (price <= 0 || isNaN(price)) {
        showToast("Enter a valid price", "error");
        return;
    }

    if (qty <= 0 || isNaN(qty)) {
        showToast("Enter a valid quantity", "error");
        return;
    }

    // Check for duplicate item
    const duplicate = cart.find(item =>
    item.name.toLowerCase() === name.toLowerCase()
    );

     if (duplicate) {
        showToast(`${name} is already in the cart!`, "error");
        return;
    }

    const item = {

        id: Date.now(),

        name,

        price,

        qty,

        user: currentUser

    };

    cart.push(item);

    saveCart();

    addActivity({

        type: "add",

        user: currentUser,

        item: name,

        qty,

        price,

        time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })

    });

    clearInputs();

    refresh();

    showToast("Item added successfully!");

}

// =========================================
// CLEAR INPUTS
// =========================================

function clearInputs() {

    itemName.value = "";
    itemPrice.value = "";
    itemQty.value = 1;

    itemName.focus();

}

// =========================================
// SAVE
// =========================================

function saveCart() {

    console.log("Saving cart:", `cart_${currentRoom}`);
    localStorage.setItem(`cart_${currentRoom}`, JSON.stringify(cart));

}

function saveActivity() {

    localStorage.setItem(`activity_${currentRoom}`, JSON.stringify(activity));

}

// =========================================
// REFRESH
// =========================================

function refresh() {

    renderCart();

    renderSummary();

    renderActivity();

    updateShipping();

}

// =========================================
// RENDER CART
// =========================================

function renderCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">

                <i class="bi bi-bag"></i>

                <h3>The cart is empty</h3>

                <p>Be the first to add something.</p>

            </div>
        `;

        cartBadge.textContent = 0;

        return;
    }

    cartBadge.textContent = cart.length;

    cart.forEach(item => {

        const total = Number(item.price || 0) * Number(item.qty || 0);

        const card = document.createElement("div");

        card.className = "cart-item";

        card.innerHTML = `

            <div class="cart-top">

                <h3>${capitalize(item.name)}</h3>

                <div class="item-total">
                   ₹${total.toFixed(2)}
                </div>

            </div>

            <div class="cart-middle">

                <span class="price-small">
                  ₹${Number(item.price || 0).toFixed(2)} each
                </span>
                <span class="qty-badge">
                  Qty: ${item.qty}
                </span>

                <span class="added-by">
                    Added by ${capitalize(item.user)}
                </span>

            </div>

           <div class="cart-bottom">

    <div class="item-actions">

        <button
            class="edit-btn"
            onclick="openEditModal(${item.id})"
            title="Edit Item">
            <i class="bi bi-pencil"></i>
        </button>

        <button
            class="delete-btn"
            onclick="openDeleteModal(${item.id})"
            title="Delete Item">
            <i class="bi bi-trash"></i>
        </button>

    </div>

</div>

        `;

        cartItems.appendChild(card);

    });

}


// =========================================
// SUMMARY
// =========================================

function renderSummary() {

    let total = 0;

    let items = 0;

    cart.forEach(item => {

        total += item.price * item.qty;

        items += item.qty;

    });

    itemCount.textContent = items;

    uniqueCount.textContent = cart.length;

    totalCost.textContent = "₹" + total.toFixed(2);

    renderPayers();

}

// =========================================
// WHO'S PAYING WHAT
// =========================================

function renderPayers() {

    payerList.innerHTML = "";

    if (cart.length === 0) {

        payerList.innerHTML = `
            <p>
                Start adding items to see the split.
            </p>
        `;

        return;
    }

    const users = {};

    cart.forEach(item => {

        if (!users[item.user]) {

            users[item.user] = {

                total:0,

                count:0

            };

        }

        users[item.user].total += item.price * item.qty;

        users[item.user].count++;

    });

    Object.keys(users).forEach(name => {

        const row = document.createElement("div");

        row.className = "payer-row";

        row.innerHTML = `
            <div class="payer-left">
              <span class="payer-dot"></span>

              <span class="payer-name">
                ${capitalize(name)}
                <small>(${users[name].count})</small>
               </span>
            </div>

              <strong class="payer-total">
                ₹${users[name].total.toFixed(2)}
              </strong>
            `;

        payerList.appendChild(row);

    });

}

// =========================================
// SHIPPING
// =========================================

function updateShipping() {

    const FREE = 100;

    let total = 0;

    cart.forEach(item => {

        total += item.price * item.qty;

    });

    const remain = Math.max(0, FREE - total);

    shippingAmount.textContent =
        "₹" + remain.toFixed(2)

    if (remain === 0) {

        shippingText.textContent =
            "🎉 Free shipping unlocked";

    }

    else {

        shippingText.textContent =
            `Add ₹${remain.toFixed(2)} more for Free Shipping`

    }

    const percentage = Math.min((total / FREE) * 100, 100);
    progressFill.style.width = `${percentage}%`;

}

// =========================================
// ACTIVITY
// =========================================

function addActivity(data) {

    activity.unshift(data);

    if (activity.length > 10) {
        activity.pop();
    }

    saveActivity();

}

function renderActivity() {

    activityList.innerHTML = "";

    if (activity.length === 0) {

        activityList.innerHTML = `
            <p class="empty-activity">
                No activity yet.<br>
                Start adding items!
            </p>
        `;

        return;
    }

    activity.forEach(log => {

        const icon =
            log.type === "add"
                ? "bi-plus-lg"
                : "bi-trash";

        const color =
            log.type === "add"
                ? "#22c55e"
                : "#ef4444";

        const row = document.createElement("div");

        row.className = "activity-item";

        row.innerHTML = `

            <div
                class="activity-icon"
                style="background:${color}20;color:${color};">

                <i class="bi ${icon}"></i>

            </div>

            <div class="activity-content">

                <h4>

                    ${capitalize(log.user)}

                    ${log.type === "add" ? "added" : "removed"}

                    ${capitalize(log.item)}

                </h4>

                <p>

                    Qty: ${log.qty}

                    ·

                    ₹${Number(log.price).toFixed(2)} each

                </p>

            </div>

            <small class="activity-time">

                ${log.time}

            </small>

        `;

        activityList.appendChild(row);

    });

}

// =========================================
// OPEN DELETE MODAL
// =========================================

function openDeleteModal(id) {

    const item = cart.find(i => i.id === id);

    if (!item) return;

    deleteItemId = id;

    deleteText.textContent =
        `Are you sure you want to delete "${item.name}"?`;

    deleteModal.classList.add("show");

}

function closeDeleteModal() {

    deleteModal.classList.remove("show");

    deleteItemId = null;

}
// =========================================
// DELETE ITEM
// =========================================

function deleteItem() {

    if (deleteItemId === null) return;

    const item = cart.find(i => i.id === deleteItemId);

    if (!item) return;

    addActivity({

        type: "delete",

        user: item.user,

        item: item.name,

        qty: item.qty,

        price: item.price,

        time: new Date().toLocaleTimeString([], {

            hour: "2-digit",

            minute: "2-digit"

        })

    });

    cart = cart.filter(i => i.id !== deleteItemId);

    saveCart();

    refresh();

    closeDeleteModal();

    showToast("Item deleted successfully!", "success");

}

// =========================================
// COPY ROOM CODE
// =========================================

function copyRoomCode() {

    navigator.clipboard.writeText(roomCode.textContent);

    showToast("Room code copied!", "info");

}

// =========================================
// CHECKOUT
// =========================================

function checkout() {

    if (cart.length === 0) {

        showToast("Your cart is empty!", "error");

        return;

    }

    window.location.href = "receipt.html";

}

// =========================================
// LOGOUT
// =========================================

function logout() {

    if (!confirm("Logout?")) return;

    sessionStorage.removeItem("userName");

    window.location.href = "index.html";

}

// =========================================
// DELETE MODAL BUTTON EVENTS
// =========================================

confirmDelete.addEventListener("click", deleteItem);

cancelDelete.addEventListener("click", closeDeleteModal);

saveEdit.addEventListener("click", saveEditedItem);

// ==========================
// PROFILE MENU
// ==========================

profileBtn.addEventListener("click", function (e) {

    e.stopPropagation();

    profileDropdown.classList.toggle("show");

});

document.addEventListener("click", function () {

    profileDropdown.classList.remove("show");

});

// ==========================
// START APP
// ==========================

init();

// ==========================
// SYNC ACROSS BROWSER TABS
// ==========================
console.log("Storage listener loaded");

window.addEventListener("storage", function (event) {

    console.log("Storage Event Fired");
    console.log(event.key);

    if (
        event.key === `cart_${currentRoom}` ||
        event.key === `activity_${currentRoom}`
    ) {

        console.log("Refreshing...");

        cart = JSON.parse(localStorage.getItem(`cart_${currentRoom}`)) || [];
        activity = JSON.parse(localStorage.getItem(`activity_${currentRoom}`)) || [];

        console.log("Cart:", cart);
        console.log("Activity:", activity);

        refresh();

    }

});