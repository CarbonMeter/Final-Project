# 🌱 Carbon Meter - Environmental Impact Calculator

A modern web application that helps users calculate and track their carbon footprint while providing educational content and gamification features to encourage sustainable living.

## 🚀 Features

- **Carbon Footprint Calculator** - Calculate your environmental impact
- **User Authentication** - Secure login with Google OAuth and email/password
- **Progress Tracking** - Monitor your sustainability journey
- **Educational Content** - Learn about environmental impact
- **Gamification** - Earn badges and track streaks
- **Community Features** - Share and compare with others
- **AI-Powered Chatbot** - Get personalized sustainability advice
- **Admin Dashboard** - Manage users and content
- **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Authentication**: NextAuth.js (Google OAuth + Credentials)
- **Database**: MongoDB
- **AI Integration**: OpenAI SDK
- **State Management**: React Hooks
- **Form Handling**: React Hook Form + Zod
- **Charts**: Recharts
- **Animations**: Framer Motion

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 18 or higher)
- **npm** or **pnpm** package manager
- **MongoDB** database (local or cloud)
- **Google OAuth** credentials (optional)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/CarbonMeter/Final-Project.git
cd Final-Project
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# OpenAI (Optional - for chatbot)
OPENAI_API_KEY=your_openai_api_key
```

### 4. Run the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   ├── calculate/         # Carbon calculator
│   ├── community/         # Community features
│   ├── learn/            # Educational content
│   ├── games/            # Gamification
│   └── login/            # Authentication pages
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── Navbar.tsx        # Navigation
│   └── Footer.tsx        # Footer
├── lib/                  # Utility functions
│   ├── auth.ts           # Authentication config
│   └── mongodb.ts        # Database connection
├── hooks/                # Custom React hooks
├── public/               # Static assets
└── styles/               # Global styles
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NEXTAUTH_SECRET` | Secret key for NextAuth | Yes |
| `NEXTAUTH_URL` | Your app URL | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |
| `OPENAI_API_KEY` | OpenAI API key for chatbot | No |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Next.js and React
- UI components from Radix UI
- Styling with Tailwind CSS
- Authentication with NextAuth.js

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/CarbonMeter/Final-Project/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**Made with ❤️ for a sustainable future** 