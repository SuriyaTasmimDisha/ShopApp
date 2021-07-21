import { ProductResponseModel } from './product.model';

export interface CartModelServer {
  total: number;
  data: [
    {
      product: ProductResponseModel;
      numInCart: number;
    }
  ];
}

export interface CartModelClient {
  total: number;
  productData: [
    {
      id: string;
      numInCart: number;
    }
  ];
}
