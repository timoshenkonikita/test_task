import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgModel } from '@angular/forms';
import { MeasureService } from '../../../services/measure.service';
import { IMeasure } from '../../../../models/measure.model';

@Component({
  selector: 'app-measure-create-modal',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatButtonModule, FormsModule, CommonModule],
  templateUrl: './measure-create-modal.component.html',
  styleUrl: './measure-create-modal.component.css'
})
export class MeasureCreateModalComponent {
  constructor(private measureService: MeasureService,
    public dialogRef: MatDialogRef<MeasureCreateModalComponent>
  ) { }

  newMeasure: IMeasure = {} as IMeasure;

  createProduct(): void {
    this.measureService.createMeasure(this.newMeasure).subscribe(
      (createdMeasure: IMeasure) => {
        this.dialogRef.close(createdMeasure);
      },
      (error) => {
        console.error('Ошибка при создании продукта:', error);
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
