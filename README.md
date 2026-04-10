# FinFlow - Elite Expense Tracker

A high-end, responsive MERN stack expense tracker with stunning micro-interactions, glassmorphism UI, and powerful features.

![FinFlow Banner](https://via.placeholder.com/1200x400/667eea/ffffff?text=FinFlow+-+Smart+Expense+Tracker)

## Features

### Core Features
- **Transaction Tracking**: Log expenses and income with categories, notes, and payment modes
- **SMS Parser**: Paste bank SMS and automatically extract transaction data using regex
- **Group Splits**: Create groups for roommates, trips, or couples and split bills
- **Settlement Algorithm**: Calculate minimum UPI transfers needed to settle up
- **Budget Tracking**: Set monthly limits with visual progress indicators

### UI/UX Highlights
- **Glassmorphism Header**: Frosted-glass navigation with blur effects
- **Lottie Animations**: Engaging hero animations and micro-interactions
- **Framer Motion**: Smooth page transitions and component animations
- **Recharts**: Beautiful animated charts for spending visualization
- **CountUp Animations**: Slot machine-style number animations for balances
- **3D Carousel**: Swipe through recent transactions

### Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Recharts for data visualization
- Lucide React for icons
- Lottie React for animations
- React CountUp for number animations

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Google OAuth support

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/finflow.git
cd finflow
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Install frontend dependencies
```bash
cd ../client
npm install
```

4. Configure environment variables
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

5. Start the development servers
```bash
# In server directory
npm run dev

# In client directory (new terminal)
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Get current user

### Transactions
- `GET /api/transactions` - List all transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/stats` - Get spending statistics
- `DELETE /api/transactions/:id` - Delete transaction

### Groups
- `GET /api/groups` - List user's groups
- `POST /api/groups` - Create new group
- `GET /api/groups/:id` - Get group details
- `GET /api/groups/:id/balances` - Calculate balances and settlements

## Project Structure

```
finflow/
├── server/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── middleware/      # Auth middleware
│   └── index.js         # Server entry
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # Reusable UI components
│   │   │   ├── layout/      # Header, Footer, Layout
│   │   │   ├── dashboard/   # Dashboard widgets
│   │   │   ├── transactions/# Transaction forms
│   │   │   ├── groups/      # Group components
│   │   │   └── sms/        # SMS parser
│   │   ├── pages/           # Route pages
│   │   ├── context/        # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   └── assets/         # Lottie animations
│   └── public/
└── README.md
```

## Usage

### Adding a Transaction
1. Click the floating "+" button or use the quick action
2. Choose between Manual, SMS, or Split entry
3. Fill in details and save

### SMS Parsing
Paste any bank SMS like:
```
UPI-Debited Rs.500.00 to MERCHANT at 01/01/24. Avl Bal: Rs.10,000.00
```
The parser will automatically extract amount, merchant, and transaction type.

### Splitting Bills
1. Go to Groups and create a new group
2. Add members and create expense splits
3. View balances and settlements in group details

## Screenshots

| Dashboard | Transactions | Groups |
|-----------|-------------|--------|
| ![Dashboard](https://via.placeholder.com/300x200/1e293b/667eea?text=Dashboard) | ![Transactions](https://via.placeholder.com/300x200/1e293b/667eea?text=Transactions) | ![Groups](https://via.placeholder.com/300x200/1e293b/667eea?text=Groups) |

## License

MIT License - feel free to use this for your portfolio or projects!

## Author

Built with ❤️ for demonstrating MCA-level skills
