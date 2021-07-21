import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductResponseModel } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: ProductResponseModel[] = [];
  constructor(private productService: ProductService, private router: Router, private cartService: CartService) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((products: ProductResponseModel[]) => {
      this.products = products;
      console.log(this.products);
    });
  }

  selectProduct(_id: string) {
    this.router.navigate(['/product', _id]).then();
  }

  AddToCart(_id: string) {
    this.cartService.addProductToCart(_id);
  }
}
