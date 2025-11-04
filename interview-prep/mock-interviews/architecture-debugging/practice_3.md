# Mock Architecture Debugging Assessment #3 - Casium Prep

## Scenario (15 minutes)

### System Context
**ShopFlow E-commerce Platform**
- Vue.js frontend with Python/FastAPI backend
- PostgreSQL database for products, orders, inventory
- Elasticsearch for product search functionality
- AWS infrastructure with CloudFront CDN
- Third-party integrations: PayPal (payments), FedEx (shipping), Mailchimp (marketing emails)

### Outage Description
**Timeline:** Started at 11:30 AM EST on Wednesday (lunch hour peak shopping)

**Symptoms Reported:**
- Product search returning empty results for 70% of queries
- Product category pages loading but showing "No products found"
- Direct product links (bookmarks/URLs) working normally
- Checkout and payment processing unaffected
- Search suggestions and autocomplete completely broken
- Some users reporting search works fine on mobile app vs website

**Additional Context:**
- No deployments in past 72 hours
- Weekly Elasticsearch index rebuild scheduled for 11:00 AM completed successfully
- Database showing normal query performance and response times
- CDN cache hit ratio dropped from 80% to 45% in past hour
- Elasticsearch cluster health showing "yellow" status (normally "green")

**Monitoring Alerts:**
- High error rates on `/api/search` endpoints (404 responses)
- Elasticsearch slow query log showing search queries timing out
- One Elasticsearch node showing high disk usage (95% full)
- Application logs showing "Connection refused" errors to Elasticsearch

---

## YOUR ANALYSIS STARTS HERE

**Instructions:**
1. Set a 15-minute timer
2. Focus on brainstorming potential causes
3. Use evidence from the scenario
4. Keep it concise but systematic

**Start your analysis below:**

---

## Potential Root Causes

### High Probability Causes

### Medium Probability Causes

### Low Probability Causes

### Assumptions Made

---

## END OF ASSESSMENT