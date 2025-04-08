const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyXzylCeFrXA_O8WGH0-_ENM9UfIPTVhrwxOvkRo7Jywv86HPjmZ-ivgQqx_BGer1iuMQ/exec";

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

var hoursInDay = 24

//BEGIN SAME DAY BOOK TIME VALIDATION
const currentTime = new Date();
const currentHour = currentTime.getHours();
const allowedTimes = []
var minTimeCanBook = Number(currentHour) + 2;
for (var b = minTimeCanBook; b<=23; b++) {

    if (b < 11) {
    var timeSlotFirst = b
console.log("Hour " + timeSlotFirst); 

    var timeSlotSecond = b + 1; 
    var timeSlotFinal = "0"+ b + ":00 AM - " + "0" + timeSlotSecond + ":00 AM";
        console.log("time slot final " + timeSlotFinal);
    }

    else if (b >= 13 ) {

        var timeSlotFirst = Number(b) - 12
        console.log("Hour " + timeSlotFirst); 
    var timeSlotSecond = timeSlotFirst + 1; 
    var timeSlotFinal = "0"+ timeSlotFirst + ":00 PM - " + "0" + timeSlotSecond + ":00 PM";
        console.log("time slot final " + timeSlotFinal);
    }

    else if (b = 12) {
console.log("Hour " + b); 
    var timeSlotFinal = "12:00 PM - 1:00 PM"
    console.log("time slot final " + timeSlotFinal);}
        
else if (b = 11) {
console.log("Hour " + b); 
    var timeSlotFinal = "11:00 AM - 12:00 PM"
    console.log("time slot final " + timeSlotFinal);}


    
    allowedTimes.push(timeSlotFinal);
}
// END SAME DAY BOOK TIME VALIDATION




// const allowedTimes = [
//     "05:00 AM - 06:00 AM", "06:00 AM - 07:00 AM", "07:00 AM - 08:00 AM",
//     "05:00 PM - 06:00 PM", "06:00 PM - 07:00 PM", "07:00 PM - 08:00 PM",
//     "08:00 PM - 09:00 PM", "09:00 PM - 10:00 PM", "10:00 PM - 11:00 PM", "11:00 PM - 12:00 AM"
// ];

allowedTimes.forEach(time => {
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

// Get value from click/drag
function updateFromPosition(x) {
  const rect = speedometer.getBoundingClientRect();
  const clickX = x - rect.left;
  const percent = Math.min(Math.max(clickX / rect.width, 0), 1);
  const newVal = Math.round(percent * 100);
  input.value = newVal;
  updateNeedle(newVal);
}

// Click support
speedometer.addEventListener("click", (e) => {
  updateFromPosition(e.clientX);
});

// Drag support (desktop + mobile)
speedometer.addEventListener("mousedown", (e) => {
  isDragging = true;
  updateFromPosition(e.clientX);
});
window.addEventListener("mousemove", (e) => {
  if (isDragging) updateFromPosition(e.clientX);
});
window.addEventListener("mouseup", () => {
  isDragging = false;
});

// Touch support for mobile
speedometer.addEventListener("touchstart", (e) => {
  isDragging = true;
  updateFromPosition(e.touches[0].clientX);
});
window.addEventListener("touchmove", (e) => {
  if (isDragging) updateFromPosition(e.touches[0].clientX);
});
window.addEventListener("touchend", () => {
  isDragging = false;
});

updateNeedle(input.value);


// ✅ Handle Form Submission
document.getElementById("multiStepForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);

    // 🔁 Replace Fuel Needed (e.g., 4 ➝ "1/2")
    const fuelMap = {
        "1": "1/8", 
        "2": "1/4", 
        "3": "1/3",
        "4": "1/2", 
        "5": "5/8", 
        "6": "2/3",
        "7": "3/4", 
        "8": "7/8", 
        "9": "Full"
    };

    const rawValue = this.querySelector('input[name="Fuel Needed"]').value;
    const label = fuelMap[rawValue] || rawValue;
    formData.set("Fuel Needed", label);

    try {
        const response = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            alert("Booking successful! 🚀 We will reach out to you soon.");
            window.location.href = "./checkout2.html";
        } else {
            throw new Error("Submission failed.");
        }
    } catch (error) {
        alert("Network error: " + error.message);
    }
});
