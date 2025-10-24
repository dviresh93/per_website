# 3rd Party Detection Software - Quick Reference Guide
## For Consultation Follow-up Questions

---

## YOUR ACTUAL WORKFLOW AT FREEFLY

**What you actually do:**
1. Integrate RGB payload (camera) onto Freefly drone platform (Astro/Altax)
2. Configure camera settings for inspection missions
3. Capture images during flight → stored to onboard USB/SD card (geotagged)
4. Customers take those images → upload to 3rd party software for AI analysis
5. You review footage during troubleshooting/crash analysis

**Key detail from Freefly docs:**
- "Images are geotagged when saved to external USB, allowing images to be associated with specific assets like power line poles"
- Freefly has official partnership with **Pix4D** (announced Feb 2025)

---

## MAJOR 3RD PARTY SOFTWARE PLATFORMS

### 1. **Pix4D** (Freefly's Official Partner - Feb 2025)
**What it does:**
- Photogrammetry software - converts drone images into 3D models, orthomosaics, point clouds
- **PIX4Dmatic** - Large dataset processing for mapping/inspection
- **PIX4Dinspect** - Specifically for infrastructure inspections (towers, buildings)

**Inspection use case:**
- Upload geotagged images from Freefly drone
- Automatically generates digital twin of infrastructure
- Can measure, annotate, track defects over time
- 70% time savings reported (12 hrs vs 40 hrs for building facade inspection)

**When clients ask:**
"Pix4D is Freefly's official software partner - customers get a 1-year license with eligible drone purchases. It handles the photogrammetry side, turning your captured images into measurable 3D models for inspection analysis."

---

### 2. **DroneDeploy**
**What it does:**
- Cloud-based platform for automated drone workflows
- Flight planning, image processing, AI-powered analytics
- Integrates data from drones, ground robots, 360 cameras

**Inspection use case:**
- Automated flight planning
- 3D mapping and defect detection
- Progress tracking, issue detection

**When clients ask:**
"DroneDeploy is popular because it automates the whole workflow - flight planning through AI analysis. It's more focused on construction and agriculture but handles infrastructure inspections too."

---

### 3. **Scopito**
**What it does:**
- Cloud-based asset inspection platform
- AI/ML-powered predictive maintenance
- Specializes in: wind turbines, solar, transmission lines, buildings

**Inspection use case:**
- Upload drone images
- Automated defect detection using ML
- Historical comparison for predictive maintenance
- Goal: "one-click reporting" (click button → full inspection report)

**When clients ask:**
"Scopito is focused on energy infrastructure - wind, solar, power lines. They're pushing toward fully automated analysis where you upload images and get AI-generated inspection reports automatically."

---

### 4. **Raptor Maps**
**What it does:**
- Solar-specific inspection platform
- ML-based anomaly detection for solar panels
- Digital twin with geotagged defects

**Inspection use case:**
- Upload thermal + RGB images
- Automated solar panel defect detection
- Interactive map showing every anomaly's location

**When clients ask:**
"Raptor Maps is the solar industry standard - they digitize entire solar farms and use ML to detect panel anomalies from drone thermal imagery."

---

### 5. **vHive**
**What it does:**
- Tower inspection software (telecom, power)
- AI-powered detection for rust, cable disconnections
- Autonomous capture + 3D modeling

**When clients ask:**
"vHive specializes in tower inspections - cellular towers, power transmission structures. Their AI detects rust and component failures automatically."

---

### 6. **SiteAware** (formerly Dronomy)
**What it does:**
- Construction/infrastructure monitoring
- Compares drone data vs BIM plans
- AI detects deviations and defects automatically

**Inspection use case:**
- Digital twin generation
- Automated progress tracking
- 99%+ defect detection accuracy claimed

---

## TYPICAL WORKFLOW (What Customers Do)

```
[Freefly Drone + RGB Payload]
          ↓
[Capture geotagged images → USB storage]
          ↓
[Upload to 3rd party platform]
          ↓
[Platform processes images]
  - Photogrammetry (3D model generation)
  - AI analysis (defect detection)
  - Report generation
          ↓
[Inspector reviews flagged defects]
          ↓
[Export reports/data to asset management]
```

---

## HOW TO ANSWER FOLLOW-UP QUESTIONS

### **If they ask: "Which software do Freefly customers typically use?"**

**Your answer:**
"Freefly has an official partnership with Pix4D - customers purchasing eligible drones get a 1-year license for their processing software. Beyond that, it depends on the industry - solar customers often use Raptor Maps, wind/tower inspections might use Scopito or vHive, and general construction/mapping customers use DroneDeploy. From the payload integration side, we focus on making sure the camera setup captures high-quality geotagged imagery that works with whatever analysis platform the customer prefers."

---

### **If they ask: "How does the AI detection actually work in these platforms?"**

**Your answer:**
"From what I've seen working with customers, most platforms use a similar pipeline - they take the geotagged images we capture, run preprocessing to normalize lighting and contrast, then use trained detection models - usually variants of YOLO or U-Net architectures depending on whether they're doing object detection or segmentation. The platforms handle the AI side - my experience is more on the front end, making sure the camera specs and image quality are set up correctly so the AI has clean inputs to work with. Things like proper resolution for the inspection distance, managing motion blur with global shutter, and getting good dynamic range for mixed lighting conditions."

---

### **If they ask: "Can these platforms do real-time detection during flight?"**

**Your answer:**
"Most of the platforms I mentioned do post-processing - you fly the mission, capture images to storage, then upload for analysis. There are some systems doing near real-time processing where a ground station runs detection during the flight and can flag potential issues for re-inspection, but that's less common because it requires significant compute power and drains battery if you're doing it onboard. The post-processing approach gives you higher accuracy because you can use heavier models and more processing power. From a practical standpoint, inspection pilots prefer to focus on safe flying rather than monitoring AI outputs in real-time."

---

### **If they ask: "What camera specs matter most for these detection platforms?"**

**Your answer (this is your wheelhouse):**
"This is where the payload integration work comes in. Resolution matters - for power line inspections where you're detecting strand breaks from a safe distance due to electrical interference, you need 20MP+ to capture enough detail. Global shutter is critical for fast flyovers or windy conditions because rolling shutter creates geometric distortion that messes up both the photogrammetry and the detection accuracy. HDR helps a lot when you're dealing with backlit scenarios like transmission lines against the sky, or mixed lighting on metal structures - without it, you lose defect visibility in shadows or blown-out highlights. The key is matching the camera specs to what the asset requires and what distance you can safely inspect from."

---

### **If they ask: "How do you validate that the images will work for AI detection?"**

**Your answer:**
"During mission planning and post-mission review, we check for common issues that break AI processing - motion blur from platform movement, inconsistent lighting across the image set, insufficient resolution at the target distance, and proper focus on the inspection area. From troubleshooting failed missions, I've learned that a lot of detection failures aren't AI problems - they're data quality problems. If the source imagery has motion blur, poor contrast, or the defects are too small in frame, no amount of AI processing will fix it. That's why the payload integration and camera configuration work matters - you're setting up the AI for success or failure before it even runs."

---

## SPECIFIC ASSET WORKFLOWS (Based on Research)

### **Power Lines / Transmission Towers:**
- **Software:** Scopito, vHive, or custom utility solutions
- **Image needs:** High resolution (20MP+), global shutter (fast flyovers), HDR (backlit scenarios)
- **Detection:** Insulator damage, conductor corrosion, strand breakage, component failures

### **Solar Farms:**
- **Software:** Raptor Maps (industry standard)
- **Image needs:** Thermal + RGB, geotagged for panel-level localization
- **Detection:** Panel anomalies, hotspots, cracking, soiling

### **Wind Turbines:**
- **Software:** Scopito
- **Image needs:** High resolution for blade inspection, stable capture (turbulent conditions)
- **Detection:** Leading edge erosion, cracks, lightning damage

### **Bridges / Concrete Structures:**
- **Software:** DroneDeploy, Pix4D, SiteAware
- **Image needs:** Good contrast for crack detection, 3D model generation
- **Detection:** Cracks, spalling, corrosion, structural deformation

### **Cellular Towers:**
- **Software:** vHive
- **Image needs:** Multiple component types (antennas, mounts, cables)
- **Detection:** Rust, cable disconnections, mount damage, antenna alignment

---

## KEY PHRASES TO USE NATURALLY

- "From the payload integration side..."
- "Based on reviewing customer missions..."
- "The software handles the AI detection - my focus is on image quality inputs..."
- "What I've learned from troubleshooting is..."
- "The camera setup directly impacts what the AI can detect downstream..."
- "It depends on the asset type and customer workflow..."

---

## WHAT YOU SHOULD AVOID SAYING

❌ "I've personally trained detection models on these platforms"
❌ "I've deployed AI algorithms for defect detection"
❌ Claiming deep technical knowledge of specific platform architectures

✅ Instead: Pivot to what you actually know - camera specs, image quality, workflow integration, field constraints

---

## EXAMPLE DIALOGUE

**Client:** "Which detection platform do you recommend for bridge inspections?"

**You:** "From the payload integration side, I've seen customers have good success with Pix4D for photogrammetry and DroneDeploy for automated workflows on bridge projects. The critical part isn't just the software choice - it's making sure your camera setup captures imagery that works well for crack detection. For concrete bridges, you need good contrast and resolution, proper lighting to avoid deep shadows that hide cracks, and if you're doing 3D modeling, you need global shutter to avoid distortion. The software platforms are all pretty capable - the differentiator is usually image quality and how well it integrates with the customer's existing asset management systems."

---

## BOTTOM LINE

**Your expertise zone:** Hardware (cameras, drones) → Software interface (image capture, geotagging, storage)

**3rd party software zone:** AI processing, defect detection, reporting

**Your value:** Understanding how camera specs and image quality affect downstream AI detection - the integration point between hardware and software

**When in doubt:** Pivot to camera specs, image quality requirements, field constraints, and workflow integration (your actual experience).
