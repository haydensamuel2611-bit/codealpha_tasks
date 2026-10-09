# ⚡ Pulse v3.0 — Full-Stack Social Media Platform

A modern, high-performance social media application built with **Vanilla HTML/CSS/JavaScript** on the frontend, an **Express.js** REST API backend, and **SQLite** for relational data persistence.

Featuring a dedicated **Page 1 Login & Welcome Screen**, 32+ posts & video reels, dev memes, double-tap likes, and rich colourful glassmorphism UI design.

---

## 🌟 Key Features

### 1. 🚀 Dedicated Page 1: Colourful Login & Welcome Screen
- **First Page Experience:** Opening the app immediately presents a futuristic, colourful glassmorphism Login & Welcome screen before revealing the main content.
- **3 Auth Tabs:**
  - **⚡ 1-Click Quick Demo:** Instant sign-in with 6 pre-seeded verified creators (Elena, Marcus, Sophia, Leo, Maya, Alex) with profile cards, stats, and bio snippets.
  - **🔑 Member Sign In:** Clean handle/username login with `@` prefix, password show/hide toggle, "Remember me" option, and quick-fill handle chips.
  - **✨ Create Account:** Interactive sign-up form with a visual preset avatar picker (cyber bots & portraits), handle validation, display name, and bio.
- **Ambient Glowing Mesh:** Dynamic animated floating orbs in radiant purple, hot magenta, electric cyan, and golden amber.
- **Platform Teaser Banner:** High-resolution preview with live stats: 32+ Posts & Reels, 6 Pro Creators, 100% Zero Latency WAL, Double-Tap Likes.
- **Smooth Content Reveal:** Seamless animated fade-out transition into the feed upon authentication.
- **Dedicated Log Out Button:** Accessible in the sidebar, mobile header, and profile actions to quickly return to the login screen.

### 2. 🎬 4K Video Reels & 🎭 Dev Memes (32+ Posts Seeded!)
- **17+ Video Reels:** High-resolution video reels with custom mute/unmute audio button, animated vinyl disk track badges, and video loop optimization.
- **Dedicated "🎬 Reels" Tab:** Filter the stream to watch continuous short-form videos with creator overlays, sound bars, and captions.
- **Dedicated "🎭 Memes" Tab:** Curated stream of tech and developer memes with custom badges.
- **Double-Tap to Like:** Double-tap any image or video reel to trigger an Instagram-style pop-up heart with floating particles.
- **Rich Post Composer:** Attach MP4 video reels, images, dev memes, quick hashtag chips (`#reels`, `#memes`, `#coding`, `#vibes`), and reaction emojis.

### 3. 👤 User Profiles & Follow System
- **Panoramic Header & Glowing Avatar:** Customized profiles with responsive banners, avatars, and verified badges.
- **Dynamic Stats Counter:** Live counters for **Posts**, **Followers**, and **Following**.
- **Interactive Followers & Following Modals:** Click on follower/following counts to view lists of users and follow/unfollow them directly.
- **Editable Profiles:** Instant profile editing modal to customize Display Name, Bio, Location, Website, and Avatar/Banner URLs.
- **Profile Subtabs:** Easily filter user content by **Posts**, **Liked**, and **Media & Reels**.

### 4. 👥 Follow & Interaction System
- **One-Click Follow / Unfollow:** Toggle follows from the feed, "Who to Follow" recommendations, profile headers, or follower modals.
- **Threaded Inline Comments:** Expand comments with one click, reply instantly, and delete comments on owned threads.
- **Smart Feed Filtering:**
  - **✨ For You:** Global curated stream of latest posts, reels, and memes.
  - **🎬 Reels:** Dedicated video reels stream.
  - **🎭 Memes:** Dedicated developer and tech memes stream.
  - **👥 Following:** Dynamic feed showing only posts from users you follow.
  - **🔥 Trending:** Posts ranked by engagement and like volume.
  - **🔖 Bookmarks:** Quick-access personal saved posts.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vanilla HTML5, Vanilla CSS3 (Custom Design System, Glassmorphism, Ambient Orbs, Micro-Animations), JavaScript (ES6+ Modules) |
| **Backend** | Express.js (Node.js v24), CORS, Multer (file uploads) |
| **Database** | Relational SQLite (`node:sqlite`) with WAL mode, foreign keys, and cascade deletions |

---

## 📁 Project Architecture

```
Task 2/
├── package.json               # Dependencies and scripts (start, dev, seed)
├── server.js                  # Express API server with REST endpoints & static serving
├── start.bat                  # One-click Windows starter batch script
├── db/
│   ├── database.js            # SQLite connection, schema definition & indexes
│   ├── seed.js                # Seed data with 32+ posts, reels, memes, comments & likes
│   └── social_pulse.db        # SQLite database file
├── public/
│   ├── index.html             # Single Page Application HTML markup (Login + Feed)
│   ├── css/
│   │   ├── style.css          # Design system tokens, login screen & animations
│   │   ├── components.css     # Post cards, video reels, composer & comments
│   │   └── profile.css        # Profile headers, stats, subtabs & edit form
│   ├── js/
│   │   ├── api.js             # Async REST API fetch client
│   │   ├── state.js           # Reactive client state management
│   │   ├── ui.js              # DOM rendering, login creator cards & templates
│   │   └── app.js             # Event listeners, auth management & feed orchestration
│   ├── images/
│   │   ├── logo.jpg           # Application branding logo
│   │   ├── pulse_welcome_hero.jpg
│   │   └── memes/             # Developer meme graphics
│   └── videos/                # Local MP4 & WebM video reels
```

---

## 🚀 Running the Application

### Option A: Using `start.bat` (Recommended on Windows)
Simply double-click `start.bat` in the project root directory. It will start the backend server and automatically open `http://localhost:3000` in your default browser.

### Option B: Using Terminal Commands
```bash
# 1. Start the Server
npm start

# 2. Open in your browser
http://localhost:3000
```
