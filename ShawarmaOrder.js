const Order = require("./Order");

const OrderState = Object.freeze({
  WELCOMING:   Symbol("welcoming"),
  ITEMS: Symbol("items"),
  SIZE:   Symbol("size"),
  TOPPINGS:   Symbol("toppings"),
  ITEM2: Symbol("item two"),
  SIZE2: Symbol("size two"),
  TOPPINGS2: Symbol("toppings two"),
  ITEM3: Symbol("item three"),
  SIZE2: Symbol("size three"),
  TOPPINGS3: Symbol("toppings three"),
  SIDE: Symbol("side"),
  DRINKS:  Symbol("drinks"),
  PAYMENT: Symbol("payment"),
});

module.exports = class ShwarmaOrder extends Order{
    constructor(sNumber, sUrl){
        super(sNumber, sUrl);
        this.stateCur = OrderState.WELCOMING;
        this.sSize = "";
        this.sToppings = "";
        this.sDrinks = "";
        this.sItem = "";
        this.sItem2 = "";
        this.sSize2 = "";
        this.sToppings2 =  "";
        this.sItem3 = "";
        this.sSize3 = "";
        this.sToppings3 =  "";
        this.sSide = "";
        this.subtotal = 0;
        this.tax = 0;
        this.total = 0;
    }
    handleInput(sInput){
      function getPrice(item) {
        switch (item.toLowerCase()) {
          case "shawarma":
            return 10;
          case "pizza":
            return 14;
          case "bread":
            return 8;
          case "small":
            return 0;
          case "medium":
            return 2;
          case "large":
            return 4;
          case "cheese":
            return 1;
          case "mushroom":
            return 2;
          case "chicken":
            return 5;
          case "wings":
            return 10;
          case "fries":
            return 5;
          default:
            return 0;
          }
        }
    
      function validateItem(sInput){
        return sInput.toLowerCase() === "shawarma" || sInput.toLowerCase() === "pizza" ||sInput.toLowerCase() === "bread";
      }
      function validateSize(sInput){
        return sInput.toLowerCase() === "small" || sInput.toLowerCase() === "medium" ||sInput.toLowerCase() === "large";
      }    
      function validateTopping(sInput){
        return sInput.toLowerCase() === "cheese" || sInput.toLowerCase() === "mushroom" ||sInput.toLowerCase() === "chicken";
      }    
      function validateSide(sInput){
        return sInput.toLowerCase() === "wings" || sInput.toLowerCase() === "fries"
      }
      function validateDrink(sInput){
        return sInput.toLowerCase() === "coke" || sInput.toLowerCase() === "sprite"
      }
      function handleItem(sInput, aReturn){
          if(!validateItem(sInput)){
            aReturn.push("invalid item")           
          }else{
            this.stateCur = OrderState.SIZE;
            this.sItem = sInput;
            this.subtotal += getPrice(sInput);
            aReturn.push("What size would you like?");
          }
      }  
      function handleSize(sInput, aReturn) {
         if(!validateSize(sInput)){
          aReturn.push("invalid size")
         }else{
          this.stateCur = OrderState.TOPPINGS;
          this.sSize = sInput;
          this.subtotal += getPrice(sInput);
          aReturn.push("What toppings would you like? Cheese, mushroom, or chicken?");
         }     
      }
      function handleTopping(sInput, aReturn){
        if(!validateTopping(sInput)){
          aReturn.push("invalid topping")
        }else{
          this.stateCur = OrderState.ITEM2;
          this.sToppings = sInput;
          this.subtotal += getPrice(sInput);
          aReturn.push("Would you like another Shawarma, pizza, or bread? Reply no to skip.");
        }        
      }
      function handleItem2(sInput, aReturn){
        if(!validateItem(sInput) && sInput.toLowerCase() !== "no"){
          aReturn.push("invalid item")
        }else if(sInput.toLowerCase() !== "no"){
          this.sItem2 = sInput;
          this.stateCur = OrderState.SIZE2;
          this.subtotal += getPrice(sInput);
          aReturn.push("What size would you like?");
        }else {
          this.stateCur = OrderState.SIDE;
          aReturn.push("Would you like some side? We have wings and fries. Reply no to skip.");
        }                   
      }
      function handleSize2(sInput, aReturn){
        if(!validateSize(sInput)){
          aReturn.push("invalid size")
        }else{
          this.stateCur = OrderState.TOPPINGS2;
          this.sSize2 = sInput;
          this.subtotal += getPrice(sInput);
          aReturn.push("What toppings would you like? Cheese, mushroom, or chicken?");
        }          
      }
      function handleTopping2(sInput, aReturn){
        if(!validateTopping(sInput)){
          aReturn.push("invalid topping")
        }else{
          this.stateCur = OrderState.SIDE;
          this.sToppings2 = sInput;
          this.subtotal += getPrice(sInput);
          aReturn.push("Would you like some side? We have wings and fries. Reply no to skip.");
        }   
      }  
        let aReturn = [];
        switch (this.stateCur) {
          case OrderState.WELCOMING:
              this.stateCur = OrderState.ITEMS;
              aReturn.push("Welcome to Richard's.");
              aReturn.push("What would you like? Shawarma, pizza, or bread?");
              break;
          case OrderState.ITEMS:
              handleItem.call(this, sInput, aReturn);
              break;
          case OrderState.SIZE:
              handleSize.call(this, sInput, aReturn);
              break;
          case OrderState.TOPPINGS:
              handleTopping.call(this, sInput, aReturn);
              break;
          case OrderState.ITEM2:
              handleItem2.call(this, sInput, aReturn);
              break;
          case OrderState.SIZE2:
              handleSize2.call(this, sInput, aReturn);
            break;
          case OrderState.TOPPINGS2:
              handleTopping2.call(this, sInput, aReturn);
            break;
          case OrderState.SIDE:
            if(!validateSide(sInput) && sInput.toLowerCase() !== "no"){
              aReturn.push("invalid input")
            }else{
              this.stateCur = OrderState.DRINKS;
                if (sInput.toLowerCase() !== "no") {
                  this.sSide = sInput;
                  this.subtotal += getPrice(sInput);
                }
                aReturn.push("Would you like some drinks? We have Coke or Sprite. Reply no to skip.");
                }        
            break;
            case OrderState.DRINKS:
              if(!validateDrink(sInput) && sInput.toLowerCase() !== "no"){
                aReturn.push("invalid input")
              }else{
                this.stateCur = OrderState.PAYMENT;
                if (sInput.toLowerCase() !== "no") {
                  this.sDrinks = sInput;
                  this.subtotal += 2;
                }             
                this.tax = this.subtotal * 0.13;
                this.total = this.subtotal + this.tax
                this.total = Math.round(this.total * 100) / 100;
                aReturn.push("Thank-you for your order of");
                aReturn.push(`${this.sSize} ${this.sItem} with ${this.sToppings}`);
                if(this.sItem2){
                  aReturn.push(`${this.sSize2} ${this.sItem2} with ${this.sToppings2}`)
                }
                if(this.sSide){
                    aReturn.push(this.sSide);
                }
                if(this.sDrinks){
                    aReturn.push(this.sDrinks);
                }
                aReturn.push(`Subtotal: $${this.subtotal.toFixed(2)}`);
                aReturn.push(`HST: $${this.tax.toFixed(2)}`);
                aReturn.push(`Your total is $${this.total.toFixed(2)}`);
                aReturn.push(`Please pay for your order here`);
                aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
              }               
                break;
            case OrderState.PAYMENT:
                console.log(sInput.purchase_units[0].shipping.address);
                let addressLine = sInput.purchase_units[0].shipping.address.address_line_1;
                this.isDone(true);
                let d = new Date();
                d.setMinutes(d.getMinutes() + 20);
                aReturn.push(`Your order will be delivered at ${d.toTimeString()}`);
                aReturn.push(`Order deliver to: ${addressLine}`);
                break;
        }
        return aReturn;
    }
    renderForm(sTitle = "-1", sAmount = "-1"){
      // your client id should be kept private
      if(sTitle != "-1"){
        this.sItem = sTitle;
      }
      if(sAmount != "-1"){
        this.nOrder = sAmount;
      }
      const sClientID = ""
            return(`
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        Thank you ${this.sNumber} for your ${this.sItem} order of $${this.total}.
        <div id="paypal-button-container"></div>
  
        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.total}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                    window.open("", "_self");
                    window.close(); 
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>
      
      </body>
          
      `);
  
    }
}