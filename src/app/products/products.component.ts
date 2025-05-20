import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  products: any[] = [];
  categories: any[] = [];
  selectedCategory: number | null = null;
  @ViewChild('categoriasContainer') categoriasContainer!: ElementRef;
  scrollStep = 53;
  isLoadingProducts = true;

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.categoriesService.getCategories().subscribe((data) => {
      this.categories = data;
      this.selectedCategory = this.categories[this.categories.length -1]?.category_id || null;
      if (this.selectedCategory !== null) {
        this.productsService.getProductsByCategory(this.selectedCategory).subscribe((data) => {
          this.products = data;
          this.isLoadingProducts = false;
        });
      }
    });
  }

  changeCategory(category: number) {
    this.selectedCategory = category;
    this.isLoadingProducts = true;
    this.productsService.getProductsByCategory(this.selectedCategory).subscribe((data) => {
      this.products = data;
      this.isLoadingProducts = false;
    });
  }

  scrollToTop() {
    const el = this.categoriasContainer.nativeElement;

    if (el.scrollTop - this.scrollStep >= 0) {
      el.scrollBy({ top: -this.scrollStep, behavior: 'smooth' });
    } else {
      // Opcional: ir al principio
      el.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  scrollToBottom() {
    const el = this.categoriasContainer.nativeElement;
    const maxScrollTop = el.scrollHeight - el.clientHeight;

    if (el.scrollTop + this.scrollStep <= maxScrollTop) {
      el.scrollBy({ top: this.scrollStep, behavior: 'smooth' });
    } else {
      // Opcional: salta directamente al final
      el.scrollTo({ top: maxScrollTop, behavior: 'smooth' });
    }
  }
}
