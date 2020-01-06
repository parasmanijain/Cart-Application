import { Component, OnInit, ViewChild, Renderer2, HostListener  } from '@angular/core';

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.scss']
})
export class CommonComponent implements OnInit {

 
  public openModal = null;
  public isMobile = false;
  @ViewChild('sortProductsModal', {static: false}) sortProductsModal;
  @ViewChild('filterProductsModal', {static: false}) filterProductsModal;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = window.innerWidth < 768 ? true : false;
  }
  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.isMobile = window.innerWidth < 768 ? true : false;
  }

  openSortProductsWizard() {
    this.openModal = 'sortProducts';
    this.sortProductsModal.show();
    this.renderer.addClass(document.body, 'modal-open');
  }

  openFilterProductsWizard() {
    this.openModal = 'filterProducts';
    this.filterProductsModal.show();
    this.renderer.addClass(document.body, 'modal-open');
  }

  modalClosed() {
    this.openModal = null;
    this.renderer.removeClass(document.body, 'modal-open');
  }

}
