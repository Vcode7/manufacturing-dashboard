import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { initialInventory } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function StockLevelsChart() {
  // Aggregate data by category
  const categories = initialInventory.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = { category: item.category, stock: 0 };
    acc[item.category].stock += item.stockLevel;
    return acc;
  }, {} as Record<string, { category: string, stock: number }>);
  
  const data = Object.values(categories).sort((a, b) => b.stock - a.stock);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Inventory by Category</CardTitle>
        <CardDescription>Total stock levels across all part categories</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{fill: 'hsl(var(--muted)/0.5)'}}
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
            />
            <Bar dataKey="stock" name="Total Stock" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
