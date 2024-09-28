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
  Modal,
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [outputModalVisible, setOutputModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [outputData, setOutputData] = useState(null);

  const [formValues, setFormValues] = useState({
    model: "ST12000NM0008",
    hardwareEccRecovered: "",
    currentPendingSectorCount: "",
    reallocatedSectorsCount: "",
    commandTimeout: "",
    reportedUncorrectableErrors: "",
    loadUnloadCycleCount: "",
    airFlowTemperature: "",
    driveTemperature: "",
    rawReadErrorRate: "",
    offlineUncorrectableSectorCount: "",
  });

  const checkHealth = () => {
    const status = Math.random() > 0.5 ? "Healthy" : "Needs Attention";
    setHealthStatus(status);
  };

  const handleCardClick = (deviceName) => {
    setSelectedDevice(deviceName);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleOutputModalClose = () => {
    setOutputModalVisible(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/hdfailure", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formValues),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOutputData(data);
      setIsModalVisible(false);
      setOutputModalVisible(true);
    } catch (error) {
      console.error("Error:", error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
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
      <Row className="flex mb-4 justify-around">
        <Card
          title="Hardware Failure Prediction"
          bordered={false}
          className="shadow-sm w-full"
        >
          <Row justify="around">
            <Col span={6} className="flex justify-center">
              <Card
                hoverable
                className="shadow-sm"
                onClick={() => handleCardClick("Hard Drive")}
              >
                Hard drive
              </Card>
            </Col>
            <Col span={6} className="flex justify-center">
              <Card
                hoverable
                className="shadow-sm"
                onClick={() => handleCardClick("SSD")}
              >
                SSD
              </Card>
            </Col>
            <Col span={6} className="flex justify-center">
              <Card
                hoverable
                className="shadow-sm"
                onClick={() => handleCardClick("Hybrid Drives")}
              >
                Hybrid Drives
              </Card>
            </Col>
            <Col span={6} className="flex justify-center">
              <Card
                hoverable
                className="shadow-sm"
                onClick={() => handleCardClick("NVME")}
              >
                NVME
              </Card>
            </Col>
          </Row>
        </Card>
      </Row>
      <Modal
        title={`${selectedDevice} Details`}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="submit" onClick={handleSubmit}>
            Submit
          </Button>,
          <Button key="back" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Row gutter={16} className="flex">
            <Col span={12} className="flex flex-col">
              <Form.Item label="Select Model">
                <Select
                  defaultValue="ST12000NM0008"
                  onChange={(value) =>
                    handleInputChange({ target: { name: "model", value } })
                  }
                >
                  <Select.Option value="ST12000NM0008">
                    ST12000NM0008
                  </Select.Option>
                  <Select.Option value="ST8000NM0055">
                    ST8000NM0055
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12} className="flex flex-col">
              <Form.Item label="Hardware ECC Recovered">
                <Input
                  type="number"
                  name="hardwareEccRecovered"
                  value={formValues.hardwareEccRecovered}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} className="flex">
            <Col span={12} className="flex flex-col">
              <Form.Item label="Current Pending Sector Count">
                <Input
                  type="number"
                  name="currentPendingSectorCount"
                  value={formValues.currentPendingSectorCount}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </Form.Item>
            </Col>
            <Col span={12} className="flex flex-col">
              <Form.Item label="Reallocated Sectors Count">
                <Input
                  type="number"
                  name="reallocatedSectorsCount"
                  value={formValues.reallocatedSectorsCount}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} className="flex">
            <Col span={12} className="flex flex-col">
              <Form.Item label="Command Timeout">
                <Input
                  type="number"
                  name="commandTimeout"
                  value={formValues.commandTimeout}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </Form.Item>
            </Col>
            <Col span={12} className="flex flex-col">
              <Form.Item label="Reported Uncorrectable Errors">
                <Input
                  type="number"
                  name="reportedUncorrectableErrors"
                  value={formValues.reportedUncorrectableErrors}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} className="flex">
            <Col span={12} className="flex flex-col">
              <Form.Item label="Load/Unload Cycle Count">
                <Input
                  type="number"
                  name="loadUnloadCycleCount"
                  value={formValues.loadUnloadCycleCount}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </Form.Item>
            </Col>
            <Col span={12} className="flex flex-col">
              <Form.Item label="Airflow Temperature (Celsius)">
                <Input
                  type="number"
                  name="airFlowTemperature"
                  value={formValues.airFlowTemperatureemperature}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} className="flex">
            <Col span={12} className="flex flex-col">
              <Form.Item label="Drive Temperature (Celsius)">
                <Input
                  type="number"
                  name="driveTemperature"
                  value={formValues.driveTemperature}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </Form.Item>
            </Col>
            <Col span={12} className="flex flex-col">
              <Form.Item label="Raw Read Error Rate">
                <Input
                  type="number"
                  name="rawReadErrorRate"
                  value={formValues.rawReadErrorRate}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Offline Uncorrectable Sector Count">
            <Input
              type="number"
              name="offlineUncorrectableSectorCount"
              value={formValues.offlineUncorrectableSectorCount}
              onChange={handleInputChange}
              className="w-full"
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Prediction Result"
        open={outputModalVisible}
        onCancel={handleOutputModalClose}
        footer={[
          <Button key="back" onClick={handleOutputModalClose}>
            Close
          </Button>,
        ]}
      >
        {outputData && (
          <div>
            <p>
              <strong>Prediction:</strong> {outputData.prediction}
            </p>
            <p>
              <strong>Model:</strong> {outputData.model}
            </p>
          </div>
        )}
      </Modal>
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
