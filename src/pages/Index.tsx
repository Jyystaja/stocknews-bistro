
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react";

const FeaturedArticle = () => (
  <Card className="relative overflow-hidden hover-lift">
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0 z-10" />
    <img
      src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
      alt="Stock market"
      className="w-full h-[400px] object-cover"
    />
    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
      <p className="text-sm font-medium mb-2">Featured</p>
      <h2 className="text-2xl font-bold mb-2">Major Tech Stocks See Unprecedented Growth</h2>
      <p className="text-sm opacity-90">Analysis of the latest market trends and tech sector boom</p>
    </div>
  </Card>
);

const StockTicker = () => (
  <div className="flex gap-4 py-4 overflow-x-auto scrollbar-hide">
    {[
      { symbol: "AAPL", price: "182.52", change: "+1.25" },
      { symbol: "GOOGL", price: "141.80", change: "-0.45" },
      { symbol: "MSFT", price: "378.85", change: "+2.10" },
      { symbol: "AMZN", price: "155.32", change: "+0.78" },
    ].map((stock) => (
      <Card key={stock.symbol} className="flex-shrink-0 hover-lift">
        <CardContent className="flex items-center gap-4 p-4">
          <div>
            <p className="font-bold">{stock.symbol}</p>
            <p className="text-sm">${stock.price}</p>
          </div>
          <div className={stock.change.startsWith("+") ? "text-stock-up" : "text-stock-down"}>
            {stock.change.startsWith("+") ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            <span className="text-sm">{stock.change}%</span>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const NewsGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[
      {
        id: 1,
        title: "Fed's Latest Interest Rate Decision",
        description: "Impact on market dynamics and future outlook",
        category: "Economy",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
      },
      {
        id: 2,
        title: "Emerging Markets Show Promise",
        description: "Analysis of growing markets and opportunities",
        category: "Global Markets",
        image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f",
      },
      {
        id: 3,
        title: "Cryptocurrency Market Update",
        description: "Latest trends in digital assets",
        category: "Crypto",
        image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d",
      },
    ].map((article) => (
      <Link key={article.id} to={`/article/${article.id}`}>
        <Card className="overflow-hidden hover-lift">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-48 object-cover"
          />
          <CardHeader>
            <CardDescription>{article.category}</CardDescription>
            <CardTitle>{article.title}</CardTitle>
            <CardDescription>{article.description}</CardDescription>
          </CardHeader>
        </Card>
      </Link>
    ))}
  </div>
);

const Index = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <FeaturedArticle />
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-bold">Market Movers</h2>
        </div>
        <StockTicker />
      </div>
      <div>
        <h2 className="text-xl font-bold mb-6">Latest News</h2>
        <NewsGrid />
      </div>
    </div>
  );
};

export default Index;
