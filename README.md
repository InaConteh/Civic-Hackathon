# Clean-Up League 🏆

A gamified civic leaderboard platform that transforms neighborhood cleanup into a competitive, rewarding experience. Built for civic hackathons to encourage community engagement and environmental stewardship.

![Clean-Up League](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)
- [Admin Panel](#admin-panel)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

**Clean-Up League** is a community-powered platform that gamifies neighborhood cleanup activities. Zones (neighborhoods) compete against each other by reporting cleanup activities, earning points, and climbing the leaderboard to win rewards like solar lights, trash bins, and community recognition.

### Key Objectives

- **Encourage Civic Participation**: Make cleanup activities fun and competitive
- **Track Impact**: Measure cleanup efforts with data-driven metrics
- **Reward Communities**: Recognize and reward top-performing zones
- **Build Community**: Foster neighborhood pride and collaboration

## ✨ Features

### 🏘️ Zone Management

- **Zone Registration**: Neighborhoods can register as competing zones
- **Zone Profiles**: View detailed information about each zone
- **Zone Leaderboards**: Track performance across different time periods

### 📊 Cleanup Reporting

- **Photo Documentation**: Upload before/after photos of cleanup activities
- **Metrics Tracking**: Record trash bags collected, weight, and area cleaned
- **Automatic Scoring**: AI-powered scoring based on impact and consistency
- **Report History**: View all submitted cleanup reports

### 🏆 Leaderboards

- **Multiple Time Periods**: Weekly, monthly, and all-time rankings
- **Real-time Updates**: Live leaderboard updates as reports are submitted
- **Top Performers**: Highlight leading zones with medals and badges

### 🎁 Rewards System

- **Point-based Rewards**: Earn points for cleanup activities
- **Tiered Rewards**: Bronze, Silver, Gold, and Platinum tiers
- **Physical Prizes**: Solar lights, trash bins, cleaning supplies, and more
- **Reward Tracking**: Monitor available and claimed rewards

### 👨‍💼 Admin Dashboard

- **Report Verification**: Review and approve cleanup reports
- **Zone Management**: Manage registered zones
- **Analytics**: View comprehensive statistics and trends
- **Reward Distribution**: Track and manage reward distribution

### 🔔 Notifications

- **Activity Updates**: Get notified about new reports and achievements
- **Leaderboard Changes**: Track position changes in rankings
- **Reward Alerts**: Notifications when rewards are unlocked

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.1](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [Tailwind Animate](https://github.com/jamiebuilds/tailwindcss-animate)

### Development Tools

- **Package Manager**: [pnpm](https://pnpm.io/)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)
- **Linting**: ESLint

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher ([Download](https://nodejs.org/))
- **pnpm**: Version 8.x or higher
  ```bash
  npm install -g pnpm
  ```

## 🚀 Installation

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd "Civic Hackathon"
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all required dependencies listed in `package.json`.

### 3. Verify Installation

Check that all dependencies are installed correctly:

```bash
pnpm list
```

## 🏃 Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
pnpm dev
```

The application will be available at:

- **Local**: http://localhost:3000
- **Network**: http://[your-ip]:3000

### Production Build

To create an optimized production build:

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

### Linting

Run ESLint to check code quality:

```bash
pnpm lint
```

## 📁 Project Structure

```
Civic Hackathon/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin dashboard pages
│   │   └── page.tsx             # Admin overview
│   ├── leaderboard/             # Leaderboard pages
│   │   └── page.tsx             # Leaderboard view
│   ├── report/                  # Cleanup reporting
│   │   └── page.tsx             # Report submission form
│   ├── rewards/                 # Rewards catalog
│   │   └── page.tsx             # Available rewards
│   ├── zones/                   # Zone management
│   │   ├── register/            # Zone registration
│   │   ├── [id]/                # Individual zone pages
│   │   └── page.tsx             # All zones list
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
│
├── components/                   # React components
│   ├── admin/                   # Admin-specific components
│   ├── layout/                  # Layout components (header, footer)
│   ├── leaderboard/             # Leaderboard components
│   ├── notifications/           # Notification components
│   ├── reports/                 # Report-related components
│   ├── rewards/                 # Reward components
│   ├── zones/                   # Zone components
│   ├── ui/                      # Reusable UI components (57 components)
│   └── theme-provider.tsx       # Theme context provider
│
├── hooks/                       # Custom React hooks
│   ├── use-mobile.tsx          # Mobile detection hook
│   └── use-toast.ts            # Toast notification hook
│
├── lib/                         # Utility libraries
│   ├── store.ts                # In-memory data store
│   ├── types.ts                # TypeScript type definitions
│   └── utils.ts                # Helper functions
│
├── public/                      # Static assets
│   ├── icon.svg                # App icon
│   ├── icon-light-32x32.png   # Light theme favicon
│   ├── icon-dark-32x32.png    # Dark theme favicon
│   └── apple-icon.png          # Apple touch icon
│
├── styles/                      # Additional stylesheets
│   └── globals.css             # Additional global styles
│
├── types/                       # Type definitions
│   └── index.ts                # Exported types
│
├── .gitignore                  # Git ignore rules
├── components.json             # Shadcn UI configuration
├── next.config.mjs             # Next.js configuration
├── package.json                # Project dependencies
├── pnpm-lock.yaml             # pnpm lock file
├── pnpm-workspace.yaml        # pnpm workspace config
├── postcss.config.mjs         # PostCSS configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## 📖 Usage Guide

### For Community Members

#### 1. Register Your Zone

1. Navigate to the homepage
2. Click **"Register Your Zone"**
3. Fill in zone details:
   - Zone name (e.g., "Downtown District")
   - Contact person name
   - Email address
   - Phone number
   - Zone description
4. Submit the registration

#### 2. Report a Cleanup

1. Click **"Report Cleanup"** from the homepage or navigation
2. Select your registered zone
3. Upload photos:
   - **Before photo**: Shows the area before cleanup
   - **After photo**: Shows the cleaned area
4. Enter cleanup metrics:
   - Number of trash bags collected
   - Estimated weight (kg)
   - Area cleaned (square meters)
   - Number of volunteers
5. Add optional notes
6. Submit the report

#### 3. Track Your Progress

1. Visit the **Leaderboard** page
2. Switch between time periods (Weekly/Monthly/All-time)
3. View your zone's ranking and points
4. See detailed statistics for each zone

#### 4. Claim Rewards

1. Navigate to the **Rewards** page
2. Browse available rewards by tier
3. Check your zone's point balance
4. Select rewards to claim (when eligible)

### For Administrators

#### 1. Access Admin Dashboard

1. Navigate to `/admin`
2. View overview statistics:
   - Total zones
   - Pending reports
   - Points awarded
   - Rewards distributed

#### 2. Verify Reports

1. Go to the **Pending Reports** section
2. Review each report:
   - Check before/after photos
   - Verify metrics
   - Assess impact
3. Approve or reject reports
4. Points are automatically awarded upon approval

#### 3. Manage Zones

1. View all registered zones
2. Edit zone information
3. Deactivate inactive zones
4. Monitor zone performance

## 🎯 Admin Panel

The admin panel (`/admin`) provides comprehensive management tools:

### Dashboard Features

- **Statistics Overview**: Real-time metrics on platform activity
- **Report Queue**: Pending cleanup reports awaiting verification
- **Zone Management**: View and manage all registered zones
- **Analytics**: Charts and graphs showing trends over time
- **Reward Tracking**: Monitor reward distribution and availability

### Report Verification Process

1. **Review Photos**: Examine before/after images for authenticity
2. **Validate Metrics**: Ensure reported numbers are reasonable
3. **Score Assignment**: System calculates points based on:
   - Trash bags collected
   - Weight of waste
   - Area cleaned
   - Number of volunteers
   - Photo quality
   - Consistency of reporting
4. **Approval/Rejection**: Approve valid reports or reject with feedback

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use existing UI components from `components/ui`
- Maintain consistent code style (use ESLint)
- Add comments for complex logic
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For questions or support:

- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

**Made with ❤️ for cleaner communities**
