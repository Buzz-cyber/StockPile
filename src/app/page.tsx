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
    <div className="flex-1 space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
        <p className="text-gray-600 text-lg">Welcome back! Here's your inventory overview.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card hover-lift border-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700">Total Items</CardTitle>
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Package className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalProducts}</div>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              Unique items in your grocery list
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card hover-lift border-0 bg-gradient-to-br from-cyan-500/10 to-teal-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700">Total Quantity</CardTitle>
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg">
              <Package2 className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalStock}</div>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              Total units across all items
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card hover-lift border-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700">
              Estimated Grocery Value
            </CardTitle>
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${totalValue.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              Estimated cost of all your groceries
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card hover-lift border-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700">Categories</CardTitle>
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
              <Star className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">{categoryDistribution.length}</div>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              Different product categories
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6">
        <Card className="glass-card hover-lift border-0 col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-2xl font-bold gradient-text">Category Distribution</CardTitle>
            <CardDescription className="text-gray-600">
              See how your groceries are distributed across categories.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-6">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[500px]"
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
                  outerRadius={160}
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
                  className="-translate-y-[2rem] flex-wrap gap-4 [&>*]:basis-1/4 [&>*]:justify-center text-sm font-medium"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
