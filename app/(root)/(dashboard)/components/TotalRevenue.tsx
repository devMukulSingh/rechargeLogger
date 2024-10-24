import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAppSelector } from "@/redux/hooks";
import { DollarSign } from "lucide-react";
import { FC } from "react";

interface TotalRevenueProps {}

const TotalRevenue: FC<TotalRevenueProps> = ({}) => {
  const { selectedMonthRevenue } = useAppSelector((state) => state.rootSlice);
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row gap-3 items-center">
          <h1>Total Revenue</h1>
          <DollarSign className="ml-auto" />
        </CardHeader>
        <CardContent className="mt-auto text-2xl font-semibo3ld">
          ₹{selectedMonthRevenue}
        </CardContent>
      </Card>
    </>
  );
};

export default TotalRevenue;
