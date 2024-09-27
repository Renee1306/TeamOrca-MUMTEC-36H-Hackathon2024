import { useState } from "react";
import Layout from "./components/Layout";
import {
  Typography,
  Card,
  Input,
  Button,
  Form,
  Col,
  Row,
  List,
  Select,
  DatePicker,
  Statistic,
} from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const { Title } = Typography;

function PredMain() {
  const [healthStatus, setHealthStatus] = useState(null);

  const checkHealth = () => {
    const status = Math.random() > 0.5 ? "Healthy" : "Needs Attention";
    setHealthStatus(status);
  };

  const mockChartData = [
    { month: "Jan", value: 12 },
    { month: "Feb", value: 19 },
    { month: "Mar", value: 3 },
    { month: "Apr", value: 5 },
    { month: "May", value: 2 },
    { month: "Jun", value: 3 },
  ];

  const mockDevices = [
    { name: "Router A", firmware: "v2.1.0" },
    { name: "Switch B", firmware: "v3.0.2" },
    { name: "Sensor C", firmware: "v1.5.1" },
  ];

  const mockRecommendations = [
    { device: "Router A", recommendation: "Update to v2.1.1 available" },
    {
      device: "Sensor C",
      recommendation: "Critical update v1.5.2 recommended",
    },
  ];

  return (
    <Layout>
      <Title level={2}>Predictive Maintenance</Title>
      <Row gutter={16} className="flex mb-4">
        <Col span={12} className="flex flex-col">
          <Card
            title="Firmware Health Check"
            bordered={false}
            className="shadow-sm flex-1"
          >
            <Form layout="vertical">
              <Form.Item label="Device Type">
                <Select defaultValue="Router">
                  <Select.Option value="Router">Router</Select.Option>
                  <Select.Option value="Switch">Switch</Select.Option>
                  <Select.Option value="Sensor">Sensor</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Firmware Version">
                <Input placeholder="Firmware Version (e.g. v2.1.0)" />
              </Form.Item>
              <Form.Item label="Last Update Date">
                <DatePicker className="w-full" placeholder="yyyy-mm-dd" />
              </Form.Item>
            </Form>
            <Button
              type="primary"
              className="w-full h-full"
              onClick={checkHealth}
            >
              Check Health
            </Button>
            {healthStatus && (
              <Statistic
                title="Firmware Health"
                value={healthStatus}
                valueStyle={{
                  color: healthStatus === "Healthy" ? "#52c41a" : "#f5222d",
                }}
                className="mt-4"
              />
            )}
          </Card>
        </Col>
        <Col span={12} className="flex flex-col">
          <Card
            title="Maintenance Prediction"
            bordered={false}
            className="shadow-sm flex-1"
          >
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={mockChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      <Row gutter={16} className="flex">
        <Col span={12} className="flex flex-col">
          <Card
            title="Device Inventory"
            bordered={false}
            className="shadow-sm flex-1"
          >
            <List
              itemLayout="horizontal"
              dataSource={mockDevices}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.name}
                    description={item.firmware}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12} className="flex flex-col">
          <Card
            title="Firmware Update Recommendations"
            bordered={false}
            className="shadow-sm flex-1"
          >
            <List
              itemLayout="horizontal"
              dataSource={mockRecommendations}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.device}
                    description={item.recommendation}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}

export default PredMain;
