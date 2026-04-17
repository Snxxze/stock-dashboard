# 📊 Stock Dashboard — Project Architecture

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | **Next.js 15 (App Router)** | SSR/SSG, API Routes, Vercel-native |
| Language | **TypeScript** | Type safety, better DX |
| Styling | **Vanilla CSS + CSS Modules** | Full control, no dependencies |
| Charts | **Recharts** | React-native charting, lightweight |
| Server State | **TanStack Query v5** | Caching, auto-refetch, retry, dedup |
| Stock API | **Yahoo Finance (via `yahoo-finance2`)** | Free, reliable, no API key needed |
| Deployment | **Vercel** | Zero-config for Next.js |

---

## 📁 Folder Structure

```
stock-dashboard/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (providers, fonts, metadata)
│   │   ├── page.tsx                # Home page (dashboard)
│   │   ├── globals.css             # Global styles + design tokens
│   │   └── api/
│   │       └── stock/
│   │           └── route.ts        # GET /api/stock?symbol=AAPL&range=1d
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.tsx       # Main dashboard layout
│   │   │   └── Dashboard.module.css
│   │   ├── StockChart/
│   │   │   ├── StockChart.tsx      # Recharts area/line chart
│   │   │   └── StockChart.module.css
│   │   ├── StockSearch/
│   │   │   ├── StockSearch.tsx     # Search input with debounce
│   │   │   └── StockSearch.module.css
│   │   ├── TimeframeSelector/
│   │   │   ├── TimeframeSelector.tsx
│   │   │   └── TimeframeSelector.module.css
│   │   ├── StockCard/
│   │   │   ├── StockCard.tsx       # Price summary card
│   │   │   └── StockCard.module.css
│   │   ├── Skeleton/
│   │   │   ├── Skeleton.tsx        # Loading skeleton
│   │   │   └── Skeleton.module.css
│   │   └── ErrorBoundary/
│   │       ├── ErrorState.tsx      # Error UI with retry
│   │       └── ErrorState.module.css
│   ├── hooks/
│   │   ├── useStockData.ts         # TanStack Query hook for stock data
│   │   ├── useDebounce.ts          # Debounce hook
│   │   └── useAutoRefresh.ts       # Auto-refresh interval hook
│   ├── lib/
│   │   ├── fetchStock.ts           # API fetcher function
│   │   └── formatters.ts           # Price/date formatting utilities
│   ├── providers/
│   │   └── QueryProvider.tsx       # TanStack QueryClientProvider
│   └── types/
│       └── stock.ts                # TypeScript interfaces
├── next.config.ts
├── tsconfig.json
├── package.json
├── vercel.json                     # Optional Vercel config
└── README.md
```

---

## 🔑 Key Features Breakdown

### 1. Stock Search (Debounced)
```
User types → useDebounce(300ms) → triggers TanStack Query fetch
```
- Autocomplete suggestions from Yahoo Finance symbol lookup
- Default watchlist: `AAPL`, `TSLA`, `GOOGL`, `MSFT`, `AMZN`

### 2. Interactive Chart (Recharts)
- **Area chart** with gradient fill
- Tooltips showing price + volume
- Responsive container
- Smooth animations on data change

### 3. Timeframe Selector
| Button | Yahoo Range | Interval |
|--------|------------|----------|
| 1D | `1d` | `5m` |
| 1W | `5d` | `30m` |
| 1M | `1mo` | `1d` |
| 3M | `3mo` | `1d` |
| 1Y | `1y` | `1wk` |

### 4. Auto Refresh
- Polls every **30 seconds** during market hours
- Uses `refetchInterval` from TanStack Query
- Visual indicator showing "Last updated: X seconds ago"

### 5. Loading State
- **Skeleton placeholders** for chart + cards
- Shimmer animation effect
- Prevents layout shift (CLS)

### 6. Error State
- Friendly error message with icon
- "Retry" button triggers `refetch()`
- Handles: network error, invalid symbol, rate limit

### 7. Caching Strategy (TanStack Query)
```typescript
{
  staleTime: 30_000,        // 30s — data is "fresh"
  gcTime: 5 * 60_000,       // 5min — garbage collect
  refetchInterval: 30_000,  // auto-refresh every 30s
  retry: 3,                 // retry failed requests 3x
  refetchOnWindowFocus: true // refetch when tab regains focus
}
```

---

## 🔌 API Design

### `GET /api/stock`

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `symbol` | string | `AAPL` | Stock ticker symbol |
| `range` | string | `1d` | Time range (`1d`, `5d`, `1mo`, `3mo`, `1y`) |

**Response:**
```json
{
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "price": 178.52,
  "change": 2.34,
  "changePercent": 1.33,
  "high": 179.10,
  "low": 175.80,
  "volume": 52340000,
  "chart": [
    { "timestamp": 1713369600, "open": 176.2, "close": 177.5, "high": 178.0, "low": 175.9, "volume": 1200000 }
  ]
}
```

---

## 🎨 Design System

### Color Palette (Dark Theme)
```css
:root {
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --bg-card: #1a1a2e;
  --bg-card-hover: #22223a;
  --accent-green: #00d47e;
  --accent-red: #ff4757;
  --accent-blue: #4f8aff;
  --text-primary: #e8e8ef;
  --text-secondary: #8888a0;
  --border-color: rgba(255, 255, 255, 0.06);
  --glass-bg: rgba(26, 26, 46, 0.7);
  --glass-border: rgba(255, 255, 255, 0.08);
}
```

### Typography
- **Font**: `Inter` (Google Fonts)
- Headings: 600 weight
- Body: 400 weight
- Monospace numbers: `tabular-nums`

---

## 🚀 Deployment (Vercel)

### Steps
1. Push to GitHub
2. Connect repo on [vercel.com](https://vercel.com)
3. Auto-detected as Next.js → zero config needed
4. Deploy!

### Environment Variables
No env vars needed — Yahoo Finance API is public.

### `vercel.json` (Optional)
```json
{
  "regions": ["sin1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "s-maxage=30, stale-while-revalidate=60" }
      ]
    }
  ]
}
```

---

## 📋 Implementation Order

1. ✅ Initialize Next.js 15 project with TypeScript
2. ✅ Set up design system (`globals.css`)
3. ✅ Create API route (`/api/stock`)
4. ✅ Set up TanStack Query provider
5. ✅ Build `useStockData` hook with caching
6. ✅ Build `useDebounce` hook
7. ✅ Build `StockChart` component (Recharts)
8. ✅ Build `StockSearch` with debounce
9. ✅ Build `TimeframeSelector`
10. ✅ Build `StockCard` with price info
11. ✅ Add loading skeletons
12. ✅ Add error states with retry
13. ✅ Add auto-refresh with indicator
14. ✅ Assemble `Dashboard`
15. ✅ Final polish + deploy to Vercel
