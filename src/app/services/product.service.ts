import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private SERVER_URL = environment.SERVER_URL;
  private products: Product[] = [];
  private productUpdated = new Subject<Product[]>();

  constructor(private http: HttpClient) {}

  createProduct(
    name: string,
    category: string,
    image: File,
    price: string,
    countInStock: string,
    details: string,
    plantCare: string
  ) {
    const product = new FormData();
    product.append("name", name);
    product.append("category", category);
    product.append("image", image, name);
    product.append("price", price);
    product.append("countInStock", countInStock);
    product.append("details", details);
    product.append("plantCare", plantCare);

    this.http
      .post(this.SERVER_URL + '/products', product)
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  getPostUpdateListener() {
    return this.productUpdated.asObservable();
  }

  getProducts() {
    return this.http.get(this.SERVER_URL + '/products');
  }
}
