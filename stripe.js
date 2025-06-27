// stripe.js

// Replace with your real publishable key
// Test KEY
const stripe = Stripe('pk_test_51R9BywPMg9X62KxRp69187eQPCaiWUVuLyn04BJPf3nNXkul7aznceDJs5Q20CZpbxoxZ0JAzPm6eIoPdhnHsX6J00kAUJ8RP2');
//live key const stripe = Stripe('pk_live_51R9ByqAYPE5r9t2NSXQPY5gL6M5s6VeGyOgqtLtQz8r038OWygnun1XVAw1o3VEWj14Dw07FI9b7KY2wj4LUgm9z00WeEFHQtU');
const elements = stripe.elements();
const card = elements.create('card');
card.mount('#card-element');

// Optional: handle real-time validation errors
card.on('change', function(event) {
  const displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});
function handlePaymentIntent() {
  const name = sessionStorage.getItem("userName");
  const email = sessionStorage.getItem("userEmail");

  fetch('https://refill-l59k.onrender.com/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name,
      email: email
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Backend response:", data);
    stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: card,
      }
    }).then(result => {
      if (result.error) {
        alert("Payment failed: " + result.error.message);
      } else if (result.paymentIntent.status === "requires_capture") {
        alert("Card authorized! We'll charge the final amount after the gas refill.");
      }
    });
  });
}

// Expose to global scope or link to button
document.getElementById("pay-now").addEventListener("click", handlePaymentIntent);
