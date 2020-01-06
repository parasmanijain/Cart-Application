import { Component, OnInit } from '@angular/core';
import { ProductListService } from '../../services/product-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {

  public products;
  constructor(private productListService: ProductListService) { }

  ngOnInit() {
    this.productListService.displayedProducts.subscribe((data: any) => {
      if (Array.isArray(data) &&  data.length > 0) {
        this.products = data;
        this.products.forEach(product => {
          product.imageLoaded = false;
          const image = new Image();
          image.onload = () => {
            product.imageLoaded = true;
          };
          image.src = product.img_url;
        });
      } else {
        this.products = [];
      }
    }, (error) => {
      console.log(error);
    });
  }

  addProductToShoppingCart(product) {
    let count = this.productListService.totalProducts.getValue() ? this.productListService.totalProducts.getValue() : 0;
    this.productListService.addProducts(product);
    count++;
    this.productListService.totalProducts.next(count);
  }
}
