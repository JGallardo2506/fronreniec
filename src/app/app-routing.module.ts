import { LayoutComponent } from './layout/layout.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './domain/dashboard/dashboard.component';
import { VaccineComponent } from './domain/vaccine/vaccine.component';
import { TransactionComponent } from './domain/transaction/transaction.component';
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'vaccine',
        component: VaccineComponent
      },
      {
        path: 'transaction',
        component: TransactionComponent
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
