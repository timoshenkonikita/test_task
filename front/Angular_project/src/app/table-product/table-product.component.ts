import { Component, OnInit, ViewChild } from '@angular/core';
import { IProduct } from '../../models/product.model';
import { ProductService } from '../services/product.service';
import { NgFor } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ProductModalComponent } from '../core/modal/product-change-modal/product-change-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { ProductCreateModalComponent } from '../core/modal/product-create-modal/product-create-modal/product-create-modal.component';

@Component({
  selector: 'products',
  standalone: true,
  imports: [NgFor, MatTableModule, MatPaginator, MatButtonModule],
  templateUrl: './table-product.component.html',
  styleUrl: './table-product.component.css'
})
export class TableProductComponent implements OnInit {

  constructor(private productService: ProductService,
    private dialog: MatDialog) { }
  displayedColumns: string[] = ['id', 'name', 'unit_cost', 'quantity', 'measure_id'];
  dataSource!: MatTableDataSource<IProduct>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  product: IProduct = {} as IProduct;
  ngOnInit() {
    this.productService.getAllProducts().subscribe((products: IProduct[]) => {
      this.dataSource = new MatTableDataSource(products);
      this.dataSource.paginator = this.paginator;
    })
  }
  openChangeProductModal(productId: number): void {
    this.productService.getProductByID(productId).subscribe((product: IProduct) => {
      const dialogRef = this.dialog.open(ProductModalComponent, {
        width: '900px',
        data: product
      });

      dialogRef.afterClosed().subscribe(() => {
        this.productService.getAllProducts().subscribe((products: IProduct[]) => {
          this.dataSource.data = products;
        });
      });
    });
  }
  openCreateProductModal(): void {
    const dialogRef = this.dialog.open(ProductCreateModalComponent, {
      width: '900px',
      data: {} as IProduct
    });

    dialogRef.afterClosed().subscribe((newProduct: IProduct) => {
      if (newProduct) {
        this.productService.getAllProducts().subscribe((products: IProduct[]) => {
          this.dataSource.data = products;
        });
      }
    });
  }
}
