"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DollarSign, Package, Package2, TrendingUp, Star } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { useProducts } from "@/hooks/use-products";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { products, isLoading } = useProducts();

  const totalProducts = products.length;
  const totalStock = products.reduce(
    (acc, product) => acc + product.quantity,
    0
  );
  const totalValue = products.reduce(
    (acc, product) => acc + product.quantity * (product.price || 0),
    0
  );

  const categoryDistribution = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryCount = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCount).map(([name, value]) => ({
      name,
      value,
    }));
  }, [products]);

  const chartConfig = {
    value: {
      label: "Products",
    },
    ...categoryDistribution.reduce((acc, category) => {
      acc[category.name] = { label: category.name };
      return acc;
    }, {} as any),
  };

  const COLORS = [
    "#8B5CF6",
    "#06B6D4",
    "#10B981",
    "#F59E0B",
    "#EF4444",
  ];

  if (isLoading) {
    return (
      <div className="flex-1 space-y-8">
        <div className="mb-8">
          <Skeleton className="h-12 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="h-[500px] col-span-4 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-10">
      <div className="mb-12 text-center">
        <h1 className="text-6xl font-black gradient-text mb-4 tracking-tight">Grocery Dashboard</h1>
        <p className="text-gray-600 text-xl font-medium">Fresh insights into your grocery inventory</p>
        <div className="w-32 h-1 bg-gradient-to-r from-emerald-500 to-green-500 mx-auto mt-4 rounded-full"></div>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <Card className="stats-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold text-gray-700 uppercase tracking-wide">Total Items</CardTitle>
            <div className="relative p-3 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl shadow-lg shadow-emerald-500/30">
              <Package className="h-5 w-5 text-white drop-shadow-sm" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-gray-900 mb-2 tracking-tight">{totalProducts}</div>
            <p className="text-sm text-gray-600 flex items-center gap-2 font-medium">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Unique grocery items
            </p>
          </CardContent>
        </Card>
        
        <Card className="stats-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold text-gray-700 uppercase tracking-wide">Total Quantity</CardTitle>
            <div className="relative p-3 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl shadow-lg shadow-teal-500/30">
              <Package2 className="h-5 w-5 text-white drop-shadow-sm" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-gray-900 mb-2 tracking-tight">{totalStock}</div>
            <p className="text-sm text-gray-600 flex items-center gap-2 font-medium">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Total units across all items
            </p>
          </CardContent>
        </Card>
        
        <Card className="stats-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold text-gray-700 uppercase tracking-wide">
              Grocery Value
            </CardTitle>
            <div className="relative p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg shadow-green-500/30">
              <DollarSign className="h-5 w-5 text-white drop-shadow-sm" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
              ${totalValue.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 flex items-center gap-2 font-medium">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Total inventory value
            </p>
          </CardContent>
        </Card>
        
        <Card className="stats-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold text-gray-700 uppercase tracking-wide">Categories</CardTitle>
            <div className="relative p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-lg shadow-yellow-500/30">
              <Star className="h-5 w-5 text-white drop-shadow-sm" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-gray-900 mb-2 tracking-tight">{categoryDistribution.length}</div>
            <p className="text-sm text-gray-600 flex items-center gap-2 font-medium">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Product categories
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-8">
        <Card className="grocery-card border-0 col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-3xl font-black gradient-text mb-2">Category Distribution</CardTitle>
            <CardDescription className="text-gray-600 text-lg font-medium">
              Visual breakdown of your grocery inventory by category
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-8 pr-8 pb-8">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[600px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={categoryDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={80}
                  outerRadius={180}
                  strokeWidth={3}
                  stroke="#fff"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="name" />}
                  className="-translate-y-[2rem] flex-wrap gap-6 [&>*]:basis-1/4 [&>*]:justify-center text-base font-bold"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
