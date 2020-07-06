import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sign-up-modal',
  templateUrl: './sign-up-modal.component.html',
  styleUrls: ['./sign-up-modal.component.css']
})
export class SignUpModalComponent implements OnInit {
  @Output() submit: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(event){
    this.submit.emit(event.target.form.elements);
  }
}
