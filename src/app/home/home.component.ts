import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Output() open: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
      this.login();
  }

  async login(){
    console.log(await this.authService.login());
  }

  async openToggle(id: string) {
    console.log(await this.authService.refreshAccessToken());
    this.authService.test()
      .valueChanges
        .subscribe((result: any) => {
          console.log(result.data);
        });
    this.open.emit(id);
    return false;
  }
  closeToggle(id: string) {
    this.close.emit(id);
    return false;
  }
}
