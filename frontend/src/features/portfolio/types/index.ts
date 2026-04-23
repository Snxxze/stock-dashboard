// ข้อมูลหุ้นใน Portfolio ของ user
export interface PortfolioItem {
  symbol: string;
  shares: number;       
  avgCost: number;      
  addedAt: number;      
}

// ข้อมูลสรุป Portfolio
export interface PortfolioSummary {
  totalInvested: number;
  totalValue: number;
  totalReturn: number;
  totalReturnPercent: number;
}

// ข้อมูล Watchlist item
export interface WatchlistItem {
  symbol: string;
  addedAt: number;
}

// User preferences
export interface UserPreferences {
  defaultTimeframe: "1D" | "1W" | "1M" | "3M" | "1Y";
  theme: "light" | "dark";
}
