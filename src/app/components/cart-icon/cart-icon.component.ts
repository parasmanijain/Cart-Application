import { Component, OnInit } from '@angular/core';
import { I18nPluralPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ProductListService } from '../../services/product-list.service';

@Component({
  selector: 'app-cart-icon',
  templateUrl: './cart-icon.component.html',
  styleUrls: ['./cart-icon.component.scss']
})
export class CartIconComponent implements OnInit {

  public addedProducts;
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
    if (this.productListService.retrieveAddedProducts().getValue().length === 0) {
      this.router.navigate(['/common']);
    } else {
      this.productListService.groupAddedProducts();
      this.productListService.addedProductGrouped.subscribe(data => {
        if (data) {
          this.totalActualCost = 0;
          this.totalDiscount = 0;
          this.totalFinalCost = 0;
          this.addedProducts = data;
          data.forEach(product => {
            this.totalActualCost += (product.productDetails.price * product.count);
            this.totalDiscount += (product.productDetails.price * (product.productDetails.discount / 100) * product.count);
          });
          this.totalFinalCost = this.totalActualCost - this.totalDiscount;
        }
      });
      this.productListService.totalProducts.subscribe(data => {
          this.totalProducts = data;
      });
      this.addedProducts.forEach(product => {
        product.imageLoaded = false;
        const image = new Image();
        image.onload = () => {
          product.imageLoaded = true;
        };
        image.src = product.productDetails.img_url;
      });
    }
  }

  decreaseProductQuantity(updatedProduct) {
    if (updatedProduct.count > 0) {
      updatedProduct.count--;
    }
    this.productListService.updateProductCount(updatedProduct);
  }

  increaseProductQuantity(updatedProduct) {
    updatedProduct.count++;
    this.productListService.updateProductCount(updatedProduct);
  }

  removeProductFromCart(removedProduct) {
    removedProduct.count = 0;
    this.productListService.removeProductFromCart(removedProduct);
  }
}
