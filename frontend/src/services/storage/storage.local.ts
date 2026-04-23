import type { PortfolioItem, WatchlistItem, UserPreferences } from "@/features/portfolio/types";
import {
  IStorageService,
  DEFAULT_PORTFOLIO,
  DEFAULT_WATCHLIST,
  DEFAULT_PREFERENCES,
} from "./storage.service";

// ============================================================
// LocalStorage Adapter
// ตอนนี้ใช้ตัวนี้ — เก็บข้อมูลใน browser
// อนาคตสร้าง BackendAdapter implement IStorageService แทน
// ============================================================

const KEYS = {
  PORTFOLIO: "stock_dashboard_portfolio",
  WATCHLIST: "stock_dashboard_watchlist",
  PREFERENCES: "stock_dashboard_preferences",
} as const;

// Helper: อ่าน/เขียน localStorage อย่างปลอดภัย
function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

// Implementation
export class LocalStorageAdapter implements IStorageService {

  // Portfolio
  async getPortfolio(): Promise<PortfolioItem[]> {
    return readStorage(KEYS.PORTFOLIO, DEFAULT_PORTFOLIO);
  }

  async addToPortfolio(item: PortfolioItem): Promise<void> {
    const portfolio = await this.getPortfolio();
    const exists = portfolio.find((p) => p.symbol === item.symbol);

    if (exists) {
      // ถ้ามีอยู่แล้ว → รวม shares + คำนวณ avgCost ใหม่
      const totalShares = exists.shares + item.shares;
      const totalCost = exists.shares * exists.avgCost + item.shares * item.avgCost;
      exists.shares = totalShares;
      exists.avgCost = totalCost / totalShares;
    } else {
      portfolio.push(item);
    }

    writeStorage(KEYS.PORTFOLIO, portfolio);
  }

  async updatePortfolioItem(symbol: string, updates: Partial<PortfolioItem>): Promise<void> {
    const portfolio = await this.getPortfolio();
    const index = portfolio.findIndex((p) => p.symbol === symbol);

    if (index !== -1) {
      portfolio[index] = { ...portfolio[index], ...updates };
      writeStorage(KEYS.PORTFOLIO, portfolio);
    }
  }

  async removeFromPortfolio(symbol: string): Promise<void> {
    const portfolio = await this.getPortfolio();
    writeStorage(
      KEYS.PORTFOLIO,
      portfolio.filter((p) => p.symbol !== symbol),
    );
  }

  // Watchlist
  async getWatchlist(): Promise<WatchlistItem[]> {
    return readStorage(KEYS.WATCHLIST, DEFAULT_WATCHLIST);
  }

  async addToWatchlist(symbol: string): Promise<void> {
    const watchlist = await this.getWatchlist();
    if (watchlist.some((w) => w.symbol === symbol)) return; // ซ้ำ → ไม่เพิ่ม

    watchlist.push({ symbol, addedAt: Date.now() });
    writeStorage(KEYS.WATCHLIST, watchlist);
  }

  async removeFromWatchlist(symbol: string): Promise<void> {
    const watchlist = await this.getWatchlist();
    writeStorage(
      KEYS.WATCHLIST,
      watchlist.filter((w) => w.symbol !== symbol),
    );
  }

  async isInWatchlist(symbol: string): Promise<boolean> {
    const watchlist = await this.getWatchlist();
    return watchlist.some((w) => w.symbol === symbol);
  }

  // Preferences
  async getPreferences(): Promise<UserPreferences> {
    return readStorage(KEYS.PREFERENCES, DEFAULT_PREFERENCES);
  }

  async updatePreferences(prefs: Partial<UserPreferences>): Promise<void> {
    const current = await this.getPreferences();
    writeStorage(KEYS.PREFERENCES, { ...current, ...prefs });
  }
}

