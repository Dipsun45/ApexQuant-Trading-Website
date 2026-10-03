const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Portfolio = require('../models/Portfolio');
const Notification = require('../models/Notification');
const Watchlist = require('../models/Watchlist');

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'apexquant_super_secure_jwt_secret',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, country, dob } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      country: country || 'United States',
      dob: dob ? new Date(dob) : undefined,
      balance: 100000, // $100,000 initial virtual cash
    });

    // Create initial empty portfolio for user
    await Portfolio.create({
      user: user._id,
      totalInvested: 0,
      currentValue: 0,
      totalProfitLoss: 0,
      totalProfitLossPercentage: 0,
    });

    // Create initial watchlist
    await Watchlist.create({
      user: user._id,
      stocks: [],
    });

    // Send welcome notification
    await Notification.create({
      user: user._id,
      title: 'Welcome to ApexQuant!',
      message: 'Your account has been created with $100,000 in virtual funds. Start trading now!',
      type: 'SUCCESS',
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        role: user.role,
        balance: user.balance,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (user.status === 'DISABLED') {
      return res.status(403).json({
        success: false,
        message: 'Account disabled. Please contact system administrator.',
      });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        role: user.role,
        balance: user.balance,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
};

// @desc    Admin login
// @route   POST /api/auth/admin-login
// @access  Public
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Try finding in Admin collection
    let adminObj = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
    let role = 'ADMIN';

    if (!adminObj) {
      // Fallback check in User collection with ADMIN role
      const userAdmin = await User.findOne({ email: email.toLowerCase(), role: 'ADMIN' }).select('+password');
      if (userAdmin) {
        adminObj = userAdmin;
      }
    }

    if (!adminObj || !(await adminObj.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials',
      });
    }

    adminObj.lastLogin = Date.now();
    await adminObj.save();

    const token = generateToken(adminObj._id, 'ADMIN');

    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      data: {
        _id: adminObj._id,
        name: adminObj.name,
        email: adminObj.email,
        role: 'ADMIN',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Admin login failed',
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      user = await Admin.findById(req.user._id);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        country: user.country || 'United States',
        role: user.role || 'ADMIN',
        balance: user.balance !== undefined ? user.balance : 1000000,
        status: user.status || 'ACTIVE',
        avatar: user.avatar || '',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, phone, country, avatar, currentPassword, newPassword } = req.body;

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (country) user.country = country;
    if (avatar !== undefined) user.avatar = avatar;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to set new password',
        });
      }
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password does not match',
        });
      }
      user.password = newPassword;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        role: user.role,
        balance: user.balance,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  adminLogin,
  getMe,
  updateProfile,
};
