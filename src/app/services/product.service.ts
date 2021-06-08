import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private SERVER_URL = environment.SERVER_URL;

  constructor(private http: HttpClient) {}

  login() {
    // return this.http.post(this.SERVER_URL + '/users/login');
  }
  getAllProducts() {
    return this.http.get(this.SERVER_URL + '/products');
  }
}
