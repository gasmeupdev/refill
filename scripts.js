//const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbx1AGoCM2ssoBsYVAmv52ENvajwaCJ38ycVwTf3w5TqpFgbeRmE9sFVCDCoj8D9i01M/exec";
const GOOGLE_SHEET_WEBHOOK_URL1 = "https://script.google.com/macros/s/AKfycbzDLc_Fj4n_yXFktLdH7_qkPgBjzd7IPkw6-RlwyDWKklk8WJWw2kpl6gt2ZXI1xz44/exec";
const GOOGLE_SHEET_WEBHOOK_URL2 = "https://script.google.com/macros/s/AKfycbzuJvGkUZJ-KBy7cKm9Dbz57rZHispgy1DltRCGZmNueJHvuWA64TXpYJG8dbFvjp4V/exec"
const GOOGLE_SHEET_WEBHOOK_URL3 = "https://script.google.com/macros/s/AKfycbx9S-vZIIC9xIHNdnBLMnjBUT0sC6tnC3cbXJfo0ZBCuaJk045cgfZUadcVaRapb0oW/exec";

// ✅ Multi-Step Navigation
let stepIndex = 0;
const steps = document.querySelectorAll(".step");
const totalSteps = steps.length;

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

// ✅ Time Selection Restricted by Day
const timeSelect = document.getElementById("schedule_time");
const dateInput = document.querySelector('input[name="Date"]');

// Set today's date as min for the date input
const today = new Date().toISOString().split("T")[0];
if (dateInput) {
  dateInput.min = today;
}

function populateTimeSlots(date) {
  timeSelect.innerHTML = ""; // clear existing options

  if (!date) return;

  const selectedDate = new Date(date + "T00:00:00"); // force midnight local
  const day = selectedDate.getDay(); 
  // Sunday = 0, Monday = 1, ... Saturday = 6
  let startHour, endHour;

  if (day === 0 || day === 6) {
    // Weekend: 7AM - 1AM
    startHour = 7;
    endHour = 24;
  } else {
    // Weekday: 5PM - 1AM
    startHour = 17;
    endHour = 24;
  }

  // Generate hourly slots
  for (let hour = startHour; hour < endHour; hour++) {
    const start = new Date();
    const end = new Date();
    start.setHours(hour, 0, 0, 0);
    end.setHours(hour + 1, 0, 0, 0);

    const options = { hour: "numeric", minute: "2-digit", hour12: true };
    const slot =
      start.toLocaleTimeString([], options).replace(":00", "") +
      " - " +
      end.toLocaleTimeString([], options).replace(":00", "");

    const option = document.createElement("option");
    option.value = slot;
    option.textContent = slot;
    timeSelect.appendChild(option);
  }

  // Always add "12 AM - 1 AM"
  const option = document.createElement("option");
  option.value = "12 AM - 1 AM";
  option.textContent = "12 AM - 1 AM";
  timeSelect.appendChild(option);
}

// ✅ Make sure it updates every time the user picks a date
dateInput.addEventListener("input", function () {
  populateTimeSlots(this.value);
});

// Run once if there’s already a value
if (dateInput.value) {
  populateTimeSlots(dateInput.value);
}

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

// ✅ Handle Form Submission
document.getElementById("multiStepForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    console.log("Form Data Submitted: ");
    for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
    }
  
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
            redirect: "follow"
        });
      } else {
        var response = await fetch(GOOGLE_SHEET_WEBHOOK_URL1, {
            method: "POST",
            body: formData,
            redirect: "follow"
        });
      }

      console.log("Response Status: " + response.status);
      console.log("Response URL: " + response.url);

      if (response.ok) {
          const result = await response.json();
          console.log("Server response: ", result);

          if (result.result === 'success') {
              alert("SUCCESS");

              if (becomeSubscriber == 'Yes') {
                  window.location.href = "./checkoutSubscriberFirst.html";
              } else {
                  window.location.href = "./checkout2.html";
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
