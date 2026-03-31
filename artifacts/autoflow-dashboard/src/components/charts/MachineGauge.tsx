import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface MachineGaugeProps {
  value: number;
  title: string;
  color?: string;
  suffix?: string;
}

export function MachineGauge({ value, title, color = "hsl(var(--primary))", suffix = "%" }: MachineGaugeProps) {
  const data = [
    { name: title, value: value },
    { name: 'Remaining', value: Math.max(0, 100 - value) }
  ];

  return (
    <div className="flex flex-col items-center justify-center relative h-32 w-32">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={55}
            startAngle={180}
            endAngle={0}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="hsl(var(--muted))" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
        <span className="text-xl font-bold">{value.toFixed(1)}{suffix}</span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{title}</span>
      </div>
    </div>
  );
}
