import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ModalService } from '../modal.service';
import { TransactionView } from '../transaction-view';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  public thisInstance: any = this;
  public transactionViewIndex: number = 0;
  public transactions: Array<TransactionView> = [];
  public transactionViewData: TransactionView;

  constructor(private modalService: ModalService, private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.transactionService.getTransactions()
    .valueChanges
    .subscribe(
      ({data}: any) =>  { 
        this.transactions = data.getTransactions;
        console.log(this.transactions);
      },
      (err) => {
        return err;
      }
    )
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
