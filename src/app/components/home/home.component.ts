import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  products: any[] = [];
  private productSubs!: Subscription;

  constructor(public productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products: any[]) => {
      this.products = products;
      console.log(this.products);
    })
  }

  ngOnDestroy() {
    this.productSubs.unsubscribe();
  }
}
