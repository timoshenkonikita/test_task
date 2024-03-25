import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TableProductComponent } from "./table-product/table-product.component";
import { NavbarComponent } from "./core/navbar/navbar.component";
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, RouterOutlet, TableProductComponent, NavbarComponent, RouterLink, RouterLinkActive]
})
export class AppComponent {

}
