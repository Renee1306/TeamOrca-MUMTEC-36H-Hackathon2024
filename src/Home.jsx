import React, { useState } from "react";
import axios from "axios";
import CustomLayout from "./components/Layout";

function Home() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [confidenceScore, setConfidenceScore] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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
      <div>
        <h1>Firmware Prediction</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit">Predict</button>
        </form>

        {prediction && (
          <div>
            <h2>Prediction: {prediction}</h2>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Generated"
                style={{ width: "224px", height: "224px" }}
              />
            )}
          </div>
        )}

        {analysis && (
          <div>
            <h2>Firmware Analysis:</h2>
            <div dangerouslySetInnerHTML={{ __html: analysis }} />
          </div>
        )}

        {confidenceScore && (
          <div>
            <h2>Confidence Score: {confidenceScore}</h2>
          </div>
        )}
      </div>
    </CustomLayout>
  );
}

export default Home;
