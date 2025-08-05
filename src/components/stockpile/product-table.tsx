"use client";

import * as React from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Plus,
  Minus,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onUpdateStock: (id: string, change: number) => void;
  recentlyUpdated: string | null;
}

const StockManager = ({ onUpdateStock }: { onUpdateStock: (change: number) => void }) => {
  const [amount, setAmount] = React.useState(1);
  return (
    <div className="space-y-4 p-2">
      <div className="space-y-2">
        <Label htmlFor="stock-amount" className="text-sm font-semibold">Amount</Label>
        <Input
          id="stock-amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value, 10) || 1))}
          className="w-full rounded-lg"
        />
      </div>
      <div className="flex justify-between gap-2">
        <Button
          variant="outline"
          className="w-full bg-green-50 border-green-200 text-green-700 hover:bg-green-100 rounded-lg"
          onClick={() => onUpdateStock(amount)}
        >
          <TrendingUp className="mr-2 h-4 w-4" /> Add
        </Button>
        <Button
          variant="outline"
          className="w-full bg-red-50 border-red-200 text-red-700 hover:bg-red-100 rounded-lg"
          onClick={() => onUpdateStock(-amount)}
        >
          <TrendingDown className="mr-2 h-4 w-4" /> Remove
        </Button>
      </div>
    </div>
  );
};

const getStockStatus = (quantity: number) => {
  if (quantity === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800 border-red-200" };
  if (quantity < 10) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800 border-yellow-200" };
  if (quantity < 50) return { label: "In Stock", color: "bg-blue-100 text-blue-800 border-blue-200" };
  return { label: "Well Stocked", color: "bg-green-100 text-green-800 border-green-200" };
};

export function ProductTable({
  products,
  onEdit,
  onDelete,
  onUpdateStock,
  recentlyUpdated,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="glass-card rounded-2xl flex flex-col items-center justify-center p-16 text-center">
        <div className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-4">
          <Package className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h3>
        <p className="text-gray-600 mb-6">
          Get started by adding a new product.
        </p>
        <Button className="modern-button">
          <Plus className="mr-2 h-4 w-4" />
          Add Your First Product
        </Button>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl border-0 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-white/10 hover:bg-transparent">
            <TableHead className="w-[120px] font-semibold text-gray-700">Image</TableHead>
            <TableHead className="w-[35%] font-semibold text-gray-700">Product Name</TableHead>
            <TableHead className="font-semibold text-gray-700">Category</TableHead>
            <TableHead className="text-right font-semibold text-gray-700">Price</TableHead>
            <TableHead className="text-right font-semibold text-gray-700">Stock</TableHead>
            <TableHead className="text-center font-semibold text-gray-700">Status</TableHead>
            <TableHead className="w-[100px] text-center font-semibold text-gray-700">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <TableCell className="py-4">
                <Image
                  src={product.image || "https://placehold.co/100x100.png"}
                  alt={product.name}
                  width={60}
                  height={60}
                  className="rounded-xl object-cover shadow-md hover-lift"
                  data-ai-hint="product image"
                />
              </TableCell>
              <TableCell className="py-4">
                <div className="font-semibold text-gray-900 text-lg">{product.name}</div>
              </TableCell>
              <TableCell className="py-4">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200 rounded-full px-3 py-1">
                  {product.category}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-bold text-gray-900 py-4">
                ${(product.price || 0).toFixed(2)}
              </TableCell>
              <TableCell
                className={cn(
                  "text-right font-bold text-lg py-4 transition-all duration-1000",
                  recentlyUpdated === product.id && "text-purple-600 bg-purple-50 scale-110"
                )}
              >
                {product.quantity}
              </TableCell>
              <TableCell className="text-center py-4">
                <Badge 
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium border",
                    getStockStatus(product.quantity).color
                  )}
                >
                  {getStockStatus(product.quantity).label}
                </Badge>
              </TableCell>
              <TableCell className="text-center py-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-full hover:bg-white/10">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-card border-white/20 rounded-xl">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start font-normal h-10 px-3 rounded-lg hover:bg-white/10">
                          Manage Stock
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-72 glass-card border-white/20 rounded-xl" align="end">
                         <StockManager onUpdateStock={(change) => onUpdateStock(product.id, change)} />
                      </PopoverContent>
                    </Popover>
                    <DropdownMenuItem onClick={() => onEdit(product)} className="rounded-lg hover:bg-white/10">
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start font-normal h-10 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="glass-card border-white/20 rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl font-bold">Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600">
                            This action cannot be undone. This will permanently
                            delete the item "{product.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => onDelete(product.id)}
                            className="bg-red-600 hover:bg-red-700 rounded-xl"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
