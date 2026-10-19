# ☁️ Mallow — The Cloud Collector

> *"Catching drifting clouds, softening forgotten dreams, and tucking them into starry skies."*

[![Framework](https://img.shields.io/badge/Framework-React%20%2B%20Vite-61dafb?style=flat-square&logo=react)](https://vitejs.dev/)
[![Styling](https://img.shields.io/badge/Styling-CSS%20%2F%20Tailwind-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](#credits-and-acknowledgements)

---

## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [Inspiration & Story](#-inspiration--story)
- [Meet Mallow](#-meet-mallow)
- [Key Features](#-key-features)
- [Showcase Projects](#-showcase-projects)
- [Technology Stack](#-technology-stack)
- [Website Structure & User Experience](#-website-structure--user-experience)
- [Installation & Local Setup](#-installation--local-setup)
- [Running the Development Server](#-running-the-development-server)
- [Building for Production](#-building-for-production)
- [Project Folder Structure](#-project-folder-structure)
- [Future Improvements](#-future-improvements)
- [Credits & Acknowledgements](#-credits--acknowledgements)

---

## 🌟 Project Overview

**Mallow — The Cloud Collector** is a whimsical, interactive personal portfolio and storytelling website.

The website transports visitors into an enchanting floating sky world rendered in dreamy pastels (powder blues, whipped cream whites, and lavender hues). Visitors accompany **Mallow**, an original baby cloud creature, through an interactive sky sanctuary where forgotten daytime wishes and nighttime dreams are collected, spun into fluffy pillows, transformed into ambient rainscapes, and cast into playful celestial forecasts.

- **Live Demo:** `[Your Deployed Website URL]`
- **Repository:** `[Your GitHub Repository URL]`
- **Demo Preview:** `[Link or Placeholder for Demo GIF / Screenshots]`

---

## 💭 Inspiration & Story

Every time someone falls asleep or daydreams by a windowsill, little wisps of their thoughts drift up toward the atmosphere. Most of them evaporate into the mist—lost, forgotten, or misplaced before they can come true.

**Mallow** was born from the softest cumulus vapor at dawn. Being tiny and shy, Mallow found solace in wandering the gentle air currents, discovering that clouds weren't just water vapor—they were memory keepers holding stray dreams. Mallow built a cozy perch atop the troposphere to gather these wandering clouds, dusting off their worries and converting their heartfelt wishes into comforting experiences that anyone visiting the sky could cherish.

This project was built to capture that comforting feeling: a digital safe space reminiscent of childhood picture books, calming ambient toys, and playful micro-interactions.

---

## 🧸 Meet Mallow

| Attribute | Details |
| :--- | :--- |
| **Name** | Mallow |
| **Species** | Sky Nimbus / Baby Cloud Creature |
| **Personality** | Shy, gentle, curious, imaginative, and deeply empathetic |
| **Visual Design** | Expressive ink-drop eyes, soft blush cheeks, tiny marshmallow hands, and an enchanted golden star hairpin |
| **Favorite Activity** | Polishing fallen stardust & catching runaway daydreams |
| **Signature Quirk** | Changes tint from sunrise peach to dusk lavender depending on the time of day |

```
        .---.
     .-'     '-.
    (   (• ‿ •)  )  ✦ * "Every dream deserves a soft landing." *
     '-.  ⸝⸝  .-'
        '---'
```

---

## ✨ Key Features

- 🎨 **Pastel Celestial Aesthetics**: Handcrafted visual styling utilizing calming hues of lavender mist (`#E0D7FF`), sky cyan (`#BAE6FD`), sunrise peach (`#FFEDD5`), and soft cloud white (`#F8FAFC`).
- ⛅ **Dynamic Floating Sky World**: Multi-layered parallax floating clouds and CSS twinkling stars that react to cursor movement and viewport scrolling.
- 🌞 / 🌙 **Day & Night Mode Switcher**: Seamlessly toggles the sky atmosphere between a radiant morning sunshine palette and a deep twilight midnight indigo.
- 📖 **Interactive Scrolling Origin Story**: An illustrated, progressive journey revealing how Mallow first gathered stray thoughts into cloud bottles.
- 📱 **Fully Responsive Layout**: Thoughtfully crafted responsive grid ensuring a smooth, tactile experience across desktop displays, tablets, and mobile screens.
- 🌈 **Secret Easter Egg**:
  - *Hint:* Keep an eye out for a particularly shy cloud nestled near the horizon.
  - *Trigger:* Tapping or clicking this secret cloud **7 times** triggers an explosion of pastel rainbow confetti and reveals a hidden keepsake: *"You found a dream Mallow forgot!"*

---

## 🚀 Showcase Projects

Mallow's floating sanctuary hosts three interactive micro-tools:

### 1. 🛏️ Cloud Pillow Factory
> *Turns fluffy clouds into pillows filled with happy dreams.*
- **What it does**: Visitors choose a cloud density (Puff, Marshmallow, or Nimbus) and insert a dream theme (e.g., "warm cocoa on a snowy day" or "flying over strawberry fields").
- **Interaction**: The machine gently spins the cloud with animated cotton puffs and stitches together a digital dream pillow badge that users can inspect and collect.

### 2. 🌧️ Rainy-Day Sound Machine
> *Creates gentle, rhythmic rainy-day soundscapes to soothe weary minds.*
- **What it does**: A built-in synthesizer and white-noise generator powered by the Web Audio API.
- **Controls**: Interactive sliders to blend drizzle intensity, distant soft rolling thunder, skylight droplet tapping, and wind chimes. Includes a toggleable visual rainfall overlay.

### 3. 🔮 Dream Forecast Station
> *Generates playful fictional dream forecasts for tonight.*
- **What it does**: An imaginative weather board for the nocturnal mind.
- **Output**: Generates randomized, whimsical daily dream forecasts (e.g., *"Expect 80% chance of floating through bubblegum skies with light showers of falling shooting stars"*).

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | **React 19** | Component-driven UI architecture and declarative state handling |
| **Build Tool** | **Vite** | Fast Hot Module Replacement (HMR) and optimized bundler |
| **Styling** | **Modern CSS & Tailwind CSS** | Soft pastel theme tokens, responsive layouts, and fluid transitions |
| **Icons** | **Lucide React** | Clean, minimalist icon set for controls, stars, and weather elements |
| **Audio** | **Web Audio API** | Real-time procedural ambient sound synthesis for rain and windscapes |
| **VFX & Confetti** | **canvas-confetti** | Lightweight canvas particle effects for the rainbow Easter egg |
| **Language** | **TypeScript** | Strict type safety and robust component interfaces |

---

## 🧭 Website Structure & User Experience

```
[ Top Navigation Bar ]
  ├── Mallow Logo & Character Icon
  ├── Navigation Links (Story, Projects, About)
  └── Day / Night Ambient Toggle Button

[ Hero Section ]
  ├── Animated Mallow Floating Avatar (Hover & Click Reactions)
  ├── Welcome Tagline & Story Introduction
  └── "Explore Mallow's Sky" Call to Action

[ Interactive Storybook Section ]
  └── 3-part scrolling chapter cards on how Mallow found the forgotten clouds

[ Showcase Pavilion ]
  ├── 🛏️ Cloud Pillow Factory
  ├── 🌧️ Rainy-Day Sound Machine
  └── 🔮 Dream Forecast Station

[ Secret Horizon (Easter Egg Zone) ]
  └── The elusive 7-click mystery cloud ☁️✨

[ Sky Sanctuary Footer ]
  └── Hackathon badge, credits, social links & gentle farewell note
```

---

## 💻 Installation & Local Setup

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher) or **yarn** / **pnpm**

### Step-by-Step Installation

1. **Clone the repository:**
   ```bash
   git clone [Your GitHub Repository URL]
   cd mallow-cloud-collector
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```
   *(If you are using yarn, run `yarn install`; for pnpm, run `pnpm install`)*

---

## 🏃 Running the Development Server

Start the local Vite development server with hot-reload:

```bash
npm run dev
```

Once the server initializes, open your browser and navigate to:
```
http://localhost:5173
```
*(or the alternate port displayed in your terminal output).*

---

## 📦 Building for Production

To create an optimized, minified production build:

```bash
npm run build
```

The output files will be compiled into the `dist/` directory, ready to deploy to Netlify, Vercel, GitHub Pages, or Cloud Run.

To preview the production build locally:

```bash
npm run preview
```

---

## 📂 Project Folder Structure

```
mallow-cloud-collector/
├── public/
│   ├── favicon.ico               # Cloud icon
│   └── sounds/                   # Fallback audio assets
├── src/
│   ├── assets/                   # Character illustrations & textures
│   │   ├── mallow-avatar.svg
│   │   └── star-accessory.svg
│   ├── components/               # Modular UI components
│   │   ├── Character.tsx         # Expressive Mallow avatar component
│   │   ├── CloudPillowFactory.tsx# Showcase Project 1
│   │   ├── RainySoundMachine.tsx # Showcase Project 2 (Web Audio API)
│   │   ├── DreamForecast.tsx     # Showcase Project 3
│   │   ├── DayNightToggle.tsx    # Theme switch controller
│   │   ├── EasterEggCloud.tsx    # 7-click rainbow Easter egg
│   │   ├── FloatingClouds.tsx    # Background floating cloud layer
│   │   └── Navbar.tsx            # Navigation header
│   ├── hooks/                    # Custom React hooks
│   │   ├── useTheme.ts           # Day/Night theme state hook
│   │   └── useRainAudio.ts       # Web Audio API ambient sound hook
│   ├── styles/                   # Style definitions & animations
│   │   └── index.css             # Tailwind imports & custom pastel keyframes
│   ├── App.tsx                   # Main application layout
│   └── main.tsx                  # React DOM root entrypoint
├── index.html                    # HTML shell & viewport metadata
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript compiler configuration
├── vite.config.ts                # Vite build and plugin settings
└── README.md                     # Project documentation
```

---

## 🏆 Project Highlights

Highlights & Features:

| Project Highlight | How Mallow Delivers |
| :--- | :--- |
| **Original Character & Story** | Mallow is a custom, fully original character with complete lore, distinct emotional traits, and dedicated character design. |
| **Interactive Whimsical Spirit** | Embraces the nostalgic charm of playful web discovery—featuring interactive sound toys, click counters, secret Easter eggs, and customizable virtual items. |
| **Cohesive Aesthetic & Theme** | Curated palette of pastels, expressive micro-animations, and dynamic day/night cycles designed to feel cozy and inviting. |
| **Complete Showcase Works** | Features three standalone, fully functional interactive creations (Pillow Factory, Rain Sound Machine, and Dream Forecast). |
| **Accessible & Responsive** | Responsive across mobile and desktop displays with smooth performance and accessible contrast controls. |

---

## 🔮 Future Improvements

- [ ] **Dream Journal LocalStorage Integration**: Allow visitors to save and catalog their generated dream pillows in a personal browser keepsake box.
- [ ] **Community Cloud Exchange**: A lightweight guestbook where visitors can leave a friendly anonymous message for future travelers to find inside a cloud.
- [ ] **Lofi Cloud Radio**: Additional generative ambient chord progressions and lullaby modes in the Rainy-Day Sound Machine.
- [ ] **Custom Character Dress-Up**: Unlockable seasonal accessories for Mallow (rain boots, moon hat, starry scarf).

---

## 💖 Credits and Acknowledgements

- **Creator & Developer**: `[Maryam Shadan, Nikhat Naaz, Areeba Shaukat]`
- **Design & Lore**: Inspired by bedtime storybooks, cozy pixel art aesthetics, and nostalgic web toys.
- **Audio Synthesis**: Built with the native browser **Web Audio API**.
- **Special Thanks**:
  - Everyone who still looks up at the clouds and dreams.

---

<p align="center">
  <sub>☁️ Built with love, starlight, and cotton-candy clouds. ☁️</sub>
</p>
