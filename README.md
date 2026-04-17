# 📈 Stock Dashboard

A real-time stock market dashboard built with **Next.js 15**, **TypeScript**, **TanStack Query**, and **Recharts**.

> ⚠️ Data is sourced from Yahoo Finance (free tier) — prices may have a 15–20 minute delay.

## ✨ Features

- 🔍 **Stock Search** — Search any stock by ticker symbol (e.g. AAPL, TSLA)
- 📊 **Interactive Chart** — Area chart with selectable timeframes (1D / 1W / 1M / 3M / 1Y)
- 💼 **Portfolio Cards** — Overview of selected portfolio stocks with price and return
- 👁️ **Watchlist** — Track multiple stocks side-by-side with live prices
- ⚡ **Auto-refresh** — Data refetches automatically (every 5 min for intraday, 1 hr for longer periods)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Data Fetching | TanStack Query v5 |
| Chart | Recharts |
| Data Source | yahoo-finance2 |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| UI Components | shadcn/ui |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/stock/route.ts    # API Route — fetches stock data
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main dashboard page
├── components/
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── StockCard.tsx         # Stock info + timeframe selector
│   ├── StockChart.tsx        # Recharts area chart
│   ├── PortfolioCards.tsx    # Portfolio overview cards
│   └── Watchlist.tsx         # Watchlist panel
├── hooks/
│   └── useStockData.ts       # TanStack Query custom hook
├── lib/
│   ├── stock.service.ts      # Yahoo Finance service layer
│   └── formatters.ts         # Price/date formatting utilities
├── providers/
│   └── QueryProvider.tsx     # TanStack Query client provider
└── types/
    └── stock.ts              # TypeScript interfaces
```

## 📡 API

```
GET /api/stock?symbol=AAPL&timeframe=1D
```

| Parameter | Type | Options |
|-----------|------|---------|
| `symbol` | string | Any valid ticker (AAPL, TSLA, GOOGL...) |
| `timeframe` | string | `1D` `1W` `1M` `3M` `1Y` |

## 🌐 Deploy

Deployed on **Vercel** — [View Live](#)
