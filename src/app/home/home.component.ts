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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    
  }

  async openToggle(id: string) {
    try {
      console.log(await this.test());
    } catch (error) {
      console.log(error);
    }

    this.open.emit(id);
    return false;
  }

  closeToggle(id: string) {
    this.close.emit(id);
    return false;
  }

  async test(){
    try {
      return await this.authService.test();
    } catch (error) {
      return error;
    }
  }
}
