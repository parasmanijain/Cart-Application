import { Injectable } from '@angular/core';
import { Router, CanLoad } from '@angular/router';
import { ProductListService } from '../services/product-list.service';

@Injectable({
  providedIn: 'root'
})
export class CheckOutGuard implements CanLoad {
  constructor(private router: Router, private productListService: ProductListService) { }

  canLoad(): boolean {
    if (this.productListService.retrieveAddedProducts().getValue().length > 0) {
      return true;
    } else {
      this.router.navigate(['/common']);
      return false;
    }
  }
}
