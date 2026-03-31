import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Part } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function InventoryTable({ parts }: { parts: Part[] }) {
  const [search, setSearch] = useState("");

  const filtered = parts.filter(p => {
    return p.name.toLowerCase().includes(search.toLowerCase()) || 
           p.id.toLowerCase().includes(search.toLowerCase()) ||
           p.category.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search parts by name, ID, or category..." 
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Part ID</TableHead>
                <TableHead className="whitespace-nowrap">Name</TableHead>
                <TableHead className="whitespace-nowrap">Category</TableHead>
                <TableHead className="text-right whitespace-nowrap">Stock Level</TableHead>
                <TableHead className="text-right whitespace-nowrap">Min/Max</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((part) => (
                <TableRow key={part.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">{part.id}</TableCell>
                  <TableCell className="font-medium whitespace-nowrap">{part.name}</TableCell>
                  <TableCell className="whitespace-nowrap">{part.category}</TableCell>
                  <TableCell className="text-right font-medium whitespace-nowrap">
                    <span className={part.stockLevel < part.minStock ? "text-rose-500" : ""}>
                      {part.stockLevel.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm whitespace-nowrap">
                    {part.minStock} / {part.maxStock}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge variant={
                      part.status === "OK" ? "secondary" : 
                      part.status === "Low" ? "outline" : "destructive"
                    } className={part.status === "OK" ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : part.status === "Low" ? "border-amber-500 text-amber-600" : ""}>
                      {part.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No parts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
