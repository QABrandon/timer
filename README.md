# 🍅 Pomodoro Timer

A modern, accessible Pomodoro Timer built with React and TypeScript. This application helps you manage your work sessions effectively using the Pomodoro Technique.

## ✨ Features

- ⏰ Customizable timer settings with 0:00 default start time
- 🔔 Smart countdown notifications:
  - For timers < 60 seconds: notifications at 3, 2, and 1 seconds remaining
  - For longer timers: notification at 10 seconds remaining
- 🏁 Completion notifications with automatic reset to custom time
- 🔄 Auto-reset functionality - timer automatically returns to your custom time after completion for easy restart
- ⌨️ Full keyboard accessibility
- 👁️ Screen reader support with ARIA live regions
- 🎨 Clean, modern UI with Chakra UI
- 📱 Responsive design
- 🚫 Fixed timer reset bugs for smooth countdown experience

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/QABrandon/timer.git
   cd timer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## 🌐 Live Demo

Visit the live application: **https://interview-timer.netlify.app**

## 🛠️ Built With

- [React](https://reactjs.org/) - UI Library
- [TypeScript](https://www.typescriptlang.org/) - Programming Language
- [Vite](https://vitejs.dev/) - Build Tool
- [Chakra UI](https://chakra-ui.com/) - Component Library
- [Jest](https://jestjs.io/) - Testing Framework
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Testing Utilities

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

**Current Test Status**: ✅ All 16 tests passing

## 📦 Production Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 🎯 Usage

1. **Set custom time**: Use the minutes and seconds input fields to set your desired timer duration
2. **Update timer**: Click "Update Timer" to apply your custom time settings
3. **Start countdown**: Click "Start" to begin the countdown
4. **Pause/Resume**: Use "Pause" to temporarily stop the timer, then "Start" to resume
5. **Reset**: Click "Reset" to return to your custom time settings
6. **Automatic restart**: After timer completion, it automatically resets to your custom time - just click "Start" again!

### 🔔 Notification Behavior

- **Short timers** (< 60 seconds): Get notifications at 3, 2, and 1 seconds remaining
- **Longer timers** (≥ 60 seconds): Get notification at 10 seconds remaining
- **Completion**: Visual and audio-accessible notification when timer ends
- **Auto-reset**: Timer automatically returns to your custom time for easy restart

## ♿ Accessibility

This timer is built with accessibility in mind:
- ARIA live regions for time announcements
- Keyboard navigation support
- Screen reader friendly notifications
- High contrast color scheme
- Clear focus indicators
- Comprehensive ARIA labels on all interactive elements

## 📝 Version History

- **v2.4.0** - Added auto-reset to custom time after timer completion for easy restart
- **v2.3.0** - Fixed countdown notifications (3,2,1 seconds) and timer completion bug
- **v2.2.0** - Fixed timer reset bug and changed default to 0:00
- **v2.1.1** - Code cleanup and optimization
- **v2.1.0** - Enhanced UI and accessibility improvements  
- **v2.0.0** - Added notifications and improved test coverage

## 🚀 Deployment

This project is continuously deployed to Netlify. Every push to the main branch automatically triggers a new deployment.

- **Production URL**: https://interview-timer.netlify.app
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Build the project: `npm run build`
6. Submit a Pull Request

## 🐛 Bug Reports

If you encounter any issues, please create an issue on GitHub with:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/OS information
