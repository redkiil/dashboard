import { AfterViewInit, Component, ElementRef, OnInit, ViewContainerRef } from '@angular/core'
import { environment  } from '../../../environments/environment'
import * as mapboxgl from 'mapbox-gl'
import { PopupinfoComponent } from '../popupinfo/popupinfo.component'

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
  constructor(private _viewelementRef: ViewContainerRef,private _elementRef: ElementRef) { 
   
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
    
    

    let brb = this._viewelementRef.createComponent(PopupinfoComponent)
    brb.instance.data = 'opa opa3'
    //console.log(brb.location.nativeElement);
    //let tt = this._elementRef.nativeElement.querySelector('#asdo')
    //console.log(tt);
    const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(brb.location.nativeElement).setMaxWidth("fit-content")

 
   
    let ele = document.createElement("div");
    ele.setAttribute('id','div_test3')
    ele.innerHTML = 'OPA3'
    let marker: mapboxgl.Marker = new mapboxgl.Marker(ele).setLngLat([this.lng, this.lat]).setPopup(popup).addTo(this.map)
    this.map.addControl(new mapboxgl.NavigationControl());
    marker.on('click', function(e){
      console.log(e);
    })

  }
  ngAfterViewInit() {
  }
}
