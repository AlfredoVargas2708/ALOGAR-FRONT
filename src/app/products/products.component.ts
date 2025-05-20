import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  categories: any[] = [];
  selectedCategory: number | null = null;
  @ViewChild('categoriasContainer') categoriasContainer!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['imagen', 'codigo', 'nombre', 'precio', 'acciones'];
  scrollStep = 53;
  isLoadingProducts = true;
  currentPage = 1;
  pageSize = 10;
  totalProducts = 0;

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit() {
    this.categoriesService.getCategories().subscribe((data) => {
      this.categories = data;
      this.selectedCategory = this.categories[0]?.category_id || null;
      this.fetchProducts();
    });
  }

  fetchProducts() {
    if (this.selectedCategory !== null) {
      this.isLoadingProducts = true;
      this.productsService.getProductsByCategory(this.selectedCategory, this.currentPage, this.pageSize)
        .subscribe((data) => {
          this.dataSource.data = data.products;
          this.totalProducts = data.totalProducts;
          console.log('Productos:', data.products);
          console.log('Total:', data.total);
          this.isLoadingProducts = false;
        });
    }
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1; // pageIndex es base 0
    this.pageSize = event.pageSize;
    this.fetchProducts();
  }

  changeCategory(category: number) {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.fetchProducts();
  }

  scrollToTop() {
    const el = this.categoriasContainer.nativeElement;
    if (el.scrollTop - this.scrollStep >= 0) {
      el.scrollBy({ top: -this.scrollStep, behavior: 'smooth' });
    } else {
      el.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  scrollToBottom() {
    const el = this.categoriasContainer.nativeElement;
    const maxScrollTop = el.scrollHeight - el.clientHeight;
    if (el.scrollTop + this.scrollStep <= maxScrollTop) {
      el.scrollBy({ top: this.scrollStep, behavior: 'smooth' });
    } else {
      el.scrollTo({ top: maxScrollTop, behavior: 'smooth' });
    }
  }
}
