import sys
import tensorflow as tf
import numpy as np
from PIL import Image
import json
import os

def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS 
    except AttributeError:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

model = tf.keras.models.load_model(resource_path("image_classifier.keras"))

with open(resource_path("classes.json")) as f:
    class_names = json.load(f)

def predict_image(path):
    img = Image.open(path).convert("RGB").resize((224, 224))
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    predictions = model.predict(img, verbose=0)
    predicted_index = np.argmax(predictions[0])
    predicted_label = class_names[predicted_index]
    return predicted_label

def handle_predictions():
    print("Model loaded. Waiting for image paths... Type 'exit' to terminate.") 
        
    while True:
        image_path = input()
        image_path = image_path.strip()
        
        if image_path.lower() == "exit":
            break
        
        if os.path.exists(image_path):
            try:
                predicted_label = predict_image(image_path)
                print(predicted_label)
            except Exception as e:
                print(f"error processing image: {e}")
        else:
            print(f"error image path {image_path} not found!")

if __name__ == "__main__":
    handle_predictions()
