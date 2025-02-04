
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Article = () => {
  const { id } = useParams();

  // Mock article data
  const article = {
    title: "Major Tech Stocks See Unprecedented Growth",
    date: "March 14, 2024",
    author: "Sarah Johnson",
    content: `The technology sector witnessed remarkable growth today as major tech stocks surged to new heights. Market analysts attribute this rise to several factors, including positive earnings reports and increased consumer confidence.

    Leading the charge was Apple Inc., whose shares climbed 3.2% following announcements of new product launches. Similarly, Microsoft and Amazon saw significant gains, pushing the NASDAQ to record levels.

    Industry experts suggest this trend might continue as digital transformation accelerates across various sectors. However, some analysts urge caution, pointing to potential market volatility and macroeconomic factors that could impact future performance.`,
    relatedStocks: [
      { symbol: "AAPL", price: "182.52", change: "+3.2" },
      { symbol: "MSFT", price: "378.85", change: "+2.1" },
      { symbol: "AMZN", price: "155.32", change: "+1.8" },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="relative h-[400px] mb-8 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0" />
        <img
          src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
          alt="Article hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <div className="flex items-center gap-4">
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.author}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div className="prose max-w-none">
          <p className="text-lg leading-relaxed whitespace-pre-line">
            {article.content}
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Related Stocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {article.relatedStocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between p-2 hover:bg-accent rounded-lg"
                  >
                    <div>
                      <p className="font-bold">{stock.symbol}</p>
                      <p className="text-sm">${stock.price}</p>
                    </div>
                    <div
                      className={
                        stock.change.startsWith("+")
                          ? "text-stock-up"
                          : "text-stock-down"
                      }
                    >
                      {stock.change.startsWith("+") ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                      <span className="text-sm">{stock.change}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Article;
