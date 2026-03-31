import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Shipment } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ShipmentTable({ shipments }: { shipments: Shipment[] }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = shipments.filter(s => {
    const matchesFilter = filter === "All" || s.status === filter;
    const matchesSearch = s.id.toLowerCase().includes(search.toLowerCase()) || 
                          s.origin.toLowerCase().includes(search.toLowerCase()) || 
                          s.destination.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search shipments..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="In Transit">In Transit</SelectItem>
            <SelectItem value="Delayed">Delayed</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Shipment ID</TableHead>
                <TableHead className="whitespace-nowrap">Origin</TableHead>
                <TableHead className="whitespace-nowrap">Destination</TableHead>
                <TableHead className="whitespace-nowrap">ETA</TableHead>
                <TableHead className="text-right whitespace-nowrap">Weight (kg)</TableHead>
                <TableHead className="text-right whitespace-nowrap">Value ($)</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-medium font-mono text-xs whitespace-nowrap">{shipment.id}</TableCell>
                  <TableCell className="whitespace-nowrap">{shipment.origin}</TableCell>
                  <TableCell className="whitespace-nowrap">{shipment.destination}</TableCell>
                  <TableCell className="whitespace-nowrap">{shipment.eta}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">{shipment.weight.toLocaleString()}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">{shipment.value.toLocaleString()}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge variant={
                      shipment.status === "Delivered" ? "default" : 
                      shipment.status === "Delayed" ? "destructive" : 
                      shipment.status === "In Transit" ? "secondary" : "outline"
                    } className={shipment.status === "Delivered" ? "bg-emerald-500 hover:bg-emerald-600 text-white" : ""}>
                      {shipment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No shipments found.
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
