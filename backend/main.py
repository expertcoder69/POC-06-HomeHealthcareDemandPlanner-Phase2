from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import math
from typing import List
import uvicorn

app = FastAPI(title="Home Healthcare Demand Planner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---
class Coordinates(BaseModel):
    lat: float
    lng: float

class Caregiver(BaseModel):
    id: str
    name: str
    location: Coordinates
    status: str  # "Active", "In Transit", "Available"
    specialty: str

class VisitRequest(BaseModel):
    id: str
    location: Coordinates
    urgency: str  # "High", "Medium", "Low"
    service_type: str
    wait_time_mins: int

class KPI(BaseModel):
    total_requests: int
    active_caregivers: int
    average_wait_time: int
    caregiver_ratio: float
    
class WaitTimeHistogram(BaseModel):
    zone: str
    wait_times: List[int]

# --- Synthetic Data Generation ---
CITIES = {
    "Riyadh": {"lat": 24.7136, "lng": 46.6753},
    "Jeddah": {"lat": 21.5433, "lng": 39.1925},
    "Abu_Dhabi": {"lat": 24.4539, "lng": 54.3773},
    "Dubai": {"lat": 25.2048, "lng": 55.2708}
}

def generate_random_location(center_lat, center_lng, radius_km=15):
    radius_in_degrees = radius_km / 111.0
    u = random.uniform(0, 1)
    v = random.uniform(0, 1)
    w = radius_in_degrees * math.sqrt(u)
    t = 2 * math.pi * v
    x = w * math.cos(t)
    y = w * math.sin(t)
    new_lng = x / math.cos(math.radians(center_lat)) + center_lng
    new_lat = y + center_lat
    return Coordinates(lat=new_lat, lng=new_lng)

def generate_caregivers(city: str, count: int) -> List[Caregiver]:
    caregivers = []
    center = CITIES[city]
    specialties = ["Nursing Care", "Physiotherapy", "Palliative Care", "Respiratory Care"]
    statuses = ["Available", "In Transit", "Active"]
    for i in range(count):
        loc = generate_random_location(center["lat"], center["lng"], radius_km=20)
        caregivers.append(Caregiver(
            id=f"CG-{city[:3]}-{i}",
            name=f"Caregiver {i}",
            location=loc,
            status=random.choices(statuses, weights=[0.4, 0.3, 0.3])[0],
            specialty=random.choice(specialties)
        ))
    return caregivers

def generate_visit_requests(city: str, count: int) -> List[VisitRequest]:
    requests = []
    center = CITIES[city]
    services = ["Post-Op Care", "Elderly Assistance", "Chronic Disease Mgmt", "Medication Admin"]
    urgencies = ["Low", "Medium", "High"]
    
    for i in range(count):
        loc = generate_random_location(center["lat"], center["lng"], radius_km=25)
        urgency = random.choices(urgencies, weights=[0.5, 0.3, 0.2])[0]
        base_wait = {"Low": 120, "Medium": 60, "High": 30}[urgency]
        actual_wait = max(0, int(random.gauss(base_wait, 20)))

        requests.append(VisitRequest(
            id=f"VR-{city[:3]}-{i}",
            location=loc,
            urgency=urgency,
            service_type=random.choice(services),
            wait_time_mins=actual_wait
        ))
    return requests

# --- API Endpoints ---

@app.get("/api/v1/demand/heatmap")
def get_heatmap(city: str = "Abu_Dhabi", count: int = 200):
    if city not in CITIES:
        city = "Abu_Dhabi"
    return generate_visit_requests(city, count)

@app.get("/api/v1/caregivers/locations")
def get_caregivers(city: str = "Abu_Dhabi", count: int = 50):
    if city not in CITIES:
        city = "Abu_Dhabi"
    return generate_caregivers(city, count)

@app.get("/api/v1/analytics/kpis")
def get_kpis(city: str = "Abu_Dhabi"):
    req_count = random.randint(150, 300)
    cg_count = random.randint(40, 80)
    
    return KPI(
        total_requests=req_count,
        active_caregivers=cg_count,
        average_wait_time=random.randint(45, 90),
        caregiver_ratio=round(req_count / max(1, cg_count), 2)
    )

@app.get("/api/v1/analytics/wait-times")
def get_wait_time_histogram(city: str = "Abu_Dhabi"):
    return [
        WaitTimeHistogram(zone="North District", wait_times=[random.randint(10, 180) for _ in range(50)]),
        WaitTimeHistogram(zone="South District", wait_times=[random.randint(20, 200) for _ in range(60)]),
        WaitTimeHistogram(zone="Central Business", wait_times=[random.randint(5, 120) for _ in range(80)])
    ]

if __name__ == "__main__":
    # Changed from 127.0.0.1 to 0.0.0.0 for Docker networking
    uvicorn.run("main:app", host="0.0.0.0", port=8000)