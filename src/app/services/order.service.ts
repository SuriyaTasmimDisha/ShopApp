import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductResponseModel } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private products: ProductResponseModel[] = [];
  private SERVER_URL = environment.SERVER_URL;

  constructor(private http: HttpClient) { }

  getSingleOrder(orderId: string) {
    return this.http.get<ProductResponseModel[]>(this.SERVER_URL + '/orders' + orderId).toPromise();
  }
}
