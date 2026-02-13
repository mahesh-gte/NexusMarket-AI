from fastapi import APIRouter, Depends
from app.utils.mock_data import vendors
from app.core.dependencies import require_role
from app.core.roles import ADMIN, VENDOR
from app.schemas.schemas import VendorCreate

router = APIRouter(prefix="/vendors", tags=["Vendors"])


@router.get("/", dependencies=[Depends(require_role([ADMIN, VENDOR]))])
def get_all_vendors():
    return vendors


@router.get("/{vendor_id}", dependencies=[Depends(require_role([ADMIN, VENDOR]))])
def get_vendor(vendor_id: int):
    for vendor in vendors:
        if vendor["id"] == vendor_id:
            return vendor
    return {"error": "Vendor not found"}

@router.post("/", status_code=201, dependencies=[Depends(require_role([ADMIN]))])
def create_vendor(payload: VendorCreate):
    new_vendor = {
        "id": len(vendors) + 1,
        "name": payload.name,
        "email": payload.email,
        "is_active": True,
        "rating": payload.rating
    }
    vendors.append(new_vendor)
    return new_vendor
