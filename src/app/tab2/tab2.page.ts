import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  paymentRequest: google.payments.api.PaymentDataRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: "CARD",
        parameters: {
          allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
          allowedCardNetworks: ["AMEX", "VISA", "MASTERCARD"]
        },
        tokenizationSpecification: {
          type: "PAYMENT_GATEWAY",
          parameters: {
            gateway: "example",
            gatewayMerchantId: "exampleGatewayMerchantId"
          }
        }
      }
    ],
    merchantInfo: {
      merchantId: "12345678901234567890",
      merchantName: "Demo Merchant"
    },
    transactionInfo: {
      totalPriceStatus: "FINAL",
      totalPriceLabel: "Total",
      totalPrice: "0.01",
      currencyCode: "EUR",
      countryCode: "IT"
    },
    callbackIntents: ['PAYMENT_AUTHORIZATION']
  };

  onLoadPaymentData = (
    event: Event
    ): void => {
      const eventDetail = event as CustomEvent<google.payments.api.PaymentData>;
      console.log("dati di pagamento caricati" , eventDetail.detail);
    }
  

  onPaymentDataAuthorized: google.payments.api.PaymentAuthorizedHandler = (
    paymentData
  ) => {
    console.log(paymentData);
    return {
      transactionState : "SUCCESS"
    };
    
  }
  onError = (event: ErrorEvent): void => {
    console.error('error' , event.error);
    
  }
}
