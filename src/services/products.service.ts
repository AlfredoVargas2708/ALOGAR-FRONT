import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroment.prod'

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  getAllProducts(page: number, pageSize: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/products?page=${page}&pageSize=${pageSize}`);
  }

  getProductsByCategory(category_id: number, page: number, pageSize: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/products/category/${category_id}?page=${page}&pageSize=${pageSize}`);
  }

  getProductByCode(code: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/products/code/${code}`);
  }

  getProductsByName(name: string, page: number, pageSize: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/products/name/${name}?page=${page}&pageSize=${pageSize}`);
  }

  getProductsOrderBy(order: string, page: number, pageSize: number, orderBy: 'asc' | 'desc'): Observable<any> {
    return this.http.get(`${environment.apiUrl}/products/order/${order}?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}`);
  }

  editProduct(product: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/products`, product);
  }
  
  deleteProduct(product_id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/products/${product_id}`);
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/products`, product);
  }
}
