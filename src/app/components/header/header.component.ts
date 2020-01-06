import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { ProductListService} from '../../services/product-list.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public addedProductsCount;
  public cartIconLink = false;
  constructor(private productListService: ProductListService, private router: Router) { }

  ngOnInit() {
    this.productListService.totalProducts.subscribe(data => {
        this.addedProductsCount = data;
    });
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (event.url === '/cart-icon') {
          this.cartIconLink = true;
        } else {
          this.cartIconLink = false;
        }
      }
    });
  }
}
