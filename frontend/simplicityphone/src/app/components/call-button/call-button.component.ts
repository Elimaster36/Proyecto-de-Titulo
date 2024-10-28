import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-call-button',
  templateUrl: './call-button.component.html',
  styleUrls: ['./call-button.component.scss'],
})
export class CallButtonComponent implements OnInit {
  @Input() label!: string;
  constructor() {}

  ngOnInit() {}

  openDialer() {
    window.open('tel:', '_system');
  }
}
