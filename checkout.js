document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('আপনার কার্ট খালি!');
        window.location.href = 'index.html';
        return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    const newOrder = {
        orderId: orderId,
        customerName: document.getElementById('c-name').value,
        phone: document.getElementById('c-phone').value,
        address: document.getElementById('c-address').value,
        paymentMethod: document.getElementById('c-payment').value,
        items: cart,
        totalAmount: totalAmount,
        status: 'Processing',
        date: new Date().toLocaleDateString()
    };

    let myOrders = JSON.parse(localStorage.getItem('myOrders')) || [];
    myOrders.unshift(newOrder);
    localStorage.setItem('myOrders', JSON.stringify(myOrders));

    // কার্ট খালি করে দেওয়া
    localStorage.removeItem('cart');

    alert(`🎉 আপনার অর্ডারটি সফলভাবে গৃহিত হয়েছে!\nআপনার অর্ডার আইডি: ${orderId}`);
    window.location.href = `track-order.html?id=${orderId}`;
});
                                       
