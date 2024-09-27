import Layout from "./components/Layout";
import { useState } from "react";
import {
  Form,
  Typography,
  Input,
  Button,
  Col,
  Row,
  Card,
  Table,
  Select,
  List,
  Statistic,
} from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function PerfBench() {
  const [benchmarkResults, setBenchmarkResults] = useState(null);

  const onFinish = (values) => {
    console.log("Benchmark started with values:", values);

    setBenchmarkResults({
      summary: {
        firmwareVersion: values.firmwareVersion,
        deviceModel: values.deviceModel,
        testType: values.testType,
        testDuration: values.testDuration,
      },
      metrics: {
        cpuUtilization: 75,
        memoryUsage: 512,
        operationsPerSecond: 10000,
        responseTime: 5,
      },
      comparison: [
        {
          metric: "CPU Utilization",
          current: "75%",
          previous: "80%",
          change: "-5%",
        },
        {
          metric: "Memory Usage",
          current: "512 MB",
          previous: "540 MB",
          change: "-28 MB",
        },
        {
          metric: "Operations/Second",
          current: "10,000",
          previous: "9,500",
          change: "+500",
        },
        {
          metric: "Response Time",
          current: "5 ms",
          previous: "6 ms",
          change: "-1 ms",
        },
      ],
    });
  };

  const columns = [
    {
      title: "Metric",
      dataIndex: "metric",
      key: "metric",
    },
    {
      title: "Current",
      dataIndex: "current",
      key: "current",
    },
    {
      title: "Previous",
      dataIndex: "previous",
      key: "previous",
    },
    {
      title: "Change",
      dataIndex: "change",
      key: "change",
      render: (text) => (
        <span style={{ color: text.startsWith("-") ? "green" : "red" }}>
          {text}
        </span>
      ),
    },
  ];

  return (
    <Layout>
      <Typography.Title level={2}>
        Firmware Performance Benchmark
      </Typography.Title>
      <Row gutter={16} className="flex mb-4">
        <Col span={12} className="flex flex-col">
          <Card title="Benchmark Configuration" className="shadow-sm flex-1">
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item label="Firmware Version">
                <Input placeholder="e.g. v1.0.0" />
              </Form.Item>
              <Form.Item label="Device Model">
                <Input placeholder="e.g. ESP32-S2" />
              </Form.Item>
              <Form.Item label="Test Duration (seconds)">
                <Input defaultValue={60} placeholder="60" type="number" />
              </Form.Item>
              <Form.Item label="Test Type">
                <Select defaultValue="cpu">
                  <Select.Option value="cpu">CPU Performance</Select.Option>
                  <Select.Option value="memory">Memory Usage</Select.Option>
                  <Select.Option value="I/O">I/O Operation</Select.Option>
                  <Select.Option value="network">
                    Network Throughput
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" className="mt-4" htmlType="submit">
                  Run Benchmark
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12} className="flex flex-col">
          <Card title="Benchmark History" className="shadow-sm flex-1">
            <List
              itemLayout="horizontal"
              dataSource={[
                {
                  title: "ESP32-S2 v1.0.0",
                  subtitle: "CPU Performance",
                  content: "100%",
                },
                {
                  title: "ESP32-S2 v2.3.0",
                  subtitle: "Memory Usage",
                  content: "100%",
                },
                {
                  title: "ESP32-S2 v3.0.0",
                  subtitle: "I/O Operation",
                  content: "100%",
                },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={item.subtitle}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
      {benchmarkResults && (
        <Card title="Benchmark Results" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="CPU Utilization"
                value={benchmarkResults.metrics.cpuUtilization}
                suffix="%"
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Memory Usage"
                value={benchmarkResults.metrics.memoryUsage}
                suffix="MB"
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Operations/Second"
                value={benchmarkResults.metrics.operationsPerSecond}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Response Time"
                value={benchmarkResults.metrics.responseTime}
                suffix="ms"
              />
            </Col>
          </Row>
          <Typography.Title level={4} style={{ marginTop: 16 }}>
            Performance Comparison
          </Typography.Title>
          <Table
            columns={columns}
            dataSource={benchmarkResults.comparison}
            pagination={false}
          />
          <Typography.Title level={4} style={{ marginTop: 16 }}>
            Performance Visualization
          </Typography.Title>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={benchmarkResults.comparison}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="current" fill="#8884d8" name="Current Version" />
              <Bar dataKey="previous" fill="#82ca9d" name="Previous Version" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </Layout>
  );
}

export default PerfBench;
