import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormValidationService } from '../form-validation.service';

@Component({
  selector: 'login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {
  public isDisabled = false;
  @Output() submit: EventEmitter<any> = new EventEmitter();

  constructor(private formValidationService: FormValidationService) { }

  ngOnInit(): void {
  }

  onInput(target){
    switch(target.id){
      case "loginEmail": {
        let elementRef = target;
        let isValid = this.formValidationService.emailValidation(target.value);

        elementRef.classList.remove("invalid");
        this.isDisabled = false;
        
        if(!isValid){
          elementRef.classList.add("invalid");
          this.isDisabled = true;
        }

        break;
      }
    }
  }

  onSubmit(event){
    this.submit.emit(event.target.form.elements);
    (<HTMLFormElement>document.getElementById("loginForm")).reset();
    return false;
  }

}
