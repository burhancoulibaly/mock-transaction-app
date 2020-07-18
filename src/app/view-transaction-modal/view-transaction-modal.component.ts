import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TransactionView } from '../transaction-view';
import { AuthService } from '../auth.service';
import { TransactionService } from '../transaction.service';
import { ModalService } from '../modal.service';

@Component({
  selector: 'view-transaction-modal',
  templateUrl: './view-transaction-modal.component.html',
  styleUrls: ['./view-transaction-modal.component.css']
})
export class ViewTransactionModalComponent implements OnInit {
  @Input() transactionView: TransactionView;

  constructor(private authService: AuthService, private transactionService: TransactionService, private modalService: ModalService) { }

  ngOnInit(): void {
  }

  getUsername(){
    return this.authService.getAuthStatus().username;
  }

  //Checks transaction can be canceled (if it has been 14 days since the original transaction)
  canCancel(){
    let today = new Date();
    let transactionDate = new Date(this.transactionView.transactionDate);
    
    // console.log(today, transactionDate); 
    // console.log(today.getTime(), transactionDate.getTime());

    //days hours minutes secs ms
    if(today.getTime() - transactionDate.getTime() >= 14 * 24 * 60 * 60 * 1000){
      return false;
    }

    return true;
  }

  cancelTransaction(transaction: TransactionView){
    this.modalService.close("transaction-view-modal")
    this.transactionService.cancelTransaction(transaction.transactionId);
  }
  
}
