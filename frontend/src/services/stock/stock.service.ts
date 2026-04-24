import YahooFinance from "yahoo-finance2";
import type { Timeframe, StockData } from "@/features/stock/types";

// สร้าง instance ใหม่ตามที่ library แนะนำ
const yf = new YahooFinance();

const cache = new Map<string, { data: StockData; timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // เก็บไว้ 60 วินาที

function resolveTimeframe(timeframe: Timeframe) {
  const now = new Date();
  const period1 = new Date();
  let interval: "5m" | "30m" | "1d" | "1wk";

  switch (timeframe) {
    case "1D": interval = "5m"; period1.setDate(now.getDate() - 1); break;
    case "1W": interval = "30m"; period1.setDate(now.getDate() - 7); break;
    case "1M": interval = "1d"; period1.setDate(now.getDate() - 30); break;
    case "3M": interval = "1d"; period1.setDate(now.getDate() - 90); break;
    case "1Y": interval = "1wk"; period1.setFullYear(now.getFullYear() - 1); break;
    default: throw new Error("INVALID_TIMEFRAME");
  }

  return { interval, period1 };
}

export async function getStockData(
  symbol: string,
  timeframe: Timeframe
): Promise<StockData> {
  const cacheKey = `${symbol}-${timeframe}`;
  const cached = cache.get(cacheKey);

  // ถ้ามีใน Cache และยังไม่หมดอายุ -> ส่งคืนทันที
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  if (!/^[A-Za-z0-9.\-\^=]+$/.test(symbol)) {
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

    const data: StockData = {
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

    // เก็บลง Cache ก่อนส่งกลับ
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;

  } catch (err) {
    console.error("Yahoo Finance Error:", err);
    throw new Error("YAHOO_API_ERROR");
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลแบบหลายตัวพร้อมกัน จะได้ลดการดึงหลาย request
export async function getBatchStockData(
  symbols: string[],
  timeframe: Timeframe
): Promise<Record<string, StockData>> {
  const results: Record<string, StockData> = {};

  await Promise.all(
    symbols.map(async (symbol) => {
      try {
        results[symbol] = await getStockData(symbol, timeframe);
      } catch (err) {
        console.error(`Batch fetch failed for ${symbol}`);
      }
    })
  );

  return results;
}

// ฟังก์ชันสำหรับดึงหุ้นที่กำลังมาแรง 4 ตัวแรกในตลาดอเมริกา
export async function getTrendingStocks() {
  try {
    const trending = await yf.trendingSymbols("US");

    // ดึง 10 ตัวแรก สำหรับทำ Carousel
    const symbols = trending.quotes.slice(0, 10).map(q => q.symbol);
    return await getBatchStockData(symbols, "1D");

  } catch (err) {
    console.error("Trending Error:", err);
    return {};
  }
}

// ฟังก์ชันสำหรับดึงข่าวการลงทุน
export async function getMarketNews() {
  try {
    const queries = ["S&P 500", "Nasdaq", "Dow Jones"];

    const results = await Promise.all(
      queries.map((q) =>
        yf.search(q, { newsCount: 10 }).catch((err) => {
          console.error(`Fetch news failed for ${q}:`, err.message);
          return { news: [] };
        })
      )
    );

    const merged = results.flatMap((r) => r.news || []);

    const unique = Array.from(
      new Map(merged.map((n) => [n.link, n])).values()
    );

    const sorted = unique.sort((a, b) => {
      const timeA = a.providerPublishTime ? new Date(a.providerPublishTime).getTime() : 0;
      const timeB = b.providerPublishTime ? new Date(b.providerPublishTime).getTime() : 0;
      return timeB - timeA;
    });

    return sorted.slice(0, 10).map((n) => ({
      title: n.title,
      url: n.link,
      source: n.publisher,
      time: n.providerPublishTime,
      image:
        n.thumbnail?.resolutions?.[0]?.url ||
        n.thumbnail?.resolutions?.[1]?.url ||
        null,
    }));
  } catch (err) {
    console.error("Yahoo news error:", err);
    return [];
  }
}
