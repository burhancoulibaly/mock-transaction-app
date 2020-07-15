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
  public transactionViewData: TransactionView;

  constructor(private modalService: ModalService, private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.transactionService.getTransactions()
    .subscribe(
      ({data}: any) =>  { 
        console.log(data);
      },
      (err) => {
        console.log(err);
      }
    )
  }

  openModal(id: string, event: any){
    let transactionViewRef = event.target.closest("section");
    
    this.transactionViewData = {
      username: transactionViewRef.children[0].children[0].innerText,
      amount: transactionViewRef.children[0].children[1].innerText,
      message: transactionViewRef.children[1].innerText
    };

    console.log(this.transactionViewData);
    this.modalService.open(id);
    return false;
  }
}
