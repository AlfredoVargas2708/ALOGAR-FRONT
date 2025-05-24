import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PRODUCTFIELDS } from '../config/fields.config';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
  orderBy: 'asc' | 'desc' = 'asc';

  productFields = PRODUCTFIELDS;
  productForm!: FormGroup;
  productIcons = [
    'https://img.icons8.com/ios/50/barcode-scanner.png',
    '',
    'https://img.icons8.com/ios/50/product--v1.png',
    'https://img.icons8.com/ios/50/price-tag.png',
  ];

  constructor(
    private productsService: ProductsService,
    private fb: FormBuilder,
    private categoriesService: CategoriesService
  ) {
    const productGroup: any = {};
    this.productFields.forEach((field) => {
      productGroup[field.name] = this.fb.control('');
    });
    this.productForm = this.fb.group(productGroup);
  }

  ngOnInit() {
    this.fetchProducts();
    this.fetchCategories();
  }

  fetchProducts() {
    this.productsService.getAllProducts(this.currentPage, this.pageSize).subscribe((data) => {
      this.products = data.products;
      this.totalProducts = data.totalProducts;
      this.totalPages = data.totalPages;
      setTimeout(() => {
        this.isLoadingProducts = false;
      }, 1500);
    });
  }

  fetchCategories() {
    this.categoriesService.getCategories().subscribe((data) => {
      this.categories = data;
    })
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
  }

  onEditProduct(product: any) {
    this.productForm.patchValue({
      codigo: product.product_code,
      id: product.product_id,
      name: product.product,
      price: product.price,
    })
  }

  onDeleteProduct(product: any) {
    this.productsService.deleteProduct(product.product_id).subscribe((res) => {
      console.log('Product deleted:', product.product_id);
    })
  }

  onSaveProduct() {
    const productData = this.productForm.value;
    this.productsService.editProduct(productData).subscribe((res) => {
      console.log('Product edited:', productData);
      this.productForm.reset();
    })
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
    this.orderBy = this.orderBy === 'asc' ? 'desc' : 'asc';
    this.productsService.getProductsOrderBy(type, this.currentPage, this.pageSize, this.orderBy)
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

    if (value !== '') {
      this.isLoadingProducts = true;
      this.productsService.getProductByCode(value).subscribe({
        next: (res) => {
          this.products = [res];
          this.totalProducts = 1;
          this.totalPages = 1;
          setTimeout(() => {
            this.isLoadingProducts = false;
          }, 1500);
        },
        error: (error: any) => {
          console.error('Error fetching product by code:', error);
          this.products = [];
          this.totalProducts = 0;
          this.totalPages = 0;
          setTimeout(() => {
            this.isLoadingProducts = false;
          }, 1500);
        }
      });
    } else {
      this.isLoadingProducts = true;
      this.fetchProducts();
      setTimeout(() => {
        this.isLoadingProducts = false;
      }, 1500);
    }
  }

  searchProductsByName(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    if (value !== '') {
      this.isLoadingProducts = true;
      this.productsService.getProductsByName(value, this.currentPage, this.pageSize).subscribe({
        next: (res) => {
          this.products = res.products;
          this.totalProducts = res.totalProducts;
          this.totalPages = res.totalPages;
          setTimeout(() => {
            this.isLoadingProducts = false;
          }, 1500);
        },
        error: (error: any) => {
          console.error('Error fetching product by name:', error);
          this.products = [];
          this.totalProducts = 0;
          this.totalPages = 0;
          setTimeout(() => {
            this.isLoadingProducts = false;
          }, 1500);
        }
      });
    } else {
      this.isLoadingProducts = true;
      this.fetchProducts();
      setTimeout(() => {
        this.isLoadingProducts = false;
      }, 1500);
    }
  }
}
