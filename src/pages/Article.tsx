import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const Article = () => {
  const { id } = useParams();
  const [stockPrices, setStockPrices] = useState<Record<string, { price: string; change: string }>>({});

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
      const { data: article, error } = await supabase
        .from("articles")
        .select(`
          *,
          article_stocks (
            symbol
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return article;
    },
  });

  useEffect(() => {
    const fetchStockPrices = async () => {
      if (!article?.article_stocks) return;

      // In a real app, you would use the TradingView API here
      // For now, we'll simulate real-time data
      const mockPrices: Record<string, { price: string; change: string }> = {};
      article.article_stocks.forEach((stock: { symbol: string }) => {
        mockPrices[stock.symbol] = {
          price: (Math.random() * 1000).toFixed(2),
          change: (Math.random() * 10 - 5).toFixed(2),
        };
      });
      setStockPrices(mockPrices);
    };

    fetchStockPrices();
    const interval = setInterval(fetchStockPrices, 5000);
    return () => clearInterval(interval);
  }, [article]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="relative h-[400px] mb-8 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0" />
        {article.image_url && (
          <img
            src={article.image_url}
            alt="Article hero"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <div className="flex items-center gap-4">
            <span>{new Date(article.created_at).toLocaleDateString()}</span>
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
                {article.article_stocks?.map((stock: { symbol: string }) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between p-2 hover:bg-accent rounded-lg"
                  >
                    <div>
                      <p className="font-bold">{stock.symbol}</p>
                      <p className="text-sm">
                        ${stockPrices[stock.symbol]?.price || "Loading..."}
                      </p>
                    </div>
                    <div
                      className={
                        (stockPrices[stock.symbol]?.change.startsWith("-")
                          ? "text-stock-down"
                          : "text-stock-up") + " flex flex-col items-end"
                      }
                    >
                      {stockPrices[stock.symbol]?.change.startsWith("-") ? (
                        <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ArrowUp className="h-4 w-4" />
                      )}
                      <span className="text-sm">
                        {stockPrices[stock.symbol]?.change || "0"}%
                      </span>
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