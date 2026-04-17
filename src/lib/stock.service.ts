import YahooFinance from "yahoo-finance2";
import type { Timeframe, StockData } from "@/types/stock";

// สร้าง instance ใหม่ตามที่ library แนะนำ
const yf = new YahooFinance();

function resolveTimeframe(timeframe: Timeframe) {
  const now = new Date();
  const period1 = new Date();
  let interval: "5m" | "30m" | "1d" | "1wk";

  switch (timeframe) {
    case "1D": interval = "5m";  period1.setDate(now.getDate() - 1); break;
    case "1W": interval = "30m"; period1.setDate(now.getDate() - 7); break;
    case "1M": interval = "1d";  period1.setDate(now.getDate() - 30); break;
    case "3M": interval = "1d";  period1.setDate(now.getDate() - 90); break;
    case "1Y": interval = "1wk"; period1.setFullYear(now.getFullYear() - 1); break;
    default: throw new Error("INVALID_TIMEFRAME");
  }

  return { interval, period1 };
}

export async function getStockData(
  symbol: string,
  timeframe: Timeframe
): Promise<StockData> {
  if (!/^[A-Z0-9.\-]+$/.test(symbol)) {
    throw new Error("INVALID_SYMBOL");
  }

  const { interval, period1 } = resolveTimeframe(timeframe);

  try {
    // ใช้ yf instance แทน yahooFinance static method
    const [quote, chartResult] = await Promise.all([
      yf.quote(symbol),
      yf.chart(symbol, { period1, interval }),
    ]);

    const chart: StockData["chart"] = (chartResult.quotes ?? [])
      .filter((p) => p.open !== null && p.close !== null && p.date !== null)
      .map((p) => ({
        timestamp: p.date.getTime(),
        open: p.open!,
        close: p.close!,
        high: p.high!,
        low: p.low!,
        volume: p.volume!,
      }))
      .sort((a, b) => a.timestamp - b.timestamp);

    return {
      symbol: quote.symbol,
      name: quote.longName || quote.shortName || quote.symbol,
      price: quote.regularMarketPrice ?? 0,
      change: quote.regularMarketChange ?? 0,
      changePercent: quote.regularMarketChangePercent ?? 0,
      high: quote.regularMarketDayHigh ?? 0,
      low: quote.regularMarketDayLow ?? 0,
      volume: quote.regularMarketVolume ?? 0,
      currency: quote.currency ?? "USD",
      chart,
    };

  } catch (err) {
    console.error("Yahoo Finance Error:", err);
    throw new Error("YAHOO_API_ERROR");
  }
}
