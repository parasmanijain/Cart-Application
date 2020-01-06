declare var AppSettings: any;
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProductCounter } from '../models/product-counter';

@Injectable({
  providedIn: 'root'
})
export class ProductListService {

  public configUrl = AppSettings.API_URL;
  products = new BehaviorSubject(null);
  displayedProducts = new BehaviorSubject(null);
  counterList = [];
  public word = new BehaviorSubject('');
  public min = new BehaviorSubject(0);
  public max = new BehaviorSubject(10000);
  public order = new BehaviorSubject('highLow');
  private addedProducts: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  public addedProductGrouped = new BehaviorSubject(null);
  public totalProducts = new BehaviorSubject(0);
  constructor(private http: HttpClient) { }

  getProductsList() {
    return this.http.get(this.configUrl).subscribe((data: any) => {
      this.products.next(data);
      data.forEach(product => {
        const productCounter = new ProductCounter();
        productCounter.productDetails = product;
        productCounter.count = 0;
        this.counterList.push(productCounter);
      });
      this.displayedProducts.next(data);
      this.searchSortFilter();
    }, (error) => {
      console.log(error);
    });
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

  addProducts(dataObj) {
    const currentValue = this.addedProducts.value;
    const updatedValue = [...currentValue, dataObj];
    this.addedProducts.next(updatedValue);
  }

  retrieveAddedProducts() {
    return this.addedProducts;
  }

  groupAddedProducts() {
    const products = this.addedProducts.getValue();
    let productCount = 0;
    products.forEach(product => {
      this.counterList.forEach(productCounter => {
        if (productCounter.productDetails.id === product.id) {
          productCounter.count ++;
        }
      });
    });
    const productAdded = this.counterList.filter(product => {
      if (product.count > 0) {
        productCount += product.count;
      }
      return (product.count > 0);
    });
    this.addedProductGrouped.next(productAdded);
    this.totalProducts.next(productCount);
  }

   updateProductCount(updatedProduct) {
    const products = this.addedProductGrouped.getValue();
    let productCount = 0;
    products.forEach(product => {
      if (product.productDetails.id === updatedProduct.productDetails.id) {
          product.count = updatedProduct.count;
      }
      productCount += product.count;
    });
    this.addedProductGrouped.next(products);
    this.totalProducts.next(productCount);
  }

  removeProductFromCart(removedProduct) {
    let products = this.addedProductGrouped.getValue();
    let productCount = 0;
    products = products.filter(product => {
      if (product.productDetails.id !== removedProduct.productDetails.id) {
        productCount += product.count;
      }
      return (product.productDetails.id !== removedProduct.productDetails.id);
    });
    this.addedProductGrouped.next(products);
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
}
