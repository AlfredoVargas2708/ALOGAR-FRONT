import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSubject = new Subject<any>();
  data$ = this.dataSubject.asObservable();

  constructor() { }

  changeViewInMenu(dato: any) {
    this.dataSubject.next(dato);
  }
}
