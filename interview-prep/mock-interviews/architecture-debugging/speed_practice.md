# Mock Architecture Debugging Assessment - SPEED CHALLENGE

## Scenario (15 minutes) - Focus on Speed + Specificity

### System Context
**StreamVibe Video Platform**
- React frontend with Node.js/Express backend
- MongoDB for user data, PostgreSQL for billing
- Redis for session management
- AWS with CloudFront CDN for video delivery
- Third-party: AWS S3 (video storage), Stripe (payments), Auth0 (authentication)

### Outage Description
**Timeline:** Started at 3:45 PM EST on Friday (peak streaming hours)

**Symptoms:**
- Video playback failing for 85% of users with "Content not available" errors
- Video thumbnails and metadata loading normally
- User login/logout working perfectly
- Billing and subscription management unaffected
- Live streams working fine, only on-demand videos failing
- Users in EU reporting normal service, US users affected

**Critical Evidence:**
- AWS S3 service dashboard shows degraded performance in us-east-1 region
- CloudFront cache miss rate spiked to 95% (normally 15%)
- Application logs: "403 Forbidden" errors when accessing S3 video files
- Database queries all performing normally
- Recent deployment 2 hours ago updated video access token generation logic

---

## SPEED CHALLENGE - Your Goal: Identify Primary Cause in 60 SECONDS

**Read the scenario above for 60 seconds, then immediately write your #1 most likely cause:**

### Primary Cause (60-second diagnosis):
*Write your immediate assessment here*

---

## Full 15-Minute Analysis

Now spend the remaining time on complete analysis:

### High Probability Causes

### Medium Probability Causes

### Assumptions Made

---

## COACHING FOCUS
- Did you spot the primary cause in 60 seconds?
- How specific were your technical details?
- Did you follow the evidence chain completely?