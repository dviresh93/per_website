# Mock Architecture Debugging Assessment #2 - Casium Prep

## Scenario (15 minutes)

### System Context
**FinanceFlow Banking Application**
- React frontend with Node.js/Express backend
- MySQL database with customer accounts and transactions
- Redis for session caching and rate limiting
- AWS infrastructure with auto-scaling groups
- Third-party integrations: Plaid (account linking), Stripe (payments), Twilio (SMS notifications)

### Outage Description
**Timeline:** Started at 9:15 AM EST on Friday morning (high transaction volume time)

**Symptoms Reported:**
- 60% of users experiencing "Login failed" errors
- Successful logins taking 15-20 seconds (normally 2-3 seconds)
- Mobile app showing "Network timeout" errors more than web app
- Password reset emails not being delivered
- Users who stay logged in can perform transactions normally
- New user registrations completely failing

**Additional Context:**
- Code deployment completed at 8:45 AM (30 minutes before issue started)
- Database CPU usage spiked to 85% (normally 30-40%)
- Redis connection count increased 300% from normal levels
- Email service provider (SendGrid) status page shows all green
- Load balancer showing even traffic distribution across all servers

**Monitoring Alerts:**
- High response times on `/auth/login` and `/auth/register` endpoints
- MySQL slow query log showing authentication-related queries taking 10+ seconds
- Redis memory usage at 90% (normally 60%)
- 5xx error rate increased from 0.1% to 8% system-wide

---

## YOUR ANALYSIS STARTS HERE

**Instructions:**
1. Set a 15-minute timer
2. Focus on potential causes only (not solutions)
3. Use the realistic format from previous practice
4. Be concise but systematic

**Start your analysis below:**

---

## Potential Root Causes

### High Probability Causes

### Medium Probability Causes

### Low Probability Causes

### Assumptions Made

---

## END OF ASSESSMENT