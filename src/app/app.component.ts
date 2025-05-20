import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { DataService } from '../services/data.service'
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SaleComponent } from './sale/sale.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductsComponent, CommonModule, NavbarComponent, SaleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  principalView: any = 'Productos';

  constructor(private dataService: DataService) { 
    this.dataService.data$.subscribe((dato: any) => {
      this.principalView = dato.name;
    })
  } 
}
