import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  dataToSend: string = "";

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
  }
  sendData(): void{
    this.homeService.sendWsMessage(this.dataToSend);
  }
}
