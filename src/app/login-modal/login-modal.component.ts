import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {
  private email: string;
  private password: string;
  @Output() submit: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(event){
    this.submit.emit(event.target.form.elements);
    return false;
  }

}
