import { Component, OnInit } from '@angular/core';
declare var Stripe;

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {

  constructor() { }

  ngOnInit() {
    this.cout()
  }
  cout() {
    var stripe = Stripe("pk_test_51IduV0K4u4NGt4AD0Y3ezdwepw9VwQNfSsvQg3pKYiHlptPyWYI0LnOsNPI5sk8oqnw0CQVo3CD5Q4WqgP8GFdEN00JcmrOLb9");
    var checkoutButton = document.getElementById("checkout-button");
    checkoutButton.addEventListener("click", () => {
      fetch("http://localhost:8000/api/create-checkout-session", {
        method: "POST",
      })
        .then( (response) => {
          console.log(response);
          return response.json();
        })
        .then((session) => {
          console.log(session);

          return stripe.redirectToCheckout({ sessionId: session['id'] });
        })
        .then((result) => {
          console.log(result);
          
          // If redirectToCheckout fails due to a browser or network
          // error, you should display the localized error message to your
          // customer using error.message.
          if (result.error) {
            alert(result.error.message);
          }
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    });
  }
}
