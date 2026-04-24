import { NextResponse } from "next/server";
import { getMarketNews } from "@/services/stock/stock.service";

export async function GET(request: Request) {
  try {
    const data = await getMarketNews();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" },
    });
    
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
