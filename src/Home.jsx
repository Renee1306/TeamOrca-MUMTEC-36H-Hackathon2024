import CustomLayout from "./components/Layout";
import { Typography } from "antd";

function Home() {
  return (
    <CustomLayout>
      <Typography.Title level={2}>Welcome to FIRMNET</Typography.Title>
    </CustomLayout>
  );
}

export default Home;
