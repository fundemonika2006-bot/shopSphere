// PRODUCT DATA

const products = [
    {
        id: 1,
        name: "Ceramic Coffee Mug",
        category: "Home",
        price: 599,
        image: "https://images.unsplash.com/photo-1514228742587-6b1558f933e3?auto=format&fit=crop&w=600&q=75"
    },
    {
        id: 2,
        name: "Modern Desk Lamp",
        category: "Home",
        price: 1899,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=75"
    },
    {
        id: 3,
        name: "Canvas Tote Bag",
        category: "Accessories",
        price: 899,
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=75"
    },
    {
        id: 4,
        name: "Indoor Plant",
        category: "Living",
        price: 749,
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=75"
    },
    {
        id: 5,
        name: "Water Bottle",
        category: "Accessories",
        price: 1199,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=75"
    },
    {
        id: 6,
        name: "Soft Cushion",
        category: "Living",
        price: 1399,
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=75"
    },
    {
        id: 7,
        name: "Daily Notebook",
        category: "Stationery",
        price: 499,
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=75"
    },
    {
        id: 8,
        name: "Glass Flower Vase",
        category: "Living",
        price: 999,
        image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=600&q=75"
    }
];

// CART DATA

let cart = [];

try {
    cart = JSON.parse(localStorage.getItem("shopsphere-cart")) || [];
} catch {
    cart = [];
}

const productList = document.getElementById("product-list");
const cartCount = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");

const formatPrice = price => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(price);
};

// DISPLAY PRODUCTS

function displayProducts(list = products) {

    if (list.length === 0) {
        productList.innerHTML =
            "<p>No products found. Try another search.</p>";
        return;
    }

    productList.innerHTML = list.map(product => `
        <article class="product-card">

            <img
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
                onerror="this.onerror=null;this.src='https://placehold.co/400x400?text=Product'"
            >

            <div class="product-info">

                <p class="category">${product.category}</p>

                <h3>${product.name}</h3>

                <p class="price">${formatPrice(product.price)}</p>

                <button
                    class="add-btn"
                    onclick="addToCart(${product.id})"
                >
                    Add to Cart +
                </button>

            </div>

        </article>
    `).join("");
}

// ADD TO CART

function addToCart(id) {

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: id,
            quantity: 1
        });
    }

    saveCart();

    alert("Product added to cart!");
}

// SAVE CART

function saveCart() {

    localStorage.setItem(
        "shopsphere-cart",
        JSON.stringify(cart)
    );

    updateCartCount();
}

// UPDATE CART COUNT

function updateCartCount() {

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalItems;
}

// SHOW CART

function showCart() {

    cartModal.style.display = "flex";
    displayCartItems();
}

// CLOSE CART

function closeCart() {
    cartModal.style.display = "none";
}

// DISPLAY CART ITEMS

function displayCartItems() {

    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    if (cart.length === 0) {

        cartItems.innerHTML = "<p>Your cart is empty!</p>";
        cartTotal.textContent = "Total: ₹0";

        return;
    }

    let total = 0;

    cartItems.innerHTML = cart.map(item => {

        const product = products.find(
            p => p.id === item.id
        );

        if (!product) return "";

        total += product.price * item.quantity;

        return `
            <div class="cart-item">

                <div>
                    <strong>${product.name}</strong>

                    <p>${formatPrice(product.price)} × ${item.quantity}</p>

                    <button onclick="changeQuantity(${product.id}, -1)">
                        −
                    </button>

                    <button onclick="changeQuantity(${product.id}, 1)">
                        +
                    </button>
                </div>

                <button
                    class="remove-btn"
                    onclick="removeFromCart(${product.id})"
                >
                    Remove
                </button>

            </div>
        `;

    }).join("");

    cartTotal.textContent = "Total: " + formatPrice(total);
}

// CHANGE QUANTITY

function changeQuantity(id, change) {

    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    }

    saveCart();
    displayCartItems();
}

// REMOVE PRODUCT

function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id);

    saveCart();
    displayCartItems();
}

// CHECKOUT

function checkout() {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const confirmOrder = confirm(
        "This is a demo checkout. No payment will be collected. Continue?"
    );

    if (confirmOrder) {

        alert(
            "Demo order placed successfully! Thank you for shopping."
        );

        cart = [];

        saveCart();
        displayCartItems();
        closeCart();
    }
}

// SEARCH PRODUCTS

document.getElementById("search").addEventListener(
    "input",
    function () {

        const searchText = this.value.toLowerCase();

        const filteredProducts = products.filter(product => {

            return (
                product.name.toLowerCase().includes(searchText) ||
                product.category.toLowerCase().includes(searchText)
            );

        });

        displayProducts(filteredProducts);
    }
);

// SORT PRODUCTS

document.getElementById("sort").addEventListener(
    "change",
    function () {

        let sortedProducts = [...products];

        if (this.value === "low") {
            sortedProducts.sort((a, b) => a.price - b.price);
        }

        else if (this.value === "high") {
            sortedProducts.sort((a, b) => b.price - a.price);
        }

        displayProducts(sortedProducts);
    }
);

// CLOSE MODAL WHEN CLICKING OUTSIDE

cartModal.addEventListener("click", function (event) {

    if (event.target === cartModal) {
        closeCart();
    }

});

// INITIALIZE WEBSITE

document.getElementById("year").textContent =
    new Date().getFullYear();

displayProducts();
updateCartCount();