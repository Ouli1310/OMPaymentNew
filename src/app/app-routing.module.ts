import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AddTransactionComponent } from './components/transactions/add-transaction/add-transaction.component';
import { ListeTransactionComponent } from './components/transactions/liste-transaction/liste-transaction.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChartComponent } from './components/chart/chart.component';
import { ProfilComponent } from './components/profil/profil.component';
import { ChartSyntheseComponent } from './components/chart-synthese/chart-synthese.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { CashInComponent } from './components/cash-in/cash-in.component';
import { ListeCashInsComponent } from './components/liste-cash-ins/liste-cash-ins.component';


const routes: Routes = [
  { path: 'ompayment/register', component: RegistrationComponent },
  { path: 'ompayment/login', component: LoginComponent },
  { path: 'ompayment/home', component: LayoutComponent},
  { path: 'ompayment/menu', component: MenuComponent},
  { path: 'ompayment/profil', component: ProfilComponent},
  { path: 'ompayment/transactions', component: ListeTransactionComponent},
  { path: 'ompayment/transactions/add-transaction', component: AddTransactionComponent},
  { path: 'ompayment/resetPassword', component: ResetPasswordComponent },
  { path: 'ompayment/changePassword', component: ChangePasswordComponent },
  { path: 'ompayment/sidebard', component: SidebarComponent},
  { path: 'ompayment/chart', component: ChartComponent },
  { path: '', component: LayoutComponent},
  { path: 'ompayment/chart-synthese', component: ChartSyntheseComponent},
  { path: 'ompayment/user-management', component: UserManagementComponent},
  { path: 'ompayment/user/update-user/:id', component: UpdateUserComponent},
  { path: 'ompayment/cashIn', component: ListeCashInsComponent},
  { path: 'ompayment/cashIn/add-cashIn', component: CashInComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
