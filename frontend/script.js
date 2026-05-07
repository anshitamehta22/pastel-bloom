// ==========================================
// 🌸 PASTEL BLOOM - MAIN JAVASCRIPT
// ==========================================

// ========== PRODUCT DATA ==========
const products = [
  { id: 1, name: "Bluebell Daisy Wrap", description: "Soft blue daisy bouquet wrapped in pastel blue paper", price: 599, image: "daisy.jpeg", category: "gift", rating: 4.7, reviews: 18 },
  { id: 2, name: "Lavender Whisper Bouquet", description: "Elegant lavender lilies with pearl accents", price: 699, image: "lily.jpeg", category: "wedding", rating: 4.9, reviews: 24 },
  { id: 3, name: "Blush Petal Dream", description: "Blush pink tulips with delicate wrapping", price: 699, image: "tulip.jpeg", category: "birthday", rating: 4.8, reviews: 21 },
  { id: 4, name: "Sunrise Bloom Bundle", description: "Warm orange sunflowers bringing joy and energy", price: 799, image: "sunflower.jpeg", category: "party", rating: 4.6, reviews: 15 },
  { id: 5, name: "Crimson Heart Embrace", description: "Heart-shaped red floral bouquet for romance", price: 999, image: "heart.jpeg", category: "wedding", rating: 5.0, reviews: 32 }
];

// ========== EXPANDED INDIAN PINCODE TO STATE MAPPING ==========
const pincodeStateMap = {
  '400': 'Maharashtra', '401': 'Maharashtra', '410': 'Maharashtra', '411': 'Maharashtra', '412': 'Maharashtra',
  '413': 'Maharashtra', '414': 'Maharashtra', '415': 'Maharashtra', '416': 'Maharashtra', '422': 'Maharashtra',
  '110': 'Delhi',
  '560': 'Karnataka', '561': 'Karnataka', '562': 'Karnataka', '570': 'Karnataka',
  '700': 'West Bengal', '711': 'West Bengal', '712': 'West Bengal',
  '600': 'Tamil Nadu', '601': 'Tamil Nadu', '620': 'Tamil Nadu', '641': 'Tamil Nadu',
  '360': 'Gujarat', '380': 'Gujarat', '390': 'Gujarat',
  '201': 'Uttar Pradesh', '226': 'Uttar Pradesh',
  '500': 'Telangana', '501': 'Telangana',
  '121': 'Haryana', '125': 'Haryana', '134': 'Haryana',
  '140': 'Punjab', '160': 'Punjab',
  '301': 'Rajasthan', '302': 'Rajasthan', '342': 'Rajasthan',
  '670': 'Kerala', '680': 'Kerala', '695': 'Kerala',
  '515': 'Andhra Pradesh', '520': 'Andhra Pradesh', '530': 'Andhra Pradesh'
};

// ========== STATE MANAGEMENT ==========
let cart = JSON.parse(localStorage.getItem('pastelBloomCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('pastelBloomWishlist')) || [];
let customBouquet = { flowers: [], colors: [], teddy: false, note: '', size: 'mini' };
let orderHistory = JSON.parse(localStorage.getItem('pastelBloomOrders')) || [];
let transactions = JSON.parse(localStorage.getItem('pastelBloomTransactions')) || [];
let generatedOTP = '';
let phoneVerified = false;

// ========== DOM ELEMENTS ==========
const productsGrid = document.getElementById('products-grid');
const cartCount = document.getElementById('cart-count');
const wishlistCount = document.getElementById('wishlist-count');
const searchInput = document.getElementById('search-input');
const customizationModal = document.getElementById('customization-modal');
const closeModalBtn = document.getElementById('close-modal');
const addToCartBtn = document.getElementById('add-custom-to-cart');
const cartIcon = document.getElementById('cart-icon');
const wishlistIcon = document.getElementById('wishlist-icon');
const profileIcon = document.getElementById('profile-icon');
const profileDropdown = document.getElementById('profile-dropdown');

// Overlay elements
const cartCheckoutOverlay = document.getElementById('cart-checkout-overlay');
const closeCheckoutOverlay = document.getElementById('close-checkout-overlay');
const overlayCheckoutForm = document.getElementById('overlay-checkout-form');
const overlayPlaceOrderBtn = document.getElementById('overlay-place-order-btn');
const overlayOrderItemsEl = document.getElementById('overlay-order-items');
const overlayOrderTotalEl = document.getElementById('overlay-order-total');

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

// OTP Modal
const otpModal = document.getElementById('otp-modal');
const closeOtpModal = document.getElementById('close-otp-modal');
const otpPhoneInput = document.getElementById('otp-phone');
const otpCodeInput = document.getElementById('otp-code');
const otpSendBtn = document.getElementById('otp-send-btn');
const otpVerifyBtn = document.getElementById('otp-verify-btn');
const otpInputGroup = document.getElementById('otp-input-group');

// ========== TOAST NOTIFICATION SYSTEM ==========
function showToast(message, type = 'success', title = '') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
  const defaultTitle = type === 'success' ? 'Success!' : 'Error';
  
  toast.innerHTML = `
    <i class="fas ${icon}"></i>
    <div class="toast-content">
      <div class="toast-title">${title || defaultTitle}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;
  
  container.appendChild(toast);
  setTimeout(() => { if (toast.parentElement) toast.remove(); }, 5000);
}

// ========== PINCODE STATE DETECTION ==========
function detectStateFromPincode(pincode) {
  if (!pincode || pincode.length < 3) return null;
  const prefix3 = pincode.slice(0, 3);
  return pincodeStateMap[prefix3] || 'Unknown';
}

function setupPincodeDetection(inputId, stateDisplayId, stateTextId, errorId) {
  const input = document.getElementById(inputId);
  const stateDisplay = document.getElementById(stateDisplayId);
  const stateText = document.getElementById(stateTextId);
  const errorEl = document.getElementById(errorId);
  
  if (!input) return;
  
  input.addEventListener('input', function() {
    const value = this.value.replace(/[^0-9]/g, '').slice(0, 6);
    this.value = value;
    
    if (value.length === 6) {
      const state = detectStateFromPincode(value);
      if (state && state !== 'Unknown') {
        stateText.textContent = `State: ${state}`;
        stateDisplay.className = 'pincode-state';
        stateDisplay.style.display = 'flex';
        errorEl?.classList.remove('show');
        this.classList.remove('error');
      } else {
        stateText.textContent = 'Pincode not recognized';
        stateDisplay.className = 'pincode-state error';
        stateDisplay.style.display = 'flex';
      }
    } else {
      stateDisplay.style.display = 'none';
    }
  });
}

// ========== LIGHTBOX FUNCTIONS - NEW ==========
function openLightbox(imageSrc) {
  lightboxImg.src = imageSrc;
  lightbox.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('show');
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// ========== OTP FUNCTIONS - NEW ==========
function openOTPModal() {
  otpModal.classList.add('show');
  profileDropdown.classList.remove('show');
  phoneVerified = false;
  otpInputGroup.style.display = 'none';
  otpVerifyBtn.style.display = 'none';
  otpSendBtn.style.display = 'block';
  otpPhoneInput.value = '';
  otpCodeInput.value = '';
}

function closeOTPModalFunc() {
  otpModal.classList.remove('show');
}

otpSendBtn.addEventListener('click', () => {
  const phone = otpPhoneInput.value.trim();
  if (!/^[0-9]{10}$/.test(phone)) {
    showToast('Please enter a valid 10-digit phone number', 'error');
    return;
  }
  
  // Generate random 6-digit OTP
  generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('Generated OTP:', generatedOTP); // For testing
  
  otpInputGroup.style.display = 'block';
  otpVerifyBtn.style.display = 'block';
  otpSendBtn.style.display = 'none';
  
  showToast('OTP sent successfully! Check console for testing.', 'success');
});

otpVerifyBtn.addEventListener('click', () => {
  const code = otpCodeInput.value.trim();
  if (code === generatedOTP) {
    phoneVerified = true;
    showToast('Phone number verified successfully!', 'success');
    setTimeout(closeOTPModalFunc, 1500);
  } else {
    showToast('Invalid OTP. Please try again.', 'error');
  }
});

closeOtpModal.addEventListener('click', closeOTPModalFunc);

// ========== PROFILE DROPDOWN - NEW ==========
profileIcon.addEventListener('click', (e) => {
  e.stopPropagation();
  profileDropdown.classList.toggle('show');
});

document.addEventListener('click', () => {
  profileDropdown.classList.remove('show');
});

function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.history-section').forEach(section => {
    section.classList.remove('show');
  });
  
  // Show selected section
  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.add('show');
    section.scrollIntoView({ behavior: 'smooth' });
    
    if (sectionId === 'order-history') renderOrderHistory();
    if (sectionId === 'transaction-history') renderTransactionHistory();
  }
  
  profileDropdown.classList.remove('show');
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    showToast('Logged out successfully', 'success');
    profileDropdown.classList.remove('show');
  }
}

// ========== RENDER PRODUCTS ==========
function renderProducts(productsToRender = products) {
  productsGrid.innerHTML = '';
  if (productsToRender.length === 0) {
    productsGrid.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:var(--text-light);padding:40px;">No products found</p>';
    return;
  }
  
  productsToRender.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    const isInWishlist = wishlist.includes(product.id);
    
    productCard.innerHTML = `
      <button class="wishlist-btn ${isInWishlist ? 'active' : ''}" data-id="${product.id}">
        <i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>
      </button>
      <div class="product-image" onclick="openLightbox('${product.image}')">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=400&h=400&fit=crop'">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="price">₹${product.price.toLocaleString('en-IN')}</div>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      </div>
    `;
    productsGrid.appendChild(productCard);
  });
  
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = parseInt(this.dataset.id);
      const product = products.find(p => p.id === productId);
      let existingItem = cart.find(item => item.id === productId);
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
      }
      localStorage.setItem('pastelBloomCart', JSON.stringify(cart));
      updateCartCount();
      updateOverlayOrderSummary();
      showToast(`${product.name} added to cart!`, 'success');
    });
  });
  
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = parseInt(this.dataset.id);
      const index = wishlist.indexOf(productId);
      if (index === -1) {
        wishlist.push(productId);
        this.classList.add('active');
        this.innerHTML = '<i class="fas fa-heart"></i>';
      } else {
        wishlist.splice(index, 1);
        this.classList.remove('active');
        this.innerHTML = '<i class="far fa-heart"></i>';
      }
      localStorage.setItem('pastelBloomWishlist', JSON.stringify(wishlist));
      updateWishlistCount();
    });
  });
}

// ========== UPDATE UI COUNTS ==========
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  cartCount.textContent = totalItems;
}

function updateWishlistCount() {
  wishlistCount.textContent = wishlist.length;
}

// ========== GET CUSTOM DETAILS HTML - NEW ==========
function getCustomDetailsHTML(item) {
  if (!item.isCustom) return '';
  
  return `
    <div class="custom-details">
      <div><i class="fas fa-seedling"></i><strong>Flowers:</strong> ${item.flowers || '-'}</div>
      <div><i class="fas fa-palette"></i><strong>Colors:</strong> ${item.colors || '-'}</div>
      <div><i class="fas fa-ruler-horizontal"></i><strong>Size:</strong> ${item.size === 'mini' ? 'Mini' : 'Large'}</div>
      ${item.teddy ? '<div><i class="fas fa-heart"></i><strong>Teddy:</strong> Yes (+₹50)</div>' : ''}
      ${item.note ? `<div><i class="fas fa-comment"></i><strong>Note:</strong> "${item.note}"</div>` : ''}
    </div>
  `;
}

// ========== UPDATE OVERLAY ORDER SUMMARY WITH CART CONTROLS - UPDATED ==========
function updateOverlayOrderSummary() {
  if (cart.length === 0) {
    overlayOrderItemsEl.innerHTML = '<p style="color:var(--text-light);font-size:0.9rem;">Your cart is empty</p>';
    overlayOrderTotalEl.textContent = '₹0';
    return;
  }
  
  let itemsHTML = '';
  let total = 0;
  
  cart.forEach(item => {
    const qty = item.quantity || 1;
    const itemTotal = item.price * qty;
    total += itemTotal;
    
    itemsHTML += `
      <div class="cart-item-wrapper">
        <div class="cart-item-header">
          <span style="font-weight:500;">${item.name}</span>
          <span style="font-weight:600;">₹${itemTotal.toLocaleString('en-IN')}</span>
        </div>
        ${getCustomDetailsHTML(item)}
        <div class="cart-item-controls">
          <button class="qty-btn minus" onclick="updateQuantity('${item.id}', -1)">−</button>
          <span class="qty-display">${qty}</span>
          <button class="qty-btn plus" onclick="updateQuantity('${item.id}', 1)">+</button>
          <button class="delete-btn" onclick="removeFromCart('${item.id}')"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `;
  });
  
  overlayOrderItemsEl.innerHTML = itemsHTML;
  overlayOrderTotalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
}

// ========== CART QUANTITY FUNCTIONS - NEW ==========
function updateQuantity(itemId, change) {
  const item = cart.find(i => i.id === itemId);
  if (!item) return;
  
  item.quantity = (item.quantity || 1) + change;
  
  if (item.quantity <= 0) {
    removeFromCart(itemId);
  } else {
    localStorage.setItem('pastelBloomCart', JSON.stringify(cart));
    updateCartCount();
    updateOverlayOrderSummary();
  }
}

function removeFromCart(itemId) {
  if (confirm('Remove this item from cart?')) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('pastelBloomCart', JSON.stringify(cart));
    updateCartCount();
    updateOverlayOrderSummary();
    showToast('Item removed from cart', 'success');
  }
}

// ========== SEARCH & CATEGORY ==========
searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase().trim();
  if (searchTerm === '') { renderProducts(products); return; }
  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm));
  renderProducts(filtered);
});

document.querySelectorAll('.category-card').forEach(card => {
  card.addEventListener('click', function() {
    document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
    const category = this.dataset.category;
    const filtered = category === 'all' ? products : products.filter(p => p.category === category);
    renderProducts(filtered);
  });
});

// ========== MODAL CONTROLS ==========
document.getElementById('open-custom-modal').addEventListener('click', () => {
  customizationModal.classList.add('show');
  document.body.style.overflow = 'hidden';
});
closeModalBtn.addEventListener('click', () => {
  customizationModal.classList.remove('show');
  document.body.style.overflow = '';
  resetValidation();
});
customizationModal.addEventListener('click', (e) => {
  if (e.target === customizationModal) {
    customizationModal.classList.remove('show');
    document.body.style.overflow = '';
    resetValidation();
  }
});

// ========== CART ICON - OPEN CHECKOUT OVERLAY ==========
cartIcon.addEventListener('click', () => {
  if (cart.length === 0) {
    showToast('Your cart is empty. Browse our collection!', 'error', 'Cart Empty');
    return;
  }
  updateOverlayOrderSummary();
  cartCheckoutOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
});

// ========== CLOSE CHECKOUT OVERLAY ==========
closeCheckoutOverlay.addEventListener('click', () => {
  cartCheckoutOverlay.classList.remove('show');
  document.body.style.overflow = '';
});

// ========== TAB SWITCHING ==========
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
    document.getElementById(`${this.dataset.tab}-tab`).classList.add('active');
  });
});

// ========== FLOWER/COLOR/SIZE SELECTION ==========
document.querySelectorAll('.flower-option').forEach(option => {
  option.addEventListener('click', function() {
    if (customBouquet.flowers.length >= 3 && !this.classList.contains('selected')) {
      showToast('You can select up to 3 flowers only.', 'error');
      return;
    }
    this.classList.toggle('selected');
    const flower = this.dataset.flower;
    if (this.classList.contains('selected')) customBouquet.flowers.push(flower);
    else customBouquet.flowers = customBouquet.flowers.filter(f => f !== flower);
    document.getElementById('flower-error').classList.remove('show');
    validateAndEnableButton();
    updatePreview();
  });
});

document.querySelectorAll('.color-option').forEach(option => {
  option.addEventListener('click', function() {
    if (customBouquet.colors.length >= 3 && !this.classList.contains('selected')) {
      showToast('You can select up to 3 colors only.', 'error');
      return;
    }
    this.classList.toggle('selected');
    const color = this.dataset.color;
    if (this.classList.contains('selected')) customBouquet.colors.push(color);
    else customBouquet.colors = customBouquet.colors.filter(c => c !== color);
    document.getElementById('color-error').classList.remove('show');
    validateAndEnableButton();
    updatePreview();
  });
});

document.getElementById('teddy-toggle').addEventListener('change', function() {
  customBouquet.teddy = this.checked;
  updatePreview();
});

document.getElementById('custom-note').addEventListener('input', function() {
  customBouquet.note = this.value;
});

document.querySelectorAll('.size-option').forEach(option => {
  option.addEventListener('click', function() {
    document.querySelectorAll('.size-option').forEach(o => {
      o.classList.remove('selected');
      o.classList.remove('error');
    });
    this.classList.add('selected');
    customBouquet.size = this.dataset.size;
    document.getElementById('size-error').classList.remove('show');
    validateAndEnableButton();
    updatePreview();
  });
});

// ========== VALIDATION ==========
function validateAndEnableButton() {
  const hasFlowers = customBouquet.flowers.length > 0;
  const hasColors = customBouquet.colors.length > 0;
  const hasSize = customBouquet.size !== '';
  if (hasFlowers && hasColors && hasSize) {
    addToCartBtn.disabled = false;
    document.getElementById('validation-error').classList.remove('show');
  } else {
    addToCartBtn.disabled = true;
    document.getElementById('validation-error').classList.add('show');
  }
}

function resetValidation() {
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
  document.querySelectorAll('.flower-option, .color-option').forEach(el => el.classList.remove('selected'));
  document.getElementById('custom-note').classList.remove('error');
}

// ========== PREVIEW UPDATE ==========
function updatePreview() {
  document.getElementById('preview-flowers').textContent = customBouquet.flowers.length > 0 ? customBouquet.flowers.join(', ') : '-';
  document.getElementById('preview-colors').textContent = customBouquet.colors.length > 0 ? customBouquet.colors.join(', ') : '-';
  document.getElementById('preview-teddy').textContent = customBouquet.teddy ? 'Yes (+₹50)' : 'No';
  document.getElementById('preview-size').textContent = customBouquet.size === 'mini' ? 'Mini (3-4 flowers)' : 'Large (7-8 flowers)';
  const basePrice = customBouquet.size === 'mini' ? 699 : 999;
  const teddyPrice = customBouquet.teddy ? 50 : 0;
  document.getElementById('preview-total').textContent = `₹${basePrice + teddyPrice}`;
}

// ========== ADD CUSTOM TO CART ==========
addToCartBtn.addEventListener('click', () => {
  if (customBouquet.flowers.length === 0) { document.getElementById('flower-error').classList.add('show'); document.querySelector('[data-tab="flowers"]').click(); return; }
  if (customBouquet.colors.length === 0) { document.getElementById('color-error').classList.add('show'); document.querySelector('[data-tab="colors"]').click(); return; }
  if (!customBouquet.size) { document.getElementById('size-error').classList.add('show'); document.querySelector('[data-tab="details"]').click(); return; }
  
  const basePrice = customBouquet.size === 'mini' ? 699 : 999;
  const teddyPrice = customBouquet.teddy ? 50 : 0;
  const totalPrice = basePrice + teddyPrice;
  const bouquetName = `${customBouquet.size === 'mini' ? 'Mini' : 'Large'} Custom Bouquet`;
  
  cart.push({
    id: `custom-${Date.now()}`,
    name: bouquetName,
    price: totalPrice,
    flowers: customBouquet.flowers.join(', '),
    colors: customBouquet.colors.join(', '),
    teddy: customBouquet.teddy,
    note: customBouquet.note,
    size: customBouquet.size,
    quantity: 1,
    isCustom: true
  });
  
  localStorage.setItem('pastelBloomCart', JSON.stringify(cart));
  updateCartCount();
  updateOverlayOrderSummary();
  showToast(`Custom bouquet added to cart!`, 'success');
  
  customizationModal.classList.remove('show');
  document.body.style.overflow = '';
  customBouquet = { flowers: [], colors: [], teddy: false, note: '', size: 'mini' };
  document.querySelectorAll('.flower-option, .color-option').forEach(el => el.classList.remove('selected'));
  document.getElementById('teddy-toggle').checked = false;
  document.getElementById('custom-note').value = '';
  document.querySelectorAll('.size-option').forEach(o => o.classList.remove('selected'));
  document.querySelector('.size-option[data-size="mini"]').classList.add('selected');
  resetValidation();
  updatePreview();
  addToCartBtn.disabled = true;
});

// ========== WISHLIST ICON ==========
wishlistIcon.addEventListener('click', () => {
  if (wishlist.length === 0) { showToast('Your wishlist is empty. Save your favorites!', 'error', 'Wishlist Empty'); return; }
  const wishlistItems = products.filter(p => wishlist.includes(p.id));
  let details = `Your Wishlist (${wishlist.length} items):\n\n`;
  wishlistItems.forEach(item => { details += `• ${item.name} - ₹${item.price}\n`; });
  alert(details);
});

// ========== PAYMENT METHOD SELECTION ==========
function setupPaymentSelection(containerSelector, hiddenInputId) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  container.querySelectorAll('.payment-option').forEach(option => {
    option.addEventListener('click', function() {
      container.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById(hiddenInputId).value = this.dataset.payment;
    });
  });
}

// ========== CHECKOUT FORM VALIDATION ==========
function validateCheckoutForm(formPrefix = '') {
  let isValid = true;
  const prefix = formPrefix ? formPrefix + '-' : '';
  
  const fields = [
    { id: prefix + 'customer-name', regex: /^[A-Za-z\s]+$/, errorId: prefix + 'name-error' },
    { id: prefix + 'customer-email', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, errorId: prefix + 'email-error' },
    { id: prefix + 'customer-phone', regex: /^[0-9]{10}$/, errorId: prefix + 'phone-error' },
    { id: prefix + 'customer-pincode', regex: /^[0-9]{6}$/, errorId: prefix + 'pincode-error' },
    { id: prefix + 'customer-address', regex: /.+/, errorId: prefix + 'address-error' }
  ];
  
  fields.forEach(field => {
    const input = document.getElementById(field.id);
    const errorEl = document.getElementById(field.errorId);
    const value = input?.value.trim();
    
    if (!value || !field.regex.test(value)) {
      input?.classList.add('error');
      errorEl?.classList.add('show');
      isValid = false;
    } else {
      input?.classList.remove('error');
      errorEl?.classList.remove('show');
    }
  });
  
  const paymentError = document.getElementById(prefix + 'payment-error');
  const paymentValue = document.getElementById(prefix + 'payment-method')?.value;
  if (!paymentValue) {
    paymentError?.classList.add('show');
    isValid = false;
  } else {
    paymentError?.classList.remove('show');
  }
  
  return isValid;
}

// ========== SAVE ORDER & TRANSACTION - NEW ==========
function saveOrder(orderData) {
  const order = {
    id: `ORD-${Date.now()}`,
    date: new Date().toISOString(),
    status: 'processing',
    ...orderData
  };
  
  orderHistory.unshift(order);
  localStorage.setItem('pastelBloomOrders', JSON.stringify(orderHistory));
  
  transactions.unshift({
    id: `TXN-${Date.now()}`,
    orderId: order.id,
    amount: orderData.totalPrice,
    paymentMethod: orderData.paymentMethod,
    date: order.date,
    status: 'completed'
  });
  localStorage.setItem('pastelBloomTransactions', JSON.stringify(transactions));
}

// ========== RENDER ORDER HISTORY - NEW ==========
function renderOrderHistory() {
  const container = document.getElementById('orders-list');
  if (orderHistory.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-box-open"></i>
        <h3>No orders yet</h3>
        <p>Your order history will appear here</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = orderHistory.map(order => `
    <div class="order-card ${order.status}">
      <div class="order-header">
        <div class="order-id-date">
          <strong>Order #${order.id}</strong>
          <small>${new Date(order.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</small>
        </div>
        <span class="order-status ${order.status}">${order.status}</span>
      </div>
      
      <div class="order-items-list">
        ${order.items.map(item => `
          <div class="order-item">
            <div>${item.name} × ${item.quantity}</div>
            <div>₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
            ${getCustomDetailsHTML(item)}
          </div>
        `).join('')}
      </div>
      
      <div class="order-footer">
        <div class="order-total-price">Total: ₹${order.totalPrice.toLocaleString('en-IN')}</div>
        ${order.status === 'processing' ? `<button class="cancel-btn" onclick="cancelOrder('${order.id}')">Cancel Order</button>` : ''}
      </div>
    </div>
  `).join('');
}

// ========== RENDER TRANSACTION HISTORY - NEW ==========
function renderTransactionHistory() {
  const container = document.getElementById('transactions-list');
  if (transactions.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-receipt"></i>
        <h3>No transactions yet</h3>
        <p>Your transaction history will appear here</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = transactions.map(txn => `
    <div class="order-card">
      <div class="order-header">
        <div class="order-id-date">
          <strong>Transaction #${txn.id}</strong>
          <small>${new Date(txn.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</small>
        </div>
        <span class="order-status ${txn.status}">${txn.status}</span>
      </div>
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin:15px 0;padding:15px;background:var(--cream);border-radius:12px;">
        <div><strong>Order ID:</strong> ${txn.orderId}</div>
        <div><strong>Payment Method:</strong> ${txn.paymentMethod.toUpperCase()}</div>
        <div><strong>Amount:</strong> ₹${txn.amount.toLocaleString('en-IN')}</div>
        <div><strong>Status:</strong> ${txn.status}</div>
      </div>
    </div>
  `).join('');
}

// ========== CANCEL ORDER - NEW ==========
function cancelOrder(orderId) {
  if (!confirm('Are you sure you want to cancel this order?')) return;
  
  const order = orderHistory.find(o => o.id === orderId);
  if (order && order.status === 'processing') {
    order.status = 'cancelled';
    localStorage.setItem('pastelBloomOrders', JSON.stringify(orderHistory));
    
    const txn = transactions.find(t => t.orderId === orderId);
    if (txn) {
      txn.status = 'refunded';
      localStorage.setItem('pastelBloomTransactions', JSON.stringify(transactions));
    }
    
    renderOrderHistory();
    showToast('Order cancelled successfully', 'success');
  }
}

// ========== PLACE ORDER FUNCTION ==========
async function placeOrder(e, formPrefix = '') {
  e.preventDefault();
  const prefix = formPrefix ? formPrefix + '-' : '';
  
  if (!validateCheckoutForm(formPrefix)) {
    showToast('Please fill all required fields correctly', 'error', 'Validation Error');
    return;
  }
  
  if (cart.length === 0) {
    showToast('Your cart is empty. Add some flowers first!', 'error', 'Cart Empty');
    return;
  }
  
  const name = document.getElementById(prefix + 'customer-name').value.trim();
  const email = document.getElementById(prefix + 'customer-email').value.trim();
  const phone = document.getElementById(prefix + 'customer-phone').value.trim();
  const pincode = document.getElementById(prefix + 'customer-pincode').value.trim();
  const address = document.getElementById(prefix + 'customer-address').value.trim();
  const paymentMethod = document.getElementById(prefix + 'payment-method').value;
  const state = detectStateFromPincode(pincode);
  
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  
  const orderData = {
    name,
    email,
    phone,
    pincode,
    state: state || 'Unknown',
    address,
    paymentMethod,
    items: cart,
    totalPrice
  };
  
  const btn = formPrefix ? overlayPlaceOrderBtn : document.getElementById('place-order-btn');
  btn.classList.add('loading');
  btn.disabled = true;
  btn.querySelector('.btn-text').textContent = 'Placing Order...';
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch('http://localhost:5000/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const result = await response.json();
    
    if (response.ok && result.success) {
      saveOrder(orderData); // Save to history
      
      cart = [];
      localStorage.setItem('pastelBloomCart', JSON.stringify(cart));
      updateCartCount();
      updateOverlayOrderSummary();
      
      overlayCheckoutForm?.reset();
      document.querySelectorAll('#overlay-checkout-form input, #overlay-checkout-form textarea').forEach(el => el.classList.remove('error'));
      document.getElementById('overlay-pincode-state').style.display = 'none';
      document.querySelectorAll('#overlay-checkout-form .payment-option').forEach((o, i) => {
        o.classList.toggle('selected', i === 0);
      });
      document.getElementById('overlay-payment-method').value = 'upi';
      
      showToast('Order placed successfully! 🌸 Confirmation email sent.', 'success', 'Order Confirmed');
      
      cartCheckoutOverlay.classList.remove('show');
      document.body.style.overflow = '';
    } else {
      showToast(result.message || 'Failed to place order. Please try again.', 'error', 'Order Failed');
    }
  } catch (error) {
    console.error('Order error:', error);
    if (error.name === 'AbortError') {
      showToast('Request timeout. Please check your internet connection.', 'error', 'Timeout Error');
    } else {
      showToast('Cannot connect to server. Please ensure backend is running.', 'error', 'Connection Error');
    }
  } finally {
    btn.classList.remove('loading');
    btn.disabled = false;
    btn.querySelector('.btn-text').textContent = 'Place Order';
  }
}

// ========== EVENT LISTENERS ==========
if (overlayCheckoutForm) overlayCheckoutForm.addEventListener('submit', (e) => placeOrder(e, 'overlay'));

['customer-name', 'customer-email', 'customer-phone', 'customer-pincode', 'customer-address'].forEach(field => {
  const input = document.getElementById('overlay-' + field);
  if (input) {
    input.addEventListener('input', function() {
      this.classList.remove('error');
      const errorEl = document.getElementById('overlay-' + field.replace('customer-', '') + '-error');
      if (errorEl) errorEl.classList.remove('show');
    });
  }
});

setupPincodeDetection('overlay-customer-pincode', 'overlay-pincode-state', 'overlay-state-detected', 'overlay-pincode-error');
setupPaymentSelection('#overlay-checkout-form .payment-methods', 'overlay-payment-method');

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartCount();
  updateWishlistCount();
  updatePreview();
  updateOverlayOrderSummary();
});

// Make functions global for onclick handlers
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.openOTPModal = openOTPModal;
window.showSection = showSection;
window.logout = logout;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.cancelOrder = cancelOrder;
