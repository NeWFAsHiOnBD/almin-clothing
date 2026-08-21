document.addEventListener('DOMContentLoaded', function() {
    const loggedUser = JSON.parse(localStorage.getItem('loggedCustomer'));
    if (!loggedUser) {
        alert('আগে লগইন করতে হবে!');
        window.location.href = 'index.html';
        return;
    }

    const nameInput = document.getElementById('c-name');
    const phoneInput = document.getElementById('c-phone');

    if (nameInput) nameInput.value = loggedUser.name || '';
    if (phoneInput) phoneInput.value = loggedUser.phone || '';
});

const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const loggedUser = JSON.parse(localStorage.getItem('loggedCustomer')) || {};
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        if (cartItems.length === 0) {
            alert('আপনার কার্ট খালি!');
            window.location.href = 'index.html';
            return;
        }

        let totalAmount = 0;
        for (let i = 0; i < cartItems.length; i++) {
            let qty = cartItems[i].quantity || 1;
            totalAmount += (cartItems[i].price * qty);
        }

        const orderIdText = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        const currentDate = new Date().toLocaleDateString();

        const newOrder = {
            orderId: orderIdText,
            customerName: document.getElementById('c-name').value,
            phone: document.getElementById('c-phone').value,
            customerEmail: loggedUser.email || 'N/A',
            address: document.getElementById('c-address').value,
            paymentMethod: document.getElementById('c-payment').value,
            items: cartItems,
            totalAmount: totalAmount,
            status: 'Processing',
            date: currentDate
        };

        let existingOrders = JSON.parse(localStorage.getItem('myOrders')) || [];
        existingOrders.unshift(newOrder);
        localStorage.setItem('myOrders', JSON.stringify(existingOrders));

        localStorage.removeItem('cart');

        alert('আপনার অর্ডারটি সফলভাবে প্লেস হয়েছে!');
        window.location.href = 'my-orders.html';
    });
             }
            
