# Exercise: Satellite Mission Management System

## Scenario: Space Operations Database for Casium

You're designing a database for Casium to manage their satellite missions, ground stations, and data collection operations.

## Requirements:
- Satellites are launched on missions with specific objectives (Earth observation, communications, research)
- Ground stations around the world communicate with satellites during orbital passes
- Each satellite has multiple sensors that collect different types of data
- Mission operators schedule data collection sessions when satellites pass over targets
- Track satellite health telemetry and operational status
- Manage orbital parameters and trajectory data
- Store and catalog collected Earth observation data

## Your Task:

Complete the schema below:

```sql
// TODO: Complete this satellite operations schema

Table satellites {
  // Add fields for satellite management
  // Think about: name, launch date, status, orbital parameters
}

Table missions {
  // Add fields for mission planning
  // Think about: mission type, objectives, start/end dates
}

Table ground_stations {
  // Add fields for ground infrastructure
  // Think about: location, capabilities, operational status
}

Table sensors {
  // Add fields for satellite instruments
  // Think about: sensor type, resolution, data format
}

// TODO: Create junction table for satellite communication passes
Table _______ {
  // When do satellites communicate with ground stations?
  // What data do you need to track for each pass?
}

// TODO: Create table for data collection sessions
Table _______ {
  // Track when satellites collect data over specific targets
  // What information is needed for each data collection?
}

// TODO: Create table for satellite telemetry/health data
Table _______ {
  // Track satellite health and status over time
  // What metrics would you monitor?
}
```

## Space Industry Context Questions Your Schema Should Answer:
1. Which satellites are currently operational in orbit?
2. When is the next communication pass between Satellite-X and Ground Station-Y?
3. What Earth observation data was collected over a specific geographic region?
4. Which sensors on each satellite are functioning properly?
5. How many successful data downlinks occurred last week?
6. What's the orbital status of all satellites in the constellation?

## Space-Specific Considerations:
- Satellites have complex operational states (launch, commissioning, operational, decommissioned)
- Ground station visibility windows are time-critical
- Data collection coordinates with orbital mechanics
- Telemetry monitoring is continuous and high-volume
- Multiple missions can share satellite resources

## Instructions:
- Edit this file directly
- Think about the unique relationships in space operations
- Consider time-critical operations and scheduling
- Include fields relevant to satellite operations (coordinates, frequencies, data volumes)
- Use proper DBML syntax

This exercise mirrors real satellite operation challenges that companies like Casium face daily! 🛰️
```