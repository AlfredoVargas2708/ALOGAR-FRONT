import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SALEFIELDS, PRODUCTFIELDS } from '../config/fields.config';

@Component({
  selector: 'app-sale',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.scss'
})
export class SaleComponent {
  saleForm!: FormGroup;
  productForm!: FormGroup;
  saleFields = SALEFIELDS;
  productFields = PRODUCTFIELDS;
  saleIcons = [
    'https://img.icons8.com/pastel-glyph/64/sale--v5.png',
    'https://img.icons8.com/ios/50/list--v1.png',
    'https://img.icons8.com/ios/50/calendar--v1.png'
  ]
  productIcons = [
    'https://img.icons8.com/ios/50/barcode-scanner.png',
    'https://img.icons8.com/ios/50/product--v1.png',
    'https://img.icons8.com/ios/50/price-tag.png',
    'https://img.icons8.com/ios/50/average.png'
  ]

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const saleGroup: any = {};
    const productGroup: any = {};

    this.saleFields.forEach((field) => {
      saleGroup[field.name] = this.fb.control('');
    })
    this.productFields.forEach((field) => {
      productGroup[field.name] = this.fb.control('');
    })

    this.productForm = this.fb.group(productGroup);
    this.saleForm = this.fb.group(saleGroup);
  }

  onSaleSubmit() {
    if (this.saleForm.valid) {
      console.log('Sale Form Submitted', this.saleForm.value);
    } else {
      console.log('Sale Form is invalid');
    }
  }

  onProductSubmit() {
    if (this.productForm.valid) {
      console.log('Product Form Submitted', this.productForm.value);
    } else {
      console.log('Product Form is invalid');
    }
  }
}
