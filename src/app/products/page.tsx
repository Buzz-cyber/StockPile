"use client";

import * as React from "react";
import { Plus, Search, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductDialog } from "@/components/stockpile/product-dialog";
import { ProductTable } from "@/components/stockpile/product-table";
import { useProducts } from "@/hooks/use-products";
import type { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPage() {
  const {
    products,
    addProduct,
    editProduct,
    updateStock,
    deleteProduct,
    isLoading,
  } = useProducts();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [productToEdit, setProductToEdit] = React.useState<Product | null>(
    null
  );
  const [recentlyUpdated, setRecentlyUpdated] = React.useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredProducts = React.useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleOpenDialog = (product?: Product) => {
    setProductToEdit(product || null);
    setIsDialogOpen(true);
  };

  const handleSaveProduct = (productData: Product) => {
    if (productToEdit) {
      editProduct(productData);
    } else {
      const newProduct = {
        ...productData,
        id: new Date().toISOString(),
        price: productData.price || 0,
      };
      addProduct(newProduct);
    }
    setIsDialogOpen(false);
    setProductToEdit(null);
  };

  const handleUpdateStock = (productId: string, change: number) => {
    updateStock(productId, change);
    setRecentlyUpdated(productId);
    setTimeout(() => setRecentlyUpdated(null), 1500);
  };

  return (
    <div className="space-y-10">
      <header className="space-y-8 text-center">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-6xl font-black gradient-text mb-4 tracking-tight">
              Grocery Inventory
            </h1>
            <p className="text-gray-600 text-xl font-medium">Manage your fresh groceries with style</p>
            <div className="w-40 h-1 bg-gradient-to-r from-emerald-500 to-green-500 mx-auto mt-4 rounded-full"></div>
          </div>
          <Button 
            onClick={() => handleOpenDialog()} 
            className="modern-button text-lg"
          >
            <Plus className="mr-3 h-6 w-6" />
            Add Grocery Item
          </Button>
        </div>
        
        <div className="flex items-center gap-6 max-w-lg mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500 h-5 w-5" />
            <Input
              placeholder="Search grocery items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-4 premium-input text-lg font-medium"
            />
          </div>
          <Button variant="outline" className="rounded-2xl border-emerald-200 bg-white/80 backdrop-blur-sm hover:bg-emerald-50 hover:border-emerald-300 shadow-lg hover:shadow-xl transition-all duration-300 p-4">
            <Filter className="h-5 w-5 text-emerald-600" />
          </Button>
        </div>
      </header>
      
      <main>
        {isLoading ? (
          <div className="grocery-card rounded-3xl p-12 space-y-6">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        ) : (
          <ProductTable
            products={filteredProducts}
            onEdit={handleOpenDialog}
            onDelete={deleteProduct}
            onUpdateStock={handleUpdateStock}
            recentlyUpdated={recentlyUpdated}
          />
        )}
      </main>

      <ProductDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
      />
    </div>
  );
}
          Products
        </h1>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </header>
      <main>
        {isLoading ? (
          <div className="w-full space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <ProductTable
            products={products}
            onEdit={handleOpenDialog}
            onDelete={deleteProduct}
            onUpdateStock={handleUpdateStock}
            recentlyUpdated={recentlyUpdated}
          />
        )}
      </main>

      <ProductDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
      />
    </div>
  );
}
