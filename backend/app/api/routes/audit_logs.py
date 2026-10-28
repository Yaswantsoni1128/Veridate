"""API routes for audit logs."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.audit_log import AuditLog

router = APIRouter(prefix="/audit-logs", tags=["audit-logs"])


@router.get("/")
def list_audit_logs(
    skip: int = 0,
    limit: int = 100,
    case_id: int | None = None,
    db: Session = Depends(get_db),
):
    """List audit logs with optional case filter."""
    query = db.query(AuditLog)
    if case_id:
        query = query.filter(AuditLog.case_id == case_id)
    total = query.count()
    logs = query.order_by(AuditLog.created_at.desc()).offset(skip).limit(limit).all()
    return {"items": logs, "total": total, "skip": skip, "limit": limit}
