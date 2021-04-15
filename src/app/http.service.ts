import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  apiUrl = "http://localhost:8000/api/airport-index"
  postiUrl = "http://localhost:8000/api/airport-store"
  stripeiUrl = "http://localhost:8000/api/airport-stripe"
  chec = "http://localhost:8000/api/create-checkout-session"
  constructor(private httpClient: HttpClient) { }

  sendGetRequest() {
    return this.httpClient.get(this.apiUrl);
  }

  sendPostRequest(data: Object): Observable<Object> {
    return this.httpClient.post(this.postiUrl, data);
  }

  stripeGet() {
    return this.httpClient.get(this.stripeiUrl);
  }

  check(data: Object): Observable<Object>  {
    return this.httpClient.post(this.chec, data);

  }

}
