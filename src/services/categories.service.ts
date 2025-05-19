import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroment'

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(private http: HttpClient) { }

  getCategories(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/categories`);
  }
}
