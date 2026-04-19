import { NextResponse } from "next/server";
import { getStockData, getBatchStockData } from "@/lib/stock.service";
import { Timeframe } from "@/types/stock";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const symbol = searchParams.get("symbol");
  const symbolsRaw = searchParams.get("symbols");
  const timeframe = (searchParams.get("timeframe") || "1D") as Timeframe;

  try {
    // กรณีที่ขอมาหลายตัว
    if (symbolsRaw) {
      const symbols = symbolsRaw.split(",").map(s => s.trim().toUpperCase());
      const data = await getBatchStockData(symbols, timeframe);
      return NextResponse.json(data, {
        headers: { "Cache-Control": "s-maxage=10, stale-while-revalidate=30" },
      });
    }

    // กรณีที่ขอมาตัวเดียว
    const data = await getStockData(symbol || "AAPL", timeframe);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=10, stale-while-revalidate=30",
      },
    });

  } catch (error: any) {
    console.error(error);

    if (error.message === "INVALID_SYMBOL") {
      return NextResponse.json(
        { error: "Invalid symbol" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}