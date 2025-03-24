document.addEventListener("DOMContentLoaded", function () {
    let cart = [];

    // Elements
    const categoryFilter = document.getElementById("categoryFilter");
    const priceFilter = document.getElementById("priceFilter");
    const applyFilters = document.getElementById("applyFilters");
    const menuItems = document.querySelectorAll(".menu-item");
    const cartCount = document.getElementById("cart-count");
    const cartNavItem = document.getElementById("cart");

    // Apply Filters
    applyFilters.addEventListener("click", function () {
        const selectedCategory = categoryFilter.value;
        const selectedPrice = priceFilter.value;

        let itemsArray = Array.from(menuItems);

        // Category Filtering
        itemsArray.forEach(item => {
            const category = item.dataset.category;
            item.style.display = (selectedCategory === "all" || category === selectedCategory) ? "block" : "none";
        });

        // Price Sorting
        if (selectedPrice !== "none") {
            itemsArray.sort((a, b) => {
                const priceA = parseInt(a.dataset.price);
                const priceB = parseInt(b.dataset.price);
                return selectedPrice === "lowToHigh" ? priceA - priceB : priceB - priceA;
            });
            const menuContainer = document.querySelector(".menu");
            itemsArray.forEach(item => menuContainer.appendChild(item));
        }
    });

    // Add to Cart
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const item = this.closest(".menu-item");
            const itemId = this.dataset.id;
            const itemName = item.querySelector("h3").innerText;
            const itemPrice = parseInt(item.dataset.price);

            const existingItem = cart.find(cartItem => cartItem.id === itemId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id: itemId, name: itemName, price: itemPrice, quantity: 1 });
            }

            updateCartCount();
        });
    });

    // Update Cart Count
    function updateCartCount() {
        cartCount.innerText = cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Show Cart on Click
    cartNavItem.addEventListener("click", function () {
        showCart();
    });

    // Show Cart Items in Modal
    function showCart() {
        let cartModal = document.getElementById("cart-modal");

        if (cartModal) {
            cartModal.remove();
        }

        cartModal = document.createElement("div");
        cartModal.id = "cart-modal";
        cartModal.classList.add("cart-popup");

        let cartHTML = `<h2>Your Cart</h2>`;
        if (cart.length === 0) {
            cartHTML += `<p>Your cart is empty.</p>`;
        } else {
            cartHTML += `<ul class="cart-list">`;
            cart.forEach(item => {
                cartHTML += `
                    <li>${item.name} - ₹${item.price} (x${item.quantity}) 
                    <button class="remove-item" data-id="${item.id}">Remove</button></li>`;
            });
            cartHTML += `</ul>`;
            cartHTML += `<p id="total-amount">Total: ₹${calculateTotal()}</p>`;
            cartHTML += `<button id="order-btn">Order</button>`;
        }

        cartHTML += `<button id="close-cart">Close</button>`;
        cartModal.innerHTML = `<div class="cart-content">${cartHTML}</div>`;
        document.body.appendChild(cartModal);

        cartModal.style.display = "block";

        document.getElementById("close-cart").addEventListener("click", function () {
            cartModal.style.display = "none";
        });

        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", function () {
                removeItem(this.dataset.id);
            });
        });

        setTimeout(() => {
            let orderBtn = document.getElementById("order-btn");
            if (orderBtn) {
                orderBtn.addEventListener("click", showOrderForm);
            }
        }, 500);
    }

    function calculateTotal() {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    function removeItem(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        updateCartCount();
        showCart();
    }

    function showOrderForm() {
        console.log("✅ Order form function triggered!");

        let orderForm = document.getElementById("order-form");
        if (orderForm) orderForm.remove();

        orderForm = document.createElement("div");
        orderForm.id = "order-form";
        orderForm.classList.add("order-popup");

        orderForm.innerHTML = `
            <h2>Complete Your Order</h2>
            <form id="orderForm">
                <label>Name: <input type="text" name="name" id="name" required></label>
                <small class="error" id="name-error"></small>

                <label>Phone: <input type="tel" name="phone" id="phone" required></label>
                <small class="error" id="phone-error"></small>

                <label>Address: <textarea name="address" id="address" required></textarea></label>
                <small class="error" id="address-error"></small>

                <p id="final-total">Total: ₹${calculateTotal()}</p>
                <button type="submit">Submit Order</button>
                <button type="button" id="cancel-order">Cancel</button>
            </form>
        `;
        document.body.appendChild(orderForm);

        // Ensure order form is displayed
        orderForm.style.display = "block";

        document.getElementById("orderForm").addEventListener("submit", validateAndSubmitOrder);
        document.getElementById("cancel-order").addEventListener("click", function () {
            orderForm.remove();
        });
    }

    function validateAndSubmitOrder(event) {
        event.preventDefault();

        let isValid = true;
        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();

        const nameError = document.getElementById("name-error");
        const phoneError = document.getElementById("phone-error");
        const addressError = document.getElementById("address-error");

        nameError.innerText = "";
        phoneError.innerText = "";
        addressError.innerText = "";

        if (name === "" || !/^[a-zA-Z\s]+$/.test(name)) {
            nameError.innerText = "Please enter a valid name (letters only).";
            isValid = false;
        }

        if (phone === "" || !/^\d{10}$/.test(phone)) {
            phoneError.innerText = "Please enter a valid 10-digit phone number.";
            isValid = false;
        }

        if (address === "") {
            addressError.innerText = "Address cannot be empty.";
            isValid = false;
        }

        if (isValid) {
            submitOrder({ name, phone, address });
        }
    }

    function submitOrder(orderDetails) {
        fetch("order_handler.php", {
            method: "POST",
            body: JSON.stringify({ order: cart, customer: orderDetails }),
            headers: { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            cart = [];
            updateCartCount();
            document.getElementById("order-form").remove();
        })
        .catch(error => console.error("Error:", error));
    }
});
