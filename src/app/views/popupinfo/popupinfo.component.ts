import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-popupinfo',
  templateUrl: './popupinfo.component.html',
  styleUrls: ['./popupinfo.component.css']
})
export class PopupinfoComponent implements OnInit {
  @Input() data!: string;
  constructor() { }

  ngOnInit(): void {
  }

}
