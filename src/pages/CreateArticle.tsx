import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";
import { Plus, X, Image as ImageIcon } from "lucide-react";

export default function CreateArticle() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [relatedStocks, setRelatedStocks] = useState<string[]>([]);
  const [newStock, setNewStock] = useState("");
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const inlineImageInputRef = useRef<HTMLInputElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;
    
    try {
      setIsLoading(true);
      const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('article-images')
        .getPublicUrl(filePath);

      // Insert image URL at cursor position
      const textarea = contentRef.current;
      if (textarea) {
        const cursorPosition = textarea.selectionStart;
        const textBefore = content.substring(0, cursorPosition);
        const textAfter = content.substring(cursorPosition);
        const imageMarkdown = `\n![${file.name}](${publicUrl})\n`;
        
        setContent(textBefore + imageMarkdown + textAfter);
        
        // Reset file input
        if (inlineImageInputRef.current) {
          inlineImageInputRef.current.value = '';
        }
      }

      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      toast.error("Failed to upload image: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addStock = () => {
    if (newStock && !relatedStocks.includes(newStock.toUpperCase())) {
      setRelatedStocks([...relatedStocks, newStock.toUpperCase()]);
      setNewStock("");
    }
  };

  const removeStock = (stock: string) => {
    setRelatedStocks(relatedStocks.filter((s) => s !== stock));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsLoading(true);

      let imageUrl = null;
      if (image) {
        const fileExt = image.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('article-images')
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('article-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { data: article, error: articleError } = await supabase
        .from('articles')
        .insert({
          title,
          content,
          image_url: imageUrl,
          author_id: user.id,
        })
        .select()
        .single();

      if (articleError) throw articleError;

      if (relatedStocks.length > 0) {
        const { error: stocksError } = await supabase
          .from('article_stocks')
          .insert(
            relatedStocks.map(symbol => ({
              article_id: article.id,
              symbol,
            }))
          );

        if (stocksError) throw stocksError;
      }

      toast.success("Article created successfully!");
      navigate(`/article/${article.id}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Article</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter article title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <div className="relative">
            <Textarea
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Write your article content"
              className="min-h-[200px]"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute right-2 bottom-2"
              onClick={() => inlineImageInputRef.current?.click()}
              disabled={isLoading}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <input
              ref={inlineImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleInlineImageUpload}
              className="hidden"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Hero Image</label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="cursor-pointer"
            ref={heroImageInputRef}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Related Stocks</label>
          <div className="flex gap-2">
            <Input
              value={newStock}
              onChange={(e) => setNewStock(e.target.value.toUpperCase())}
              placeholder="Enter stock symbol (e.g., AAPL)"
              className="flex-1"
            />
            <Button type="button" onClick={addStock} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {relatedStocks.map((stock) => (
              <div
                key={stock}
                className="flex items-center gap-1 bg-accent px-2 py-1 rounded"
              >
                <span>{stock}</span>
                <button
                  type="button"
                  onClick={() => removeStock(stock)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Article"}
        </Button>
      </form>
    </div>
  );
}