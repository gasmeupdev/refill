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
const allowedTimes = ["05:00 AM", "06:00 AM", "07:00 AM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM"];

allowedTimes.forEach(time => {
    const option = document.createElement("option");
    option.value = time;
    option.textContent = time;
    timeSelect.appendChild(option);
});

// ✅ Handle Form Submission
document.getElementById("multiStepForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    try {
        const response = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            alert("Booking successful! 🚀 We will reach out to you soon.");
            window.location.href = "checkout.html"; // Redirect to checkout after submission
        } else {
            throw new Error("Submission failed.");
        }
    } catch (error) {
        alert("Network error: " + error.message);
    }
});
