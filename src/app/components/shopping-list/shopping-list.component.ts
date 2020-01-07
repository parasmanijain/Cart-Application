import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductListService } from '../../services/product-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  public products;
  constructor(private productListService: ProductListService) { }

  ngOnInit() {
    this.subscriptions.push(this.productListService.displayedProducts.subscribe((data: any) => {
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
    }));
  }

  addProductToShoppingCart(product) {
    this.productListService.updateShoppingCart(product.id, true);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
    this.subscriptions = [];
  }
}
