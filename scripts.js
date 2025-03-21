const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyXzylCeFrXA_O8WGH0-_ENM9UfIPTVhrwxOvkRo7Jywv86HPjmZ-ivgQqx_BGer1iuMQ/exec";

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

// ✅ Time Selection Restricted
const timeSelect = document.getElementById("schedule_time");
const allowedTimes = [
    "05:00 AM", "06:00 AM", "07:00 AM",
    "05:00 PM", "06:00 PM", "07:00 PM",
    "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM"
];

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

    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setFields(["address_components", "formatted_address"]);

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        const addressComponents = place.address_components;

        let zipCode = "";
        for (let component of addressComponents) {
            if (component.types.includes("postal_code")) {
                zipCode = component.long_name;
                break;
            }
        }

        const neighborhood = zipToNeighborhood[zipCode] || "Other";

        // Create hidden field for neighborhood
        let hiddenInput = document.querySelector("input[name='Neighborhood']");
        if (!hiddenInput) {
            hiddenInput = document.createElement("input");
            hiddenInput.type = "hidden";
            hiddenInput.name = "Neighborhood";
            input.form.appendChild(hiddenInput);
        }
        hiddenInput.value = neighborhood;
    });
}
window.addEventListener("load", initAutocomplete);

// ✅ Handle Form Submission
document.getElementById("multiStepForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);

    // 🔁 Replace Fuel Needed (e.g., 4 ➝ "1/2")
    const fuelMap = {
        "1": "1/8", "2": "1/4", "3": "1/3",
        "4": "1/2", "5": "5/8", "6": "2/3",
        "7": "3/4", "8": "7/8", "9": "Full"
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
            window.location.href = "checkout.html";
        } else {
            throw new Error("Submission failed.");
        }
    } catch (error) {
        alert("Network error: " + error.message);
    }
});
