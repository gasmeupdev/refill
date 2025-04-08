from flask import Flask, jsonify, request
import stripe
import os 
from flask_cors import CORS 

app = Flask(__name__) 
CORS(app) 

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY") 

@app.route('/create-payment-intent', methods=['POST'])
def create_paymnt(): 
    try: 
          intent = stripe.PaymentIntent.create(
          amount=2500,  # $25 in cents
          currency='usd',
          capture_method='manual',
          automatic_payment_methods={'enabled': True}
      )
          return jsonify({'clientSecret': intent.client_secret})
    except Exception as e:
         return jsonify({'error': str(e)}), 400

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Render provides the PORT env var
    app.run(host="0.0.0.0", port=port)
