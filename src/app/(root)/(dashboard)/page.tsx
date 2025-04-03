import dynamic from "next/dynamic";
import ChartSkeleton from "./components/ChartSkeleton";
import { Suspense } from "react";
const DashboardData = dynamic(() => import("./components/DashboardData"), {
  ssr: false,
});
const ChartSection = dynamic(
  () => import("@/src/app/(root)/(dashboard)/components/ChartSection"),
  {
    loading: () => <ChartSkeleton />,
  },
);

const DashboardPage = async () => {
  return (
    <div className="px-5 py-3 lg:px-15 md:px-10 space-y-5">
      <header>
        <h1 className="text-3xl font-bold">Dasboard</h1>
        <h1>Manage Dashboard</h1>
      </header>
      <Suspense fallback={<>loading...</>}>
        <DashboardData />
      </Suspense>
      <Suspense fallback={<ChartSkeleton />}>
        <ChartSection />
      </Suspense>
    </div>
  );
};

export default DashboardPage;
