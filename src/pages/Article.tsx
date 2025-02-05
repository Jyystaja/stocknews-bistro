import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, ArrowUp, ArrowDown, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import ReactMarkdown from 'react-markdown';

const Article = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stockPrices, setStockPrices] = useState<Record<string, { price: string; change: string }>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

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

  const updateArticleMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("articles")
        .update({
          title: editedTitle,
          content: editedContent,
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Article updated successfully!");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error("Failed to update article: " + error.message);
    },
  });

  useEffect(() => {
    if (article) {
      setEditedTitle(article.title);
      setEditedContent(article.content);
    }
  }, [article]);

  useEffect(() => {
    const fetchStockPrices = async () => {
      if (!article?.article_stocks?.length) return;

      try {
        const symbols = article.article_stocks.map((stock: { symbol: string }) => stock.symbol);
        const { data, error } = await supabase.functions.invoke('get-stock-prices', {
          body: { symbols }
        });

        if (error) throw error;

        const pricesMap: Record<string, { price: string; change: string }> = {};
        data.forEach((price: { symbol: string; price: string; change: string }) => {
          pricesMap[price.symbol] = {
            price: price.price,
            change: price.change,
          };
        });

        setStockPrices(pricesMap);
      } catch (error) {
        console.error('Error fetching stock prices:', error);
      }
    };

    fetchStockPrices();
    const interval = setInterval(fetchStockPrices, 60000);
    return () => clearInterval(interval);
  }, [article]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!article) {
    return <div>Article not found</div>;
  }

  const canEdit = user && article.author_id === user.id;

  const handleSave = () => {
    updateArticleMutation.mutate();
  };

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
          {isEditing ? (
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-4xl font-bold mb-4 bg-white/10 border-white/20"
            />
          ) : (
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          )}
          <div className="flex items-center gap-4">
            <span>{new Date(article.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          {isEditing ? (
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[400px]"
            />
          ) : (
            <ReactMarkdown 
              components={{
                img: ({ node, ...props }) => (
                  <img 
                    {...props} 
                    className="w-full rounded-lg my-4"
                    loading="lazy"
                  />
                ),
              }}
            >
              {article.content}
            </ReactMarkdown>
          )}
          <div className="mt-8 flex items-center gap-4">
            {canEdit && (
              isEditing ? (
                <>
                  <Button onClick={handleSave}>Save</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )
            )}
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
                        (parseFloat(stockPrices[stock.symbol]?.change || "0") < 0
                          ? "text-stock-down"
                          : "text-stock-up") + " flex flex-col items-end"
                      }
                    >
                      {parseFloat(stockPrices[stock.symbol]?.change || "0") < 0 ? (
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