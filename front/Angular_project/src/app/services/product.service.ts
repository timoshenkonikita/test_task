import { Injectable } from '@angular/core';
import { IProduct } from '../../models/product.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl

  constructor(private http: HttpClient) { this.apiUrl = "http://localhost:8080/product" }

  getAllProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>("http://localhost:8080/product/");
  }

  getProductByID(id: number): Observable<IProduct> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Request URL:', url);
    return this.http.get<IProduct>(url);
  }

  createProduct(product: IProduct): Observable<IProduct> {
    console.log(product)
    return this.http.post<IProduct>("http://localhost:8080/product/", product);
  }

  updateProduct(product: IProduct): Observable<IProduct> {
    const url = `${this.apiUrl}/${product.id}`;
    return this.http.put<IProduct>(url, product);
  }

  deleteProduct(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
