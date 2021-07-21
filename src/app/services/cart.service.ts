import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CartModelClient, CartModelServer } from '../models/cart.model';
import { OrderResponse } from '../models/order.model';
import { ProductResponseModel } from '../models/product.model';
import { OrderService } from './order.service';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private SERVER_URL = environment.SERVER_URL;

  //Cart on Client's local storage
  private cartDataClient: CartModelClient = {
    total: 0,
    productData: [
      {
        numInCart: 0,
        id: '0',
      },
    ],
  };

  //Cart on server
  private cartDataServer: CartModelServer = {
    total: 0,
    data: [
      {
        numInCart: 0,
        product: undefined,
      },
    ],
  };

  //Observables for the components to subscribe
  cartTotal$ = new BehaviorSubject<Number>(0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
    private toast: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.cartTotal$.next(this.cartDataServer.total);
    this.cartData$.next(this.cartDataServer);

    //Get info from localStorage
    let info: CartModelClient = JSON.parse(localStorage.getItem('cart'));

    if (
      info !== null &&
      info !== undefined &&
      info.productData[0].numInCart !== 0
    ) {
      this.cartDataClient = info;

      //put every product in CartDataService
      this.cartDataClient.productData.forEach((product) => {
        this.productService
          .getProduct(product.id)
          .subscribe((productInfo: ProductResponseModel) => {
            if (this.cartDataServer.data[0].numInCart === 0) {
              this.cartDataServer.data[0].numInCart = product.numInCart;
              this.cartDataServer.data[0].product = productInfo;
              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            } else {
              // Cart has some entry in it
              this.cartDataServer.data.push({
                numInCart: product.numInCart,
                product: productInfo,
              });
              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            }
            this.cartData$.next({ ...this.cartDataServer });
          });
      });
    }
  }

  addProductToCart(id: string, quantity: number) {
    this.productService
      .getProduct(id)
      .subscribe((product: ProductResponseModel) => {
        //1. Chenck if the cart is empty
        if (this.cartDataServer.data[0].product === undefined) {
          this.cartDataServer.data[0].product = product;
          this.cartDataServer.data[0].numInCart =
            quantity !== undefined ? quantity : 1;

          this.cartDataClient.productData[0].numInCart =
            this.cartDataServer.data[0].numInCart;
          this.cartDataClient.productData[0].id = product._id;
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.cartData$.next({ ...this.cartDataServer });
        } else {
          // 2. Check if cart has some items
          let index = this.cartDataServer.data.findIndex(
            (p) => p.product._id === product._id
          );

          //a. If that item is already in the cart
          if (index !== -1) {
            if (quantity !== undefined && quantity <= product.countInStock) {
              this.cartDataServer.data[index].numInCart =
                this.cartDataServer.data[index].numInCart < product.countInStock
                  ? quantity
                  : product.countInStock;
            } else {
              this.cartDataServer.data[index].numInCart =
                this.cartDataServer.data[index].numInCart < product.countInStock
                  ? this.cartDataServer.data[index].numInCart++
                  : product.countInStock;
            }
            this.cartDataClient.productData[index].numInCart =
              this.cartDataServer.data[index].numInCart;
            this.toast.info(
              `${product.name} updaated in the cart`,
              'Product Updated',
              {
                timeOut: 1500,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right',
              }
            );
          } else {
            //b. If that item is not in the cart
            this.cartDataServer.data.push({
              numInCart: 1,
              product: product,
            });

            this.cartDataClient.productData.push({
              numInCart: 1,
              id: product._id,
            });

            this.toast.success(
              `${product.name} added to the cart`,
              'Product Added',
              {
                timeOut: 1500,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right',
              }
            );

            this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            this.cartData$.next({ ...this.cartDataServer });
          }
        }
      });
  }

  updateCartItems(index: number, increase: boolean) {
    let data = this.cartDataServer.data[index];

    if (increase) {
      data.numInCart < data.product.countInStock
        ? data.numInCart++
        : data.product.countInStock;
      this.cartDataClient.productData[index].numInCart = data.numInCart;

      this.cartDataClient.total = this.cartDataServer.total;
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.cartData$.next({ ...this.cartDataServer });
    } else {
      data.numInCart--;
    }

    if (data.numInCart < 1) {
      this.cartData$.next({ ...this.cartDataServer });
    } else {
      this.cartData$.next({ ...this.cartDataServer });
      this.cartDataClient.productData[index].numInCart = data.numInCart;

      this.cartDataClient.total = this.cartDataServer.total;
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
    }
  }

  deleteProductFromCart(index: number) {
    if (window.confirm('Are you sure you want to remove the item?')) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.productData.splice(index, 1);

      this.cartDataClient.total = this.cartDataServer.total;

      if (this.cartDataClient.total === 0) {
        this.cartDataClient = {
          total: 0,
          productData: [
            {
              numInCart: 0,
              id: '0',
            },
          ],
        };
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      } else {
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

      if (this.cartDataServer.total === 0) {
        this.cartDataServer = {
          total: 0,
          data: [
            {
              numInCart: 0,
              product: undefined,
            },
          ],
        };
        this.cartData$.next({ ...this.cartDataServer });
      } else {
        this.cartData$.next({ ...this.cartDataServer });
      }
    } else {
      //if the user click cancel button
      return;
    }
  }

  private CalculateTotal() {
    let total = 0;

    this.cartDataServer.data.map((p) => {
      const { numInCart } = p;
      const { price } = p.product;      

      total += numInCart * price;
    });

    this.cartDataServer.total = total;
    this.cartTotal$.next(this.cartDataServer.total);
  }

  checkoutFromCart(userId: string) {
    this.http
      .post(this.SERVER_URL + '/orders/payment', null)
      .subscribe((res: { success: boolean }) => {
        if (res.success) {
          this.resetServerData();
          this.http
            .post(this.SERVER_URL + '/orders', {
              userId: userId,
              products: this.cartDataClient.productData,
            })
            .subscribe((data: OrderResponse) => {
              this.orderService
                .getSingleOrder(data.orderId)
                .then((products) => {
                  if (data.success) {
                    const navigatorExtras: NavigationExtras = {
                      state: {
                        message: data.message,
                        products: products,
                        orderId: data.orderId,
                        total: this.cartDataClient.total,
                      },
                    };
                    this.spinner.hide().then();
                    this.router
                      .navigate(['/greeting'], navigatorExtras)
                      .then((product) => {
                        this.cartDataClient = {
                          total: 0,
                          productData: [
                            {
                              numInCart: 0,
                              id: '0',
                            },
                          ],
                        };
                        this.cartTotal$.next(0);
                        localStorage.setItem(
                          'cart',
                          JSON.stringify(this.cartDataClient)
                        );
                      });
                  }
                });
            });
        } 
        else {
          this.spinner.hide().then();
          this.router.navigateByUrl('/checkout').then();
          this.toast.error(
            `Sorry! couldn't place the order`,
            'Order Status',
            {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right',
            }
          );
        }
      });
  }

  private resetServerData() {
    this.cartDataServer = {
      total: 0,
      data: [
        {
          numInCart: 0,
          product: undefined,
        },
      ],
    };
    this.cartData$.next({ ...this.cartDataServer });
  }
}
