"""Audit log repository for data access operations."""

from typing import Optional, List, Dict, Any
import json

from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


class AuditLogRepository:
    """Repository for AuditLog model operations."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def create(
        self,
        actor: str,
        action: str,
        case_id: Optional[int] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> AuditLog:
        """Create a new audit log entry."""
        log = AuditLog(
            actor=actor,
            action=action,
            case_id=case_id,
            metadata_json=json.dumps(metadata) if metadata else None,
        )
        self.db.add(log)
        self.db.commit()
        self.db.refresh(log)
        return log

    def list_by_case(self, case_id: int) -> List[AuditLog]:
        """Get all audit logs for a case."""
        return (
            self.db.query(AuditLog)
            .filter(AuditLog.case_id == case_id)
            .order_by(AuditLog.created_at.desc())
            .all()
        )

    def list_all(self, skip: int = 0, limit: int = 100) -> List[AuditLog]:
        """List audit logs with pagination."""
        return (
            self.db.query(AuditLog)
            .order_by(AuditLog.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
