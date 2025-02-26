const products = [
    {
      id: 1,
      name: "Smartphone",
      price: 499.99,
      image: "img/phone.jpg",
      description: "Latest model smartphone with advanced features",
      category: "Electronics",
      rating: 4.5,
      stock: 10
    },
    {
      id: 2,
      name: "Laptop",
      price: 999.99,
      image: "img/pexels-craigmdennis-205421.jpg",
      description: "Powerful laptop for work and gaming",
      category: "Electronics",
      rating: 4.8,
      stock: 5
    },
    {
      id: 3,
      name: "Designer T-Shirt",
      price: 29.99,
      image: "img/ck.jpg",
      description: "Premium cotton t-shirt with modern design",
      category: "Fashion",
      rating: 4.2,
      stock: 50
    },
    {
      id: 4,
      name: "Running Shoes",
      price: 79.99,
      image: "img/nike.png",
      description: "Comfortable running shoes with great support",
      category: "Fashion",
      rating: 4.6,
      stock: 15
    },
    {
      id: 5,
      name: "Coffee Maker",
      price: 89.99,
      image: "img/coffy.jpeg",
      description: "Automatic coffee maker with timer",
      category: "Home & Living",
      rating: 4.3,
      stock: 8
    },
    {
      id: 6,
      name: "Bed Sheet Set",
      price: 49.99,
      image: "img/bad.jpg",
      description: "100% cotton bed sheet set, queen size",
      category: "Home & Living",
      rating: 4.7,
      stock: 20
    }
  ];
  
  let cart = [];
  let wishlist = [];
  
  function renderProducts(category = 'All Products') {
    showSkeletonLoading();
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const sortBy = document.getElementById('sortSelect')?.value || 'default';
    const productsContainer = document.getElementById('products');
    
    let filteredProducts = category === 'All Products' 
      ? products 
      : products.filter(p => p.category === category);
  
    // Apply search filter
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm) || 
      p.description.toLowerCase().includes(searchTerm)
    );
  
    // Apply sorting
    switch(sortBy) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
    }
      
    setTimeout(() => {
      productsContainer.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="showProductDetails(${product.id})">
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <div class="price">$${product.price.toFixed(2)}</div>
          <div class="product-rating">
            ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}
            <span>(${product.rating})</span>
          </div>
          <div class="stock-cart-row">
            <div class="stock-status ${product.stock < 5 ? 'low-stock' : ''}">
              ${product.stock < 5 ? 'Only ' + product.stock + ' left!' : 'In Stock'}
            </div>
            <button class="add-to-cart-mini" onclick="event.stopPropagation(); addToCart(${product.id})">
              <i class="fas fa-shopping-cart"></i>
            </button>
          </div>
        </div>
      `).join('');
      
      hideLoading(productsContainer);
    }, 500);
  }
  
  window.showProductDetails = (productId) => {
    const product = products.find(p => p.id === productId);
    const detailsPanel = document.getElementById('productDetails');
    
    detailsPanel.innerHTML = `
      <div class="product-details-container">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
          <h2>${product.name}</h2>
          <div class="price">$${product.price.toFixed(2)}</div>
          <div class="product-rating">
            ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}
            <span>(${product.rating})</span>
          </div>
          <div class="stock-cart-row">
            <div class="stock-status ${product.stock < 5 ? 'low-stock' : ''}">
              ${product.stock < 5 ? 'Only ' + product.stock + ' left!' : 'In Stock'}
            </div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
              <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
          </div>
          <p class="description">${product.description}</p>
          <div class="category-tag">
            Category: <span>${product.category}</span>
          </div>
          <div class="action-buttons">
            <button class="add-to-wishlist" onclick="toggleWishlist(${product.id})">
              <i class="fas fa-heart"></i> Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    `;

    // Highlight the selected product card
    document.querySelectorAll('.product-card').forEach(card => {
      card.classList.remove('selected');
    });
    document.querySelector(`.product-card[onclick="showProductDetails(${productId})"]`)?.classList.add('selected');
  };
  
  window.addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product.stock > 0) {
      cart.push(product);
      product.stock--;
      updateCartCount();
      renderCart();
      renderProducts(document.querySelector('#categories li.active').textContent);
      showNotification(`${product.name} added to cart!`);
    } else {
      showNotification('Sorry, this item is out of stock!', 'error');
    }
  };
  
  window.toggleWishlist = (productId) => {
    const index = wishlist.findIndex(p => p.id === productId);
    const button = document.querySelector(`[data-wishlist="${productId}"]`);
    
    if (index === -1) {
      const product = products.find(p => p.id === productId);
      wishlist.push(product);
      button.classList.add('active');
      showToast('Added to wishlist!');
    } else {
      wishlist.splice(index, 1);
      button.classList.remove('active');
      showToast('Removed from wishlist!');
    }
    updateWishlistCount();
  };
  
  function updateWishlistCount() {
    document.getElementById('wishlist-count').textContent = wishlist.length;
  }
  
  function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
  }
  
  let currentUser = null;
  
  window.showLoginModal = () => {
    document.getElementById('loginModal').style.display = 'block';
  };
  
  window.login = () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (email && password) {
      currentUser = { email };
      document.getElementById('loginModal').style.display = 'none';
      document.getElementById('authSection').innerHTML = `
        <span>Welcome, ${email}</span>
        <button onclick="logout()">Logout</button>
      `;
    } else {
      alert('Please enter email and password');
    }
  };
  
  window.logout = () => {
    currentUser = null;
    document.getElementById('authSection').innerHTML = `
      <button onclick="showLoginModal()">Login</button>
    `;
    cart = [];
    updateCartCount();
    renderCart();
  };
  
  window.removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCartCount();
    renderCart();
  };
  
  function renderCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <span>${item.name}</span>
        <span>$${item.price}</span>
        <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
      </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cart-total').textContent = total.toFixed(2);
  }
  
  window.checkout = () => {
    if (!currentUser) {
      alert('Please login first!');
      showLoginModal();
      return;
    }
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    alert('Thank you for your purchase!');
    cart = [];
    updateCartCount();
    renderCart();
    document.getElementById('cartModal').style.display = 'none';
  };
  
  // Category selection
  document.getElementById('categories').addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
      document.querySelectorAll('#categories li').forEach(li => li.classList.remove('active'));
      e.target.classList.add('active');
      renderProducts(e.target.textContent);
    }
  });
  
  document.querySelector('.cart-icon').addEventListener('click', () => {
    document.getElementById('cartModal').style.display = 'block';
  });
  
  document.getElementById('cartModal').addEventListener('click', (e) => {
    if (e.target.id === 'cartModal') {
      document.getElementById('cartModal').style.display = 'none';
    }
  });
  
  // Event listeners for search and sort
  document.getElementById('searchInput')?.addEventListener('input', () => {
    renderProducts(document.querySelector('#categories li.active').textContent);
  });
  
  document.getElementById('sortSelect')?.addEventListener('change', () => {
    renderProducts(document.querySelector('#categories li.active').textContent);
  });
  
  // Add toast notification
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
  
  // Initialize the page
  renderProducts();
  updateCartCount();
  
  // Add loading state
  function showLoading(element) {
    element.classList.add('loading');
  }
  
  function hideLoading(element) {
    element.classList.remove('loading');
  }
  
  // Add skeleton loading for products
  function showSkeletonLoading() {
    const productsContainer = document.getElementById('products');
    const skeletonHTML = Array(6).fill(`
      <div class="product-card skeleton">
        <div style="height: 200px;"></div>
        <div style="height: 24px; margin: 1rem 0;"></div>
        <div style="height: 18px; width: 60%;"></div>
        <div style="height: 18px; margin: 0.5rem 0;"></div>
        <div style="height: 36px; margin-top: 1rem;"></div>
      </div>
    `).join('');
    
    productsContainer.innerHTML = skeletonHTML;
  }
  
  // Add notification system
  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `toast ${type}`;
    notification.innerHTML = `
      <div class="toast-content">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
  
  // Enhance login modal
  function enhanceLoginModal() {
    const loginContent = document.querySelector('.login-content');
    loginContent.innerHTML = `
      <span class="close-btn" onclick="closeLoginModal()">&times;</span>
      <h2>Welcome Back</h2>
      <div class="input-group">
        <input type="email" id="email" placeholder=" ">
        <label for="email">Email</label>
      </div>
      <div class="input-group">
        <input type="password" id="password" placeholder=" ">
        <label for="password">Password</label>
      </div>
      <button onclick="login()" class="login-btn">
        <i class="fas fa-sign-in-alt"></i> Login
      </button>
      <div class="social-login">
        <button class="google-btn">
          <i class="fab fa-google"></i> Continue with Google
        </button>
      </div>
    `;
  }
  
  // Initialize enhancements
  document.addEventListener('DOMContentLoaded', () => {
    enhanceLoginModal();
    
    // Add notification dot to cart if items present
    if (cart.length > 0) {
      const cartIcon = document.querySelector('.cart-icon');
      const dot = document.createElement('div');
      dot.className = 'notification-dot';
      cartIcon.appendChild(dot);
    }
  });
  