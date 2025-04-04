"use client";
import { Fragment, useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { trpc } from "@/src/lib/trpc";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { router } from "@/src/server/trpc";
import { Calendar } from "lucide-react";

export interface IgraphData {
  name: string;
  total: number;
}
interface ChartSectionProps {}

const ChartSection: React.FC<ChartSectionProps> = async ({}) => {
  const searchParams = useSearchParams();
  const { data } = trpc.analyticsRouter.getGraphData.useQuery({
    year: searchParams.get("year") || new Date().getFullYear().toString(),
  });
  return (
    <div className="space-y-5 border rounded-md p-5">
      <YearSelector />
      <ResponsiveContainer
        width="100%"
        height={350}
        className={" p-2 rounded-md"}
      >
        <BarChart data={data || []}>
          <XAxis
            dataKey="name"
            stroke="#fff"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#fff"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₹${value}`}
          />
          <Bar dataKey="total" fill="#0F172A" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartSection;

function YearSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data } = trpc.analyticsRouter.getYears.useQuery();
  function onSelectChange(year: string) {
    const params = new URLSearchParams(searchParams);
    params.set("year", year);
    router.push(`/?${params.toString()}`);
  }
  return (
    <Select onValueChange={(year) => onSelectChange(year)}>
      <SelectTrigger className="w-[10rem] text-black">
        <Calendar size={18} />
        <SelectValue placeholder="Select year" />
      </SelectTrigger>
      <SelectContent>
        {data?.map((d, index) => (
          <SelectItem key={index} value={d.year}>
            {d.year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
