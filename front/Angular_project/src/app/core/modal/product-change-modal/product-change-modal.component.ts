import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IProduct } from '../../../../models/product.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgModel } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatButtonModule, FormsModule, CommonModule],
  templateUrl: './product-change-modal.component.html',
  styleUrl: './product-change-modal.component.css'
})
export class ProductModalComponent {
  constructor(private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public product: IProduct,
    public dialogRef: MatDialogRef<ProductModalComponent>
  ) { }

  @ViewChild('nameInput') nameInput!: ElementRef;
  @ViewChild('costInput') costInput!: ElementRef;
  @ViewChild('quantityInput') quantityInput!: ElementRef;
  @ViewChild('measureInput') measureInput!: ElementRef;

  editMode: boolean = false;
  isModalOpened: boolean = false;
  productId!: number;
  originalProduct: IProduct | null = null;
  editedProduct: IProduct = {} as IProduct;

  ngOnInit(): void {
    this.editedProduct = { ...this.product };
    this.originalProduct = { ...this.product };
  }

  closeDialog(): void {
    this.isModalOpened = false;
    this.dialogRef.close();
  }


  toggleEditMode(): void {
    if (this.editMode) {
      this.editedProduct = { ...this.originalProduct! };
    }
    this.editMode = !this.editMode;
  }

  deleteProduct(): void {
    this.productService.deleteProduct(this.product.id).subscribe(() => {
      this.dialogRef.close();
    });
  }

  updateProduct(): void {
    const updatedProduct: IProduct = {
      ...this.editedProduct!,
      quantity: Number(this.editedProduct!.quantity),
    };
    this.productService.updateProduct(updatedProduct).subscribe(
      (response) => {
        this.editMode = false;
        this.originalProduct = { ...response };
        this.product = { ...response };
        this.editedProduct = {} as IProduct;
        this.dialogRef.close();
      },
      (error) => {
        console.error('Ошибка при обновлении продукта:', error);
      }
    );
  }
}
