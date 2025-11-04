# FINAL MOCK ASSESSMENT - Casium AI Product Engineer

## 🚨 **REAL ASSESSMENT CONDITIONS**
**Time Limit:** 30 minutes
**Format:** Code Review (like real Woven assessment)
**Target:** 8.5+/10
**Company:** Casium - Immigration AI Platform

---

## Scenario Context
**Pull Request:** "Add AI document analysis endpoint with user validation"
**Author:** Mid-level engineer on your team
**Task:** Review this code as if it's going to production tomorrow
**Stakes:** Handles real immigration documents for visa applications

## Code Under Review

```python
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import openai
import json
import uuid
import os
from datetime import datetime

app = FastAPI()
security = HTTPBearer()

# Models
class DocumentAnalysisRequest(BaseModel):
    case_id: str
    analysis_type: str  # "h1b", "l1", "o1"

class DocumentAnalysisResponse(BaseModel):
    document_id: str
    extracted_data: Dict[str, Any]
    confidence_score: float
    processing_time: float

# Database (simplified)
def get_db():
    pass

def verify_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    # Simple token validation
    if len(token) < 10: # This need to more sophesticated ; either validate this against a database, or do some encrytion check 
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"user_id": 123, "email": "user@example.com"}

# AI Analysis Function
def analyze_document_with_ai(document_content: str, analysis_type: str) -> Dict[str, Any]:
    """Extract information from immigration documents using OpenAI"""

    openai.api_key = os.getenv('OPENAI_API_KEY')

    # this is vurnarable to prompt injection: sturcture this better using openai prompting libraries. Divide this into system prompt; role; goal & context. You can make this clean and scalable by defining a function - say def prompt_generatore(arguments) - this can be an abstract class / utlitiy tool - that can generate prompts in a consistent format 
    prompt = f"""
    Analyze this {analysis_type} immigration document and extract:
    - Applicant name
    - Job title
    - Salary
    - Company name
    - Start date

    Document content: {document_content}

    Return valid JSON only:
    """

    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=1000,
        temperature=0.1
    ) # max_tokens=1000, temperature=0.1, should be retrieved from a config file for better maintainability
    
    result = response.choices[0].text.strip() # result of the prompt needs to be validated here. You can use pydantic parsers, to ensure consistency; once we got the data in a clean format, you can validate the response using an llm call; this whole thing can be abstracted to a utility function aswell as i decribed earlier - def validate_reposonse (original_query, response) this will use LLM as a judge, then return confidence 
    data = json.loads(result)
    # confidence and processing time must not be hardcoded. You can you use LLM as a judge to validate the response against the original query to comeup with  a confidence metric. For preocessing time - initialize a timer starting of the function, then capure the time at this step - diff will be the prcessing time. 
    return {
        "extracted_fields": data,
        "confidence": 0.95,
        "processing_time": 2.3
    }

@app.post("/analyze-document", response_model=DocumentAnalysisResponse)
async def analyze_document(
    request: DocumentAnalysisRequest,
    file: UploadFile = File(...),
    user: dict = Depends(verify_user),
    db: Session = Depends(get_db)
):
    """Analyze uploaded immigration document with AI"""

    # Read file content
    content = await file.read() # add some timeouts here, incase the file reading takes for ever, also first validate the file before starting the read 
    document_text = content.decode('utf-8')

    # Validate case belongs to user
    case = db.query("SELECT * FROM cases WHERE id = ? AND user_id = ?", 
                   request.case_id, user["user_id"]) 
    if not case: # you can add try catch staments here, to handle any failed queries, or inconsistent data, thats much more clearner. Bonus ponits, to log all this to a seperate file for future review 
        raise HTTPException(status_code=404, detail="Case not found")

    # Run AI analysis
    start_time = datetime.now()
    analysis_result = analyze_document_with_ai(document_text, request.analysis_type)
    processing_time = (datetime.now() - start_time).total_seconds()

    # Save results to database
    document_id = str(uuid.uuid4())
    db.execute(
        "INSERT INTO document_analyses (id, case_id, user_id, extracted_data, created_at) VALUES (?, ?, ?, ?, ?)",
        document_id, request.case_id, user["user_id"],
        json.dumps(analysis_result["extracted_fields"]), datetime.now()
    )
    db.commit() # its ideal to validate the database - make sure there is enough space, and rhe schema itself, before adding the query. Also add try catch for exception handling 

    return DocumentAnalysisResponse(
        document_id=document_id,
        extracted_data=analysis_result["extracted_fields"],
        confidence_score=analysis_result["confidence"],
        processing_time=processing_time
    )

@app.get("/cases/{case_id}/analyses")
async def get_case_analyses(
    case_id: str,
    user: dict = Depends(verify_user),
    db: Session = Depends(get_db)
):
    """Get all AI analyses for a case"""
    # either intialize analysis to something, incase there is no data - we return some valid response 
    analyses = db.query(
        "SELECT * FROM document_analyses WHERE case_id = ? ORDER BY created_at DESC",
        case_id
    ).fetchall()

    return {"analyses": analyses}
```

---

## YOUR FINAL ASSESSMENT (30 MINUTES)

**Use your proven style - inline comments + structured feedback**

### Overall Assessment (2 minutes)
*Production readiness? Confidence level?*

### Critical Issues Found (10 minutes)
*Security, reliability, data integrity*

### Technical Issues (10 minutes)
*API design, error handling, performance*

### Quick Wins (5 minutes)
*Easy fixes that improve quality*

### Final Recommendation (3 minutes)
*Merge? Request changes? Block?*

---

## **START TIMER NOW: 30 MINUTES** ⏰

**This is it - your final practice before the real Casium assessment!**

**Go!** 🚀