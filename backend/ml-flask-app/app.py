from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Load the models and scalers
try:
    # Load first motor model and scaler
    model1 = joblib.load('next_watering_model.pkl')
    scaler1 = joblib.load('scaler1.pkl')
    
    # Load second motor model and scaler
    model2 = joblib.load('motor_model.pkl')
    scaler2 = joblib.load('scaler2.pkl')
    
    logger.info("Successfully loaded all models and scalers")
except Exception as e:
    logger.error(f"Error loading models or scalers: {e}")
    raise

@app.route('/predict-motor', methods=['POST'])
def predict_motor():
    try:
        data = request.json
        logger.debug(f"Received data: {data}")
        
        # Validate input data
        if not all(key in data for key in ['temperature', 'humidity', 'soil_moisture', 'water_level']):
            return jsonify({"error": "Missing required fields"}), 400

        # Prepare input data
        input_data = np.array([[
            float(data['temperature']),
            float(data['humidity']),
            float(data['soil_moisture']),
            float(data['water_level'])
        ]])
        
        # Scale the input data
        input_data_scaled = scaler1.transform(input_data)
        
        # Make prediction
        prediction = model1.predict(input_data_scaled)[0]
        logger.debug(f"Prediction result: {prediction}")
        
        return jsonify({'motor_on_time': round(float(prediction), 2)})
    except Exception as e:
        logger.error(f"Error in predict_motor: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 400

@app.route('/predict-motor-2', methods=['POST'])
def predict_motor_2():
    try:
        data = request.json
        logger.debug(f"Received data: {data}")
        
        # Validate input data
        if not all(key in data for key in ['temperature', 'humidity', 'soil_moisture', 'water_level']):
            return jsonify({"error": "Missing required fields"}), 400

        # Prepare input data
        input_data = np.array([[
            float(data['temperature']),
            float(data['humidity']),
            float(data['soil_moisture']),
            float(data['water_level'])
        ]])
        
        # Scale the input data
        input_data_scaled = scaler2.transform(input_data)
        
        # Make prediction
        prediction = model2.predict(input_data_scaled)[0]
        logger.debug(f"Prediction result: {prediction}")
        
        return jsonify({'motor_on_time': round(float(prediction), 2)})
    except Exception as e:
        logger.error(f"Error in predict_motor_2: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 400

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001) 