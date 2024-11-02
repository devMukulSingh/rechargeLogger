import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { useAppSelector } from "@/src/redux/hooks";
import { CreditCard, DollarSign } from "lucide-react";
import { FC } from "react";

interface SalesProps {}

const Sales: FC<SalesProps> = ({}) => {
  const { selectedMonthTransactions } = useAppSelector(
    (state) => state.rootReducer,
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row gap-3 items-center">
          Transactions
          <CreditCard className="ml-auto" />
        </CardHeader>
        <CardContent className="mt-auto text-2xl font-semibold">
          +{selectedMonthTransactions}
        </CardContent>
      </Card>
    </>
  );
};

export default Sales;
