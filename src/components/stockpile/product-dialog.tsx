"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Sparkles, Loader2, Upload } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { productSchema } from "./product-schema";
import type { Product } from "@/lib/types";
import { suggestProductCategory } from "@/ai/flows/suggest-product-category";
import { useToast } from "@/hooks/use-toast";

interface ProductDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (product: Product) => void;
  productToEdit: Product | null;
}

type ProductFormData = z.infer<typeof productSchema>;

export function ProductDialog({
  isOpen,
  onOpenChange,
  onSave,
  productToEdit,
}: ProductDialogProps) {
  const [isSuggesting, setIsSuggesting] = React.useState(false);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: "",
      name: "",
      category: "",
      quantity: 0,
      price: 0,
      image: "",
    },
  });

  React.useEffect(() => {
    if (productToEdit) {
      form.reset(productToEdit);
    } else {
      form.reset({
        id: "",
        name: "",
        category: "",
        quantity: 0,
        price: 0,
        image: `https://placehold.co/100x100.png`,
      });
    }
  }, [productToEdit, form, isOpen]);

  const handleSuggestCategory = async () => {
    const productName = form.getValues("name");
    if (!productName) {
      form.setError("name", {
        type: "manual",
        message: "Please enter a product name first.",
      });
      return;
    }
    setIsSuggesting(true);
    try {
      const result = await suggestProductCategory({ productName });
      if (result.categorySuggestion) {
        form.setValue("category", result.categorySuggestion, {
          shouldValidate: true,
        });
      }
    } catch (error) {
      console.error("AI suggestion failed", error);
      toast({
        title: "AI Suggestion Failed",
        description: "Could not suggest a category. Please enter one manually.",
        variant: "destructive",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("image", reader.result as string, {
          shouldValidate: true,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ProductFormData) => {
    const product: Product = {
      id: productToEdit?.id || new Date().toISOString(),
      ...data,
      image: data.image || `https://placehold.co/100x100.png`
    };
    onSave(product);
  };
  
  const imageUrl = form.watch("image");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] grocery-card border-emerald-200/50 rounded-3xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black gradient-text mb-2">
            {productToEdit ? "Edit Grocery Item" : "Add New Grocery Item"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-lg font-medium">
            {productToEdit
              ? "Update your fresh grocery item details."
              : "Add a new item to your grocery inventory."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {imageUrl && (
                 <div className="flex justify-center mb-8">
                    <Image
                        src={imageUrl}
                        alt="Product image"
                        width={150}
                        height={150}
                        className="rounded-3xl object-cover shadow-xl hover-lift border-4 border-emerald-100"
                        data-ai-hint="product image"
                    />
                </div>
            )}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold text-gray-800 uppercase tracking-wide">Product Image</FormLabel>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Input 
                        placeholder="e.g. https://example.com/fresh-apple.png" 
                        className="premium-input text-base font-medium"
                        {...field} 
                      />
                    </FormControl>
                     <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-2xl border-emerald-200 bg-white/80 hover:bg-emerald-50 hover:border-emerald-300 shadow-lg hover:shadow-xl transition-all duration-300 h-12 w-12"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Upload Image"
                    >
                      <Upload className="h-5 w-5 text-emerald-600" />
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold text-gray-800 uppercase tracking-wide">Product Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Fresh Organic Apples" 
                      className="premium-input text-base font-medium"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold text-gray-800 uppercase tracking-wide">Category</FormLabel>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Input 
                        placeholder="e.g. Fresh Produce" 
                        className="premium-input text-base font-medium"
                        {...field} 
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-2xl border-emerald-200 bg-gradient-to-r from-emerald-500/10 to-green-500/10 hover:from-emerald-500/20 hover:to-green-500/20 shadow-lg hover:shadow-xl transition-all duration-300 h-12 w-12"
                      onClick={handleSuggestCategory}
                      disabled={isSuggesting}
                      aria-label="Suggest Category"
                    >
                      {isSuggesting ? (
                        <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                      ) : (
                        <Sparkles className="h-5 w-5 text-emerald-600" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 uppercase tracking-wide">Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        className="premium-input text-base font-medium"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-800 uppercase tracking-wide">Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="premium-input text-base font-medium"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl border-emerald-200 bg-white/80 hover:bg-emerald-50 hover:border-emerald-300 shadow-lg hover:shadow-xl transition-all duration-300 font-bold text-base py-3 px-6"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="modern-button text-base">
                {productToEdit ? "Update Grocery Item" : "Save Grocery Item"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
