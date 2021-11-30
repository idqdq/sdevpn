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
    vlan_id: int = Field(..., gt=1, lt=4096)
    vni: int = Field(..., ge=10000, lt=10999)
    svi_ip: IPv4Interface
    # optional data (with defaults)
    vlan_name: str = None
    mtu: int = Field(1500, ge=1280, le=9216)
    svi_descr: str = 'anycast SVI'
    vrf: str = 'Tenant-1'
    mgroup: Optional[IPv4Address]
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
                "mgroup": "239.1.1.10",
                "arpsup": False,
            }
        }

    """
    @validator('vlan_id')
    def v_vlan_id(cls, v):
        if not 1 < v < 4096:
            raise ValueError('vlan_id must be within range 1..4096 ')
        return v

    @validator('vni')
    def v_vni(cls, v):
        if not 10000 < v < 10999:
            raise ValueError('vlan_id must be within range 10000..10999')
        return v

    @validator('mtu')
    def v_vni(cls, v):
        if not 1280 <= v <= 9216:
            raise ValueError('vlan_id must be within range 1280..9216')
        return v
    """

    @validator('mgroup')
    def v_svi_ip(cls,v):
        if v is not None:
            assert IPv4Address(v).is_multicast, 'mgorup address must be multicast address'
        return v        
    



class Update_EvpnDataClass(BaseModel):   
    vlan_id: int = Field(..., gt=1, lt=4096)
    vni: int = Field(..., ge=10000, lt=10999)     
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
                "mgroup": "239.1.1.10",
                "arpsup": False,
            }
        }

