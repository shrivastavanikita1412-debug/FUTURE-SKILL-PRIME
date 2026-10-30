from fastapi import APIRouter, HTTPException
from backend.schemas.hygiene_schema import HygieneInspectionRequest, HygieneInspectionResponse
from backend.services.hygiene_service import audit_facility_hygiene

router = APIRouter()

@router.post("/audit", response_model=HygieneInspectionResponse)
def audit_hygiene(request: HygieneInspectionRequest):
    if not request.image_base64:
        raise HTTPException(status_code=400, detail="Image base64 payload is required")
    return audit_facility_hygiene(request.image_base64, request.facility_type or "Commercial Kitchen")
