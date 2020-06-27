import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { ModalService } from '../modal.service';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() id: string;
  private element: any;

  constructor(private modalService: ModalService, private el: ElementRef) { 
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    // making sure id attribute exist
    if(!this.id){
      console.error(`modal doesn't have an id`);
      return;
    }

    //add element to bottom of page to be displayed over everything
    document.body.appendChild(this.element);

    this.element.addEventListener('click', (el) => {
      if(el.target.className === 'mtc-modal-background' || el.target.className === 'close') {
        this.close();
      }
    })

    this.modalService.add(this);
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }

  //open modal
  open(): void {
    document.body.classList.add('mtc-modal-open');
  }

  //close modal
  close(): void {
    document.body.classList.remove('mtc-modal-open');
  }
}
