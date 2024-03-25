import { Routes } from '@angular/router';
import { TableProductComponent } from './table-product/table-product.component';
import { TableMeasureComponent } from './table-measure/table-measure.component';

export const routes: Routes = [
    { path: 'products', component: TableProductComponent },
    { path: 'measures', component: TableMeasureComponent },
];
