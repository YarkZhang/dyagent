from fastapi import FastAPI
from agent.logic import run_agent

app = FastAPI()

@app.get("/")
def root():
    return {"message": "dyagent is running"}

@app.post("/run")
def run(payload: dict):
    return run_agent(payload)
