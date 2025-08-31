import DashboardPageView from "./page-view";
import { getDictionary } from "@/app/dictionaries";

interface DashboardProps {
  params: {
    lang: any;
  };
}
const Dashboard = async ({ params: { lang } }: DashboardProps) => {

  return <DashboardPageView  />;
};

export default Dashboard;
