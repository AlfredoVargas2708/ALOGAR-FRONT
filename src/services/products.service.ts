import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  API_URL = 'http://localhost:3001/api/products';

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<any> {
    return this.http.get(`${this.API_URL}`);
  }

  getProductsByCategory(category: string): Observable<any> {
    return this.http.get(`${this.API_URL}/category/${category}`);
  }
}
