import { Component, OnInit} from '@angular/core';
import { AuthService } from '../auth.service';
import { ModalService } from '../modal.service';
import { Router } from '@angular/router';
import { TransactionInfo } from '../transaction-info';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService, private modalService: ModalService, private router: Router, private transactionService: TransactionService) {}

  ngOnInit(): void {
    
  }

  async openModal(id: string){
    if(!this.authService.getAuthStatus()){
      this.router.navigateByUrl('/login');
      return false;
    }

    this.modalService.open(id);
    return false;
  }

  submitTransaction(form){
    let transactionInfo: TransactionInfo = {
      billing: {
        f_name: form[0].value,
        l_name: form[1].value,
        address: form[5].value,
        addressLine2: form[6].value,
        city: form[7].value,
        state: form[8].value,
        zip: form[9].value,
        country: form[10].value,
      },
      username: this.authService.getAuthStatus().username,
      cardNum: form[2].value,
      expDate: form[3].value,
      ccv: form[4].value,
      message: form[11].value,
    };

    this.transactionService.submitTransaction(transactionInfo);

    this.modalService.close('transaction-modal');
  }
}
