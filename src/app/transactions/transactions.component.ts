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
  public transactionViewIndex: number = 0;
  public transactions: Array<TransactionView>;
  public transactionViewData: TransactionView;

  constructor(private modalService: ModalService, private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.transactionService.getTransactions()
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
    };


    this.modalService.open(id);
    return false;
  }
}
