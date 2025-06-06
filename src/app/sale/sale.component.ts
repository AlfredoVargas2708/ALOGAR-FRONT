import { CommonModule } from '@angular/common';
import { Component, Renderer2, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SALEFIELDS, SALEPRODUCTFIELDS } from '../config/fields.config';
import { SalesService } from '../../services/sales.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.scss'
})
export class SaleComponent implements AfterViewInit {

  saleForm!: FormGroup;
  productForm!: FormGroup;
  saleFields = SALEFIELDS;
  productFields = SALEPRODUCTFIELDS;
  productsInSale: any[] = [];
  totalSale: number = 0;
  indexOfProduct: number | null = null;

  saleIcons = [
    'https://img.icons8.com/pastel-glyph/64/sale--v5.png',
    'https://img.icons8.com/ios/50/calendar--v1.png',
  ];
  productIcons = [
    'https://img.icons8.com/ios/50/barcode-scanner.png',
    '',
    'https://img.icons8.com/ios/50/product--v1.png',
    'https://img.icons8.com/ios/50/price-tag.png',
    'https://img.icons8.com/ios/50/average.png'
  ];

  cantSales: number = 1;
  diaSemana: string = new Date().toLocaleDateString('es-ES', { weekday: 'long' });
  fecha: string = new Date().toLocaleDateString('es-ES', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  });

  constructor(
    private fb: FormBuilder,
    private saleService: SalesService,
    private productsService: ProductsService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    const saleGroup: any = {};
    const productGroup: any = {};

    this.saleFields.forEach((field) => {
      saleGroup[field.name] = this.fb.control('');
    });
    this.productFields.forEach((field) => {
      productGroup[field.name] = this.fb.control('');
    });

    this.productForm = this.fb.group(productGroup);
    this.saleForm = this.fb.group(saleGroup);

    this.saleService.getCantSales().subscribe((res) => {
      this.cantSales = res.total_sales + 1;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.focusCodeInput();
    }, 1000);
  }

  focusCodeInput() {
    let input = this.renderer.selectRootElement('#codigo');

    this.renderer.listen(input, 'focus', () => { });

    input.focus();
  }

  onSaleSubmit() {
    this.saleForm.addControl('products', this.fb.control([]));
    this.saleForm.patchValue({
      date: new Date().toISOString(),
      id: this.cantSales,
      total: this.totalSale,
      products: this.productsInSale
    });
    this.saleService.createSale(this.saleForm.value).subscribe((res) => {
      console.log('Sale created successfully', res);
      setTimeout(() => {
        this.productsInSale = [];
        this.totalSale = 0;
        this.indexOfProduct = null; // Resetear la selección
        this.saleForm.reset();
        this.productForm.reset();
        this.focusCodeInput();
      }, 1500);
    });
  }

  onCodeInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.productsService.getProductByCode(value).subscribe((res) => {
      this.productForm.addControl('weighable', this.fb.control(res.product_weighable));
      this.productForm.patchValue({
        id: res.product_id,
        name: res.product,
        price: res.price
      });
      console.log('Product Form', this.productForm.value);

      setTimeout(() => {
        let input = this.renderer.selectRootElement('#quantity');
        this.renderer.listen(input, 'focus', () => { });
        input.focus();
      })
    });
  }

  onQuantityInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    const isWeighable = this.productForm.get('weighable')?.value;

    // Validación para productos pesables
    if (isWeighable) {
      // Verificar si el valor tiene decimales
      if (!value.includes('.') || value.split('.')[1]?.length !== 2) {
        // Mostrar mensaje de error y mantener el foco
        inputElement.setCustomValidity('Debe ingresar un valor con 2 decimales (ej: 1.00)');
        inputElement.reportValidity();
        return; // Salir de la función sin procesar
      } else {
        inputElement.setCustomValidity(''); // Limpiar el mensaje de error
      }
    }

    // Si hay un producto seleccionado, actualizarlo
    if (this.indexOfProduct !== null) {
      this.updateSelectedProduct(Number(value));
    } else {
      // Si no hay producto seleccionado, agregar uno nuevo
      this.addNewProduct(Number(value));
    }

    this.productForm.reset();
    this.focusCodeInput();
    this.indexOfProduct = null;
  }

  private addNewProduct(quantity: number) {
    this.productsInSale.push({
      code: this.productForm.get('codigo')?.value,
      id: this.productForm.get('id')?.value,
      name: this.productForm.get('name')?.value,
      price: this.productForm.get('price')?.value,
      quantity: quantity
    });
    this.calculateTotal();
  }

  private updateSelectedProduct(quantity: number) {
    const product = this.productsInSale[this.indexOfProduct!];
    product.quantity = quantity;
    this.calculateTotal();
  }

  private calculateTotal() {
    this.totalSale = this.productsInSale.reduce(
      (sum, product) => sum + (product.price * product.quantity),
      0
    );
  }

  onProductSelect(index: number) {
    // Si ya está seleccionado, deseleccionar
    if (this.indexOfProduct === index) {
      this.indexOfProduct = null;
      this.productForm.reset();
      this.focusCodeInput();
      return;
    }

    if (this.indexOfProduct !== null) {
      // Seleccionar el nuevo producto
      this.indexOfProduct = index;
      const product = this.productsInSale[index];

      // Actualizar el formulario con los valores del producto seleccionado
      this.productForm.patchValue({
        codigo: product.code,
        name: product.name,
        price: product.price,
        quantity: product.quantity
      });

      // Enfocar el campo de cantidad para edición
      setTimeout(() => {
        const quantityInput = this.renderer.selectRootElement('#quantity');
        quantityInput.focus();
        quantityInput.select(); // Seleccionar el texto para facilitar la edición
      });
    }
  }

  onProductRemove(index: number) {
    this.productsInSale.splice(index, 1);
    this.calculateTotal();
    this.indexOfProduct = null; // Resetear la selección
    this.productForm.reset();
    this.focusCodeInput();
  }
}
