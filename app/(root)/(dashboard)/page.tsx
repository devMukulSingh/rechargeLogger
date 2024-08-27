import dynamic from "next/dynamic";
import ChartSkeleton from "./components/CardSkeleton";
import DashboardDataSkeleton from "./components/DashboardDataSkeleton";
const ChartSection = dynamic(
  () => import("@/app/(root)/(dashboard)/components/ChartSection"),
  {
    loading: () => <ChartSkeleton />,
  }
);
const DashboardData = dynamic(
  () => import("@/app/(root)/(dashboard)/components/DashboardData"),
  {
    loading: () => <DashboardDataSkeleton />,
  }
);

const DashboardPage = async () => {

  return (
    <div className="px-5 py-3 lg:px-15 md:px-10 space-y-5">
      <header>
        <h1 className="text-3xl font-bold">Dasboard</h1>
        <h1>Manage Dashboard</h1>
      </header>

      <DashboardData />
      <ChartSection />
    </div>
  );
};

export default DashboardPage;
