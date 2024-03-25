import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MeasureService } from '../../../services/measure.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IMeasure } from '../../../../models/measure.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-measure-change-modal',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatButtonModule, FormsModule, CommonModule],
  templateUrl: './measure-change-modal.component.html',
  styleUrl: './measure-change-modal.component.css'
})
export class MeasureChangeModalComponent {
  constructor(private measureService: MeasureService,
    @Inject(MAT_DIALOG_DATA) public measure: IMeasure,
    public dialogRef: MatDialogRef<MeasureChangeModalComponent>
  ) { }

  @ViewChild('idInput') idInput!: ElementRef;
  @ViewChild('valueInput') valueInput!: ElementRef;

  editMode: boolean = false;
  isModalOpened: boolean = false;
  measureId!: number;
  originalMeasure: IMeasure | null = null;
  editedMeasure: IMeasure = {} as IMeasure;
  ngOnInit(): void {
    this.editedMeasure = { ...this.measure };
    this.originalMeasure = { ...this.measure };
  }

  closeDialog(): void {
    this.isModalOpened = false;
    this.dialogRef.close();
  }


  toggleEditMode(): void {
    if (this.editMode) {
      this.editedMeasure = { ...this.originalMeasure! };
    }
    this.editMode = !this.editMode;
  }

  deleteMeasure(): void {
    this.measureService.deleteMeasure(this.measure.id).subscribe(() => {
      this.dialogRef.close();
    });
  }

  updateMeasure(): void {
    const updatedMeasure: IMeasure = {
      ...this.editedMeasure!
    };
    this.measureService.updateMeasure(updatedMeasure).subscribe(
      (response) => {
        this.editMode = false;
        this.originalMeasure = { ...response };
        this.measure = { ...response };
        this.editedMeasure = {} as IMeasure;
        this.dialogRef.close();
      },
      (error) => {
        console.error('Ошибка при обновлении measure:', error);
      }
    );
  }
}
