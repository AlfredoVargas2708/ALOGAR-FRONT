import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  menuItems = [
    { name: 'Venta', icon: 'https://img.icons8.com/ios/50/FFFFFF/sale--v1.png', active: false, iconActive: 'https://img.icons8.com/ios-filled/50/1b421d/sale.png'},
    { name: 'Productos', icon: 'https://img.icons8.com/ios/50/FFFFFF/fast-moving-consumer-goods.png', active: true, iconActive: 'https://img.icons8.com/ios-filled/50/1b421d/fast-moving-consumer-goods.png'},
    { name: 'Registros', icon: 'https://img.icons8.com/ios/50/FFFFFF/documents.png', active: false, iconActive: 'https://img.icons8.com/ios-filled/50/1b421d/documents.png'},
  ]
  constructor(private dataService: DataService) {}

  changeViewInMenu(dato: any) {
    this.dataService.changeViewInMenu(dato);
    this.menuItems.forEach((item) => {
      item.active = item.name === dato.name;
    });
  }
}
