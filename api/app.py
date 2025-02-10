from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import numpy as np

# Load the trained model
with open("asteroid_model.pkl", "rb") as f:
    model = pickle.load(f)

app = FastAPI()

# Request model
class AsteroidInput(BaseModel):
    size: float
    velocity: float
    distance: float

@app.get("/")
def root():
    return {"message": "Asteroid Impact Prediction API"}

@app.post("/predict")
def predict(asteroid: AsteroidInput):
    features = np.array([[asteroid.size, asteroid.velocity, asteroid.distance]])
    prediction = model.predict(features)[0]
    return {"hazardous": bool(prediction)}
