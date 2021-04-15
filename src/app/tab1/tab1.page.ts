import { HttpService } from './../http.service';
import { Component, OnInit } from '@angular/core';
import * as dropin  from "braintree-web-drop-in";
import * as braintree2  from "braintree-web";
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
// import { Stripe } from '@ionic-native/stripe/ngx';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  constructor (private ajax: HttpService,private router: Router)
     {

  }


  dropIninstance: any;
  braintreeIsReady;
  brainsubmitbtn;
  deviceDataBT;
  nonce;
  dio;

  ngOnInit() {
    this.braintreePay();
    // this.token();
  }


  // token() {
  //   this.ajax.sendGetRequest().subscribe((responseBody) => {
  //     console.log(responseBody);
  //     this.dio = responseBody;
  //     this.dio = this.dio.results.clientToken;
      
  //     this.braintreePay(this.dio);
  //   })
  // }




  braintreePay() {
    
    var sandboy = "sandbox_tvd35j32_96bqgdfznc5j7zx5";
    // var resp = responseBody
    
    let payAmount ="10";

    braintree.dropin.create({
      container: '#dropin-container',
      authorization: sandboy,
      paypal: {
        flow: 'checkout',
        amount: payAmount,
        currency: 'EUR'
      },
      card: {
        cardholderName: true
      },
      applePay: {
        displayName: 'Merchant Name',
        paymentRequest: {
          total: {
            label: 'Localized Name',
            amount: '10.00',
          },
          countryCode: 'IT',
          currencyCode: 'EUR',
          supportedNetworks: ['visa'],
          merchantCapabilities: ['FULL'],
        }
      },
      googlePay: {
        googlePayVersion: 2,
        merchantId: 'merchant-id-from-google',
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPrice: payAmount,
          currencyCode: 'EUR'
        }, 
        allowedPaymentMethods: [{
          type: 'CARD',
          parameters: {
            // We recommend collecting and passing billing address information with all Google Pay transactions as a best practice.
            billingAddressRequired: true,
            billingAddressParameters: {
              format: 'FULL'
            }
          }
        }]
      } 
      
    }, (err, dropinInstance ) => {
      this.brainsubmitbtn = true;

      if (err) {
        console.error(err);
        return;
      }
      
      this.dropIninstance = dropinInstance;
      this.braintreeIsReady = true;
      //creo istanza per salvare i deviceData
      braintree2.client.create({
        authorization: sandboy
      }, (err, clientInstance)=> {
        // Creation of any other components...
        braintree2.dataCollector.create({
          client: clientInstance,
          paypal: true,
        }, (err, dataCollectorInstance) => {
          
          if (err) {
            // Handle error in creation of data collector
            return;
          }
          // At this point, you should access the dataCollectorInstance.deviceData value and provide it
          // to your server, e.g. by injecting it into your form as a hidden input.
          // this.deviceDataBT = dataCollectorInstance.deviceData;
          this.deviceDataBT = dataCollectorInstance.deviceData;
          console.log(this.deviceDataBT);
        });
      })
  
      let form = document.getElementById("braintree-form");

      dropinInstance.on('paymentMethodRequestable', (event) => {
    
        if (event.paymentMethodIsSelected && event.type != "CreditCard" ) {
          this.brainsubmitbtn = false;
          
          this.dropIninstance.requestPaymentMethod((err, payload) => {
            if (err) {
              console.log(err);
            }else {
              this.nonce = payload.nonce;
              var data = {
                nonce: payload.nonce,
                price: payAmount
              }

              this.ajax.sendPostRequest(data).subscribe(resp => {
                console.log(resp)
                location.reload();
              });
              
              console.log('inviato al server');
              console.log(this.nonce);
            }
          });
        }
      });

      form.addEventListener("submit", (event) => { 
        event.preventDefault();
        this.dropIninstance.requestPaymentMethod((err, payload) => {
          if (err) {
            console.log(err);
          }else {
            this.nonce = payload.nonce;
            var data = {
              nonce: payload.nonce,
              price: payAmount
            }

            this.ajax.sendPostRequest(data).subscribe(resp => {
              console.log(resp)
              location.reload();
            });

            console.log('inviato al server');
            console.log(this.nonce);
            form.onsubmit;

            this.brainsubmitbtn = false;
            location.reload();
            //send nonce to the server
          }
        });
      });
    });
  }
}
