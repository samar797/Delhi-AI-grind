# Solar Intelligence Platform

## AI-Powered Smart Solar Maintenance, Monitoring & Solar Waste Recycling Platform

A futuristic full-stack application combining real-time IoT monitoring, AI efficiency analysis, predictive maintenance, and solar waste recycling management.

---

## 🌟 Features

### Core Modules
- **Smart Solar Monitoring** - Real-time IoT data with live charts and animations
- **AI Efficiency Analysis** - Predictive maintenance and health scoring
- **Solar Waste Recycling** - Connect users with certified recyclers
- **Rewards System** - QR scanning, coupons, and redemption
- **Sustainability Hub** - Carbon tracking and environmental impact
- **Interactive Maps** - Recycler finder and machine locations
- **Real-Time Alerts** - WebSocket-powered notifications

### Authentication
- Premium Login & Signup pages
- JWT-based security
- Role-based access control (User, Recycler, Manufacturer, Admin)
- Demo credentials included

---

## 🏗️ Project Structure

```
/workspace
├── client/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/          # API clients, utilities, socket service
│   │   └── styles/       # Global CSS with Tailwind
│   ├── package.json
│   ├── tailwind.config.js
│   └── next.config.js
│
├── server/                # Node.js/Express Backend
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth & validation
│   ├── services/         # Business logic, IoT simulation
│   ├── sockets/          # Socket.IO handlers
│   └── index.js          # Server entry point
│
└── package.json          # Root workspace config
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (optional - runs in demo mode without it)
- npm or yarn

### Installation

```bash
# Install all dependencies (root, client, server)
npm run install:all

# Or install manually:
npm install                    # Root
cd client && npm install      # Frontend
cd ../server && npm install   # Backend
```

### Running the Application

**Option 1: Run both together (recommended)**
```bash
npm run dev
```

**Option 2: Run separately**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

---

## 🔐 Demo Credentials

### User Accounts
| Email | Password | Role |
|-------|----------|------|
| demo@solar.com | demo123 | User |
| admin@solar.com | admin123 | Admin |

*Note: Create new accounts via the signup page for persistent testing*

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/logout` - Logout

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/energy` - Energy production data
- `GET /api/dashboard/carbon` - Carbon reduction metrics

### Solar Monitoring
- `GET /api/solar/panels` - List all panels
- `GET /api/solar/panels/:id` - Get panel details
- `GET /api/solar/panels/:id/metrics` - Live metrics

### IoT Data
- `GET /api/iot/data` - Historical data
- `GET /api/iot/realtime/:panelId` - Real-time readings

### AI Analysis
- `GET /api/ai/analyze/:panelId` - Efficiency analysis
- `GET /api/ai/predictions/:panelId` - Performance predictions
- `GET /api/ai/maintenance/:panelId` - Maintenance recommendations
- `GET /api/ai/health/:panelId` - Health score

### Alerts
- `GET /api/alerts` - Get all alerts
- `PUT /api/alerts/:id/read` - Mark as read
- `PUT /api/alerts/read-all` - Mark all as read

### Recycling
- `GET /api/recycling/recyclers` - Find recyclers
- `POST /api/recycling/request` - Create pickup request
- `GET /api/recycling/requests` - User requests
- `GET /api/recycling/requests/:id/track` - Track request

### Rewards
- `GET /api/rewards/balance` - Points balance
- `GET /api/rewards/transactions` - Transaction history
- `POST /api/rewards/redeem` - Redeem coupon
- `POST /api/rewards/scan` - Scan QR code
- `GET /api/rewards/coupons` - Available coupons

---

## 🎨 Design System

### Color Palette
- **Solar Dark**: `#0a1f1a` - Primary background
- **Solar Green**: `#00ff88` - Primary accent, neon effects
- **Solar Blue**: `#00d4ff` - Secondary accent
- **Glass BG**: `rgba(255,255,255,0.05)` - Glassmorphism

### UI Components
- Glassmorphism cards with blur effects
- Neon gradient buttons with hover animations
- Smooth Framer Motion transitions
- Responsive mobile-first layout

---

## 🔧 Configuration

### Environment Variables (server/.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/solar-intelligence
CLIENT_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
```

---

## 📱 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Maps**: Leaflet + React-Leaflet
- **Icons**: Lucide React
- **State**: React Hooks
- **HTTP**: Axios
- **Real-time**: Socket.IO Client

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcryptjs
- **Real-time**: Socket.IO
- **Validation**: express-validator
- **Security**: Helmet, CORS

---

## 🌐 Real-Time Features

The platform uses Socket.IO for:
- Live IoT sensor data streaming
- Instant alert notifications
- Dashboard auto-refresh
- Recycling status updates
- Panel metric updates

---

## 📊 Database Models

- **User** - Authentication & profiles
- **SolarPanel** - Panel specifications & metrics
- **Alert** - System notifications
- **Recycler** - Recycling partner info
- **RecyclingRequest** - Pickup tracking
- **IoTData** - Historical sensor readings

---

## 🎯 Key Features Detail

### IoT Simulation
The backend includes a realistic IoT simulator that:
- Generates time-based solar production curves
- Simulates weather impact
- Creates random maintenance issues
- Emits real-time WebSocket updates
- Triggers AI-powered alerts

### AI Analysis Engine
Rule-based AI that detects:
- Dust accumulation
- Overheating conditions
- Efficiency drops
- Voltage fluctuations
- Performance anomalies

### Recycling Management
End-to-end workflow:
1. User submits pickup request
2. System matches with nearby recyclers
3. Real-time status tracking
4. Rewards points on completion
5. Environmental impact calculation

---

## 🤝 Contributing

This is a demonstration project showcasing modern full-stack development practices for renewable energy platforms.

---

## 📄 License

MIT License - Feel free to use for learning and commercial projects.

---

## 🙏 Acknowledgments

Built with passion for sustainable technology and clean energy innovation.

**Solar Intelligence** - Powering the future with AI ☀️🤖
