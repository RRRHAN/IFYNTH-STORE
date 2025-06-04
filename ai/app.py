import os
import json
import uuid
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from tensorflow.keras.preprocessing import image
from werkzeug.utils import secure_filename

# Config
MODEL_PATH = "image_classifier.keras"
CLASSES_PATH = "classes.json"

# Load model and classes
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    with open(CLASSES_PATH, "r") as f:
        class_names = json.load(f)
except Exception as e:
    raise RuntimeError(f"Failed to load model or classes: {e}")

app = Flask(__name__)


def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img) / 255.0
    return np.expand_dims(img_array, axis=0)


def respond_success(data, http_status):
    return jsonify({"data": data, "errors": None}), http_status


def respond_errors(error, http_status):
    return jsonify({"data": None, "errors": error}), http_status


@app.route("/ai/predict-image", methods=["POST"])
def predict():
    
    errors = []
    if "image" not in request.files:
        errors.append("no image uploaded")
        return respond_errors(errors,400)

    uploaded_file = request.files["image"]
    original_filename = secure_filename(uploaded_file.filename)
    ext = os.path.splitext(original_filename)[1] or ".jpg"
    temp_filename = f"{uuid.uuid4()}{ext}"
    temp_path = os.path.join(temp_filename)

    uploaded_file.save(temp_path)

    try:
        img_array = preprocess_image(temp_path)
        predictions = model.predict(img_array)
        predicted_index = int(np.argmax(predictions[0]))
        predicted_label = class_names[predicted_index]
        confidence = float(np.max(predictions[0]) * 100)

        return respond_success(
            {"prediction": predicted_label, "confidence": confidence}, 200
        )

    except Exception as e:
        return respond_errors([str(e)],500)

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


if __name__ == "__main__":
    app.run(debug=True)
