"use client";
import { Fragment, useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { trpc } from "@/src/lib/trpc";
import toast from "react-hot-toast";

export interface IgraphData {
  name: string;
  total: number;
}
interface ChartSectionProps {}

const ChartSection: React.FC<ChartSectionProps> = async ({}) => {
  const [graphData, setGraphData] = useState<IgraphData[]>([]);
  const { data, isLoading, error, isError } =
    trpc.transactionRouter.getAllTransactions.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

  if (isError) {
    console.log(error);
    toast.error(error.message);
  }

  const getGraphData = () => {
    const graphData: IgraphData[] = [
      { name: "Jan", total: 0 },
      { name: "Feb", total: 0 },
      { name: "Mar", total: 0 },
      { name: "Apr", total: 0 },
      { name: "May", total: 0 },
      { name: "Jun", total: 0 },
      { name: "Jul", total: 0 },
      { name: "Aug", total: 0 },
      { name: "Sep", total: 0 },
      { name: "Oct", total: 0 },
      { name: "Nov", total: 0 },
      { name: "Dec", total: 0 },
    ];

    let i = 0;
    if (data) {
      // console.log(transactions);

      for (let obj of graphData) {
        let totalMonthlyRevenue = 0;
        //getting totalRevenue of a particular month
        totalMonthlyRevenue = data
          ?.filter((item) => new Date(item.createdAt).getMonth() === i)
          .map((item) => item.plan.amount)
          .reduce((acc, next) => {
            return acc + next;
          }, 0);
        //inserting total revenue of particular month in the graphData array
        obj.total = totalMonthlyRevenue;
        i++;
      }
    }
    return graphData;
  };

  useEffect(() => {
    const data = getGraphData();
    setGraphData(data);
  }, [data]);

  return (
    <Fragment>
      <ResponsiveContainer
        width="100%"
        height={350}
        className={"border p-2 rounded-md"}
      >
        <BarChart data={graphData}>
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
    </Fragment>
  );
};

export default ChartSection;
