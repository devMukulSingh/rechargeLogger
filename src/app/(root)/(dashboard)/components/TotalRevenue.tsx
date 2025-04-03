import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { useAppSelector } from "@/src/redux/hooks";
import { DollarSign } from "lucide-react";
import { FC } from "react";

interface TotalRevenueProps {
  totalRevenue: number | undefined;
}

const TotalRevenue: FC<TotalRevenueProps> = ({ totalRevenue }) => {
  // const { selectedMonthRevenue } = useAppSelector((state) => state.rootReducer);
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row gap-3 items-center">
          <h1>Total Revenue</h1>
          <DollarSign className="ml-auto" />
        </CardHeader>
        <CardContent className="mt-auto text-2xl font-semibo3ld">
          ₹{totalRevenue || 0}
        </CardContent>
      </Card>
    </>
  );
};

export default TotalRevenue;
