let cartItems = JSON.parse(localStorage.getItem('myCart')) || [];
let ordersList = JSON.parse(localStorage.getItem('myOrders')) || [];
let subtotal = 0;
let shippingCharge = 80;

function loadCheckoutSummary() {
    const summaryContainer = document.getElementById('checkout-items-list');
    if (!summaryContainer) return;
    
    if (cartItems.length === 0) {
        summaryContainer.innerHTML = '<p style="color: red;">কার্ট খালি!</p>';
        return;
    }

    summaryContainer.innerHTML = '';
    subtotal = 0;
    cartItems.forEach(item => {
        subtotal += item.price;
        summaryContainer.innerHTML += `<div class="order-summary-item"><span>${item.title}</span><span>৳ ${item.price}</span></div>`;
    });

    document.getElementById('subtotal-price').innerText = `৳ ${subtotal}`;
    calculateGrandTotal();
}

function updateShippingCharge() {
    shippingCharge = Number(document.getElementById('shipping-area').value);
    document.getElementById('shipping-charge-text').innerText = `৳ ${shippingCharge}`;
    calculateGrandTotal();
}

function calculateGrandTotal() {
    document.getElementById('grand-total-price').innerText = `৳ ${subtotal + shippingCharge}`;
}

function processOrder() {
    const name = document.getElementById('cust-name').value;
    const phone = document.getElementById('cust-phone').value;
    const address = document.getElementById('cust-address').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    if (!name || !phone || !address) {
        alert('সব তথ্য পূরণ করুন!');
        return;
    }

    const trackingId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
        orderId: trackingId, customerName: name, phone: phone, address: address,
        items: cartItems, totalAmount: subtotal + shippingCharge, paymentMethod: paymentMethod,
        status: 'Processing', date: new Date().toLocaleDateString('bn-BD')
    };

    ordersList.unshift(newOrder);
    localStorage.setItem('myOrders', JSON.stringify(ordersList));
    localStorage.removeItem('myCart');

    alert(`অর্ডার সফল হয়েছে! ট্র্যাকিং আইডি: ${trackingId}`);
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', loadCheckoutSummary);
