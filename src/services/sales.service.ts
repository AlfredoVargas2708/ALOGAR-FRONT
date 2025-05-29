import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroment'

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private http: HttpClient) { }

  getAllSales(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/sales`);
  }

  getProductSales(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/sales/products`);
  }

  getCantSales(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/sales/count`);
  }

  createSale(sale: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/sales`, sale);
  }
}
