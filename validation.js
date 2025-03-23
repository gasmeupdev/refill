// validation.js

function validateStep(stepIndex) {
    const steps = document.querySelectorAll(".step");
    const currentStep = steps[stepIndex];
    const inputs = currentStep.querySelectorAll("input, select");

    for (let input of inputs) {
        if (!input.checkValidity()) {
            alert(`Please fill out: ${input.placeholder || input.name}`);
            input.focus();
            return false;
        }

        // Phone number validation (10 digits)
        if (input.name === "Phone" && !/^\d{10}$/.test(input.value.replace(/\D/g, ''))) {
            alert("Please enter a valid 10-digit phone number.");
            input.focus();
            return false;
        }

        // Car year validation (1980-2025)
        if (input.name === "Car Year") {
            const year = parseInt(input.value);
            if (!/^[0-9]{4}$/.test(input.value) || year < 1980 || year > 2025) {
                alert("Please enter a valid car year between 1980 and 2025.");
                input.focus();
                return false;
            }
        }
    }

    return true;
}
