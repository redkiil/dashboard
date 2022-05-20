import { AfterViewInit, Component, ElementRef, OnInit, ViewContainerRef } from '@angular/core'
import { environment  } from '../../../environments/environment'
import * as mapboxgl from 'mapbox-gl'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { PopupinfoComponent } from '../popupinfo/popupinfo.component'
import { MathUtils, Mesh, MeshStandardMaterial, Vector2, Vector3 } from 'three'
import * as turf from '@turf/turf'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
 
  map: mapboxgl.Map | undefined
  style = 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y';
  lat = -18.605886290572965;//-18.605886290572965, -52.98480142078401
  lng = -52.98480142078401;
  constructor(private _viewelementRef: ViewContainerRef,private _elementRef: ElementRef) { 
   
  }

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapboxAccessToken,
      container: 'map',
      style: this.style,
      zoom: 18,
      center: [this.lng,this.lat]
    });
    //create cords
    const cordstest = [
      [-18.60576815423769, -52.97163403421252]
    ]
    // create the popup
    let brb = this._viewelementRef.createComponent(PopupinfoComponent)
    brb.instance.data = {speed: 10, rpm: 1200, op: 'Colaborador José' }
    const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(brb.location.nativeElement).setMaxWidth("fit-content")

 
   
    let ele = document.createElement("div");
    ele.setAttribute('id','div_test3')
    ele.innerHTML = '0000'
    var marker: mapboxgl.Marker = new mapboxgl.Marker(ele).setLngLat([this.lng, this.lat]).setPopup(popup).addTo(this.map)
    this.map.addControl(new mapboxgl.NavigationControl());
    marker.on('click', function(e){
      console.log(e);
    })

    //map 3d
    var modelOrigin: mapboxgl.LngLatLike =  [this.lng, this.lat]
    var modelAltitude: number = 0;
    var modelRotation = [Math.PI / 2, 0, 0];
    //const mapboxgl = this.map;
    var modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude)
    var modelTransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z,
      rotateX: modelRotation[0],
      rotateY: modelRotation[1],
      rotateZ: modelRotation[2],
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
    }

    const customLayer: any = {
      id: '3d-model',
      type: 'custom',
      renderingMode: '3d',
      onAdd: function(map: any, gl: any){
        this.camera = new THREE.Camera()
        this.scene = new THREE.Scene()

        const directionalLight = new THREE.AmbientLight(0x404040);
        this.scene.add(directionalLight);
        

        const loader = new GLTFLoader();
        loader.load(
        'assets/TRACTOR.gltf',
        (gltf) => {
          const obj = gltf.scene.children[0] as Mesh;
          const tt = obj.material as MeshStandardMaterial
          tt.metalness = 0
         this.scene.add(gltf.scene);
        }
        );
        this.renderer = new THREE.WebGLRenderer({
          canvas: map.getCanvas(),
          context: gl,
        })
        this.renderer.autoClear = false;

      },render: function(gl: any, matrix: any){
        const rotationX = new THREE.Matrix4().makeRotationAxis(
          new THREE.Vector3(1, 0, 0),
          modelTransform.rotateX
          );
          const rotationY = new THREE.Matrix4().makeRotationAxis(
          new THREE.Vector3(0, 1, 0),
          modelTransform.rotateY
          );
          const rotationZ = new THREE.Matrix4().makeRotationAxis(
          new THREE.Vector3(0, 0, 1),
          modelTransform.rotateZ
          );
           
          const m = new THREE.Matrix4().fromArray(matrix);
          const l = new THREE.Matrix4()
          .makeTranslation(
          modelTransform.translateX,
          modelTransform.translateY,
          modelTransform.translateZ!
          )
          .scale(
          new THREE.Vector3(
          modelTransform.scale,
          -modelTransform.scale,
          modelTransform.scale
          )
          )
          .multiply(rotationX)
          .multiply(rotationY)
          .multiply(rotationZ);
           
          this.camera.projectionMatrix = m.multiply(l);
          this.renderer.resetState();
          this.renderer.render(this.scene, this.camera);
          //this.map.triggerrepaint();
      }
    }
    const cam = this.map.getFreeCameraOptions()
    this.map.on('style.load', ()=>{
      this.map?.addLayer(customLayer, 'waterway-label')
      var tt :number = 0;

      const inter = setInterval(()=>{
        if(tt>1) clearInterval(inter)
        let pos1 = new THREE.Vector2(this.lng, this.lat)
        var c_vector1 = pos1.clone()
        let pos2 = new THREE.Vector2(cordstest[0][1], cordstest[0][0])
        pos1.lerp(pos2, tt)
        modelOrigin = [pos1.x, pos1.y]
        let bear = turf.bearing(modelOrigin, [this.lng, this.lat])
        marker.setLngLat(modelOrigin)
        //camera
       
        var c_vector2 = pos2.clone()
        var r_vector = c_vector2.sub(c_vector1)
        var rotate = r_vector.multiply(new Vector2(-1, -1))
        rotate.multiplyScalar(0.1)
        const camera_pos = pos1.add(rotate)
        modelAltitude = 0;
        cam.position = mapboxgl.MercatorCoordinate.fromLngLat(
          [camera_pos.x, camera_pos.y],
          10,
        );
        cam.lookAtPoint(modelOrigin)
        this.map?.setFreeCameraOptions(cam)
        var test = turf.degrees2radians(bear)
        modelRotation = [Math.PI / 2, -test, 0];
         modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude)
         modelTransform = {
          translateX: modelAsMercatorCoordinate.x,
          translateY: modelAsMercatorCoordinate.y,
          translateZ: modelAsMercatorCoordinate.z,
          rotateX: modelRotation[0],
          rotateY: modelRotation[1],
          rotateZ: modelRotation[2],
          scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
        }
        //fake mock
        brb.instance.data = {speed: this.randomInteger(1,15), rpm: this.randomInteger(850, 2200), op: 'Colaborador José' }
        this.map?.triggerRepaint()
        tt = tt+0.001;
      },20)
    })
  }
  ngAfterViewInit() {
  }
  randomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
