import { useState } from "react";
import CustomLayout from "./components/Layout";
import {
  Input,
  Button,
  Typography,
  Col,
  Row,
  Card,
  Checkbox,
  Alert,
} from "antd";

const { TextArea } = Input;

function CodeOptimize() {
  const [optimizeCode, setOptimizeCode] = useState(false);

  return (
    <CustomLayout>
      <Typography.Title level={2}>Code Optimizer</Typography.Title>
      <Row gutter={16} className="flex mb-4">
        <Col span={12} className="flex flex-col">
          <Card title="Input Your Firmware Code" className="shadow-sm flex-1">
            <TextArea
              placeholder="Please input your code here..."
              rows={20}
              className="mb-4"
            />
          </Card>
        </Col>
        <Col span={12} className="flex flex-col">
          <Card title="Optimization Option" className="shadow-sm flex-1">
            <div className="flex flex-col space-y-4 text-lg">
              <Checkbox className="text-lg">Remove Unuse Variable</Checkbox>
              <Checkbox className="text-lg">Inline Simple Function</Checkbox>
              <Checkbox className="text-lg">Apply Loop Unrolling</Checkbox>
              <Checkbox className="text-lg">Constant Propagation</Checkbox>
              <Checkbox className="text-lg">Dead Code Elimination</Checkbox>
            </div>
            <Button
              type="primary"
              className="mt-4"
              onClick={() => setOptimizeCode(true)}
            >
              Optimize Code
            </Button>
          </Card>
        </Col>
      </Row>
      {optimizeCode && (
        <Row>
          <Card title="Optimization Result" className="shadow-sm flex-1">
            <Alert
              message="Code size reduction: 15%"
              showIcon
              type="info"
              className="mb-4"
            />
            <Alert
              message="Estimated performance improvement: 10%"
              showIcon
              type="info"
              className="mb-4"
            />
            <Typography.Title level={5}>Optimized Code</Typography.Title>
            <TextArea
              placeholder="
            // Your optimized code will appear here
            void setup() {
                // Optimized setup code
            }

            void loop() {
                // Optimized main loop
            }"
              rows={20}
              disabled
              className="mb-4"
            />
          </Card>
        </Row>
      )}
    </CustomLayout>
  );
}

export default CodeOptimize;
