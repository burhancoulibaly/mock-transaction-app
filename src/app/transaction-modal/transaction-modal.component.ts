import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'transaction-modal',
  templateUrl: './transaction-modal.component.html',
  styleUrls: ['./transaction-modal.component.css']
})
export class TransactionModalComponent implements OnInit {
  public currentTab = 0;
  @Output() submit: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.showTab(this.currentTab);
  }

  showTab(num) {
    // This function will display the specified tab of the form ...
    let tabs = document.getElementsByClassName("tab") as HTMLCollectionOf<HTMLElement>;
    tabs[num].style.display = "block";
    // ... and fix the Next buttons:
    if (num == (tabs.length - 1)) {
      document.getElementById("nextBtn").innerHTML = "Submit";
    } else {
      document.getElementById("nextBtn").innerHTML = "Next";
    }
    // ... and run a function that displays the correct step indicator:
    this.fixStepIndicator(num);
  }

  nextPrev(num, event) {
    // This function will figure out which tab to display
    var tabs = document.getElementsByClassName("tab") as HTMLCollectionOf<HTMLElement>;
    // Exit the function if any field in the current tab is invalid:
    if (num == 1 && !this.validateForm()) return false;
    // Hide the current tab:
    tabs[this.currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    this.currentTab = this.currentTab + num;
    // if you have reached the end of the form... :
    if (this.currentTab >= tabs.length) {
      //...the form gets submitted:
      this.onSubmit(event);
      this.currentTab = 0;
      (<HTMLFormElement>document.getElementById("transactionForm")).reset();
    }
    console.log("submit button wasn't clicked")
    // Otherwise, display the correct tab:
    this.showTab(this.currentTab);
  }

  validateForm() {
    // This function deals with validation of the form fields
    let tabs, inputs, i, valid = true;
    tabs = document.getElementsByClassName("tab");
    inputs = tabs[this.currentTab].getElementsByTagName("input");
    // A loop that checks every input field in the current tab:
    for (i = 0; i < inputs.length; i++) {
      // If a field is empty...
      if (inputs[i].value == "") {
        // add an "invalid" class to the field:
        inputs[i].className += " invalid";
        // and set the current valid status to false:
        valid = false;
      }
    }
    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
      document.getElementsByClassName("step")[this.currentTab].className += " finish";
    }
    return valid; // return the valid status
  }

  fixStepIndicator(num) {
    // This function removes the "active" class of all steps...
    var i, steps = document.getElementsByClassName("step");
    for (i = 0; i < steps.length; i++) {
      steps[i].className = steps[i].className.replace(" active", "");
    }
    //... and adds the "active" class to the current step:
    steps[num].className += " active";
  }

  onSubmit(event){
    this.submit.emit(event.target.form.elements);
    return false;
  }
}







