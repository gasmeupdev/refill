from flask import Flask, jsonify, request
import stripe
import os 
from flask_cors import CORS 

app = Flask(__name__) 
cors(app) 

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
