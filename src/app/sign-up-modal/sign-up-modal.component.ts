import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormValidationService } from '../form-validation.service';

@Component({
  selector: 'sign-up-modal',
  templateUrl: './sign-up-modal.component.html',
  styleUrls: ['./sign-up-modal.component.css']
})
export class SignUpModalComponent implements OnInit {
  public isDisabled = false;
  @Output() submit: EventEmitter<any> = new EventEmitter();

  constructor(private formValidationService: FormValidationService) { }

  ngOnInit(): void {
  }

  onInput(target){
    switch(target.id){
      case "firstName": {
        let elementRef = target;
        let isValid = this.formValidationService.charValidation(target.value);

        elementRef.classList.remove("invalid");
        this.isDisabled = false;
        
        if(!isValid){
          elementRef.classList.add("invalid");
          this.isDisabled = true;
        }

        break;
      }
      case "lastName": {
        let elementRef = target;
        let isValid = this.formValidationService.charValidation(target.value);

        elementRef.classList.remove("invalid");
        this.isDisabled = false;
        
        if(!isValid){
          elementRef.classList.add("invalid");
          this.isDisabled = true;
        }

        break;
      }
      case "username": {
        let elementRef = target;
        let isValid = this.formValidationService.stringValidation(target.value);

        elementRef.classList.remove("invalid");
        this.isDisabled = false;
        
        if(!isValid){
          elementRef.classList.add("invalid");
          this.isDisabled = true;
        }

        break;
      }
      case "signupEmail": {
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
      case "confirmPassword": {
        let elementRef = target;
        let isValid = this.formValidationService.comparePasswords((<HTMLInputElement>document.getElementById("signupPassword")).value,target.value);

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
    (<HTMLFormElement>document.getElementById("signupForm")).reset();
    return false;
  }
}
