import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { useAppSelector } from "@/src/redux/hooks";
import { CreditCard, DollarSign } from "lucide-react";
import { FC } from "react";

interface SalesProps {
  transactions: number | undefined;
}

const Sales: FC<SalesProps> = ({ transactions }) => {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row gap-3 items-center">
          Transactions
          <CreditCard className="ml-auto" />
        </CardHeader>
        <CardContent className="mt-auto text-2xl font-semibold">
          +{transactions || 0}
        </CardContent>
      </Card>
    </>
  );
};

export default Sales;
