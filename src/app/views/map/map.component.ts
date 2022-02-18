import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { environment  } from '../../../environments/environment'
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 37.75;
  lng = -122.41;
  constructor(private _elementRef : ElementRef) { 
   
  }

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapboxAccessToken,
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng,this.lat]
    });
    // create the popup
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML('<div id="vsf">vsf</div>');
   

    let ele = document.createElement("div");
    ele.setAttribute('id','vtnc')
    ele.innerHTML = 'aoskd'
    let marker: mapboxgl.Marker = new mapboxgl.Marker(ele).setLngLat([this.lng, this.lat]).setPopup(popup).addTo(this.map);
    this.map.addControl(new mapboxgl.NavigationControl());
    ele.addEventListener('click', e =>{
      let brb = this._elementRef;
      console.log(brb);
    })
  }
  ngAfterViewInit() {
    
  }
}
