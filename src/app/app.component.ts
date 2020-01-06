import { Component, OnInit } from '@angular/core';
import { ProductListService } from './services/product-list.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'cart-application';

  constructor(private productListService: ProductListService) {

  }
  ngOnInit() {
    this.productListService.getProductsList();
  }

}
