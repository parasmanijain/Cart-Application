import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ProductListService } from '../../services/product-list.service';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss']
})
export class SortComponent implements OnInit {

  @Input() modal;
  @Output() modalClosed: EventEmitter<any> = new EventEmitter();
  public order;
  public selectedOrder;
  public isMobile = false;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = window.innerWidth < 768 ? true : false;
  }
  constructor(private productListService: ProductListService) { }

  ngOnInit() {
    this.isMobile = window.innerWidth < 768 ? true : false;
    this.order = this.productListService.order.getValue() ? this.productListService.order.getValue() : 'highLow';
    this.selectedOrder = this.order;
  }

  sortProducts(order) {
    this.selectedOrder = order;
    this.implementSort(this.selectedOrder);
  }

  implementSort(order) {
    this.productListService.order.next(order);
    this.productListService.searchSortFilter();
  }

  applySort() {
    this.implementSort(this.selectedOrder);
    this.hide();
  }

  hide() {
    this.modal.hide();
    this.modalClosed.emit();
  }

  changeOption(order) {
    this.selectedOrder = order;
  }

}
