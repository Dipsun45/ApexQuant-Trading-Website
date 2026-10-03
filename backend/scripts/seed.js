const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Admin = require('../models/Admin');
const Stock = require('../models/Stock');

const initialStocks = [
  { name: 'Apple Inc.', symbol: 'AAPL', sector: 'Technology', currentPrice: 224.50, openPrice: 222.10, description: 'Pioneer in consumer electronics, software, and online services.' },
  { name: 'Microsoft Corp.', symbol: 'MSFT', sector: 'Software', currentPrice: 448.20, openPrice: 445.00, description: 'Global leader in software, cloud computing, and AI systems.' },
  { name: 'Amazon.com Inc.', symbol: 'AMZN', sector: 'Consumer Cyclical', currentPrice: 186.40, openPrice: 184.50, description: 'E-commerce and cloud services infrastructure titan.' },
  { name: 'Alphabet Inc.', symbol: 'GOOGL', sector: 'Communication', currentPrice: 178.90, openPrice: 176.80, description: 'Search engine, cloud computing, and advertising technology giant.' },
  { name: 'Meta Platforms Inc.', symbol: 'META', sector: 'Communication', currentPrice: 512.30, openPrice: 508.00, description: 'Social metaverse and digital interaction ecosystem.' },
  { name: 'NVIDIA Corp.', symbol: 'NVDA', sector: 'Semiconductors', currentPrice: 128.80, openPrice: 125.40, description: 'Accelerated computing and AI hardware leader.' },
  { name: 'Tesla Inc.', symbol: 'TSLA', sector: 'Automotive', currentPrice: 246.10, openPrice: 240.00, description: 'Electric vehicles, energy storage, and autonomous technology.' },
  { name: 'Netflix Inc.', symbol: 'NFLX', sector: 'Entertainment', currentPrice: 684.50, openPrice: 678.00, description: 'Global subscription streaming and media production.' },
  { name: 'Adobe Inc.', symbol: 'ADBE', sector: 'Software', currentPrice: 562.10, openPrice: 558.00, description: 'Creative software and digital experience solutions.' },
  { name: 'Intel Corp.', symbol: 'INTC', sector: 'Semiconductors', currentPrice: 21.40, openPrice: 21.10, description: 'Semiconductor design and manufacturing firm.' },
  { name: 'Advanced Micro Devices', symbol: 'AMD', sector: 'Semiconductors', currentPrice: 154.20, openPrice: 151.00, description: 'High-performance computing and graphics processor developer.' },
  { name: 'Oracle Corp.', symbol: 'ORCL', sector: 'Software', currentPrice: 138.90, openPrice: 136.50, description: 'Enterprise database software and cloud infrastructure.' },
  { name: 'International Business Machines', symbol: 'IBM', sector: 'IT Services', currentPrice: 198.60, openPrice: 196.00, description: 'Hybrid cloud solutions and enterprise AI computing.' },
  { name: 'Cisco Systems Inc.', symbol: 'CSCO', sector: 'Networking', currentPrice: 50.30, openPrice: 49.80, description: 'Digital communications and networking hardware.' },
  { name: 'JPMorgan Chase & Co.', symbol: 'JPM', sector: 'Financial Services', currentPrice: 214.80, openPrice: 212.00, description: 'Global financial services institution and investment bank.' },
  { name: 'Visa Inc.', symbol: 'V', sector: 'Financial Services', currentPrice: 278.40, openPrice: 276.00, description: 'Global digital payment network operator.' },
  { name: 'Mastercard Inc.', symbol: 'MA', sector: 'Financial Services', currentPrice: 462.10, openPrice: 458.00, description: 'Worldwide payment processing network.' },
  { name: 'The Coca-Cola Co.', symbol: 'KO', sector: 'Consumer Defensive', currentPrice: 68.70, openPrice: 68.00, description: 'Global beverage manufacturer and brand holder.' },
  { name: 'PepsiCo Inc.', symbol: 'PEP', sector: 'Consumer Defensive', currentPrice: 174.20, openPrice: 173.00, description: 'Convenient foods and beverage producer.' },
  { name: 'McDonald\'s Corp.', symbol: 'MCD', sector: 'Consumer Cyclical', currentPrice: 294.50, openPrice: 292.00, description: 'Global quick service restaurant chain operator.' },
  { name: 'Nike Inc.', symbol: 'NKE', sector: 'Consumer Cyclical', currentPrice: 82.10, openPrice: 81.00, description: 'Athletic footwear, apparel, and equipment brand.' },
  { name: 'Walmart Inc.', symbol: 'WMT', sector: 'Consumer Defensive', currentPrice: 78.30, openPrice: 77.50, description: 'Omnichannel retail corporation and grocery operator.' },
  { name: 'The Walt Disney Co.', symbol: 'DIS', sector: 'Entertainment', currentPrice: 94.60, openPrice: 93.80, description: 'Mass media, parks, resorts, and entertainment conglomerate.' },
  { name: 'Uber Technologies Inc.', symbol: 'UBER', sector: 'Technology', currentPrice: 74.80, openPrice: 73.50, description: 'Mobility, delivery, and freight technology network.' },
  { name: 'Airbnb Inc.', symbol: 'ABNB', sector: 'Hospitality', currentPrice: 118.20, openPrice: 116.00, description: 'Online marketplace for lodging and vacation rentals.' },
  { name: 'PayPal Holdings Inc.', symbol: 'PYPL', sector: 'Financial Services', currentPrice: 69.40, openPrice: 68.50, description: 'Online payment system supporting digital commerce.' },
  { name: 'Salesforce Inc.', symbol: 'CRM', sector: 'Software', currentPrice: 258.90, openPrice: 255.00, description: 'Customer relationship management (CRM) software suite.' },
  { name: 'Qualcomm Inc.', symbol: 'QCOM', sector: 'Semiconductors', currentPrice: 168.30, openPrice: 165.00, description: 'Wireless technology and mobile chip designer.' },
  { name: 'Shopify Inc.', symbol: 'SHOP', sector: 'Software', currentPrice: 76.50, openPrice: 75.00, description: 'E-commerce platform for online stores and retail systems.' },
  { name: 'Berkshire Hathaway Inc.', symbol: 'BRK.B', sector: 'Financial Services', currentPrice: 448.60, openPrice: 445.00, description: 'Multinational conglomerate holding company.' }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ApexQuant';
    await mongoose.connect(mongoUri);
    console.log('ApexQuant Database Connected for Seeding');

    const adminEmail = 'admin@gmail.com';
    const adminPass = 'admin';

    // Delete existing admin to re-seed clean single-hashed password
    await Admin.deleteMany({ email: adminEmail });
    await User.deleteMany({ email: adminEmail });

    await Admin.create({
      name: 'ApexQuant Master Admin',
      email: adminEmail,
      password: adminPass,
      role: 'ADMIN',
    });
    console.log('✔ Admin account created in Admin collection');

    await User.create({
      name: 'ApexQuant Admin User',
      email: adminEmail,
      password: adminPass,
      role: 'ADMIN',
      balance: 1000000,
    });
    console.log('✔ Admin user created in User collection');

    // 2. Seed 30 Stocks
    let insertedCount = 0;
    for (const item of initialStocks) {
      const existing = await Stock.findOne({ symbol: item.symbol });
      if (!existing) {
        const price = item.currentPrice;
        const open = item.openPrice;
        const dailyChange = Math.round((price - open) * 100) / 100;
        const dailyChangePercent = Math.round(((price - open) / open) * 10000) / 100;

        // Generate synthetic initial 10-point price history graph
        const history = [];
        let runningPrice = open;
        for (let i = 9; i >= 0; i--) {
          const varPct = (Math.random() * 2 - 0.98) / 100;
          runningPrice = Math.round(runningPrice * (1 + varPct) * 100) / 100;
          history.push({
            price: i === 0 ? price : runningPrice,
            timestamp: new Date(Date.now() - i * 3600000),
          });
        }

        await Stock.create({
          name: item.name,
          symbol: item.symbol,
          sector: item.sector,
          currentPrice: price,
          previousPrice: open,
          openPrice: open,
          highPrice: Math.max(price, open * 1.02),
          lowPrice: Math.min(price, open * 0.98),
          dailyChange,
          dailyChangePercent,
          marketStatus: 'OPEN',
          description: item.description,
          logo: `https://asset.brandfetch.io/${item.symbol.toLowerCase()}.com/logo`,
          priceHistory: history,
        });
        insertedCount++;
      }
    }

    console.log(`✔ 30 stocks verified (${insertedCount} new stocks inserted)`);
    console.log('Database seed completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
