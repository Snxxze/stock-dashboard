import { NextResponse } from "next/server";
import { getStockData } from "@/lib/stock.service";
import { Timeframe } from "@/types/stock";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const symbol = searchParams.get("symbol") || "AAPL";
  const timeframe = (searchParams.get("timeframe") || "1D") as Timeframe;

  try {
    const data = await getStockData(symbol, timeframe);

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