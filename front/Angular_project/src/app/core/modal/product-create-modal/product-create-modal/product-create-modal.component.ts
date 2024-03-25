import { Component } from '@angular/core';
import { ProductService } from '../../../../services/product.service';
import { IProduct } from '../../../../../models/product.model';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { IMeasure } from '../../../../../models/measure.model';
import { MeasureService } from '../../../../services/measure.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-product-create-modal',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatButtonModule, FormsModule, CommonModule, MatAutocompleteModule],
  templateUrl: './product-create-modal.component.html',
  styleUrl: './product-create-modal.component.css'
})
export class ProductCreateModalComponent {
  constructor(private productService: ProductService,
    private measureService: MeasureService,
    public dialogRef: MatDialogRef<ProductCreateModalComponent>
  ) { }

  newProduct: IProduct = {} as IProduct;
  measureList: IMeasure[] = [];
  selectedMeasure: number | null = null;

  ngOnInit(): void {
    this.loadMeasureList();
  }

  loadMeasureList(): void {
    this.measureService.getAllMeasures().subscribe((measures: IMeasure[]) => {
      this.measureList = measures;
    });
  }

  createProduct(): void {
    if (this.selectedMeasure !== null) {
      this.newProduct.measure_id = this.selectedMeasure;
      this.productService.createProduct(this.newProduct).subscribe(
        (createdProduct: IProduct) => {
          this.dialogRef.close(createdProduct);
        },
        (error) => {
          console.error('Ошибка при создании продукта:', error);
        }
      );
    } else {
      console.error('Выберите единицу измерения!');
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
