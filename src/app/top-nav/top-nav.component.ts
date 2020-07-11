import { Component, OnInit } from '@angular/core';
import { ModalService } from '../modal.service';
import { AuthService } from '../auth.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {
  public isAuthed: boolean;
  public href: string = "";

  constructor( private authService: AuthService, private modalService: ModalService, private router: Router){
    router.events.subscribe((val: any) => {
      if(val instanceof NavigationEnd){
        this.href = val.urlAfterRedirects;
      } 
    });

    this.authService.authChange
      .subscribe((val) => {
        this.isAuthed = val;
        console.log(this.isAuthed);
      })
  };

  ngOnInit(): void {
  }

  logout(){
    this.authService.logOut()
      .then((response) => {
        console.log(response);
        return false;
      })
      .catch((error) => {
        console.log(error);
        return false;
      })
  }

  login(form){
    let email = form[0].value;
    let password = form[1].value;

    this.authService.login(email, password)
      .then((response) => {
        console.log(response);
        this.closeModal(`login-modal`);
        return false;
      })
      .catch((error) => {
        console.log(error);
        return false;
      })
  }

  signup(form){
    //signup function
    console.log(form);
    let firstName = form[0].value;
    let lastName = form[1].value;
    let username = form[2].value;
    let email = form[3].value;
    let password = form[4].value;//add logic to make sure passwords are the same;

    this.authService.signUp(username, firstName, lastName, email, password)
      .then((response) => {
        console.log(response);
        this.closeModal(`sign-up-modal`);
        return false;
      })
      .catch((error) => {
        console.log(error);
        return false;
      })
  }

  openModal(id: string){
    this.modalService.open(id);
  }
  closeModal(id: string){
    this.modalService.close(id);
  }
}

//username: String, f_name: String, l_name: String, email: String, password: String
