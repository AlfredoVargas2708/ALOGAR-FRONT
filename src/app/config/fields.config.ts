import { SaleField } from "../interfaces/sale";
import { ProductField } from "../interfaces/product";

export const SALEFIELDS: SaleField[] = [
  { type: 'number', name: 'id', label: 'N° Venta' },
  { type: 'text', name: 'date', label: 'Fecha' },
  { type: 'number', name: 'total', label: 'Total' },
];

export const SALEPRODUCTFIELDS: ProductField[] = [
  { type: 'number', name: 'codigo', label: 'Codigo de Barras' },
  { type: 'number', name: 'id', label: 'ID' },
  { type: 'text', name: 'name', label: 'Producto' },
  { type: 'number', name: 'price', label: 'Precio' },
  { type: 'number', name: 'quantity', label: 'Cantidad' },
];

export const PRODUCTFIELDS: ProductField[] = [
  { type: 'number', name: 'codigo', label: 'Codigo de Barras' },
  { type: 'number', name: 'id', label: 'ID' },
  { type: 'text', name: 'name', label: 'Nombre del Producto' },
  { type: 'number', name: 'price', label: 'Precio' },
];
