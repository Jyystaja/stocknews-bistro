
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowUp, ArrowDown, Search } from "lucide-react";

const StockPrices = () => {
  const stocks = [
    { symbol: "AAPL", name: "Apple Inc.", price: "182.52", change: "+1.25", volume: "62.5M" },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: "141.80", change: "-0.45", volume: "28.3M" },
    { symbol: "MSFT", name: "Microsoft Corporation", price: "378.85", change: "+2.10", volume: "45.1M" },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: "155.32", change: "+0.78", volume: "35.7M" },
    { symbol: "TSLA", name: "Tesla Inc.", price: "202.64", change: "-1.15", volume: "55.2M" },
    { symbol: "META", name: "Meta Platforms Inc.", price: "484.10", change: "+3.20", volume: "42.8M" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search stocks..."
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted">
                <tr>
                  <th className="px-6 py-3">Symbol</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Change</th>
                  <th className="px-6 py-3">Volume</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr
                    key={stock.symbol}
                    className="border-b hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">{stock.symbol}</td>
                    <td className="px-6 py-4">{stock.name}</td>
                    <td className="px-6 py-4">${stock.price}</td>
                    <td className="px-6 py-4">
                      <div
                        className={`flex items-center gap-1 ${
                          stock.change.startsWith("+")
                            ? "text-stock-up"
                            : "text-stock-down"
                        }`}
                      >
                        {stock.change.startsWith("+") ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                        {stock.change}%
                      </div>
                    </td>
                    <td className="px-6 py-4">{stock.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockPrices;
