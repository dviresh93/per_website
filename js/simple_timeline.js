document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript is working!");
    
    // Test timeline loading
    const timelineContainer = document.getElementById("timeline-container");
    if (timelineContainer) {
        fetch("data/timeline.json")
        .then(response => response.json())
        .then(data => {
            console.log("Timeline data loaded:", data);
            
            let html = "";
            data.journey.forEach(item => {
                html += `<div style="background: #f0f0f0; padding: 1rem; margin: 1rem 0; border-radius: 8px; cursor: pointer;" onclick="alert('Clicked: ${item.title}')"">
                    <h3>${item.title}</h3>
                    <p>${item.year} | ${item.location}</p>
                    <p>${item.company || item.institution}</p>
                </div>`;
            });
            
            timelineContainer.innerHTML = html;
        })
        .catch(error => {
            console.error("Error loading timeline:", error);
            timelineContainer.innerHTML = "<p>Error loading timeline</p>";
        });
    }
});
