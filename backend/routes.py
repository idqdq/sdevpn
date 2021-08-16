from fastapi import FastAPI, Request, Body, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from typing import List
from models import EvpnDataClass

app = FastAPI()

## mongo start
# first we'll be using fake data thus we could develop the frontend part of app without access to the real switchfabric
# to store and retrieve such date mongodb is being used
import motor.motor_asyncio

@app.on_event("startup")
async def create_db_client():
    mdbclient = motor.motor_asyncio.AsyncIOMotorClient()
    app.db = mdbclient.evpn

@app.on_event("shutdown")
async def shutdown_db_client():
    # stop your client here
    app.db.close()

## mongo end

## CORS
origins = [    
    "http://127.0.0.1",
    "http://127.0.0.1:3000",
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
## CORS end

## FastAPI Routes
@app.get("/getEvpnAll", response_model=List[EvpnDataClass])
async def getEvpnAll():
    evpns = []
        
    async for evpn in app.db.evpn.find({}):
        print(evpn)
        evpns.append(EvpnDataClass(**evpn))
    
    return evpns


@app.get("/getEvpn/{vni}")    
async def getEvpn(vni: int):
    if (evpn := await app.db.evpn.find_one({"vni": vni})) is not None:
        return evpn

    raise HTTPException(status_code=404, detail=f"VNI: {id} not found")


@app.post("/createEvpn")
async def createEvpn(evpn: EvpnDataClass = Body(...)):
    
    evpn = jsonable_encoder(evpn)
    new_evpn = await app.db.evpn.insert_one(evpn)

    created_evpn = await app.db.evpn.find_one({"_id": new_evpn.inserted_id})

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_evpn)



#if __name__ == "__main__":
#    uvicorn.run(app, host="0.0.0.0", port=8000)