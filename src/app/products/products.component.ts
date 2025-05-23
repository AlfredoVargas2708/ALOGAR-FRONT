import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  categories: any[] = [];
  products: any[] = [];
  selectedCategory: number | null = null;
  @ViewChild('categoriasContainer') categoriasContainer!: ElementRef;

  scrollStep = 53;
  isLoadingProducts = true;
  currentPage = 1;
  pageSize = 10;
  totalProducts = 0;
  totalPages = 0;

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
          this.products = data.products;
          this.totalProducts = data.totalProducts;
          this.totalPages = data.totalPages;
          setTimeout(() => {
            this.isLoadingProducts = false;
          }, 1500);
        });
    }
  }

  changeCategory(category: number) {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.fetchProducts();
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
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

  sortBy(type: string) {
    this.isLoadingProducts = true;
    this.productsService.getProductsOrderBy(type, this.currentPage, this.pageSize)
      .subscribe((data) => {
        this.products = data.products;
        this.totalProducts = data.totalProducts;
        this.totalPages = data.totalPages;
        setTimeout(() => {
          this.isLoadingProducts = false;
        }, 1500);
      });
  }

  searchProductsByCode(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    if(value !== '') {
      this.isLoadingProducts = true;
      this.productsService.getProductByCode(value).subscribe((res) => {
        this.products = [res];
        this.totalProducts = 1;
        this.totalPages = 1;
        setTimeout(() => {
          this.isLoadingProducts = false;
        }, 1500);
      });
    } else {
      this.fetchProducts();
      setTimeout(() => {
        this.isLoadingProducts = false;
      }, 1500);
    }
  }
}
