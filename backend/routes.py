from ipaddress import IPv4Address, IPv4Interface
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

## mongo start
# first we'll be using fake data thus we could develop the frontend part of app without access to the real switchfabric
# to store and retrieve such date mongodb is being used
import motor.motor_asyncio
from fastapi.encoders import jsonable_encoder

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

## custom evpn data class
from pydantic import BaseModel, ValidationError, validator
from typing import List, Union, Optional

class EvpnDataClass(BaseModel):
    # mandatory data
    vlan_id: int
    vni: int
    # optional data (with defaults)
    ip_address: IPv4Interface = None # it can be blank in case of 'remove' operation but it's absolutely mandatory for the 'create' operation
    vlan_name: str = None
    mtu: Union[int, str] = 1500
    description: str = 'anycast SVI'
    vrf_name: str = 'Tenant-1'
    #mgroup: IPv4Address = '231.1.1.111'
    mgroup: str = '231.1.1.111'
    supARP: bool = False

    class Config:
        schema_extra = {
            "example": {
                "vlan_id": 10,
                "vni": 10010,
                "ip_address": '10.1.10.254/24',
                "vlan_name": "VLAN10",
                "mtu": 1500,
                "description": "SVI10",
                "vrf_name": "Tenant-1",
                "mgroup": "231.1.1.10",
                "supARP": False,
            }
        }

    @validator('vlan_id')
    def v_name(cls, v):
        if not 1 < v < 4096:
            raise ValueError('vlan_id must be within range 1..4096 ')
        return v


"""
evpnData = [
    { "id": 10, "data": {"vlan_id":"10","vni":"10010","vlan_name":"","svi_ip":"","svi_descr":"","mtu":"","vrf":"","mgroup":"","arpsup":True }},
    { "id": 20, "data": {"vlan_id":"20","vni":"10020","vlan_name":"","svi_ip":"","svi_descr":"","mtu":"","vrf":"","mgroup":"","arpsup":False }},
    { "id": 30, "data": {"vlan_id":"30","vni":"10030","vlan_name":"Vlan30","svi_ip":"10.1.30.254/24","svi_descr":"","mtu":"1600","vrf":"Tenant-1","mgroup":"231.0.0.30","arpsup":True }},
]
"""

## FastAPI Routes
#@app.get("/getEvpnAll")
#async def getEvpnAll():
#    res = await app.db.evpn.find_one({})
#    return { "evpnData": res["evpnData"] }

@app.get("/getEvpnAll", response_model=List[EvpnDataClass])
async def getEvpnAll():
    evpns = []
    res = await app.db.evpn.find_one({})
    
    for evpn in res["evpnData"]:
        print(evpn)
        evpns.append(EvpnDataClass(**evpn))
    
    return evpns

@app.post("/putEvpnAll")
async def putEvpnAll(data):
    pass



#if __name__ == "__main__":
#    uvicorn.run(app, host="0.0.0.0", port=8000)

