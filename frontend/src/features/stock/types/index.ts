// สำหรับจุดบนกราฟ
export interface ChartDataPoint {
  timestamp: number;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}

// ข้อมูลหุ้นทั้งหมด
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  currency: string;
  chart: ChartDataPoint[];
}

// timeframe
export type Timeframe = "1D" | "1W" | "1M" | "3M" | "1Y";

// ข่าวสารตลาด
export interface MarketNewsItem {
  title: string;
  url: string;
  source: string;
  time: number; 
  image: string | null;
}