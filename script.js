let products = JSON.parse(localStorage.getItem('myProducts')) || [
    { id: 1, title: "প্রিমিয়াম কটন ক্যাজুয়াল শার্ট", category: "men", size: "L", price: 1250, oldPrice: 1500, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500" }
];

let cart = JSON.parse(localStorage.getItem('myCart')) || [];

function displayProducts(items) {
    const productList = document.getElementById('product-list');
    if (!productList) return;
    productList.innerHTML = '';

    items.forEach(product => {
        const productCard = `
            <div class="product-card" style="background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <img src="${product.image}" alt="${product.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 5px;">
                <h4 style="margin: 10px 0 5px; font-size: 16px;">${product.title}</h4>
                <p style="font-size: 13px; color: #666;">সাইজ: ${product.size}</p>
                <div style="margin: 8px 0; font-weight: bold; color: #e63946;">
                    ৳ ${product.price} <span style="text-decoration: line-through; color: #888; font-size: 12px;">৳ ${product.oldPrice}</span>
                </div>
                <button onclick="addToCart(${product.id})" style="width: 100%; padding: 8px; background: #1d3557; color: #fff; border: none; border-radius: 4px; cursor: pointer;">
                    <i class="fa-solid fa-cart-plus"></i> কার্টে যোগ করুন
                </button>
            </div>
        `;
        productList.innerHTML += productCard;
    });
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    localStorage.setItem('myCart', JSON.stringify(cart));
    updateCartUI();
    alert('প্রোডাক্টটি কার্টে যোগ করা হয়েছে!');
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    if(cartCount) cartCount.innerText = cart.length;
    
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">আপনার কার্ট বর্তমানে খালি।</p>';
        document.getElementById('total-price').innerText = '৳ 0';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        cartItemsContainer.innerHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                <div>
                    <h5 style="font-size: 14px;">${item.title}</h5>
                    <small>৳ ${item.price}</small>
                </div>
                <button onclick="removeFromCart(${index})" style="background: none; border: none; color: red; cursor: pointer;">&times;</button>
            </div>
        `;
    });

    document.getElementById('total-price').innerText = `৳ ${total}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('myCart', JSON.stringify(cart));
    updateCartUI();
}

const cartIcon = document.getElementById('cart-icon');
const cartDrawer = document.getElementById('cart-drawer');
const closeCart = document.getElementById('close-cart');

if(cartIcon && cartDrawer) {
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        cartDrawer.classList.add('active');
    });
    closeCart.addEventListener('click', () => {
        cartDrawer.classList.remove('active');
    });
}

const checkoutBtn = document.querySelector('.btn-checkout');
if(checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('আপনার কার্ট খালি!');
            return;
        }
        window.location.href = 'checkout.html';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    updateCartUI();
});
