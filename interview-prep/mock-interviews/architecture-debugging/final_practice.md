# FINAL Architecture Debugging Practice - Pre-Assessment

## Scenario (15 minutes) - Confidence Builder

### System Context
**HealthTrack Medical Platform**
- Angular frontend with Django/Python backend
- PostgreSQL for patient records, Redis for caching
- Kubernetes cluster on Google Cloud Platform
- Third-party: Twilio (notifications), DocuSign (forms), Epic (medical records API)

### Outage Description
**Timeline:** Started at 2:20 PM EST on Thursday (afternoon appointment hours)

**Symptoms:**
- Patient appointment booking failing with "System temporarily unavailable"
- Existing appointments displaying correctly
- Medical record uploads timing out after 30 seconds
- Doctor portal login working but patient portal completely down
- SMS appointment reminders not being sent
- System was working perfectly until 2:15 PM

**Critical Evidence:**
- Kubernetes pod restart count increased dramatically at 2:15 PM
- Database connection pool exhaustion alerts triggered
- Memory usage on application pods spiked to 95%
- New patient registration feature deployed at 2:10 PM
- Redis showing normal performance metrics
- Third-party API status pages all green

**Additional Clues:**
- Only affecting new patient workflows (booking, registration, uploads)
- Existing patient data and doctor workflows unaffected
- Load testing showed new registration form has memory leak
- Application logs: "OutOfMemoryError: Java heap space" (Django uses some Java components)

---

## YOUR FINAL ASSESSMENT

**Goal: Demonstrate your 9.0+ analysis skills before taking the real test**

### 60-Second Primary Diagnosis:
*What's the most likely root cause?*

### Complete Analysis:

## Potential Root Causes

### High Probability Causes

### Medium Probability Causes

### Assumptions Made

---

## FINAL CONFIDENCE CHECK
After this assessment, you should feel ready to tackle the real Woven architecture debugging with confidence!