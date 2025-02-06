import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, ArrowUp, ArrowDown, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { TextEditor } from "@/components/TextEditor";

const Article = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stockPrices, setStockPrices] = useState<Record<string, { price: string; change: string }>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);

  const { data: article, isLoading: queryLoading } = useQuery({
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
          description: editedDescription,
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Artikkeli päivitettiin onnistuneesti!");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error("Artikkelin päivittäminen epäonnistui: " + error.message);
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async () => {
      const { error: stocksError } = await supabase
        .from("article_stocks")
        .delete()
        .eq("article_id", id);

      if (stocksError) throw stocksError;

      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Artikkeli poistettiin onnistuneesti!");
      navigate("/browse");
    },
    onError: (error) => {
      toast.error("Artikkelin poistaminen epäonnistui: " + error.message);
    },
  });

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;
    
    try {
      setUploadLoading(true);
      const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('article-images')
        .getPublicUrl(filePath);

      const imageMarkdown = `\n![${file.name}](${publicUrl})\n`;
      setEditedContent(prev => prev + imageMarkdown);

      toast.success("Kuva ladattiin onnistuneesti!");
    } catch (error: any) {
      toast.error("Kuvan lataaminen epäonnistui: " + error.message);
    } finally {
      setUploadLoading(false);
    }
  };

  useEffect(() => {
    if (article) {
      setEditedTitle(article.title);
      setEditedContent(article.content);
      setEditedDescription(article.description || "");
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
        console.error('Virhe osakekurssien hakemisessa:', error);
      }
    };

    fetchStockPrices();
    const interval = setInterval(fetchStockPrices, 60000);
    return () => clearInterval(interval);
  }, [article]);

  if (queryLoading) {
    return <div>Ladataan...</div>;
  }

  if (!article) {
    return <div>Artikkelia ei löytynyt</div>;
  }

  const canEdit = user && article.author_id === user.id;

  const handleSave = () => {
    updateArticleMutation.mutate();
  };

  const handleDelete = () => {
    if (window.confirm("Oletko varma, että haluat poistaa tämän artikkelin?")) {
      deleteArticleMutation.mutate();
    }
  };

  // Function to convert markdown to HTML and preserve line breaks
  const formatContent = (content: string) => {
    // Convert markdown bold to HTML
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convert markdown italic to HTML
    content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Convert line breaks to <br /> tags
    content = content.replace(/\n/g, '<br />');
    return content;
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="relative h-[400px] mb-8 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0" />
        {article.image_url && (
          <img
            src={article.image_url}
            alt="Artikkelin pääkuva"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          {isEditing ? (
            <>
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-4xl font-bold mb-4 bg-white/10 border-white/20"
              />
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="bg-white/10 border-white/20"
                placeholder="Syötä artikkelin kuvaus"
              />
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
              {article.description && (
                <p className="text-lg opacity-90 mb-4">{article.description}</p>
              )}
            </>
          )}
          <div className="flex items-center gap-4">
            <span>{new Date(article.created_at).toLocaleDateString('fi-FI')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          {isEditing ? (
            <TextEditor
              content={editedContent}
              onChange={setEditedContent}
              onImageUpload={handleInlineImageUpload}
              isLoading={uploadLoading}
            />
          ) : (
            <div 
              className="article-content whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
            />
          )}
          <div className="mt-8 flex items-center gap-4">
            {canEdit && (
              isEditing ? (
                <>
                  <Button onClick={handleSave}>Tallenna</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Peruuta</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Muokkaa
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Poista
                  </Button>
                </>
              )
            )}
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Jaa
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Liittyvät osakkeet</CardTitle>
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
                        ${stockPrices[stock.symbol]?.price || "Ladataan..."}
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
