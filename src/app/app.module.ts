import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ViewTransactionModalComponent } from './view-transaction-modal/view-transaction-modal.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { ModalComponent } from './modal/modal.component';
import { TransactionButtonComponent } from './transaction-button/transaction-button.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { TransactionModalComponent } from './transaction-modal/transaction-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ViewTransactionModalComponent,
    TransactionsComponent,
    TopNavComponent,
    ModalComponent,
    TransactionButtonComponent,
    LoginComponent,
    SignUpComponent,
    TransactionModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
