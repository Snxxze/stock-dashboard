// Format ราคา
export function formatPrice(price: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}

// Format Volume
export function formatVolume(volume: number): string {
  if (volume >= 1_000_000_000) return (volume / 1_000_000_000).toFixed(1) + "B";
  if (volume >= 1_000_000) return (volume / 1_000_000).toFixed(1) + "M";
  if (volume >= 1_000) return (volume / 1_000).toFixed(1) + "K";
  return volume.toString();
}

// Format เปลี่ยนแปลงราคา
export function formatChange(change: number, changePercent: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
}

// Format timestamp
export function formatChartDate(timestamp: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}
