let adminProducts = JSON.parse(localStorage.getItem('myProducts')) || [
    {
        id: 1,
        title: "প্রিমিয়াম কটন ক্যাজুয়াল শার্ট",
        category: "men",
        size: "L",
        price: 1250,
        oldPrice: 1500,
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500"
    }
];

let adminOrders = JSON.parse(localStorage.getItem('myOrders')) || [];

function renderAdminProducts() {
    const tableBody = document.getElementById('admin-product-table');
    if(!tableBody) return;
    tableBody.innerHTML = '';

    adminProducts.forEach((product, index) => {
        const row = `
            <tr>
                <td><img src="${product.image}" alt="${product.title}" class="img-thumb"></td>
                <td><strong>${product.title}</strong></td>
                <td>${product.category === 'men' ? 'পুরুষ' : product.category === 'women' ? 'নারী' : 'বাচ্চা'}</td>
                <td>${product.size}</td>
                <td>৳ ${product.price}</td>
                <td>
                    <button class="btn-delete" onclick="deleteProduct(${index})">
                        <i class="fa-solid fa-trash"></i> ডিলিট
                    </button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    localStorage.setItem('myProducts', JSON.stringify(adminProducts));
}

document.getElementById('add-product-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const newProduct = {
        id: Date.now(),
        title: document.getElementById('p-title').value,
        category: document.getElementById('p-category').value,
        size: document.getElementById('p-size').value,
        price: Number(document.getElementById('p-price').value),
        oldPrice: Number(document.getElementById('p-old-price').value) || Number(document.getElementById('p-price').value),
        image: document.getElementById('p-image').value
    };

    adminProducts.unshift(newProduct);
    renderAdminProducts();
    this.reset();
    alert('🎉 নতুন প্রোডাক্ট সফলভাবে যোগ হয়েছে!');
});

function deleteProduct(index) {
    if (confirm('আপনি কি নিশ্চিত যে এই প্রোডাক্টটি মুছে ফেলতে চান?')) {
        adminProducts.splice(index, 1);
        renderAdminProducts();
    }
}

// ধাপ ৮: অর্ডার লিস্ট রেন্ডার ও আপডেট করার ফাংশন
function renderAdminOrders() {
    const orderTableBody = document.getElementById('admin-order-table');
    if (!orderTableBody) return;
    orderTableBody.innerHTML = '';

    if (adminOrders.length === 0) {
        orderTableBody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:#888;">এখনো কোনো নতুন অর্ডার আসেনি।</td></tr>';
        return;
    }

    adminOrders.forEach((order, index) => {
        const itemNames = order.items.map(item => item.title).join(', ');
        const row = `
            <tr>
                <td><strong>${order.orderId}</strong><br><small>${order.date}</small></td>
                <td>${order.customerName}<br><small>${order.phone}</small></td>
                <td><small>${order.address}</small></td>
                <td>${itemNames} (${order.items.length}টি)</td>
                <td><strong>৳ ${order.totalAmount}</strong></td>
                <td><span style="background: #e1f5fe; color: #0288d1; padding: 2px 6px; border-radius: 3px; font-size: 12px;">${order.paymentMethod}</span></td>
                <td>
                    <select onchange="changeOrderStatus(${index}, this.value)" style="padding: 4px; border-radius: 4px;">
                        <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>প্রসেসিং</option>
                        <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>কুরিয়ারে পাঠানো হয়েছে</option>
                        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>ডেলিভার্ড</option>
                        <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>বাতিল</option>
                    </select>
                </td>
                <td>
                    <button class="btn-delete" onclick="deleteOrder(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        orderTableBody.innerHTML += row;
    });
}

function changeOrderStatus(index, newStatus) {
    adminOrders[index].status = newStatus;
    localStorage.setItem('myOrders', JSON.stringify(adminOrders));
    alert(`অর্ডার স্টেটাস '${newStatus}' হিসেবে সেভ হয়েছে!`);
}

function deleteOrder(index) {
    if (confirm('আপনি কি এই অর্ডারটি মুছে ফেলতে চান?')) {
        adminOrders.splice(index, 1);
        localStorage.setItem('myOrders', JSON.stringify(adminOrders));
        renderAdminOrders();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderAdminProducts();
    renderAdminOrders();
});
