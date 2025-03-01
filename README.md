https://gasmeupdev.github.io/refill/

Things to remember: 
- In the sheet, if we delete rows, then it will default to filling the highest-up open row 
- Time is in 15-minute increments (only accepts that, change the scale of the time selecter to be that) 
- This is an SPA (Single page architecture), so the URL doesn't change from step-to-step



- This utilizes a Google Apps Script, which is setup FROM the Google Sheet (that's where it's accesible if you want to find it quickly). It's a custom JS connector to accept data from external resources (which in this case, is our html form) 

- So this "closes" the loop we make between the information users fill out on the form, submit it, and send it to the Google Sheet row. Y'all can then do what you please with the information there. (there's some cool ideas to integrate other systems into Sheets, like: 
  - did someone handle this yet, cost (formula for determining pricing, profit), distance from HQ, estimated travel
  - Gas type should just be a dropdown
  - Payment processors - what makes the most sense to start out? (something proprietary, or would it be better to embed something)
  - 
