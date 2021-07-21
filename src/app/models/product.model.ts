export interface ProductModel {
    name: string;
    category: string;
    image: string;
    price: number;
    countInStock: number;
    details: string;
    plantCare: string;
}
export interface ProductResponseModel {
    _id: string;
    name: string;
    category: string;
    image: string;
    price: number;
    countInStock: number;
    details: string;
    plantCare: string;
}