// EmailJS ইনিশিয়ালাইজেশন (আপনার পাবলিক কি দিয়ে)
(function() {
    emailjs.init("DXdkW6ZXuMumReLif");
})();

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// হোমপেজে প্রোডাক্ট রেন্ডারিং ফাংশন
function displayProducts(productsToDisplay) {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    productList.innerHTML = '';

    if (productsToDisplay.length === 0) {
        productList.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#777;">বর্তমানে কোনো প্রোডাক্ট নেই। অ্যাডমিন প্যানেল থেকে প্রোডাক্ট যোগ করুন।</p>';
        return;
    }

    productsToDisplay.forEach(product => {
        const card = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.title}" class="product-img">
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price">
                        <span class="current-price">৳ ${product.price}</span>
                        ${product.oldPrice ? `<span class="old-price">৳ ${product.oldPrice}</span>` : ''}
                    </div>
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">কার্ডে যোগ করুন</button>
                </div>
            </div>
        `;
        productList.innerHTML += card;
    });
}

// কার্টে প্রোডাক্ট যোগ করা
function addToCart(productId) {
    const allProducts = JSON.parse(localStorage.getItem('admin_products')) || [];
    const product = allProducts.find(p => p.id === productId);

    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
        document.getElementById('cart-drawer').classList.add('open');
    }
}

// কার্ট আপডেট ও কাউন্ট বাড়ানো
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const totalPriceElem = document.getElementById('total-price');

    if (cartCount) {
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.innerText = totalCount;
    }

    if (cartItems) {
        cartItems.innerHTML = '';
        let totalAmount = 0;

        cart.forEach((item, index) => {
            totalAmount += item.price * item.quantity;
            cartItems.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="cart-item-details">
                        <h4>${item.title}</h4>
                        <p>৳ ${item.price} x ${item.quantity}</p>
                    </div>
                    <button onclick="removeFromCart(${index})" style="background:none; border:none; color:red; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
        });

        if (totalPriceElem) {
            totalPriceElem.innerText = `৳ ${totalAmount}`;
        }
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// গ্লোবাল ভ্যারিয়েবল ওটিপি স্টোর করার জন্য
let generatedOtp = '';

// ওটিপি পাঠানোর ফাংশন (EmailJS যুক্ত করা হয়েছে)
function sendOtpCode() {
    const name = document.getElementById('cust-name').value.trim();
    const email = document.getElementById('cust-email').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();

    if(!name || !email || !phone) {
        alert('দয়া করে নাম, জিমেইল এবং ফোন নম্বর সঠিকভাবে পূরণ করুন!');
        return;
    }

    // ৪ ডিজিটের র্যান্ডম ওটিপি কোড জেনারেট করা
    generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // EmailJS টেমপ্লেট প্যারামিটার
    const templateParams = {
        to_email: email,
        to_name: name,
        pass_code: generatedOtp,
        message: `আপনার ওটিপি কোড হলো: ${generatedOtp}`
    };

    // ইমেল পাঠানোর রিকোয়েস্ট
    emailjs.send('service_h5dvcyh', 'template_fminrzr', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            tempUserData = { name, email, phone };
            document.getElementById('step-1').style.display = 'none';
            document.getElementById('step-2').style.display = 'block';
            alert('আপনার জিমেইলে সফলভাবে রিয়েল ওটিপি কোড পাঠানো হয়েছে!');
        }, function(error) {
            console.log('FAILED...', error);
            alert('ইমেল পাঠাতে সমস্যা হয়েছে! ইন্টারনেট কানেকশন বা জিমেইল চেক করুন।');
        });
}

// ওটিপি ভেরিফাই করার ফাংশন
function verifyOtpCode() {
    const otp = document.getElementById('otp-input').value.trim();
    if(otp === generatedOtp) {
        const registerData = {
            username: tempUserData.name,
            password: tempUserData.phone
        };

        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            localStorage.setItem('loggedCustomer', JSON.stringify(tempUserData));
            alert('🎉 সফলভাবে ভেরিফিকেশন ও সার্ভারে রেজিস্ট্রেশন সম্পন্ন হয়েছে!');
            closeAuthModal();
            checkUserLoginStatus();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('সার্ভারে সংযোগ স্থাপন করা যায়নি! টার্মিনালে সার্ভার चालू আছে কি না চেক করুন।');
        });

    } else {
        alert('ভুল ওটিপি কোড! আপনার জিমেইলে যাওয়া সঠিক কোডটি দিন।');
    }
}

// কার্ট ড্রয়ার টগল করা এবং ইনিশিয়ালাইজেশন
document.addEventListener('DOMContentLoaded', () => {
    updateCart();
    
    const cartIcon = document.getElementById('cart-icon');
    const closeCart = document.getElementById('close-cart');
    const cartDrawer = document.getElementById('cart-drawer');

    if (cartIcon) {
        cartIcon.addEventListener('click', () => cartDrawer.classList.add('open'));
    }
    if (closeCart) {
        closeCart.addEventListener('click', () => cartDrawer.classList.remove('open'));
    }

    // অটো লোড প্রোডাক্টস
    const savedProducts = JSON.parse(localStorage.getItem('admin_products')) || [];
    displayProducts(savedProducts);
});
            
