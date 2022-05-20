import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EquipmentDto } from '../equipment-dto';

@Injectable({
  providedIn: 'root'
})
export class EquipmentApiService {

  constructor(private http: HttpClient) { }
  getEquipment(fleet: number): Observable<EquipmentDto> {
    return this.http.get<EquipmentDto>(`http://localhost:5000/api/equipments/${fleet}`);
  }
}
