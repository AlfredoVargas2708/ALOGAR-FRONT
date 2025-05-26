import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroment.prod'

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private http: HttpClient) { }

  getAllSales(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/sales`);
  }

  getCantSales(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/sales/count`);
  }
}
