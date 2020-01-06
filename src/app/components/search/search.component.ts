import { Component, OnInit } from '@angular/core';
import { ProductListService } from '../../services/product-list.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public query;
  constructor(private productListService: ProductListService) { }

  ngOnInit() {
  }

  searchProductByWord() {
    this.productListService.word.next(this.query);
    this.productListService.searchSortFilter();
  }

}
