export interface OrderResponse {
  orderId: string;
  success: boolean;
  message: string;
  products: [
    {
      _id: string;
      numInCart: number;
    }
  ];
}
