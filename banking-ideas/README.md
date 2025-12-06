# 🏦 BANK//IDEAS - Platforma de Idei Inovative pentru Banking

> O platformă socială de crowdsourcing pentru idei inovative în banking, cu design retro **TELETEXT/VIDEOTEX** din anii '80-'90.

![Teletext Design](https://img.shields.io/badge/Design-TELETEXT%20RETRO-cyan)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![AI Powered](https://img.shields.io/badge/AI-Vercel%20AI%20SDK-blue)

```
╔═══════════════════════════════════════════════════════════════╗
║ ████ BANK//IDEAS ████████████████████████████ P.100         ║
║═══════════════════════════════════════════════════════════════║
║                                                               ║
║  ▌█▌ BINE AȚI VENIT LA BANCA DE IDEI                        ║
║  ─────────────────────────────────────                       ║
║                                                               ║
║  101 ▶ IDEI RECENTE                                         ║
║  102 ▶ CATEGORII                                            ║
║  103 ▶ TOP VOTAT                                            ║
║  200 ▶ ADAUGĂ IDEE NOUĂ                                     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

## 🎯 Concept

BANK//IDEAS este o platformă unde utilizatorii pot propune, vizualiza și explora idei inovative pentru industria bancară. Fiecare idee trece printr-un **pipeline de agenți AI** care generează automat o pagină web în format **TELETEXT** - stilul retro al anilor '80-'90.

### De ce Teletext?
- 📺 **Nostalgia funcțională** - Teletext a fost prima "aplicație bancară" accesibilă publicului larg
- 🏦 **Istoric banking** - Băncile foloseau Teletext pentru cursuri valutare și informații despre servicii
- 🎨 **Design minimalist** - Focalizează atenția pe conținut, nu pe distrageri vizuale
- ⏰ **Time Capsule** - Perfect pentru tema "yesterday's inspiration + tomorrow's technology"

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **Tailwind CSS** + CSS custom pentru efecte Teletext
- **Framer Motion** pentru animații
- **React Hook Form** + **Zod** pentru validare

### Backend
- **Next.js API Routes**
- **Drizzle ORM** + **SQLite** (better-sqlite3)

### AI Pipeline
- **Vercel AI SDK** (ai + @ai-sdk/openai)
- **GPT-4o-mini** pentru generare cost-efectivă
- **5 Agenți AI** specializați:
  1. Content Analyzer
  2. Page Designer
  3. ASCII Art Generator
  4. Teletext Copywriter
  5. Page Renderer

## 🚀 Quick Start

### Prerequisite
- Node.js 18+
- npm sau yarn
- OpenAI API Key

### Instalare

```bash
# Clonează repository-ul
git clone https://github.com/your-username/banking-ideas.git
cd banking-ideas

# Instalează dependențele
npm install

# Copiază fișierul de configurare
cp .env.example .env.local

# Editează .env.local și adaugă OPENAI_API_KEY

# Inițializează baza de date
npm run db:push

# Pornește serverul de dezvoltare
npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000) în browser.

## 📁 Structura Proiectului

```
banking-ideas/
├── app/
│   ├── layout.tsx              # Layout global cu stil Teletext
│   ├── page.tsx                # P.100 - Index principal
│   ├── ideas/
│   │   ├── page.tsx            # P.101 - Lista idei
│   │   ├── [id]/
│   │   │   └── page.tsx        # Pagina idee generată
│   │   └── new/
│   │       ├── page.tsx        # P.200 - Form adăugare idee
│   │       └── steps/          # Componente pentru pașii formularului
│   ├── categories/
│   │   └── page.tsx            # P.102 - Categorii
│   ├── top/
│   │   └── page.tsx            # P.103 - Top votat
│   └── api/
│       ├── ideas/              # CRUD ideas
│       ├── vote/               # Voting endpoint
│       └── comments/           # Comments endpoint
├── components/
│   └── teletext/               # Componente UI Teletext
├── lib/
│   ├── ai/
│   │   ├── agents/             # Agenții AI
│   │   └── orchestrator.ts     # Pipeline orchestration
│   ├── db/
│   │   ├── schema.ts           # Database schema
│   │   └── index.ts            # Database connection
│   └── schemas/
│       └── index.ts            # Zod schemas
└── styles/
    └── teletext.css            # Stiluri Teletext
```

## 🎨 Design Teletext

### Paletă de culori
```css
--teletext-black: #000000;
--teletext-blue: #0000FF;
--teletext-red: #FF0000;
--teletext-magenta: #FF00FF;
--teletext-green: #00FF00;
--teletext-cyan: #00FFFF;
--teletext-yellow: #FFFF00;
--teletext-white: #FFFFFF;
```

### Caractere speciale folosite
```
█ ▌ ▐ ░ ▒ ▓ ─ │ ┌ ┐ └ ┘ ═ ║ ╔ ╗ ╚ ╝ ▶ ◀ ★ ☆ ●
```

### Efecte vizuale
- **Scanlines** - Linii orizontale transparente
- **Flicker** - Variație subtilă a opacității
- **Phosphor Glow** - Text-shadow pentru efect CRT
- **Blink** - Cursor animat

## 📝 Formularul de Idei (7 pași)

1. **Informații de Bază** - Titlu, descriere, categorie, problemă rezolvată
2. **Tehnologii** - AI, Blockchain, IoT, etc.
3. **Tip Soluție** - Web, Mobile, API, Chatbot, etc.
4. **Context Business** - Segment țintă, model monetizare, piețe
5. **Reglementări** - PSD2, GDPR, AML/KYC, etc.
6. **Diferențiatori** - Valoare unică, nivel implementare, GitHub link
7. **Detalii Adiționale** - Echipă, timeline, buget

## 🤖 AI Pipeline

```
INPUT: Form Data (JSON)
        │
        ▼
┌─────────────────────────────────────┐
│ AGENT 1: Content Analyzer           │
│ - Extrage keywords                  │
│ - Determină ton și stil             │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│ AGENT 2: Page Designer              │
│ - Structurează paginile             │
│ - Alocă numere de pagină            │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│ AGENT 3: ASCII Art Generator        │
│ - Creează grafice Teletext          │
│ - Generează borduri                 │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│ AGENT 4: Teletext Copywriter        │
│ - Rescrie în stil concis            │
│ - Max 40 caractere/linie            │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│ AGENT 5: Page Renderer              │
│ - Asamblează HTML/CSS               │
│ - Aplică efecte retro               │
└─────────────────────────────────────┘
        │
        ▼
OUTPUT: Set de pagini Teletext (P.1XX)
```

## 🗳️ Funcționalități Sociale

- **Votare** - Sistem de rating 1-5 stele
- **Comentarii** - Discuții în stil forum retro
- **Vizualizări** - Counter pentru popularitate
- **Top votat** - Clasament al ideilor

## 📜 Licență

MIT License - vezi fișierul [LICENSE](LICENSE)

## 🤝 Contribuții

Contribuțiile sunt binevenite! Deschide un Issue sau Pull Request.

---

```
═══════════════════════════════════════════════════════════════
FASTTXT ▌ Version 10.0 │ Time capsule initialized │ ©2025
═══════════════════════════════════════════════════════════════
```
