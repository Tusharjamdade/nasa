from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np

# Load the trained model
with open("asteroid_model.pkl", "rb") as f:
    model = pickle.load(f)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
