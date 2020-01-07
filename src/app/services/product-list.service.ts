declare var AppSettings: any;
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AddedProduct } from '../models/added-product';
import { ProductCounter } from '../models/product-counter';

@Injectable({
  providedIn: 'root'
})
export class ProductListService {

  public configUrl = AppSettings.API_URL;
  public products = new BehaviorSubject(null);
  public displayedProducts = new BehaviorSubject(null);
  public counterList = [];
  public word = new BehaviorSubject('');
  public min = new BehaviorSubject(0);
  public max = new BehaviorSubject(10000);
  public order = new BehaviorSubject('highLow');
  public addedProducts = new BehaviorSubject([]);
  public totalProducts = new BehaviorSubject(0);
  public totalActualCost = new BehaviorSubject(0);
  public totalFinalCost = new BehaviorSubject(0);
  public totalDiscount = new BehaviorSubject(0);
  constructor(private http: HttpClient) { }

  getProductsList() {
    return this.http.get(this.configUrl).subscribe((data: any) => {
      const addedProducts = [];
      data.forEach(product => {
        const addedProduct = new AddedProduct();
        addedProduct.productDetails = product;
        addedProduct.count = 0;
        addedProducts.push(addedProduct);
      });
      this.addedProducts.next(addedProducts);
      this.products.next(data);
      this.displayedProducts.next(data);
      this.searchSortFilter();
    }, (error) => {
      console.log(error);
    });
  }

  updateShoppingCart(productId, flag) {
    const addedProducts = this.addedProducts.getValue();
    let totalProducts = this.totalProducts.getValue();
    addedProducts.forEach(product => {
      if (product.productDetails.id === productId) {
        if (flag) {
          product.count++;
          totalProducts++;
        } else {
          if (product.count > 0) {
            product.count--;
            totalProducts--;
          }
        }
      }
    });
    this.addedProducts.next(addedProducts);
    this.updateProductCosts();
    this.totalProducts.next(totalProducts);
  }

  updateProductCosts() {
    let totalActualCost = 0;
    let totalDiscount = 0;
    let totalFinalCost = 0;
    this.addedProducts.getValue().forEach(product => {
        totalActualCost += (product.productDetails.price * product.count);
        totalDiscount += ((product.productDetails.price * (product.productDetails.discount / 100)) * product.count);
        totalFinalCost = totalActualCost - totalDiscount;
    });
    this.totalActualCost.next(totalActualCost);
    this.totalDiscount.next(totalDiscount);
    this.totalFinalCost.next(totalFinalCost);
  }

  removeProductFromCart(productID) {
    let products = this.addedProducts.getValue();
    let productCount = 0;
    products = products.filter(product => {
      if (product.productDetails.id !== productID) {
        productCount += product.count;
      } else {
        product.count = 0;
      }
      return product;
    });
    this.addedProducts.next(products);
    this.updateProductCosts();
    this.totalProducts.next(productCount);
  }

  searchSortFilter() {
    let productsList = this.products.getValue();
    const word = this.word.getValue();
    const min = this.min.getValue();
    const max = this.max.getValue();
    const order = this.order.getValue();
    productsList = productsList.filter(product => {
      return ((product.price - (product.price * (product.discount / 100)) >= min) &&
      (product.price - (product.price * (product.discount / 100)) <= max));
    });
    if (word !== '') {
      productsList = productsList.filter(product => {
        return (product.name.indexOf(word) !== -1);
      });
    }
    switch (order) {
      case 'highLow':  productsList.sort(this.sortHighLow);
                       break;
      case 'lowHigh':  productsList.sort(this.sortLowHigh);
                       break;
      case 'discount': productsList = productsList.filter(product => {
                       return (product.discount !== 0);
                       });
                       productsList.sort(this.sortDiscount);
                       break;
    }
    this.displayedProducts.next(productsList);
  }

  sortHighLow(product2, product1) {
    const price1 = product1.price - (product1.price * (product1.discount / 100));
    const price2 = product2.price - (product2.price * (product2.discount / 100));
    if (price1 < price2) {
      return -1;
    }
    if (price1 > price2) {
      return 1;
    }
    return 0;
  }

  sortLowHigh(product2, product1) {
    const price1 = product1.price - (product1.price * (product1.discount / 100));
    const price2 = product2.price - (product2.price * (product2.discount / 100));
    if (price1 < price2) {
      return 1;
    }
    if (price1 > price2) {
      return -1;
    }
    return 0;
  }

  sortDiscount(product2, product1) {
    if (product1.discount < product2.discount) {
      return -1;
    }
    if (product1.discount > product2.discount) {
      return 1;
    }
    return 0;
  }
}
