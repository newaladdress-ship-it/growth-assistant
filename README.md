# 🚀 AIGrowth Assistant - AI-Powered Website Growth, SEO & Performance Audit Platform

> **Final Project Submission Report**  
> **Developed by:** [Imran Digitals](https://imrandigitals.online/)  
> **Live Web Application**: [https://ai-growth-assistant-rho.vercel.app/](https://ai-growth-assistant-rho.vercel.app/)  
> **Public GitHub Repository**: [https://github.com/newaladdress-ship-it/growth-assistant.git](https://github.com/newaladdress-ship-it/growth-assistant.git)

---

## 📌 Problem Statement & Target Audience

### The Real-World Problem
Small business owners, digital marketers, freelancers, and web developers constantly struggle with technical website optimization. Existing tools like Google PageSpeed Insights, Ahrefs, or Semrush are often:
1. **Overly Complex**: They present raw technical metrics without explaining *how* to fix them in plain English.
2. **Disconnected from Action**: They don't provide tailored content rewrites, headline suggestions, or personalized growth plans.
3. **Expensive or Fragmented**: Requiring multiple subscriptions just to track performance, SEO, accessibility, and AI recommendations.

### The Solution: AIGrowth Assistant
**AIGrowth Assistant** is an all-in-one, end-to-end Progressive Web App (PWA) that automates technical website health checks, SEO audits, performance benchmarks, and accessibility compliance. It connects these metrics directly to an **AI Neural Growth Engine** that acts as an on-demand web growth consultant.

### Target Audience
- **Small & Medium Business (SMB) Owners**: Non-technical website owners who need quick, actionable growth insights.
- **Freelance Web Developers & Agencies**: Professionals looking for automated audit reporting and client proposals.
- **Digital Marketers & SEO Specialists**: Analysts needing instant recommendations for page speed, Core Web Vitals, and keyword optimization.

---

## 🌐 Live Deployed Application

- **Live Deployed URL**: [https://ai-growth-assistant-rho.vercel.app/](https://ai-growth-assistant-rho.vercel.app/)
- **Progressive Web App (PWA)**: Installable natively on **Android, macOS, Windows Desktop, and iOS**.

---

## ✨ Features List — Everything AIGrowth Assistant Can Do

### 1. Real-Time Website Audit Engine
- **Instant URL Health Analysis**: Analyzes any domain (e.g. `example.com`) in real-time.
- **Core Web Vitals Benchmarking**: Measures **Largest Contentful Paint (LCP)**, **Time to First Byte (TTFB)**, and Overall Speed Index.
- **SEO Health Scoring**: Evaluates Meta Titles, Meta Descriptions, Canonical tags, OpenGraph metadata, and Heading (`<h1>` - `<h6>`) hierarchy.
- **Accessibility & Security Checks**: Verifies HTTPS protocol, alt tag coverage, contrast standards, and mobile viewport responsiveness.

### 2. Interactive Analytics Dashboard (`/dashboard`)
- Comprehensive score gauge displaying overall growth rating (0–100).
- Categorized metric cards for Performance, SEO, Security, and Accessibility.
- Priority Action Matrix prioritizing high-impact optimizations.

### 3. AI-Powered Neural Growth Assistant (`/ai-chat`)
- Context-aware chatbot that ingests your site's exact audit metrics (LCP, TTFB, SEO health, Meta tags) to deliver tailored advice.
- Generates high-converting `<h1>` headlines, optimized meta descriptions, and step-by-step code snippet fixes.
- Handles general technical queries, web development questions, math calculations, and digital strategy.

### 4. Audit History & Local Sync (`/history`)
- Automatically saves prior website audits to local state and optional Firebase Firestore cloud database.
- Allows side-by-side comparison of historical audit scores over time.

### 5. Cross-Device Progressive Web App (PWA)
- **Install Anywhere**: Installable via dedicated PWA install buttons in the **Sidebar**, **Header**, and floating install prompt.
- **Offline Access**: Powered by a custom Service Worker (`/sw.js`) that caches static assets and provides offline fallback capabilities.
- **Responsive Aesthetics**: Modern dark/light mode surface tokens, glassmorphism, and smooth Tailwind animations.

### 6. User Authentication & Guest Mode (`/auth`)
- Firebase Authentication supporting email/password registration and sign-in.
- Guest mode allowing immediate audits without blocking user entry.

---

## 🤖 The AI Feature — Instructions & System Prompt

### What It Does
The AI Feature is driven by a custom Next.js API route (`/api/chat/route.js`) connecting to **Google Gemini AI models** (`gemini-2.0-flash`, `gemini-1.5-flash`). It dynamically injects the audited website's real-time performance data directly into the system prompt context.

### The System Prompt Instructions Behind AIGrowth Assistant

```typescript
const systemPrompt = `You are AIGrowth Assistant, an expert AI Web Optimization & General Knowledge Assistant (like ChatGPT/Gemini).
You can answer ANY user question — including general knowledge (geography, capitals, math calculations, science, history, coding), as well as website audits, SEO, and performance optimization.

${hasAuditedSite ? `Analyzed Target Website Context:
- Target Website: ${domain} (${reportContext?.url || ''})
- Overall Growth Rating: ${score}/100
- Performance Score: ${perfScore}%
- SEO Health Score: ${seoScore}%
- LCP Speed: ${lcp}
- TTFB Server Latency: ${ttfb}
- Meta Title: "${metaTitle}"
- Meta Description: "${metaDesc}"` : 'Note: User has not audited a specific website yet.'}`;
```

### Key AI Architecture Capabilities
1. **Context-Aware Recommendations**: When asked *"How can I improve my speed?"*, the AI uses the actual audited LCP and TTFB metrics to suggest specific CDN configurations, image WebP compression, and script deferral.
2. **AI Headline & Copywriting Generator**: Generates high-converting `<h1>` tags tailored to the audited domain's industry.
3. **Dynamic Knowledge & Math Fallback**: Integrated math execution evaluator and dynamic knowledge fallback to handle technical calculations and strategy queries seamlessly.

---

## 🛠️ Tools, Services & AI Models Used

| Category | Technology / Service Used |
| :--- | :--- |
| **Framework & Core** | **Next.js 14** (App Router), React 18, JavaScript ES6+ |
| **Styling & Design** | **Vanilla TailwindCSS v3**, Google Fonts (`Inter`), Material Symbols |
| **AI Models & APIs** | **Google Gemini API** (`gemini-2.0-flash`), Custom Next.js Serverless Route |
| **PWA & Offline** | Web App Manifest (`manifest.json`), Custom Service Worker (`sw.js`) |
| **Authentication & Database** | **Firebase Auth** & **Cloud Firestore** |
| **Hosting & Deployment** | **Vercel** / Node.js Production Environment |

---

## 📸 Screenshots of the App in Action

*(Include at least 3 screenshots in your GitHub repository `public/screenshots/` folder)*

1. **Dashboard & Real-Time Audit Report**  
   ![Dashboard Screenshot](public/icon-512.png)  
   *Overview of overall growth rating, Core Web Vitals, and technical recommendations.*

2. **AI Neural Growth Assistant (`/ai-chat`)**  
   ![AI Assistant Screenshot](public/icon-512.png)  
   *Interactive AI chat giving site-specific SEO and speed optimizations.*

3. **PWA Cross-Device Installation**  
   ![PWA Installation Screenshot](public/icon-512.png)  
   *Installable PWA banner and sidebar button on desktop and mobile.*

---

## ⚙️ How to Run the Project Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Step 1: Clone the Repository
```bash
git clone https://github.com/newaladdress-ship-it/growth-assistant.git
cd stitch_ai_website_growth_assistant
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

### Step 4: Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 5: Test Production Build
```bash
npm run build
npm run start
```

---

## 🚀 How to Deploy Live on Vercel

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of AIGrowth Assistant"
   git branch -M main
   git remote add origin https://github.com/newaladdress-ship-it/growth-assistant.git
   git push -u origin main
   ```
2. Go to [Vercel.com](https://vercel.com/) and click **"Add New Project"**.
3. Import your `aigrowth-assistant` GitHub repository.
4. Add your Environment Variables (`NEXT_PUBLIC_GEMINI_API_KEY`, etc.).
5. Click **Deploy**. Your app will be live with an SSL certificate!

---

## 👨‍💻 Developer Credits

**Developed by [Imran Digitals](https://imrandigitals.online/)**  
- Portfolio: [https://imrandigitals.online/](https://imrandigitals.online/)  
- Project: AIGrowth Assistant — AI Web Growth & Audit Platform
