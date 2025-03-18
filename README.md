https://gasmeupdev.github.io/refill/

## Technical Overview
Things to remember: 
- In the sheet, if we delete rows, then it will default to filling the highest-up open row 
- Time is in 15-minute increments (only accepts that, change the scale of the time selecter to be that) 
- This is an SPA (Single page architecture), so the URL doesn't change from step-to-step

- This utilizes a Google Apps Script, which is setup FROM the Google Sheet (that's where it's accesible if you want to find it quickly). It's a custom JS connector to accept data from external resources (which in this case, is our html form) 

- So this "closes" the loop we make between the information users fill out on the form, submit it, and send it to the Google Sheet row. Y'all can then do what you please with the information there. (there's some cool ideas to integrate other systems into Sheets, like: 
  - did someone handle this yet, cost (formula for determining pricing, profit), distance from HQ, estimated travel
  - Gas type should just be a dropdown
  - Payment processors - what makes the most sense to start out? (something proprietary, or would it be better to embed something)

  - Excel functions too - how can we use to implement different

 ## Short-term Roadmap 
- Fill up tires for extra charge? Cleaning windows and shit for additional costs. 
- First page to show "how it works" Button to take people to booking

- Longer Term thought on zip code availability (only allow booking in a certain number of them) 
- Time intervals should be an hour (only 5p-11p, 5a-7a)
- Payments integration 
- Car year, license plate
- Will car be unlocked? <- wordsmith the intention to be able to get into the car
- How much of your gas tank do you need filled? Estimator slider? 1/8, 1/2, 3/4, Full?
 -   Have a caveat for estimations being wrong? 
- Pricing table
  - Calculate before checkout, after car information step 

PRE-Dynamic Model
- An estimated pricing (assuming an average of 15 gallons) 
- type       gallon    est. 1/4 total  est. 1/2 total  
- standard   3.5        13.13            26.26
- premium  3.5         13.13              26.26
- diesel   3.5         13.13              26.26

- Our fees (at least $15)
- .2 a gallon upcharge
- Air in your tire up-charge, PSI measurement
- Estimated total before checkout. For example, if we're refilling 10 gallons of gas, it;'s going to cost me X dollars.
- How to develop as an app insetead - what are the steps 
 
