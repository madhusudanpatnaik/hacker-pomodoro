# Hacker Pomodoro

A sleek, feature-rich Pomodoro timer application designed specifically for developers and tech enthusiasts. Built with Next.js, TypeScript, and React.

![Hacker Pomodoro Screenshot](public/screenshot.png)

## Features

- **Modern, Hacker-Inspired UI**: Clean, dark theme interface with subtle code-inspired visual elements
- **Enhanced Animation System**: Choose between fluid animations, code rain, particle effects, twinkling stars, or animated waves
- **Theme Switching**: Several pre-defined color themes to match your preferences (Cyberdark, Cyberlight, Matrix, Midnight, Ocean)
- **Pomodoro Timer**: Customizable work sessions and break intervals
- **Task Management**: Add and manage tasks with a simple interface
- **Productivity Statistics**: Track your focus time, completed sessions, tasks, and daily streaks
- **Keyboard Shortcuts**: Streamlined workflow with keyboard controls
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Sound Notifications**: Audio cues when sessions complete

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/hacker-pomodoro.git
   cd hacker-pomodoro
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

### Timer Controls

- **Start/Pause**: Click the play/pause button or press the Space key
- **Reset**: Click the reset button or press the R key
- **Sound Toggle**: Click the sound button to mute/unmute notifications

### Settings

- **Open Menu**: Click the gear icon or press the M key
- **Theme Selection**: Choose a theme from the dropdown in the settings panel
- **Animation Style**: Select from multiple animation styles (Fluid, Code Rain, Particles, Stars, Waves, or None)
- **Task Management**: Add tasks using the input field below the timer

### Productivity Tracking

- **Daily Streaks**: The app tracks your daily usage and maintains a streak counter
- **Session Statistics**: Monitor completed focus sessions, break sessions, and total time spent
- **Tasks Completed**: Keep track of your completed tasks

## Keyboard Shortcuts

- `Space`: Start/Pause timer
- `R`: Reset timer
- `M`: Open/close menu
- `T`: Cycle through themes

## Technologies Used

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: Type-safe JavaScript
- **React**: UI component library
- **CSS Modules**: Scoped styling for components
- **LocalStorage**: For saving settings and statistics
- **HTML5 Canvas**: For creating dynamic animations

## Project Structure

- `/components`: React components for UI elements and animations
- `/contexts`: Context providers for application state management
- `/pages`: Next.js page components and routing
- `/public`: Static assets including fonts and audio files
- `/styles`: CSS modules for component and global styling

## Animations

The application features five different animation styles:

1. **Fluid Animation**: Colorful, flowing particles that connect with lines when close to each other
2. **Code Rain**: Matrix-style falling characters for a cyberpunk aesthetic
3. **Particles**: Colorful floating particles with varied movement patterns
4. **Stars**: Twinkling stars with occasional shooting stars across the screen
5. **Waves**: Animated wave patterns that create a calming water-like effect

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The Pomodoro Technique was developed by Francesco Cirillo
- Inspired by the developer community's love for productive tools
- Special thanks to the open source community for the fantastic libraries used in this project 