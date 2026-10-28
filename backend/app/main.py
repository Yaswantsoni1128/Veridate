"""FastAPI application entry point."""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes.verify import router as verify_router
from app.api.routes.candidates import router as candidates_router
from app.api.routes.cases import router as cases_router
from app.api.routes.documents import router as documents_router
from app.api.routes.audit_logs import router as audit_logs_router
from app.api.routes.dashboard import router as dashboard_router

logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    docs_url="/docs",
    redoc_url="/redoc",
    debug=settings.debug,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(verify_router)
app.include_router(candidates_router)
app.include_router(cases_router)
app.include_router(documents_router)
app.include_router(audit_logs_router)
app.include_router(dashboard_router)

logger.info("Started %s v%s", settings.app_name, settings.app_version)
