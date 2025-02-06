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
          <p className="text-sm font-medium mb-2">Pääartikkeli</p>
          <h2 className="text-2xl font-bold mb-2">{featuredArticle.title}</h2>
          <p className="text-sm opacity-90">
            {featuredArticle.description || "Ei kuvausta saatavilla"}
          </p>
        </div>
      </Card>
    </Link>
  );
};

const StockTicker = () => {
  const { data: stocks, isLoading } = useQuery({
    queryKey: ["stock-prices"],
    queryFn: async () => {
      const symbols = ["AAPL", "GOOGL", "MSFT", "AMZN"];
      const { data, error } = await supabase.functions.invoke('get-stock-prices', {
        body: { symbols }
      });
      
      if (error) {
        console.error('Error fetching stock prices:', error);
        throw error;
      }
      
      return data;
    },
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <div className="flex gap-4 py-4 overflow-x-auto scrollbar-hide">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="flex-shrink-0 animate-pulse">
            <CardContent className="flex items-center gap-4 p-4 w-48 h-20">
              <div className="bg-gray-200 w-full h-full rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 py-4 overflow-x-auto scrollbar-hide">
      {(stocks || []).map((stock) => (
        <Card key={stock.symbol} className="flex-shrink-0 hover-lift">
          <CardContent className="flex items-center gap-4 p-4">
            <div>
              <p className="font-bold">{stock.symbol}</p>
              <p className="text-sm">${stock.price}</p>
            </div>
            <div className="flex flex-col gap-1">
              <div className={Number(stock.change) >= 0 ? "text-stock-up flex items-center gap-1" : "text-stock-down flex items-center gap-1"}>
                {Number(stock.change) >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                <span className="text-sm">{stock.change}% (1d)</span>
              </div>
              <div className={Number(stock.fiveDayChange) >= 0 ? "text-stock-up flex items-center gap-1" : "text-stock-down flex items-center gap-1"}>
                {Number(stock.fiveDayChange) >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                <span className="text-sm">{stock.fiveDayChange}% (5d)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

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
                {article.description || "Ei kuvausta saatavilla"}
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
          <h2 className="text-xl font-bold">Markkinoiden liikkujat</h2>
        </div>
        <StockTicker />
      </div>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Viimeisimmät uutiset</h2>
          <Link to="/browse">
            <Button variant="outline">Selaa kaikkia artikkeleita</Button>
          </Link>
        </div>
        <NewsGrid />
      </div>
    </div>
  );
};

export default Index;