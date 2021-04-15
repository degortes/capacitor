import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
declare var Stripe;

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  stripeInt:any ;
  stripe:any;
  clientsecret;
  
  constructor(private ajax: HttpService) {

  }
  
  ngOnInit() {
    this.intent();
  }
  
  
  async intent() {
     this.ajax.stripeGet().subscribe((resp) => {
      this.stripeInt = resp['results']['id'];
      console.log(this.stripeInt);
      const div = document.createElement('div');
      div.innerHTML = '<button id="card-button" class="btn btn-dark" type="submit" data-secret="'+ this.stripeInt + '"> Pay </button>'
      document.getElementById('card-foot').append(div);
  
      this.zio();
    })
  }
  
  async zio() {
    
    var style = {
      base: {
        color: '#32325d',
        lineHeight: '18px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };
    
    const stripe = Stripe('pk_test_51IduV0K4u4NGt4AD0Y3ezdwepw9VwQNfSsvQg3pKYiHlptPyWYI0LnOsNPI5sk8oqnw0CQVo3CD5Q4WqgP8GFdEN00JcmrOLb9'); // Create a Stripe client.
    const elements = stripe.elements(); // Create an instance of Elements.
    const cardElement = elements.create('card', { style: style }); // Create an instance of the card Element.
    const cardButton = document.getElementById('card-button');
    const clientSecret = cardButton.dataset.secret;

  
    cardElement.mount('#card-element'); // Add an instance of the card Element into the `card-element` <div>.
  
    // Handle real-time validation errors from the card Element.
    cardElement.addEventListener('change', function(event) {
        var displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });
  
    // Handle form submission.
    var form = document.getElementById('payment-form');
  
    form.addEventListener('submit', function(event) {
        event.preventDefault();
  
    stripe.handleCardPayment(clientSecret, cardElement, {
            payment_method_data: {
                //billing_details: { name: cardHolderName.value }
            }
        })
        .then(function(result) {
            console.log(result);
            if (result.error) {
                // Inform the user if there was an error.
                var errorElement = document.getElementById('card-errors');
                errorElement.textContent = result.error.message;
            } else {
                console.log(result);
                form.onsubmit;
            }
        });
    });
    }
  
  

  

}
