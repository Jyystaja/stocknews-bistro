import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const FeaturedArticle = () => {
  const { data: featuredArticle } = useQuery({
    queryKey: ["featured-article"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (error) return null;
      return data;
    },
  });

  if (!featuredArticle) return null;

  return (
    <Link to={`/article/${featuredArticle.id}`}>
      <Card className="relative overflow-hidden hover-lift">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0 z-10" />
        <img
          src={featuredArticle.image_url || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"}
          alt={featuredArticle.title}
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
          <p className="text-sm font-medium mb-2">Featured</p>
          <h2 className="text-2xl font-bold mb-2">{featuredArticle.title}</h2>
          <p className="text-sm opacity-90">{featuredArticle.content.substring(0, 120)}...</p>
        </div>
      </Card>
    </Link>
  );
};

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

const NewsGrid = () => {
  const { data: articles } = useQuery({
    queryKey: ["latest-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles?.map((article) => (
        <Link key={article.id} to={`/article/${article.id}`}>
          <Card className="overflow-hidden hover-lift h-full">
            <img
              src={article.image_url || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
            <CardHeader>
              <CardTitle className="line-clamp-2">{article.title}</CardTitle>
              <CardDescription className="line-clamp-3">
                {article.content}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
};

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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Latest News</h2>
          <Link to="/browse">
            <Button variant="outline">Browse All Articles</Button>
          </Link>
        </div>
        <NewsGrid />
      </div>
    </div>
  );
};

export default Index;
