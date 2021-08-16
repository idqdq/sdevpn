## custom evpn data class with the mongo specific ObjectId 
from pydantic import BaseModel, ValidationError, Field, validator
from typing import List, Union, Optional
from bson import ObjectId
from ipaddress import IPv4Address, IPv4Interface

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class EvpnDataClass(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    # mandatory data
    vlan_id: int
    vni: int
    svi_ip: IPv4Interface
    # optional data (with defaults)
    vlan_name: str = None
    mtu: Union[int, str] = 1500
    svi_descr: str = 'anycast SVI'
    vrf: str = 'Tenant-1'
    mgroup: IPv4Address = None
    #mgroup: str = '231.1.1.111'
    arpsup: bool = False

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "vlan_id": 10,
                "vni": 10010,
                "svi_ip": '10.1.10.254/24',
                "vlan_name": "VLAN10",
                "mtu": 1500,
                "svi_descr": "SVI10",
                "vrf": "Tenant-1",
                "mgroup": "231.1.1.10",
                "arpsup": False,
            }
        }

    @validator('vlan_id')
    def v_name(cls, v):
        if not 1 < v < 4096:
            raise ValueError('vlan_id must be within range 1..4096 ')
        return v


class Update_EvpnDataClass(BaseModel):    
    vlan_id: Optional[int]
    vni: Optional[int]
    svi_ip: Optional[IPv4Interface]
    vlan_name: Optional[str]
    mtu: Optional[int]
    svi_descr: Optional[str]
    vrf: Optional[str]
    mgroup: Optional[IPv4Address]
    arpsup: Optional[bool]

    class Config:        
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "vlan_id": 10,
                "vni": 10010,
                "svi_ip": '10.1.10.254/24',
                "vlan_name": "VLAN10",
                "mtu": 1500,
                "svi_descr": "SVI10",
                "vrf": "Tenant-1",
                "mgroup": "231.1.1.10",
                "arpsup": False,
            }
        }

"""
evpnData = [
    { "id": 10, "data": {"vlan_id": 10,"vni": 10010,"vlan_name":"","svi_ip":"","svi_descr":"","mtu":"","vrf":"","mgroup":"","arpsup": true }},
    { "id": 20, "data": {"vlan_id": 20,"vni": 10020,"vlan_name":"","svi_ip":"","svi_descr":"","mtu":"","vrf":"","mgroup":"","arpsup": false }},
    { "id": 30, "data": {"vlan_id": 30,"vni": 10030,"vlan_name":"Vlan30","svi_ip":"10.1.30.254/24","svi_descr":"","mtu":"1600","vrf":"Tenant-1","mgroup":"231.0.0.30","arpsup":true }},
]
"""
