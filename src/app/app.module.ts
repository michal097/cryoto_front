import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {BrowserModule} from '@angular/platform-browser';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {UserdataComponent} from './userdata/userdata.component';
import {FooterComponent} from './footer/footer.component';
import {BasicAuthHtppInterceptorService} from './service/basic-auth-interceptor.service';
import {InjectableRxStompConfig, RxStompService, rxStompServiceFactory} from '@stomp/ng2-stompjs';
import {myRxStompConfig} from '../rx-stomp.config';
import { TradingDecisionsComponent } from './trading-decisions/trading-decisions.component';
import { MailVerificationComponent } from './mail-verification/mail-verification.component';
import { ChartComponent } from './chart/chart.component';
import {TvComponent} from './chart/tv/tv.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatStepperModule} from '@angular/material/stepper';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SummaryComponent } from './summary/summary.component';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';


@NgModule({
    // declarations: [LoginComponent, DashboardComponent, UserdataComponent, FooterComponent,
    //   TradingDecisionsComponent, MailVerificationComponent, ChartComponent, TvComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatExpansionModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatListModule,
    MatSortModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: BasicAuthHtppInterceptorService,
    multi: true
  }, {
    provide: InjectableRxStompConfig,
    useValue: myRxStompConfig
  },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig]
    }],
  declarations: [
    SummaryComponent
  ]
})
export class AppModule {
}
