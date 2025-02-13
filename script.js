
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
      
    productsContainer.innerHTML = filteredProducts.map(product => `
      <div class="product-card" onclick="showProductDetails(${product.id})">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="price">$${product.price}</p>
        <div class="product-rating">
          ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}
          <span>(${product.rating})</span>
        </div>
        <p class="stock-status ${product.stock < 5 ? 'low-stock' : ''}">
          ${product.stock < 5 ? 'Only ' + product.stock + ' left!' : 'In Stock'}
        </p>
        <div class="card-buttons">
          <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
          <button class="add-to-wishlist" onclick="event.stopPropagation(); toggleWishlist(${product.id})">
            <i class="fas fa-heart"></i>
          </button>
        </div>
      </div>
    `).join('');
  }
  
  window.showProductDetails = (productId) => {
    const product = products.find(p => p.id === productId);
    const detailsPanel = document.getElementById('productDetails');
    
    detailsPanel.innerHTML = `
      <h2>${product.name}</h2>
      <img src="${product.image}" alt="${product.name}" style="width: 100%; max-width: 200px; margin: 1rem 0;">
      <p class="price">$${product.price}</p>
      <p>${product.description}</p>
      <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
    `;
  };
  
  window.addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product.stock > 0) {
      cart.push(product);
      product.stock--;
      updateCartCount();
      renderCart();
      renderProducts(document.querySelector('#categories li.active').textContent);
    } else {
      alert('Sorry, this item is out of stock!');
    }
  };
  
  window.toggleWishlist = (productId) => {
    const index = wishlist.findIndex(p => p.id === productId);
    if (index === -1) {
      const product = products.find(p => p.id === productId);
      wishlist.push(product);
    } else {
      wishlist.splice(index, 1);
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
  
  // Initialize the page
  renderProducts();
  updateCartCount();
  