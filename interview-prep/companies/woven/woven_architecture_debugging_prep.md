# Woven Architecture Debugging Prep (15 min scenario)

## Objective
- **Task:** Brainstorm potential causes of a system outage
- **Time:** 15 minutes
- **Focus:** Potential causes only (not solutions or debugging steps)
- **Format:** Likely a specific outage scenario description

## Systematic Approach (Use This Framework)

### 1. Read Scenario Carefully (2 minutes)
- What symptoms are described?
- What system components are mentioned?
- What was the user impact?
- Any timing information (when did it start, patterns)?

### 2. Layer-by-Layer Analysis (10 minutes)

#### Frontend/Client Layer
- **Browser issues:** JavaScript errors, DNS resolution, CDN problems
- **Mobile app:** App crashes, API timeouts, network connectivity
- **User devices:** Device-specific bugs, OS version compatibility

#### Load Balancer/Proxy Layer
- **Load balancer failure:** Health check failures, traffic routing issues
- **CDN problems:** Cache invalidation, geographic routing issues
- **Rate limiting:** DDoS protection triggering, API limits exceeded

#### Web Application Server Layer
- **Application crashes:** Memory leaks, unhandled exceptions
- **Performance degradation:** CPU spikes, memory exhaustion
- **Configuration issues:** Environment variables, feature flags
- **Code deployment:** Bad release, rollback needed

#### Database Layer
- **Connection issues:** Connection pool exhaustion, timeout issues
- **Performance problems:** Slow queries, missing indexes, lock contention
- **Data corruption:** Failed migrations, disk issues
- **Capacity problems:** Storage full, memory limits

#### Infrastructure Layer
- **Server hardware:** CPU/memory/disk failures, network card issues
- **Cloud provider:** AWS/GCP/Azure service outages, region issues
- **Networking:** DNS failures, firewall rules, subnet issues
- **Scaling issues:** Auto-scaling failures, resource limits

#### External Dependencies
- **Third-party APIs:** Payment processors, email services, auth providers
- **Monitoring/logging:** Observability tools down (may mask other issues)
- **Security incidents:** DDoS attacks, data breaches, certificate expiry

### 3. Pattern Recognition (2 minutes)
- **Gradual vs Sudden:** Performance degradation vs instant failure
- **Partial vs Complete:** Some users affected vs total outage
- **Timing patterns:** Peak hours, specific regions, user types

### 4. Documentation Format (1 minute)
```
## Potential Root Causes

### High Probability
1. [Most likely cause based on symptoms]
2. [Second most likely]

### Medium Probability
3. [Possible but less likely]
4. [Could be related]

### Low Probability (Worth Investigating)
5. [Edge cases or rare scenarios]

### Assumptions Made
- [List any assumptions about the system]
```

## Common Outage Patterns to Recognize

### Traffic Surge Patterns
- **Symptoms:** Slow response times, timeouts, 503 errors
- **Causes:** Viral content, marketing campaigns, DDoS attacks
- **Focus on:** Load balancers, auto-scaling, database connections

### Database-Related Patterns
- **Symptoms:** Slow queries, timeouts, inconsistent data
- **Causes:** Lock contention, failed migrations, storage issues
- **Focus on:** Query performance, connection pools, disk space

### Deployment-Related Patterns
- **Symptoms:** Sudden onset after release, version-specific issues
- **Causes:** Bad code deploy, configuration changes, feature flags
- **Focus on:** Recent changes, rollback scenarios

### Infrastructure Patterns
- **Symptoms:** Regional issues, complete service unavailability
- **Causes:** Cloud provider outages, network partitions, DNS issues
- **Focus on:** External dependencies, geographic distribution

## Quick Diagnostic Questions Framework

Ask yourself these in order:

1. **When?** Timing tells you about traffic patterns, deployments, scheduled jobs
2. **Who?** All users vs specific segments (region, device, feature usage)
3. **What?** Complete failure vs degraded performance vs data issues
4. **Where?** Which system components are affected
5. **How sudden?** Gradual degradation suggests capacity, sudden suggests deployment/infrastructure

## Red Flags That Indicate Specific Causes

**Database Issues:**
- Slow response times that worsen over time
- Specific features failing while others work
- Error messages about connections or timeouts

**Infrastructure Issues:**
- Complete service unavailability
- Geographic patterns (one region affected)
- Multiple services failing simultaneously

**Application Issues:**
- Error rates spiking after deployments
- Memory/CPU related error messages
- Specific user actions triggering failures

**External Dependencies:**
- Third-party service status pages showing issues
- Authentication/payment processing failures
- Email/notification delivery problems

## Sample Response Structure

```
# System Outage Root Cause Analysis

## Symptoms Observed
- [List key symptoms from scenario]

## High Probability Causes
1. **Database Connection Exhaustion**
   - Connection pool limits exceeded during traffic spike
   - Would explain timeout errors and gradual degradation

2. **Failed Application Deployment**
   - Recent release introduced memory leak
   - Timing aligns with deployment window

## Medium Probability Causes
3. **Third-party API Degradation**
   - Payment processor having issues
   - Could explain checkout failures specifically

## Assumptions Made
- Traffic patterns typical for time of day
- No known planned maintenance
- Monitoring systems are functioning correctly
```

## Time Management Strategy

- **Minutes 1-2:** Read scenario, identify key symptoms
- **Minutes 3-8:** Work through each layer systematically
- **Minutes 9-12:** Prioritize causes by probability
- **Minutes 13-15:** Format response clearly, add assumptions

## Practice Exercise

Think through this scenario: *"E-commerce site experiencing 30% of checkout attempts failing with timeout errors. Started 2 hours ago during normal business hours. Customer service reports payment processing is slow."*

**Quick Analysis:**
- **Timing:** During business hours (not traffic surge)
- **Scope:** Specific to checkout (not whole site)
- **Symptoms:** Timeouts suggest performance issue
- **Focus areas:** Payment processing, database connections, third-party integrations

## Remember for the Assessment

1. **Stay systematic** - don't jump to conclusions
2. **Consider all layers** - even if one seems obvious
3. **Prioritize by likelihood** - based on symptoms described
4. **Document assumptions** - shows analytical thinking
5. **Time management** - 15 minutes goes fast, stay focused