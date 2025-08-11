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
      <div className="grocery-card rounded-3xl flex flex-col items-center justify-center p-20 text-center">
        <div className="relative p-6 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full mb-6 shadow-xl shadow-emerald-500/20">
          <Package className="h-12 w-12 text-emerald-600" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full"></div>
        </div>
        <h3 className="text-3xl font-black text-gray-900 mb-3 gradient-text">No Grocery Items Found</h3>
        <p className="text-gray-600 mb-8 text-lg font-medium">
          Start building your fresh grocery inventory today.
        </p>
        <Button className="modern-button">
          <Plus className="mr-3 h-5 w-5" />
          Add Your First Item
        </Button>
      </div>
    );
  }

  return (
    <div className="grocery-card rounded-3xl border-0 overflow-hidden shadow-2xl shadow-emerald-500/10">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-emerald-100/50 hover:bg-transparent">
            <TableHead className="w-[140px] font-black text-gray-800 text-sm uppercase tracking-wide py-6">Image</TableHead>
            <TableHead className="w-[35%] font-black text-gray-800 text-sm uppercase tracking-wide">Item Name</TableHead>
            <TableHead className="font-black text-gray-800 text-sm uppercase tracking-wide">Category</TableHead>
            <TableHead className="text-right font-black text-gray-800 text-sm uppercase tracking-wide">Price</TableHead>
            <TableHead className="text-right font-black text-gray-800 text-sm uppercase tracking-wide">Stock</TableHead>
            <TableHead className="text-center font-black text-gray-800 text-sm uppercase tracking-wide">Status</TableHead>
            <TableHead className="w-[120px] text-center font-black text-gray-800 text-sm uppercase tracking-wide">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="border-b border-emerald-50/50 table-row-hover">
              <TableCell className="py-6">
                <Image
                  src={product.image || "https://placehold.co/100x100.png"}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="rounded-2xl object-cover shadow-lg hover-lift border-2 border-emerald-100"
                  data-ai-hint="product image"
                />
              </TableCell>
              <TableCell className="py-6">
                <div className="font-bold text-gray-900 text-xl tracking-tight">{product.name}</div>
              </TableCell>
              <TableCell className="py-6">
                <Badge variant="secondary" className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200 rounded-full px-4 py-2 font-bold text-sm shadow-sm">
                  {product.category}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-black text-gray-900 py-6 text-lg">
                ${(product.price || 0).toFixed(2)}
              </TableCell>
              <TableCell
                className={cn(
                  "text-right font-black text-xl py-6 transition-all duration-1000",
                  recentlyUpdated === product.id && "text-emerald-600 bg-emerald-50 scale-110 shadow-lg rounded-lg"
                )}
              >
                {product.quantity}
              </TableCell>
              <TableCell className="text-center py-6">
                <Badge 
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-bold border shadow-sm",
                    getStockStatus(product.quantity).color
                  )}
                >
                  {getStockStatus(product.quantity).label}
                </Badge>
              </TableCell>
              <TableCell className="text-center py-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-12 w-12 p-0 rounded-full hover:bg-emerald-100/50 hover:shadow-lg transition-all duration-300">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-5 w-5 text-emerald-600" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="grocery-card border-emerald-200/50 rounded-2xl shadow-xl">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start font-bold h-12 px-4 rounded-xl hover:bg-emerald-50 text-emerald-700">
                          Manage Stock
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 grocery-card border-emerald-200/50 rounded-2xl shadow-xl" align="end">
                         <StockManager onUpdateStock={(change) => onUpdateStock(product.id, change)} />
                      </PopoverContent>
                    </Popover>
                    <DropdownMenuItem onClick={() => onEdit(product)} className="rounded-xl hover:bg-emerald-50 font-bold text-emerald-700 py-3">
                      <Pencil className="mr-3 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start font-bold h-12 px-4 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl py-3"
                        >
                          <Trash2 className="mr-3 h-4 w-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="grocery-card border-emerald-200/50 rounded-3xl shadow-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-2xl font-black gradient-text">Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600 text-lg font-medium">
                            This action cannot be undone. This will permanently
                            delete the item "{product.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-2xl font-bold">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => onDelete(product.id)}
                            className="bg-red-600 hover:bg-red-700 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
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
