// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { HelloWorld } from './pages/hello-world/hello-world';
import { Login } from './pages/login/login.component';
import { OrderList } from './pages/order-list/order-list.component';
import { OrderDetail } from './pages/order-detail/order-detail.component';

export const routes: Routes = [
  {
    path: 'hello-world',
    component: HelloWorld,
  },
  {
    path: 'order-list',
    component: OrderList,
  },
  {
    path: 'order-detail/:id',
    component: OrderDetail,
  },
  {
    path: 'login',
    component: Login,
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];