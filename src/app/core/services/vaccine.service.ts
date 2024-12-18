import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VaccineService {

  constructor(private http: HttpClient) { }

  listarVaccine() {
    return this.http.get(`${environment.apiUrl}/vaccines`);
  }

  listarInactive() {
    return this.http.get(`${environment.apiUrl}/vaccines/inactive`);
  }

  eliminarVaccine(vaccineId: number) {
    return this.http.delete(`${environment.apiUrl}/vaccines/${vaccineId}`);
  }

  activarVaccine(vaccineId: number) {
    return this.http.put(`${environment.apiUrl}/vaccines/${vaccineId}/reactivate`, {});
  }

  crearVaccine(datosVaccine: any) {
    return this.http.post(`${environment.apiUrl}/vaccines`, datosVaccine);
  }

  actualizarVaccine(id: number, datosVaccine: any) {
    return this.http.put(`${environment.apiUrl}/vaccines/${id}`, datosVaccine);

  }

 
}
