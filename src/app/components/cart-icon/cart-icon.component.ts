import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductListService } from '../../services/product-list.service';

@Component({
  selector: 'app-cart-icon',
  templateUrl: './cart-icon.component.html',
  styleUrls: ['./cart-icon.component.scss']
})
export class CartIconComponent implements OnInit, OnDestroy {

  public addedProducts = [];
  private subscriptions: Subscription[] = [];
  public products;
  public totalActualCost = 0;
  public totalDiscount = 0;
  public totalFinalCost = 0;
  public totalProducts = 0;
  public itemPluralMapping = {
    item: {
      '=0' : '0 items',
      '=1' : '1 item',
      'other' : '# items'
    },
  };
  constructor(private productListService: ProductListService, private router: Router) { }

  ngOnInit() {
    if (this.productListService.totalProducts.getValue() === 0) {
      this.router.navigate(['/common']);
    } else {
      this.subscriptions.push(this.productListService.addedProducts.subscribe(data => {
        if (data) {
          this.addedProducts = data.filter(product => {
            return (product.count !== 0);
          });
        }
      }));
      this.subscriptions.push(this.productListService.totalProducts.subscribe(data => {
          this.totalProducts = data;
      }));
      this.addedProducts.forEach(product => {
        product.imageLoaded = false;
        const image = new Image();
        image.onload = () => {
          product.imageLoaded = true;
        };
        image.src = product.productDetails.img_url;
      });
      this.subscriptions.push(this.productListService.totalActualCost.subscribe(data => {
        this.totalActualCost = data;
      }));
      this.subscriptions.push(this.productListService.totalDiscount.subscribe(data => {
        this.totalDiscount = data;
      }));
      this.subscriptions.push(this.productListService.totalFinalCost.subscribe(data => {
        this.totalFinalCost = data;
      }));
    }
  }

  decreaseProductQuantity(updatedProduct) {
    if (updatedProduct.count === 1) {
      this.productListService.removeProductFromCart(updatedProduct.productDetails.id);
    } else {
      this.productListService.updateShoppingCart(updatedProduct.productDetails.id, false);
    }
  }

  increaseProductQuantity(updatedProduct) {
    this.productListService.updateShoppingCart(updatedProduct.productDetails.id, true);
  }

  removeProductFromCart(removedProduct) {
    this.productListService.removeProductFromCart(removedProduct.productDetails.id);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
    this.subscriptions = [];
  }
}
