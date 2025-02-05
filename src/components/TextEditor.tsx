import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bold, Italic, Type, Image as ImageIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TextEditorProps {
  content: string;
  onChange: (value: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
}

export const TextEditor = ({ content, onChange, onImageUpload, isLoading }: TextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const insertFormat = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      default:
        return;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    onChange(newContent);
    
    // Reset selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, end + 4);
    }, 0);
  };

  const handleFontSize = (size: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const formattedText = `<span style="font-size: ${size}px">${selectedText}</span>`;

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    onChange(newContent);
  };

  const handleColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const formattedText = `<span style="color: ${e.target.value}">${selectedText}</span>`;

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    onChange(newContent);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 p-2 border rounded-lg bg-background">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => insertFormat('bold')}
          className="h-8 w-8"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => insertFormat('italic')}
          className="h-8 w-8"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Select onValueChange={handleFontSize}>
          <SelectTrigger className="w-[100px] h-8">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12">Small</SelectItem>
            <SelectItem value="16">Normal</SelectItem>
            <SelectItem value="20">Large</SelectItem>
            <SelectItem value="24">XLarge</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="color"
          onChange={handleColor}
          className="w-8 h-8 p-1"
          title="Text color"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => imageInputRef.current?.click()}
          disabled={isLoading}
          className="h-8 w-8"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[400px] p-4 rounded-lg border bg-background resize-y"
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        className="hidden"
      />
    </div>
  );
};