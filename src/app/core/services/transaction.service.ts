import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }

  listarTransaction() {
    return this.http.get(`${environment.apiUrl}/transactions`);
  }

  listarInactive() {
    return this.http.get(`${environment.apiUrl}/transactions/inactive`);
  }

  eliminarTransaction(transactionId: number) {
    return this.http.delete(`${environment.apiUrl}/transactions/${transactionId}`);
  }

  activarTransaction(transactionId: number) {
    return this.http.put(`${environment.apiUrl}/transactions/${transactionId}/reactivate`, {});
  }

  crearTransaction(datosTransaction: any) {
    return this.http.post(`${environment.apiUrl}/transactions`, datosTransaction);
  }

  actualizarTransaction(id: number, datosTransaction: any) {
    return this.http.put(`${environment.apiUrl}/transactions/${id}`, datosTransaction);

  }

 
}
