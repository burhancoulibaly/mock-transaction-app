import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import {timer} from 'rxjs';
import {take} from 'rxjs/operators';  

@Component({
  selector: 'app-transaction-button',
  templateUrl: './transaction-button.component.html',
  styleUrls: ['./transaction-button.component.css']
})
export class TransactionButtonComponent implements OnInit {
  backgroundRGB:Array<number>;
  borderRGB:Array<number>;

  constructor() { }

  ngOnInit(): void {

  }

  repeat = timer(1000, 1000);

  subscribe = this.repeat.subscribe(() => {
    this.backgroundRGB = [this.getRandomInt(256),this.getRandomInt(256),this.getRandomInt(256)];
    this.borderRGB = [this.getRandomInt(256),this.getRandomInt(256),this.getRandomInt(256)];

    $("button.trans-button").css({"transition":`all 1000ms linear`});
    $("button.trans-button").css({"background-color":`rgb(${this.backgroundRGB[0]},${this.backgroundRGB[1]},${this.backgroundRGB[2]})`});
    $("button.trans-button").css({"border-color":`rgb(${this.borderRGB[0]},${this.borderRGB[1]},${this.borderRGB[2]})`});
  });

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
}
