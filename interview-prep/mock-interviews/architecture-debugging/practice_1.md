# Mock Architecture Debugging Assessment

## Scenario (15 minutes)

### System Context
**TechCorp E-learning Platform**
- Django web application serving 50,000 daily active users
- PostgreSQL database with course content and user progress
- Redis cache for session management
- AWS infrastructure with load balancers
- Third-party integrations: Stripe (payments), SendGrid (emails), Zoom (video calls)

### Outage Description
**Timeline:** Started at 2:30 PM EST on Tuesday (peak learning hours)

**Symptoms Reported:**
- 80% of users unable to access course videos
- Video pages showing "503 Service Unavailable" errors
- Course text content loading normally
- User login/logout working fine
- Payment processing unaffected
- Some users in West Coast reporting normal video access

**Additional Context:**
- No recent deployments in past 48 hours
- Database performance metrics showing normal query times
- CDN provider (CloudFlare) status page shows all green
- Customer support receiving 200+ tickets in past hour
- System had similar brief issue 3 days ago that resolved itself after 20 minutes

**Monitoring Alerts:**
- High error rate on `/api/video/stream` endpoints
- Load balancer health checks failing on 2 out of 6 app servers
- Redis connection count within normal limits
- No unusual traffic spikes detected

---

## YOUR ANALYSIS STARTS HERE

**Instructions:**
1. You have 15 minutes to identify potential root causes
2. Focus on brainstorming causes, not solutions
3. Organize by probability (High/Medium/Low)
4. Document any assumptions you make
5. Use the systematic approach from the prep guide

**Start your analysis below:**

---

## Potential Root Causes
503 services not found indicates that request is not getting served - there uses are not able to access the course videos, but rest of the services are not affected - indicating something could be going on in the postgres database 

Since the databse checks itself are showing all green, its likely that we might have hit some deadlock scenario itself 

Only likely scanario for this could be, if database is its trying fetch data from some invalid location, or its waiting on some services to finish action

And/or database does not have sufficient RAM / compute sources to complete the action

### High Probability

Video is not is the correct location or if the video itself is corrupted

### Medium Probability

Postgres server does not have sufficient cache / RAM and / or compute to complete the action

There is some resource continully polling the database so it continuously only serving that resouce, hance not able to serve the other users


Status checks that are indicating all green could be all false positvies, check if they are actually fetching the real status of the database and of the other services 

### Low Probability (Worth Investigating)


If the there some authentication that needs to be happening to access the video, and if any of that has been changed - this can happen if the video is stored in some other location

There is a corrupted files 

### Assumptions Made

---

## REALISTIC 15-MIN SOLUTION

### High Probability Causes

1. **Regional CDN/Video Server Failure**
   - West Coast works, East Coast fails = geographic issue
   - 503 on video endpoints specifically
   - Recurring (happened 3 days ago)

2. **App Server Resource Exhaustion**
   - 2/6 servers failing health checks
   - Video processing is resource-heavy
   - Only video affected, not text content

3. **Video Storage Backend Issues**
   - S3/video storage regional problems
   - Network issues between app servers and video storage

### Medium Probability

4. **Load Balancer Routing Problems**
   - Health check failures suggest LB issues
   - Regional routing misconfigured

5. **Video Service Dependencies**
   - Third-party video hosting degradation
   - CDN provider regional issues

### Assumptions Made
- Videos served via separate infrastructure from text
- Geographic load balancing in use
- Database ruled out (metrics normal)

---

## END OF ASSESSMENT

**When you're done, I'll provide coaching feedback on your analysis approach and how to improve for the real assessment.**