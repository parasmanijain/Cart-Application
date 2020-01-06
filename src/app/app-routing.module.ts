import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckOutGuard } from './guards/checkout.guard';
import { CommonComponent } from './components/common/common.component';
import { CartIconComponent } from './components/cart-icon/cart-icon.component';


const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/common',
    pathMatch: 'full'
  },
  {
    path: 'common',
    component: CommonComponent
  },
  {
    path: 'cart-icon',
    component: CartIconComponent,
    canLoad: [CheckOutGuard]
  },
  {
    path: '**',
    redirectTo: '/common',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
