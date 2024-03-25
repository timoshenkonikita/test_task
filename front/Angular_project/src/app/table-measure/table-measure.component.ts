import { Component, OnInit, ViewChild } from '@angular/core';
import { IProduct } from '../../models/product.model';
import { NgFor } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ProductModalComponent } from '../core/modal/product-change-modal/product-change-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { ProductCreateModalComponent } from '../core/modal/product-create-modal/product-create-modal/product-create-modal.component';
import { MeasureService } from '../services/measure.service';
import { IMeasure } from '../../models/measure.model';
import { MeasureChangeModalComponent } from '../core/modal/measure-change-modal/measure-change-modal.component';
import { MeasureCreateModalComponent } from '../core/modal/measure-create-modal/measure-create-modal.component';

@Component({
  selector: 'app-table-measure',
  standalone: true,
  imports: [NgFor, MatTableModule, MatPaginator, MatButtonModule],
  templateUrl: './table-measure.component.html',
  styleUrl: './table-measure.component.css'
})
export class TableMeasureComponent {
  constructor(private measureService: MeasureService,
    private dialog: MatDialog) { }
  displayedColumns: string[] = ['id', 'value'];
  dataSource!: MatTableDataSource<IMeasure>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  product: IProduct = {} as IProduct;
  ngOnInit() {
    this.measureService.getAllMeasures().subscribe((measures: IMeasure[]) => {
      this.dataSource = new MatTableDataSource(measures);
      this.dataSource.paginator = this.paginator;
    })
  }
  openChangeProductModal(measure_id: number): void {
    this.measureService.getMeasureByID(measure_id).subscribe((measure: IMeasure) => {
      const dialogRef = this.dialog.open(MeasureChangeModalComponent, {
        width: '900px',
        data: measure
      });

      dialogRef.afterClosed().subscribe(() => {
        this.measureService.getAllMeasures().subscribe((measures: IMeasure[]) => {
          this.dataSource.data = measures;
        });
      });
    });
  }
  openCreateProductModal(): void {
    const dialogRef = this.dialog.open(MeasureCreateModalComponent, {
      width: '900px',
      data: {} as IProduct
    });

    dialogRef.afterClosed().subscribe((newMeasure: IMeasure) => {
      if (newMeasure) {
        this.measureService.getAllMeasures().subscribe((measures: IMeasure[]) => {
          this.dataSource.data = measures;
        });
      }
    });
  }
}

