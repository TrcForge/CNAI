from fastapi import FastAPI

from backend.routes.health import router as health_router
from backend.routes.cases import router as cases_router
from backend.routes.entities import router as entities_router
from backend.routes.relationships import router as relationships_router
from backend.osint.routes import router as osint_router

app = FastAPI(
    title="Criminal Network Intelligence System",
    description=(
        "Unified backend API for the AI-Powered Criminal "
        "Network Analysis System"
    ),
    version="1.0.0"
)


app.include_router(health_router)
app.include_router(cases_router)
app.include_router(entities_router)
app.include_router(relationships_router)
app.include_router(osint_router)

@app.get("/")
def root():
    return {
        "service": "Criminal Network Intelligence System",
        "status": "running",
        "version": "1.0.0"
    }