import type { PortfolioItem, WatchlistItem, UserPreferences } from "@/features/portfolio/types";

// Interface หลัก — ทุก adapter (localStorage, backend) ต้อง implement ตาม
// เมื่อมี backend → สร้าง class ใหม่ implement interface นี้ → swap ได้เลย
export interface IStorageService {
  // Portfolio
  getPortfolio(): Promise<PortfolioItem[]>;
  addToPortfolio(item: PortfolioItem): Promise<void>;
  updatePortfolioItem(symbol: string, updates: Partial<PortfolioItem>): Promise<void>;
  removeFromPortfolio(symbol: string): Promise<void>;

  // Watchlist
  getWatchlist(): Promise<WatchlistItem[]>;
  addToWatchlist(symbol: string): Promise<void>;
  removeFromWatchlist(symbol: string): Promise<void>;
  isInWatchlist(symbol: string): Promise<boolean>;

  // Preferences
  getPreferences(): Promise<UserPreferences>;
  updatePreferences(prefs: Partial<UserPreferences>): Promise<void>;
}

// Default values — ใช้ตอนที่ยังไม่มีข้อมูลจาก user
export const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  { symbol: "AAPL",  shares: 10, avgCost: 150.00, addedAt: Date.now() },
  { symbol: "META",  shares: 5,  avgCost: 320.00, addedAt: Date.now() },
  { symbol: "MSFT",  shares: 8,  avgCost: 380.00, addedAt: Date.now() },
  { symbol: "GOOGL", shares: 3,  avgCost: 140.00, addedAt: Date.now() },
];

export const DEFAULT_WATCHLIST: WatchlistItem[] = [
  { symbol: "AAPL",  addedAt: Date.now() },
  { symbol: "TSLA",  addedAt: Date.now() },
  { symbol: "GOOGL", addedAt: Date.now() },
  { symbol: "MSFT",  addedAt: Date.now() },
  { symbol: "AMZN",  addedAt: Date.now() },
];

export const DEFAULT_PREFERENCES: UserPreferences = {
  defaultTimeframe: "1D",
  theme: "light",
};

