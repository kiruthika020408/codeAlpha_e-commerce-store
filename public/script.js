const cartItems = document.getElementById("cartItems");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutSection = document.getElementById("checkoutSection");
const checkoutForm = document.getElementById("checkoutForm");
const orderMessage = document.getElementById("orderMessage");
const authLink = document.getElementById("authLink");
const authStatus = document.getElementById("authStatus");
const toast = document.getElementById("toast");

let cart = [];
let user = JSON.parse(localStorage.getItem("storeUser")) || null;

if (!user) {
    window.location.href = "login.html";
}

function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timeout);
    showToast.timeout = setTimeout(() => toast.classList.remove("show"), 1600);
}

function addToCart(name, price) {
    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    renderCart();
    showToast(`${name} added to cart`);
}

function changeQuantity(name, delta) {
    const item = cart.find((cartItem) => cartItem.name === name);

    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        cart = cart.filter((cartItem) => cartItem.name !== name);
    }

    renderCart();
}

function renderAuth() {
    if (user) {
        authLink.textContent = "Logout";
        authLink.href = "#";
        authStatus.innerHTML = `<strong>Signed in as ${user.name}</strong><br>${user.email}`;
    } else {
        authLink.textContent = "Login";
        authLink.href = "login.html";
        authStatus.textContent = "Sign in to place your order.";
    }
}

function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty">Your order is empty.</p>';
        subtotalEl.textContent = "0";
        totalEl.textContent = "0";
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = "Cart is Empty";
        checkoutBtn.classList.add("disabled");
        return;
    }

    cartItems.innerHTML = cart
        .map(
            (item) => `
                <div class="cart-item">
                    <div>
                        <strong>${item.name}</strong>
                        <p>₹${item.price} each</p>
                    </div>
                    <div class="item-controls">
                        <button class="qty-btn" data-name="${item.name}" data-action="decrease">−</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" data-name="${item.name}" data-action="increase">+</button>
                    </div>
                    <div class="item-total">₹${item.price * item.quantity}</div>
                </div>
            `
        )
        .join("");

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    subtotalEl.textContent = subtotal;
    totalEl.textContent = subtotal;
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = "Proceed to Checkout";
    checkoutBtn.classList.remove("disabled");
}

document.addEventListener("click", (event) => {
    const button = event.target.closest(".qty-btn");

    if (!button) return;

    const { name, action } = button.dataset;
    changeQuantity(name, action === "increase" ? 1 : -1);
});

document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
        addToCart(button.dataset.name, Number(button.dataset.price));
    });
});

authLink.addEventListener("click", (event) => {
    if (user) {
        event.preventDefault();
        localStorage.removeItem("storeUser");
        user = null;
        renderAuth();
    }
});

checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        orderMessage.innerHTML = '<p class="empty">Please add items to your cart first.</p>';
        return;
    }

    if (!user) {
        orderMessage.innerHTML = `
            <div class="success-box" style="background:#fef2f2;border-color:#fecaca;color:#991b1b;">
                <strong>Registration required</strong>
                <p>Please create a customer account first to place your order.</p>
            </div>
        `;
        checkoutSection.classList.remove("hidden");
        checkoutSection.scrollIntoView({ behavior: "smooth" });
        return;
    }

    checkoutSection.classList.remove("hidden");
    checkoutSection.scrollIntoView({ behavior: "smooth" });
    orderMessage.innerHTML = "";
    document.getElementById("fullName").value = user.name;
    document.getElementById("email").value = user.email;
});

checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(checkoutForm);
    const name = formData.get("fullName");
    const email = formData.get("email");
    const address = formData.get("address");
    const phone = formData.get("phone");
    const payment = formData.get("payment");

    const orderNumber = Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    const order = {
        id: orderNumber,
        customerName: name,
        email,
        address,
        phone,
        payment,
        items: cart.map((item) => ({ ...item })),
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        orderedAt: now.toLocaleString(),
        date: now.toISOString().slice(0, 10)
    };

    const existingOrders = JSON.parse(localStorage.getItem("storeOrders")) || [];
    existingOrders.unshift(order);
    localStorage.setItem("storeOrders", JSON.stringify(existingOrders));

    orderMessage.innerHTML = `
        <div class="success-box">
            <strong>Order placed successfully!</strong>
            <p>Thank you, ${name}. Your order #${orderNumber} is being prepared.</p>
            <p>Payment method: ${payment}</p>
            <p>Delivery address: ${address}</p>
        </div>
    `;

    cart = [];
    renderCart();
    checkoutForm.reset();
    checkoutSection.classList.remove("hidden");
});

renderAuth();
renderCart();





