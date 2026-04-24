import { NextResponse } from "next/server";
import { getTrendingStocks } from "@/services/stock/stock.service";

export async function GET() {
  try {
    const data = await getTrendingStocks();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" },
    });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    
  }
}
