import React, { useState } from "react";
import axios from "axios";
import CustomLayout from "./components/Layout";
import { Card, Typography, Form, Button, Descriptions, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Paragraph, Title } = Typography;

function FirmwareAnal() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [confidenceScore, setConfidenceScore] = useState("");

  const handleFileChange = ({ file }) => {
    setFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const data = response.data;
      setConfidenceScore(data.confidenceScore);
      setPrediction(data.predictionResult);
      setImageUrl(`http://127.0.0.1:5000/download_image/${data.image}`);
      setAnalysis(data.firmwareAnalysis);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CustomLayout>
      <Typography.Title level={2}>Firmware Analysis</Typography.Title>
      <Form>
        <Form.Item>
          <Upload
            name="file"
            beforeUpload={() => false}
            onChange={handleFileChange}
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!file}
            onClick={handleSubmit}
          >
            Predict
          </Button>
        </Form.Item>
      </Form>

      {prediction && (
        <Card style={{ marginTop: 20 }}>
          <Descriptions title="Prediction Results">
            <Descriptions.Item label="Prediction">
              {prediction}
            </Descriptions.Item>
            {confidenceScore && (
              <Descriptions.Item label="Confidence Score">
                {confidenceScore}
              </Descriptions.Item>
            )}
          </Descriptions>

          {imageUrl && (
            <div style={{ marginTop: 20 }}>
              <img
                src={imageUrl}
                alt="Generated"
                style={{ width: "224px", height: "224px" }}
              />
            </div>
          )}
        </Card>
      )}

      {analysis && (
        <Card style={{ marginTop: 20 }}>
          <Title level={4}>Firmware Analysis:</Title>
          <div dangerouslySetInnerHTML={{ __html: analysis }} />
        </Card>
      )}
    </CustomLayout>
  );
}

export default FirmwareAnal;
