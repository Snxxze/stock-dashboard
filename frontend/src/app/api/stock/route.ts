import { NextResponse } from "next/server";
import { getStockData, getBatchStockData } from "@/services/stock/stock.service";
import { Timeframe } from "@/features/stock/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const symbol = searchParams.get("symbol");
  const symbolsRaw = searchParams.get("symbols");
  const timeframe = (searchParams.get("timeframe") || "1D") as Timeframe;

  try {
    // à¸à¸£à¸“à¸µà¸—à¸µà¹ˆà¸‚à¸­à¸¡à¸²à¸«à¸¥à¸²à¸¢à¸•à¸±à¸§
    if (symbolsRaw) {
      const symbols = symbolsRaw.split(",").map(s => s.trim().toUpperCase());
      const data = await getBatchStockData(symbols, timeframe);
      return NextResponse.json(data, {
        headers: { "Cache-Control": "s-maxage=10, stale-while-revalidate=30" },
      });
    }

    // à¸à¸£à¸“à¸µà¸—à¸µà¹ˆà¸‚à¸­à¸¡à¸²à¸•à¸±à¸§à¹€à¸”à¸µà¸¢à¸§
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
