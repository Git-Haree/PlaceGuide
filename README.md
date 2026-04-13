# ⚡ PlaceIQ — Intelligent Placement Navigator

> **AI-powered skill gap analysis for 40+ companies with personalised week-by-week preparation roadmaps.**

![Tech Stack](https://img.shields.io/badge/Java-17-orange?style=flat-square) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green?style=flat-square) ![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat-square) ![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple?style=flat-square) ![Gemini AI](https://img.shields.io/badge/Gemini-AI-red?style=flat-square)

---

## 🎯 Features

| Feature | Description |
|--------|-------------|
| 📊 **Gap Analysis** | Compare skills against 40+ companies using intelligent keyword matching |
| 🤖 **Gemini AI Advice** | Personalised 2-sentence advice per company from Google Gemini |
| 🗓️ **Roadmap Generator** | Week-by-week skill preparation plan based on gaps |
| 📈 **Chart.js Visuals** | Interactive bar charts and radar charts for skill coverage |
| 💰 **Salary Simulator** | AI-powered salary negotiation advisor |
| 🎙️ **Mock Interview** | 90+ curated questions randomiser with countdown timer |
| 📊 **Company Comparison** | Side-by-side radar chart comparison for 2–4 companies |
| ✅ **Progress Tracker** | Check off skills as you learn; live progress bar |
| 🌙 **Dark/Light Mode** | Glassmorphic dark theme with persistent preference |
| 🎉 **Confetti** | Celebration animation for high match scores |
| 📤 **Export PDF** | Print-optimised report export |
| 🔗 **Shareable Links** | URL-encoded result sharing |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17 + Spring Boot 3.2 + Spring Data JPA |
| Database | MySQL 8.0 |
| AI Layer | Google Gemini API (gemini-1.5-flash, FREE tier) |
| Frontend | HTML5 + CSS3 + Vanilla JS + Bootstrap 5.3 + Chart.js 4 |
| Build | Apache Maven 3.9 |
| Deploy (BE) | Railway.app |
| Deploy (FE) | Firebase Hosting |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
Ensure these are installed (run `verify_tools.ps1` or check manually):
- ✅ Java 17+ (`java -version`)
- ✅ Maven 3.9+ (`mvn -version`)
- ✅ MySQL 8.0 (`mysql --version`)
- ✅ Node.js + npm (for Firebase CLI)
- ✅ Firebase CLI (`firebase --version`)

---

### Step 1: MySQL Setup

```sql
-- Open MySQL Workbench or CLI and run:
CREATE DATABASE placeiq_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verify:
SHOW DATABASES;
```

---

### Step 2: Configure `application.properties`

Open `src/main/resources/application.properties` and update:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/placeiq_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_ACTUAL_MYSQL_PASSWORD

gemini.api.key=YOUR_GEMINI_API_KEY
```

> 🔑 **Get free Gemini API key at:** https://aistudio.google.com
> - Sign in with Google → Create API key → Copy and paste above
> - **Free tier:** 15 requests/minute, 1M tokens/month

---

### Step 3: Run Spring Boot Backend

```powershell
cd "c:\Users\keert\Downloads\Java PLACEIQ"

# Add Maven to PATH (current session)
$env:PATH += ";C:\Users\keert\maven\apache-maven-3.9.14\bin"

# Build and run
mvn spring-boot:run
```

**Expected output:**
```
========================================
  PlaceIQ Backend Started Successfully!
  API available at: http://localhost:8080
========================================
```

The app will **auto-create tables** and **seed 40+ companies** on first startup.

---

### Step 4: Open Frontend

Simply open `frontend/index.html` in your browser:
```powershell
start "c:\Users\keert\Downloads\Java PLACEIQ\frontend\index.html"
```

Or use VS Code Live Server extension for hot reload.

The frontend connects to `http://localhost:8080` by default.

---

## 🌐 Production Deployment

### Backend → Railway.app

1. Push your project to GitHub:
```bash
git init
git add .
git commit -m "PlaceIQ initial commit"
git remote add origin https://github.com/YOUR_USERNAME/placeiq.git
git push -u origin main
```

2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add environment variables in Railway dashboard:
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://YOUR_RAILWAY_MYSQL_URL/placeiq_db?allowPublicKeyRetrieval=true
   SPRING_DATASOURCE_USERNAME=root
   SPRING_DATASOURCE_PASSWORD=YOUR_DB_PASSWORD
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   ```
4. Railway will auto-build the Maven JAR and deploy it
5. Your backend URL will be: `https://placeiq-production.up.railway.app`

---

### Frontend → Firebase Hosting

1. Update `BASE_URL` in `frontend/js/app.js`:
```js
const BASE_URL = 'https://placeiq-production.up.railway.app'; // Your Railway URL
```

2. Deploy to Firebase:
```powershell
# Login (one time)
firebase login

# Initialize hosting (one time)
firebase init hosting
# Select: Use existing project → placeiq → public dir: frontend → SPA: yes → No overwrite

# Deploy
firebase deploy --only hosting
```

**Your app will be live at:** `https://YOUR_PROJECT.web.app`

---

## 📁 Project Structure

```
Java PLACEIQ/
├── pom.xml                          # Maven build config
├── firebase.json                    # Firebase hosting config
├── .firebaserc                      # Firebase project ID
├── README.md                        # This file
├── src/main/
│   ├── java/com/placeiq/
│   │   ├── PlaceIQApplication.java  # Spring Boot entry point
│   │   ├── config/
│   │   │   ├── CorsConfig.java      # CORS for Firebase →Railway
│   │   │   └── GeminiConfig.java    # Gemini API key + RestTemplate
│   │   ├── controller/
│   │   │   ├── AnalysisController.java  # POST /api/analyse
│   │   │   ├── CompanyController.java   # GET /api/companies
│   │   │   ├── ProfileController.java   # POST/GET /api/profiles
│   │   │   └── ProgressController.java  # POST/GET /api/progress, salary-advice
│   │   ├── model/
│   │   │   ├── Company.java
│   │   │   ├── UserProfile.java
│   │   │   ├── GapAnalysis.java
│   │   │   └── ProgressItem.java
│   │   ├── dto/
│   │   │   ├── AnalysisRequest.java
│   │   │   ├── AnalysisResponse.java
│   │   │   └── CompanyGapResult.java
│   │   ├── repository/            # JPA repositories (4 files)
│   │   └── service/
│   │       ├── AnalysisService.java     # Pipeline orchestrator
│   │       ├── GapScorerService.java    # Skill matching algorithm
│   │       ├── GeminiService.java       # Gemini AI calls
│   │       ├── RoadmapService.java      # Week-by-week roadmap
│   │       └── ResumeParserService.java # Resume text skill extractor
│   └── resources/
│       ├── application.properties   # Config (edit DB + Gemini key)
│       └── data.sql                 # 40+ company seed data
└── frontend/
    ├── index.html                   # Single-page application
    ├── css/style.css                # Glassmorphic dark theme
    └── js/app.js                    # All frontend logic
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/api/analyse` | **Main analysis** — submit profile, get gap results |
| `GET` | `/api/companies` | List all 40+ companies |
| `GET` | `/api/companies/{name}` | Get company details by name |
| `GET` | `/api/companies/category/{cat}` | Filter by Service/Product/MNC/Startup |
| `POST` | `/api/profiles` | Save user profile |
| `GET` | `/api/profiles/{id}` | Get profile by ID |
| `POST` | `/api/progress` | Save skill progress item |
| `GET` | `/api/progress/{profileId}` | Get progress for a profile |
| `POST` | `/api/salary-advice` | AI salary negotiation advice |

---

## 🧠 Gap Scoring Algorithm

```
Score = (matched_skills / total_required_skills) × 100

Matching uses:
1. Substring matching (Spring Boot ↔ Spring)
2. Alias expansion (DSA = Data Structures = Algorithms)
3. Category aliases (OOPs = Object Oriented = OOP)
4. Bidirectional matching (student alias matches required)
```

Score bands:
- 🟢 **70–100%** = Strong match
- 🟡 **40–69%** = Moderate — needs some prep
- 🔴 **0–39%** = Needs significant work

---

## ⚠️ Troubleshooting

| Problem | Solution |
|---------|---------|
| `mvn not found` | Run: `$env:PATH += ";C:\Users\keert\maven\apache-maven-3.9.14\bin"` |
| `Access denied to MySQL` | Check username/password in `application.properties` |
| `Gemini API 403` | Get a new key at https://aistudio.google.com |
| `CORS error` | Ensure Spring Boot is running on port 8080 and CORS is configured |
| `data.sql not seeding` | Check `spring.jpa.defer-datasource-initialization=true` is set |
| `Company grid empty` | Backend not running — frontend falls back to static list |

---

## 📜 License

MIT License — Free for educational and personal use.

---

*Built with ❤️ — PlaceIQ v1.0.0*
