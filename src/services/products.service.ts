import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroment.prod'

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/products`);
  }

  getProductsByCategory(category_id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/products/category/${category_id}`);
  }

  getProductByCode(code: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/products/${code}`);
  }
}
