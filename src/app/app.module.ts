import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModel } from '@angular/forms';
import { ProfilComponent } from './components/profil/profil.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon'; 
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button'; 
import {MatCardModule} from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatToolbarModule} from '@angular/material/toolbar';
import { ToolbarComponent } from './shared/toolbar/toolbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { MatDividerModule } from '@angular/material/divider';
import { MenuComponent } from './components/menu/menu.component';
import { AddTransactionComponent } from './components/transactions/add-transaction/add-transaction.component';
import { ListeTransactionComponent } from './components/transactions/liste-transaction/liste-transaction.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AuthInterceptor } from './_helpers/auth.interceptor';
import { FilterTransaction } from './components/transactions/liste-transaction/filter-transaction';
import { LayoutComponent } from './components/layout/layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatListModule} from '@angular/material/list';
import { ChartComponent } from './components/chart/chart.component';
import { ChartistModule } from 'ng-chartist';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ChartsModule } from 'ng2-charts';
import {MatDatepickerModule} from '@angular/material/datepicker';
import * as CanvasJSAngularChart from '../assets/canvasjs.angular.component';
import { ChartSyntheseComponent } from './components/chart-synthese/chart-synthese.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { 
	IgxDropDownModule,
	IgxButtonModule,
	IgxToggleModule
 } from "igniteui-angular";
 import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
 import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { MomentDateModule } from '@angular/material-moment-adapter';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {DatePipe} from '@angular/common';
import { CashInComponent } from './components/cash-in/cash-in.component';
import { ListeCashInsComponent } from './components/liste-cash-ins/liste-cash-ins.component';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogAnimationsExampleDialogComponent } from './components/dialog-animations-example-dialog/dialog-animations-example-dialog.component';
import { DataService } from './service/data.service';
import { CurrencyPipe } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { WebSocketService } from './service/web-socket.service';



registerLocaleData(localeFr);

var CanvasJSChart = CanvasJSAngularChart.CanvasJSChart;


@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    ProfilComponent,
    ToolbarComponent,
    FooterComponent,
    HomeComponent,
    MenuComponent,
    AddTransactionComponent,
    ListeTransactionComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    HomeComponent,
    FilterTransaction,
    LayoutComponent,
    SidebarComponent,
    ChartComponent,
    CanvasJSChart,
    ChartSyntheseComponent,
    UserManagementComponent,
    UpdateUserComponent,
    CashInComponent,
    ListeCashInsComponent,
    DialogAnimationsExampleDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MomentDateModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatDividerModule,
    ButtonModule,
    CardModule,
    MatGridListModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatNativeDateModule,
    MatRippleModule,
    MatListModule,
    ChartistModule,
    MatAutocompleteModule,
    ChartsModule,
    MatDatepickerModule,
    IgxDropDownModule,
	IgxButtonModule,
	IgxToggleModule,
  NgbModule,
  MatSlideToggleModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  NgxQRCodeModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, DatePipe, DataService,  { provide: LOCALE_ID, useValue: 'fr-FR' }, WebSocketService],
  bootstrap: [AppComponent]
})

export class AppModule { }
