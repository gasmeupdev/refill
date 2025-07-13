//const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbx1AGoCM2ssoBsYVAmv52ENvajwaCJ38ycVwTf3w5TqpFgbeRmE9sFVCDCoj8D9i01M/exec";
const GOOGLE_SHEET_WEBHOOK_URL1 = "https://script.google.com/macros/s/AKfycbx9S-vZIIC9xIHNdnBLMnjBUT0sC6tnC3cbXJfo0ZBCuaJk045cgfZUadcVaRapb0oW/exec";
   const GOOGLE_SHEET_WEBHOOK_URL2 = "https://script.google.com/macros/s/AKfycbzuJvGkUZJ-KBy7cKm9Dbz57rZHispgy1DltRCGZmNueJHvuWA64TXpYJG8dbFvjp4V/exec"
// ✅ Multi-Step Navigation
let stepIndex = 0;
const steps = document.querySelectorAll(".step");
const totalSteps = steps.length;

// sce added 4/4/2025
function myFunction() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}
// end sce 4/4 edits

function nextStep() {
    if (stepIndex < totalSteps - 1) {
        steps[stepIndex].classList.remove("active");
        stepIndex++;
        steps[stepIndex].classList.add("active");
    }
}

function prevStep() {
    if (stepIndex > 0) {
        steps[stepIndex].classList.remove("active");
        stepIndex--;
        steps[stepIndex].classList.add("active");
    }
}


// ✅ Time Selection Restricted
const timeSelect = document.getElementById("schedule_time");

// Set today's date as min for the date input
const dateInput = document.querySelector('input[name="Date"]');
const today = new Date().toISOString().split("T")[0];
if (dateInput) {
    dateInput.min = today;
}

// Populate time options from 7AM to 12AM in 1-hour increments
const timeSlots = [];
for (let hour = 7; hour <= 23; hour++) {
    const start = new Date();
    const end = new Date();
    start.setHours(hour, 0);
    end.setHours(hour + 1, 0);
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    const slot = start.toLocaleTimeString([], options).replace(":00", "") + " - " +
                 end.toLocaleTimeString([], options).replace(":00", "");
    timeSlots.push(slot);
}

timeSlots.push("12 AM - 1 AM");

timeSlots.forEach(time => {
    const option = document.createElement("option");
    option.value = time;
    option.textContent = time;
    timeSelect.appendChild(option);
});
(time => {
    const option = document.createElement("option");
    option.value = time;
    option.textContent = time;
    timeSelect.appendChild(option);
});

// ✅ Neighborhood ZIP Mapping
const zipToNeighborhood = {
    "15219": "Downtown",
    "15203": "South Side",
    "15201": "Lawrenceville",
    "15213": "Oakland",
    "15217": "Squirrel Hill",
    "15206": "East Liberty",
    "15222": "Strip District"
};

// ✅ Google Maps Autocomplete + ZIP Lookup
function initAutocomplete() {
    const input = document.getElementById("address");
    if (!input) return;

    const autocomplete = new google.maps.places.Autocomplete(input, {
        types: ["geocode"],
        componentRestrictions: { country: "us" }
    });

    autocomplete.addListener("place_changed", function () {
        const place = autocomplete.getPlace();
        if (!place || !place.address_components) return;

        let zipCode = "";
        for (let comp of place.address_components) {
            if (comp.types.includes("postal_code")) {
                zipCode = comp.long_name;
                break;
            }
        }

        console.log("Detected ZIP Code:", zipCode);

        const neighborhood = zipToNeighborhood[zipCode] || "Other";

        // ✅ Add or update hidden neighborhood field
        let neighborhoodInput = document.querySelector("input[name='Neighborhood']");
        if (!neighborhoodInput) {
            neighborhoodInput = document.createElement("input");
            neighborhoodInput.type = "hidden";
            neighborhoodInput.name = "Neighborhood";
            input.form.appendChild(neighborhoodInput);
        }
        neighborhoodInput.value = neighborhood;
    });
}

window.addEventListener("load", initAutocomplete);
// second test of fuel gauge test
const input = document.getElementById("fuelInput");
const needle = document.getElementById("needle");
const valueDisplay = document.getElementById("fuelValue");
const speedometer = document.querySelector(".speedometer");

let isDragging = false;

function updateNeedle(val) {
  const min = parseInt(input.min);
  const max = parseInt(input.max);
  const percent = (val - min) / (max - min);
  const barWidth = speedometer.offsetWidth;

  const px = barWidth * percent;
  needle.style.left = `${px}px`;
  valueDisplay.textContent = val;
}

// ✅ Handle Form Submission
document.getElementById("multiStepForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    console.log("Form Data Submitted: ");
    for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
    }
  
    //  Store name and email in sessionStorage
    const name = formData.get("Name");
    const email = formData.get("Email");
    const becomeSubscriber = formData.get("Become Subscriber");
  console.log('Become Subscriber? ' + becomeSubscriber);

    sessionStorage.setItem("userName", name);
    sessionStorage.setItem("userEmail", email);
    sessionStorage.setItem("becomeSubscriber", becomeSubscriber);

    try {
 if (becomeSubscriber == 'Yes') {
     var response = await fetch(GOOGLE_SHEET_WEBHOOK_URL2, {
            method: "POST",
            body: formData,
            redirect: "follow"  // Allows handling of redirects
        });

  
 }

      else {

          var response = await fetch(GOOGLE_SHEET_WEBHOOK_URL1, {
            method: "POST",
            body: formData,
            redirect: "follow"  // Allows handling of redirects
        });
 }

     
      
      
        // const response = await fetch(GOOGLE_SHEET_WEBHOOK_URL2, {
        //     method: "POST",
        //     body: formData,
        //     redirect: "follow"  // Allows handling of redirects
        // });

        console.log("Response Status: " + response.status);  // Log status
        console.log("Response URL: " + response.url);  // Log final URL

        if (response.ok) {
            const result = await response.json();
            console.log("Server response: ", result);

            if (result.result === 'success') {
                alert("SUCCESS");


    if (becomeSubscriber == 'Yes')
    {                 window.location.href = "./checkoutSubscriberFirst.html";
}

              else {                window.location.href = "./checkout2.html";
 }
            } else {
                const errorMsg = result.error || result.message || "Unknown error occurred.";
                alert("Error: " + errorMsg);
            }
        } else {
            throw new Error("Submission failed with status " + response.status);
        }
    } catch (error) {
        alert("Network error: " + error.message);
        console.error("Error during submission:", error);
    }
});
