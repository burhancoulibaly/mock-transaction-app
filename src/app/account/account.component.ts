import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserInfo } from '../user-info';
import { TransactionView } from '../transaction-view';
import { TransactionService } from '../transaction.service';
import { ModalService } from '../modal.service';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  public isAuthed: boolean = false;
  public userInfo: UserInfo;
  public transactionViewIndex: number = 0;
  public transactions: Array<TransactionView> = [];
  public transactionViewData: TransactionView;

  constructor(private authService: AuthService, private transactionService: TransactionService, private modalService: ModalService) { 
    this.authService.authChange
      .subscribe((val) => {
        this.isAuthed = val;
        
        if(this.isAuthed){
          this.getUserInfo(this.authService.getAuthStatus().username);
        }
      })
  }

  ngOnInit(): void {
  
  }

  getUserTransactions(username){
    this.transactionService.getUserTransactions(username)
    .valueChanges
    .subscribe(
      ({data}: any) =>  { 
        this.transactions = data.getUserTransactions;
        console.log(this.transactions)
      },
      (err) => {
        return err;
      }
    )
  }

  getUserInfo(username){
    this.authService.userInfo(username)
    .valueChanges
    .subscribe(
      ({data}: any) =>  { 
        this.userInfo = data.userInfo;
        this.getUserTransactions(this.userInfo.username);
      },
      (err) => {
        return err;
      }
    )
  }

  cancelTransaction(transaction: TransactionView){
    for(let i = 0; i < this.transactions.length; i++){
      if(this.transactions[i].transactionId == transaction.transactionId){
        this.transactions[i].is_canceled = "1";
      }
    }
  }

  getPaginations(num){
    let paginations: Array<number> = [];

    for(let i = 0; i < Math.ceil(num); i++){
      paginations.push(i+1);
    }
    
    return paginations;
  }

  prev(){
    this.transactionViewIndex -= 4;
    return false;
  }

  switch(event){
    let pageNum = event.target.innerText;

    this.transactionViewIndex = (4 * pageNum) - 4;
    return false;
  }

  next(){
    this.transactionViewIndex += 4;
    return false;
  }

  openModal(id: string, ind: number){
    this.transactionViewData = {
      transactionId: this.transactions[ind].transactionId,
      f_name: this.transactions[ind].f_name,
      l_name: this.transactions[ind].l_name,
      lastFourCardNum: this.transactions[ind].lastFourCardNum,
      amount: this.transactions[ind].amount,
      message: this.transactions[ind].message,
      transactionDate: this.transactions[ind].transactionDate,
      username: this.transactions[ind].username,
      is_canceled: this.transactions[ind].is_canceled
    };

    this.modalService.open(id);
    return false;
  }
}
