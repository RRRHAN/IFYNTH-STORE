import sys
import os
import json
import numpy as np
from PIL import Image
import tensorflow as tf

tf.get_logger().setLevel('ERROR')

# Helper to get the correct path for bundled resources (e.g., PyInstaller)
def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS  # PyInstaller temporary folder
    except AttributeError:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

# Load the model
model = tf.keras.models.load_model(resource_path("image_classifier.keras")) 

# Load the class names from the JSON file
with open(resource_path("classes.json"), "r") as f:
    class_names = json.load(f)

# Preprocess the input image to match model input size (224x224 for example)
def preprocess_image(img_path):
    img = Image.open(img_path).convert("RGB").resize((224, 224))
    img_array = np.array(img) / 255.0  # Normalize pixel values to [0, 1]
    return np.expand_dims(img_array, axis=0)  # Add batch dimension

if __name__ == "__main__":
    # Get the image file path from the command line argument
    img_path = sys.argv[1]

    # Preprocess the image
    img_tensor = preprocess_image(img_path)

    # Make the prediction
    prediction = model.predict(img_tensor,verbose=0)[0]

    # Get the predicted class index (highest probability)
    predicted_index = int(np.argmax(prediction))

    # Output the predicted class
    print(class_names[predicted_index])
