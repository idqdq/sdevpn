from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient

app = FastAPI()

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

@app.get("/getEvpnAll")
async def getEvpnAll():
# first we'll be using fake data so we could develop the frontend part of app without access to the real switchfabric
    with MongoClient() as mc:
        db = mc.evpn
        return { "evpnData": db.evpn.find_one({})["evpnData"] }
    """{
        "evpnData": [
            {"vlan_id":"10","vni":"10010","vlan_name":"","svi_ip":"","svi_descr":"","mtu":"","vrf":"","mgroup":"","arpsup":True},
            {"vlan_id":"20","vni":"10020","vlan_name":"","svi_ip":"","svi_descr":"","mtu":"","vrf":"","mgroup":"","arpsup":False},
            {"vlan_id":"30","vni":"10030","vlan_name":"Vlan30","svi_ip":"10.1.30.254/24","svi_descr":"","mtu":"1600","vrf":"Tenant-1","mgroup":"231.0.0.30","arpsup":True},
            ]
    }"""


""" fill the mongodb instance with evpn data with the following code:
from pymongo import MongoClient
client = MongoClient()
db = client.evpn
evpn =  {
        "evpnData": [
            {"vlan_id":"10","vni":"10010","vlan_name":"","svi_ip":"","svi_descr":"","mtu":"","vrf":"","mgroup":"","arpsup":True},
            {"vlan_id":"20","vni":"10020","vlan_name":"","svi_ip":"","svi_descr":"","mtu":"","vrf":"","mgroup":"","arpsup":False},
            {"vlan_id":"30","vni":"10030","vlan_name":"Vlan30","svi_ip":"10.1.30.254/24","svi_descr":"","mtu":"1600","vrf":"Tenant-1","mgroup":"231.0.0.30","arpsup":True},
            ]
    }
res = db.evpn.insert_one(evpn)
"""