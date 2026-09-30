// config/db.js — In-Memory + MySQL resilient database adapter for BookMart
const bcrypt = require('bcryptjs');

let realPool = null;
const useRealDb = Boolean(process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_NAME);

if (useRealDb) {
  try {
    const mysql = require('mysql2');
    realPool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'bookmart',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    }).promise();
  } catch (err) {
    console.warn('[DB] MySQL init failed, falling back to in-memory store:', err.message);
    realPool = null;
  }
}

// ── In-Memory Database Store ────────────────────────────────
console.log('⚡ [DB] Initializing BookMart in-memory database store with seed data');

const adminPasswordHash = bcrypt.hashSync('Admin@1234', 10);
const userPasswordHash = bcrypt.hashSync('password123', 10);

const memoryDB = {
  categories: [
    { id: 1, name: 'Fiction', slug: 'fiction' },
    { id: 2, name: 'Science & Tech', slug: 'science-tech' },
    { id: 3, name: 'Self-Help', slug: 'self-help' },
    { id: 4, name: 'History', slug: 'history' },
    { id: 5, name: 'Business', slug: 'business' }
  ],

  users: [
    {
      id: 1,
      name: 'Store Admin',
      email: 'admin@bookmart.com',
      password: adminPasswordHash,
      role: 'admin',
      is_active: 1,
      address: '100 Admin Way',
      city: 'San Francisco',
      state: 'CA',
      zip: '94103',
      country: 'US',
      created_at: new Date('2026-01-01T00:00:00Z').toISOString()
    },
    {
      id: 2,
      name: 'John Doe',
      email: 'john@example.com',
      password: userPasswordHash,
      role: 'customer',
      is_active: 1,
      address: '456 Fiction Blvd',
      city: 'Seattle',
      state: 'WA',
      zip: '94105',
      country: 'US',
      created_at: new Date('2026-01-15T00:00:00Z').toISOString()
    },
    {
      id: 3,
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: userPasswordHash,
      role: 'customer',
      is_active: 1,
      address: '123 Tech Lane',
      city: 'San Francisco',
      state: 'CA',
      zip: '10001',
      country: 'US',
      created_at: new Date('2026-02-01T00:00:00Z').toISOString()
    }
  ],

  products: [
    {
      id: 1,
      title: 'The Pragmatic Programmer',
      author: 'David Thomas & Andrew Hunt',
      description: 'A masterclass in software engineering and professional craftsmanship.',
      price: 39.99,
      stock: 50,
      image_url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=400&q=80',
      isbn: '978-0201616224',
      rating: 4.8,
      category_id: 2
    },
    {
      id: 2,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      description: 'A Handbook of Agile Software Craftsmanship that teaches how to write maintainable code.',
      price: 45.00,
      stock: 30,
      image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
      isbn: '978-0132350884',
      rating: 4.9,
      category_id: 2
    },
    {
      id: 3,
      title: 'Dune',
      author: 'Frank Herbert',
      description: 'A science fiction masterpiece set on the desert planet Arrakis.',
      price: 15.99,
      stock: 100,
      image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
      isbn: '978-0441172719',
      rating: 4.7,
      category_id: 1
    },
    {
      id: 4,
      title: 'Atomic Habits',
      author: 'James Clear',
      description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.',
      price: 20.00,
      stock: 200,
      image_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80',
      isbn: '978-0735211292',
      rating: 4.9,
      category_id: 3
    },
    {
      id: 5,
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      description: 'A Brief History of Humankind covering cognitive, agricultural, and scientific revolutions.',
      price: 24.99,
      stock: 80,
      image_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80',
      isbn: '978-0062316097',
      rating: 4.8,
      category_id: 4
    },
    {
      id: 6,
      title: '1984',
      author: 'George Orwell',
      description: 'Dystopian social science fiction novel exploring totalitarianism, mass surveillance, and control.',
      price: 12.99,
      stock: 45,
      image_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80',
      isbn: '978-0451524935',
      rating: 4.6,
      category_id: 1
    },
    {
      id: 7,
      title: 'Think and Grow Rich',
      author: 'Napoleon Hill',
      description: 'Classic personal development and wealth mindset guide.',
      price: 14.50,
      stock: 60,
      image_url: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&q=80',
      isbn: '978-1585424337',
      rating: 4.5,
      category_id: 5
    },
    {
      id: 8,
      title: 'Steve Jobs',
      author: 'Walter Isaacson',
      description: 'The definitive, uncensored biography of Apple co-founder Steve Jobs.',
      price: 22.00,
      stock: 40,
      image_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80',
      isbn: '978-1451648539',
      rating: 4.7,
      category_id: 5
    },
    {
      id: 9,
      title: 'Design Patterns',
      author: 'Erich Gamma et al.',
      description: 'Elements of Reusable Object-Oriented Software by the Gang of Four.',
      price: 54.99,
      stock: 25,
      image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80',
      isbn: '978-0201633610',
      rating: 4.8,
      category_id: 2
    },
    {
      id: 10,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      description: 'The classic tragic story of Jay Gatsby and the Jazz Age.',
      price: 10.99,
      stock: 75,
      image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80',
      isbn: '978-0743273565',
      rating: 4.5,
      category_id: 1
    },
    {
      id: 11,
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      description: 'The monumental examination of the two systems that drive the way we think.',
      price: 18.50,
      stock: 90,
      image_url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80',
      isbn: '978-0374533557',
      rating: 4.7,
      category_id: 3
    },
    {
      id: 12,
      title: 'Guns, Germs, and Steel',
      author: 'Jared Diamond',
      description: 'The Fates of Human Societies and why civilizations developed at different rates.',
      price: 19.99,
      stock: 40,
      image_url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&q=80',
      isbn: '978-0393317558',
      rating: 4.6,
      category_id: 4
    },
    {
      id: 13,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      description: 'A timeless coming-of-age story and Pulitzer Prize winner exploring justice and morality.',
      price: 13.99,
      stock: 65,
      image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
      isbn: '978-0060935467',
      rating: 4.9,
      category_id: 1
    },
    {
      id: 14,
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      description: 'The comprehensive guide to modern algorithms and data structures.',
      price: 68.00,
      stock: 20,
      image_url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=400&q=80',
      isbn: '978-0262033848',
      rating: 4.8,
      category_id: 2
    },
    {
      id: 15,
      title: 'Zero to One',
      author: 'Peter Thiel',
      description: 'Notes on Startups, or How to Build the Future and create unique value.',
      price: 17.50,
      stock: 85,
      image_url: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&q=80',
      isbn: '978-0804139298',
      rating: 4.7,
      category_id: 5
    },
    {
      id: 16,
      title: 'Man’s Search for Meaning',
      author: 'Viktor E. Frankl',
      description: 'Psychiatrist Viktor Frankl’s memoir of life in Nazi death camps and exploration of logotherapy.',
      price: 11.99,
      stock: 110,
      image_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80',
      isbn: '978-0807014295',
      rating: 4.9,
      category_id: 3
    }
  ],

  cart_items: [
    { id: 1, user_id: 2, product_id: 1, quantity: 1 },
    { id: 2, user_id: 2, product_id: 4, quantity: 2 }
  ],

  orders: [
    {
      id: 1,
      user_id: 3,
      subtotal: 39.99,
      tax: 3.20,
      total: 43.19,
      status: 'paid',
      shipping_name: 'Jane Smith',
      shipping_email: 'jane@example.com',
      shipping_address: '123 Tech Lane',
      shipping_city: 'San Francisco',
      shipping_state: 'CA',
      shipping_zip: '10001',
      shipping_country: 'US',
      paypal_order_id: 'DEV-PAYPAL-1',
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 2,
      user_id: 2,
      subtotal: 45.00,
      tax: 3.60,
      total: 48.60,
      status: 'pending',
      shipping_name: 'John Doe',
      shipping_email: 'john@example.com',
      shipping_address: '456 Fiction Blvd',
      shipping_city: 'Seattle',
      shipping_state: 'WA',
      shipping_zip: '94105',
      shipping_country: 'US',
      paypal_order_id: null,
      created_at: new Date().toISOString()
    }
  ],

  order_items: [
    { id: 1, order_id: 1, product_id: 1, quantity: 1, price: 39.99 },
    { id: 2, order_id: 2, product_id: 2, quantity: 1, price: 45.00 }
  ]
};

let nextId = {
  users: 4,
  products: 17,
  cart_items: 3,
  orders: 3,
  order_items: 3,
  categories: 6
};

// ── In-Memory Query Engine ──────────────────────────────────
function executeInMemoryQuery(sql, params = []) {
  const s = sql.trim().replace(/\s+/g, ' ');

  // 1. Categories
  if (s.startsWith('SELECT * FROM categories')) {
    return [memoryDB.categories.map(c => ({ ...c }))];
  }

  // 2. Products Query (Catalog)
  // SELECT p.*, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1...
  if (s.startsWith('SELECT p.*, c.slug as category_slug FROM products p LEFT JOIN categories c')) {
    let prods = memoryDB.products.map(p => {
      const cat = memoryDB.categories.find(c => c.id === p.category_id);
      return {
        ...p,
        category: cat ? cat.name : null,
        category_slug: cat ? cat.slug : null
      };
    });

    let paramIdx = 0;
    if (s.includes('AND c.slug = ?')) {
      const slug = params[paramIdx++];
      prods = prods.filter(p => p.category_slug === slug);
    }
    if (s.includes('AND (p.title LIKE ? OR p.author LIKE ?)')) {
      const p1 = String(params[paramIdx++] || '').replace(/%/g, '').toLowerCase();
      const p2 = String(params[paramIdx++] || '').replace(/%/g, '').toLowerCase();
      prods = prods.filter(p =>
        (p.title && p.title.toLowerCase().includes(p1)) ||
        (p.author && p.author.toLowerCase().includes(p2))
      );
    }

    // Sorting
    if (s.includes('ORDER BY p.rating DESC')) {
      prods.sort((a, b) => b.rating - a.rating);
    } else if (s.includes('ORDER BY p.title ASC')) {
      prods.sort((a, b) => a.title.localeCompare(b.title));
    } else if (s.includes('ORDER BY p.price ASC')) {
      prods.sort((a, b) => a.price - b.price);
    } else if (s.includes('ORDER BY p.price DESC')) {
      prods.sort((a, b) => b.price - a.price);
    } else {
      prods.sort((a, b) => b.id - a.id);
    }

    if (s.includes('LIMIT ? OFFSET ?')) {
      const limit = params[paramIdx++];
      const offset = params[paramIdx++];
      const sliced = prods.slice(offset, offset + limit);
      return [sliced];
    }

    return [prods];
  }

  // 3. Single Product Query
  // SELECT p.*, c.name as category FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?
  if (s.startsWith('SELECT p.*, c.name as category FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?')) {
    const id = Number(params[0]);
    const p = memoryDB.products.find(x => x.id === id);
    if (!p) return [[]];
    const cat = memoryDB.categories.find(c => c.id === p.category_id);
    return [[{ ...p, category: cat ? cat.name : null, category_slug: cat ? cat.slug : null }]];
  }

  // 4. Admin Products Query
  if (s.startsWith('SELECT p.*, c.name AS category FROM products p LEFT JOIN categories c ON p.category_id = c.id')) {
    let prods = memoryDB.products.map(p => {
      const cat = memoryDB.categories.find(c => c.id === p.category_id);
      return { ...p, category: cat ? cat.name : null };
    });

    if (s.includes('WHERE p.title LIKE ? OR p.author LIKE ? OR p.isbn LIKE ?')) {
      const term = String(params[0] || '').replace(/%/g, '').toLowerCase();
      prods = prods.filter(p =>
        (p.title && p.title.toLowerCase().includes(term)) ||
        (p.author && p.author.toLowerCase().includes(term)) ||
        (p.isbn && p.isbn.toLowerCase().includes(term))
      );
    }
    prods.sort((a, b) => b.id - a.id);
    return [prods];
  }

  // 5. Auth / Users Queries
  if (s.startsWith('INSERT INTO users (name, email, password) VALUES (?, ?, ?)')) {
    const [name, email, password] = params;
    if (memoryDB.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      const err = new Error('ER_DUP_ENTRY');
      err.code = 'ER_DUP_ENTRY';
      throw err;
    }
    const newUser = {
      id: nextId.users++,
      name,
      email,
      password,
      role: 'customer',
      is_active: 1,
      address: null,
      city: null,
      state: null,
      zip: null,
      country: null,
      created_at: new Date().toISOString()
    };
    memoryDB.users.push(newUser);
    return [{ insertId: newUser.id, affectedRows: 1 }];
  }

  if (s.startsWith('SELECT * FROM users WHERE email = ?')) {
    const email = String(params[0]).toLowerCase();
    const rows = memoryDB.users.filter(u => u.email.toLowerCase() === email);
    return [rows];
  }

  if (s.startsWith('UPDATE users SET is_active = TRUE WHERE id = ?')) {
    const id = Number(params[0]);
    const u = memoryDB.users.find(x => x.id === id);
    if (u) u.is_active = 1;
    return [{ affectedRows: u ? 1 : 0 }];
  }

  if (s.startsWith('UPDATE users SET is_active = FALSE WHERE id = ?')) {
    const id = Number(params[0]);
    const u = memoryDB.users.find(x => x.id === id);
    if (u) u.is_active = 0;
    return [{ affectedRows: u ? 1 : 0 }];
  }

  if (s.startsWith('SELECT id, name, email, role FROM users WHERE id = ?')) {
    const id = Number(params[0]);
    const u = memoryDB.users.find(x => x.id === id);
    if (!u) return [[]];
    return [[{ id: u.id, name: u.name, email: u.email, role: u.role }]];
  }

  if (s.startsWith('SELECT id, name, email, role, address, city, state, zip, country FROM users WHERE id = ?')) {
    const id = Number(params[0]);
    const u = memoryDB.users.find(x => x.id === id);
    if (!u) return [[]];
    return [[{
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      address: u.address,
      city: u.city,
      state: u.state,
      zip: u.zip,
      country: u.country
    }]];
  }

  if (s.startsWith('SELECT password FROM users WHERE id = ?')) {
    const id = Number(params[0]);
    const u = memoryDB.users.find(x => x.id === id);
    if (!u) return [[]];
    return [[{ password: u.password }]];
  }

  if (s.startsWith('UPDATE users SET name=?, email=?, address=?, city=?, state=?, zip=?, country=?, password=? WHERE id=?')) {
    const [name, email, address, city, state, zip, country, password, id] = params;
    const numId = Number(id);
    if (memoryDB.users.some(u => u.id !== numId && u.email.toLowerCase() === String(email).toLowerCase())) {
      const err = new Error('ER_DUP_ENTRY');
      err.code = 'ER_DUP_ENTRY';
      throw err;
    }
    const u = memoryDB.users.find(x => x.id === numId);
    if (u) {
      u.name = name;
      u.email = email;
      u.address = address;
      u.city = city;
      u.state = state;
      u.zip = zip;
      u.country = country;
      u.password = password;
    }
    return [{ affectedRows: u ? 1 : 0 }];
  }

  if (s.startsWith('UPDATE users SET name=?, email=?, address=?, city=?, state=?, zip=?, country=? WHERE id=?')) {
    const [name, email, address, city, state, zip, country, id] = params;
    const numId = Number(id);
    if (memoryDB.users.some(u => u.id !== numId && u.email.toLowerCase() === String(email).toLowerCase())) {
      const err = new Error('ER_DUP_ENTRY');
      err.code = 'ER_DUP_ENTRY';
      throw err;
    }
    const u = memoryDB.users.find(x => x.id === numId);
    if (u) {
      u.name = name;
      u.email = email;
      u.address = address;
      u.city = city;
      u.state = state;
      u.zip = zip;
      u.country = country;
    }
    return [{ affectedRows: u ? 1 : 0 }];
  }

  if (s.startsWith('SELECT id, name, email, role, created_at FROM users')) {
    let rows = memoryDB.users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, created_at: u.created_at }));
    if (s.includes('WHERE name LIKE ? OR email LIKE ?')) {
      const term = String(params[0] || '').replace(/%/g, '').toLowerCase();
      rows = rows.filter(u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
    }
    rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return [rows];
  }

  // 6. Cart Queries
  if (s.includes('FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?')) {
    const userId = Number(params[0]);
    const items = memoryDB.cart_items
      .filter(c => c.user_id === userId)
      .map(c => {
        const prod = memoryDB.products.find(p => p.id === c.product_id);
        return {
          id: c.id,
          product_id: c.product_id,
          quantity: c.quantity,
          title: prod ? prod.title : 'Book',
          author: prod ? prod.author : 'Author',
          price: prod ? prod.price : 0,
          image_url: prod ? prod.image_url : ''
        };
      });
    return [items];
  }

  if (s.startsWith('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?')) {
    const [userId, prodId] = params.map(Number);
    const existing = memoryDB.cart_items.filter(c => c.user_id === userId && c.product_id === prodId);
    return [existing];
  }

  if (s.startsWith('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?')) {
    const qty = Number(params[0]);
    const id = Number(params[1]);
    const item = memoryDB.cart_items.find(c => c.id === id);
    if (item) item.quantity += qty;
    return [{ affectedRows: item ? 1 : 0 }];
  }

  if (s.startsWith('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)')) {
    const [user_id, product_id, quantity] = params.map(Number);
    const newItem = { id: nextId.cart_items++, user_id, product_id, quantity };
    memoryDB.cart_items.push(newItem);
    return [{ insertId: newItem.id, affectedRows: 1 }];
  }

  if (s.startsWith('UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?')) {
    const [quantity, id, userId] = params.map(Number);
    const item = memoryDB.cart_items.find(c => c.id === id && c.user_id === userId);
    if (item) item.quantity = quantity;
    return [{ affectedRows: item ? 1 : 0 }];
  }

  if (s.startsWith('DELETE FROM cart_items WHERE id = ? AND user_id = ?')) {
    const [id, userId] = params.map(Number);
    const initialLen = memoryDB.cart_items.length;
    memoryDB.cart_items = memoryDB.cart_items.filter(c => !(c.id === id && c.user_id === userId));
    return [{ affectedRows: initialLen - memoryDB.cart_items.length }];
  }

  if (s.startsWith('DELETE FROM cart_items WHERE user_id = ?')) {
    const userId = Number(params[0]);
    const initialLen = memoryDB.cart_items.length;
    memoryDB.cart_items = memoryDB.cart_items.filter(c => c.user_id !== userId);
    return [{ affectedRows: initialLen - memoryDB.cart_items.length }];
  }

  // 7. Orders & Checkout Queries
  if (s.startsWith('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC')) {
    const userId = Number(params[0]);
    const userOrders = memoryDB.orders
      .filter(o => o.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return [userOrders];
  }

  if (s.startsWith('INSERT INTO orders')) {
    // Both standard order and paypal order
    let newOrder;
    if (s.includes('paypal_order_id')) {
      const [user_id, subtotal, tax, total, shipping_name, shipping_email, shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country, paypal_order_id] = params;
      newOrder = {
        id: nextId.orders++,
        user_id: Number(user_id),
        subtotal: Number(subtotal),
        tax: Number(tax),
        total: Number(total),
        status: 'paid',
        shipping_name,
        shipping_email,
        shipping_address,
        shipping_city,
        shipping_state,
        shipping_zip,
        shipping_country,
        paypal_order_id,
        created_at: new Date().toISOString()
      };
    } else {
      const [user_id, subtotal, tax, total, status, shipping_name, shipping_email, shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country] = params;
      newOrder = {
        id: nextId.orders++,
        user_id: Number(user_id),
        subtotal: Number(subtotal),
        tax: Number(tax),
        total: Number(total),
        status,
        shipping_name,
        shipping_email,
        shipping_address,
        shipping_city,
        shipping_state,
        shipping_zip,
        shipping_country,
        paypal_order_id: null,
        created_at: new Date().toISOString()
      };
    }
    memoryDB.orders.unshift(newOrder);
    return [{ insertId: newOrder.id, affectedRows: 1 }];
  }

  if (s.startsWith('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)')) {
    const [order_id, product_id, quantity, price] = params;
    const newItem = {
      id: nextId.order_items++,
      order_id: Number(order_id),
      product_id: Number(product_id),
      quantity: Number(quantity),
      price: Number(price)
    };
    memoryDB.order_items.push(newItem);
    return [{ insertId: newItem.id, affectedRows: 1 }];
  }

  if (s.startsWith('UPDATE products SET stock = stock - ? WHERE id = ?')) {
    const [qty, id] = params.map(Number);
    const prod = memoryDB.products.find(p => p.id === id);
    if (prod) prod.stock = Math.max(0, prod.stock - qty);
    return [{ affectedRows: prod ? 1 : 0 }];
  }

  // 8. Admin Dashboard Queries
  if (s.includes('SELECT COUNT(*) AS totalOrders FROM orders')) {
    return [[{ totalOrders: memoryDB.orders.length }]];
  }

  if (s.includes("SELECT COALESCE(SUM(total),0) AS totalRevenue FROM orders WHERE status='paid'")) {
    const totalRevenue = memoryDB.orders
      .filter(o => o.status === 'paid')
      .reduce((sum, o) => sum + Number(o.total || 0), 0);
    return [[{ totalRevenue }]];
  }

  if (s.includes('SELECT COUNT(*) AS totalUsers FROM users')) {
    return [[{ totalUsers: memoryDB.users.length }]];
  }

  if (s.includes('SELECT COUNT(*) AS totalProducts FROM products')) {
    return [[{ totalProducts: memoryDB.products.length }]];
  }

  if (s.includes('SELECT o.*, u.name AS user_name, u.email AS user_email FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT 10')) {
    const recent = memoryDB.orders.slice(0, 10).map(o => {
      const u = memoryDB.users.find(x => x.id === o.user_id);
      return {
        ...o,
        user_name: u ? u.name : o.shipping_name,
        user_email: u ? u.email : o.shipping_email
      };
    });
    return [recent];
  }

  if (s.includes('SELECT p.title, p.author, SUM(oi.quantity) AS units_sold, SUM(oi.price * oi.quantity) AS revenue FROM order_items oi JOIN products p ON oi.product_id = p.id GROUP BY p.id ORDER BY units_sold DESC LIMIT 5')) {
    const salesMap = {};
    for (const oi of memoryDB.order_items) {
      if (!salesMap[oi.product_id]) {
        salesMap[oi.product_id] = { units_sold: 0, revenue: 0 };
      }
      salesMap[oi.product_id].units_sold += Number(oi.quantity);
      salesMap[oi.product_id].revenue += Number(oi.price) * Number(oi.quantity);
    }
    const top = Object.keys(salesMap).map(pid => {
      const prod = memoryDB.products.find(p => p.id === Number(pid));
      return {
        title: prod ? prod.title : 'Book',
        author: prod ? prod.author : 'Author',
        units_sold: salesMap[pid].units_sold,
        revenue: salesMap[pid].revenue
      };
    }).sort((a, b) => b.units_sold - a.units_sold).slice(0, 5);
    return [top];
  }

  // 9. Admin Product CRUD
  if (s.startsWith('INSERT INTO products (title, author, description, price, stock, image_url, isbn, rating, category_id) VALUES (?,?,?,?,?,?,?,?,?)')) {
    const [title, author, description, price, stock, image_url, isbn, rating, category_id] = params;
    const newProd = {
      id: nextId.products++,
      title,
      author,
      description,
      price: Number(price),
      stock: Number(stock) || 0,
      image_url,
      isbn,
      rating: Number(rating) || 4.0,
      category_id: category_id ? Number(category_id) : null
    };
    memoryDB.products.push(newProd);
    return [{ insertId: newProd.id, affectedRows: 1 }];
  }

  if (s.startsWith('UPDATE products SET title=?, author=?, description=?, price=?, stock=?, image_url=?, isbn=?, rating=?, category_id=? WHERE id=?')) {
    const [title, author, description, price, stock, image_url, isbn, rating, category_id, id] = params;
    const prod = memoryDB.products.find(p => p.id === Number(id));
    if (prod) {
      prod.title = title;
      prod.author = author;
      prod.description = description;
      prod.price = Number(price);
      prod.stock = Number(stock);
      prod.image_url = image_url;
      prod.isbn = isbn;
      prod.rating = Number(rating);
      prod.category_id = category_id ? Number(category_id) : null;
    }
    return [{ affectedRows: prod ? 1 : 0 }];
  }

  if (s.startsWith('DELETE FROM products WHERE id = ?')) {
    const id = Number(params[0]);
    const initLen = memoryDB.products.length;
    memoryDB.products = memoryDB.products.filter(p => p.id !== id);
    return [{ affectedRows: initLen - memoryDB.products.length }];
  }

  if (s.includes('DELETE FROM products WHERE id IN (?)') || s.includes('DELETE FROM products WHERE id IN')) {
    const ids = Array.isArray(params[0]) ? params[0].map(Number) : [Number(params[0])];
    const initLen = memoryDB.products.length;
    memoryDB.products = memoryDB.products.filter(p => !ids.includes(p.id));
    return [{ affectedRows: initLen - memoryDB.products.length }];
  }

  // 10. Admin Orders
  if (s.startsWith('SELECT o.*, u.name AS user_name, u.email AS user_email FROM orders o LEFT JOIN users u ON o.user_id = u.id')) {
    let ordersList = memoryDB.orders.map(o => {
      const u = memoryDB.users.find(x => x.id === o.user_id);
      return {
        ...o,
        user_name: u ? u.name : o.shipping_name,
        user_email: u ? u.email : o.shipping_email
      };
    });

    if (s.includes('WHERE o.id LIKE ?')) {
      const term = String(params[0] || '').replace(/%/g, '').toLowerCase();
      ordersList = ordersList.filter(o =>
        String(o.id).includes(term) ||
        (o.user_name && o.user_name.toLowerCase().includes(term)) ||
        (o.user_email && o.user_email.toLowerCase().includes(term)) ||
        (o.shipping_name && o.shipping_name.toLowerCase().includes(term)) ||
        (o.shipping_email && o.shipping_email.toLowerCase().includes(term))
      );
    }

    ordersList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return [ordersList];
  }

  if (s.startsWith('UPDATE orders SET status = ? WHERE id = ?')) {
    const [status, id] = params;
    const o = memoryDB.orders.find(x => x.id === Number(id));
    if (o) o.status = status;
    return [{ affectedRows: o ? 1 : 0 }];
  }

  if (s.includes('SHOW TABLES')) {
    return [[{ 'Tables_in_bookmart': 'users' }, { 'Tables_in_bookmart': 'categories' }, { 'Tables_in_bookmart': 'products' }, { 'Tables_in_bookmart': 'cart_items' }, { 'Tables_in_bookmart': 'orders' }, { 'Tables_in_bookmart': 'order_items' }]];
  }

  console.warn('[DB] Fallback in-memory query handler for:', s);
  return [[]];
}

// ── Export Interface Matching mysql2/promise ─────────────────
module.exports = {
  query: async function (sql, params = []) {
    if (realPool) {
      try {
        return await realPool.query(sql, params);
      } catch (err) {
        console.warn('[DB] MySQL query failed, falling back to in-memory store:', err.message);
      }
    }
    return executeInMemoryQuery(sql, params);
  },
  execute: async function (sql, params = []) {
    return this.query(sql, params);
  }
};
