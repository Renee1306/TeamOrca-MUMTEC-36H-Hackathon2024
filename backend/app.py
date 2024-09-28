import os
import numpy as np
from flask_cors import CORS
from flask import (
    Flask,
    request,
    send_file,
    render_template,
)
from tensorflow.keras.models import load_model
from PIL import Image
from firmware_analysis import analyze_firmware

app = Flask(__name__)

CORS(app)

# Load the model
model = load_model("mobilenet_malware_model.h5")

# Define the class labels
class_labels = [
    "Benignware",
    "Unknown",
    "Hackware",
    "Malware",
]  # Replace with your actual class names

# Ensure directories exist
UPLOAD_FOLDER = "uploads"
PROCESSED_FOLDER = "processed"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)


# Helper function to process the binary file and create a 32x32 grayscale image
def process_binary_file(file_path):
    # Read the first 1024 bytes from the binary file
    with open(file_path, "rb") as file:
        binary_data = file.read(1024)
    # Convert bytes to a numpy array of decimals (0-255 range)
    byte_array = np.frombuffer(binary_data, dtype=np.uint8)
    # If the length is less than 1024 bytes, pad with zeros
    if len(byte_array) < 1024:
        byte_array = np.pad(byte_array, (0, 1024 - len(byte_array)), "constant")
    # Map each byte to a value between 0-15 (lower 4 bits) and then scale to 0-255
    byte_array = byte_array & 0x0F  # Extract the lower 4 bits (0-15)
    byte_array = byte_array * 17  # Scale from 0-15 to 0-255 by multiplying by 17
    # Reshape the array to 32x32 (since we have 1024 bytes)
    byte_array = byte_array.reshape((32, 32))
    # Convert to a grayscale PIL image directly without scaling further
    img = Image.fromarray(byte_array, mode="L")
    return img


def firmware_analysis_table(analysis_data):
    table_html = """
    <table border="1" cellpadding="5" cellspacing="0">
        <tr>
            <th>Property</th>
            <th>Value</th>
        </tr>
    """

    for key, value in analysis_data.items():
        # Check if the value is a list (e.g., URLs, IPs, passwords)
        if isinstance(value, list):
            if len(value) > 0:
                value = "<br>".join(
                    value
                )  # Join list items with <br> for proper HTML display
            else:
                value = "None found"  # If list is empty, explicitly say no data

        # Check if the value is a dictionary (e.g., metadata)
        elif isinstance(value, dict):
            value = "<br>".join(
                [f"{k}: {v}" for k, v in value.items()]
            )  # Convert dict to key-value HTML format

        # If value is None or empty, show 'None found'
        elif not value:
            value = "None found"

        table_html += f"""
        <tr>
            <td>{key}</td>
            <td>{value}</td>
        </tr>
        """

    table_html += "</table>"
    return table_html


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    # Get the file from the POST request
    file = request.files["file"]

    # Save the binary file to the 'uploads' directory
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # Process the binary file and create an image
    img = process_binary_file(file_path)

    # Save the processed image to the 'processed' directory
    img_filename = f"processed_{file.filename.rsplit('.', 1)[0]}.png"
    img_path = os.path.join(PROCESSED_FOLDER, img_filename)
    img.save(img_path)

    # Preprocess the image for the model
    img = img.resize((224, 224))  # Resize to match model's input size
    img_array = np.array(img) / 255.0  # Normalize the image
    img_array = np.expand_dims(
        img_array, axis=-1
    )  # Add channel dimension for grayscale
    img_array = np.repeat(
        img_array, 3, axis=-1
    )  # Convert to 3 channels (RGB-like for model compatibility)
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension

    # Make a prediction using the model
    predictions = model.predict(img_array)

    # Get the index of the class with the highest probability
    predicted_class_index = np.argmax(predictions[0])

    # Get the class label
    predicted_class_label = class_labels[predicted_class_index]

    # Run firmware analysis
    firmware_analysis_result = analyze_firmware(file_path)

    # Generate the firmware analysis table
    firmware_analysis_html = firmware_analysis_table(firmware_analysis_result)

    return {
        "predictionResult": predicted_class_label,
        "confidenceScore": float(predictions[0][predicted_class_index]),
        "image": img_filename,
        "firmwareAnalysis": firmware_analysis_html,
    }


@app.route("/download_image/<filename>")
def download_image(filename):
    img_path = os.path.join(PROCESSED_FOLDER, filename)
    return send_file(img_path, as_attachment=False)


if __name__ == "__main__":
    app.run(debug=True)
