import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CashIn, Transaction } from '../model/transactionRequest';

@Injectable({
  providedIn: 'root'
})
export class CashInService {

  constructor(
    private http: HttpClient
  ) { }


  initCashIn(id: any, data: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl+'/cashIn/initCashIn/'+id, data);
  }

  initBulkCashIn(id: any, data: any): Observable<any> {
   
    return this.http.post<any>(environment.apiUrl+'/cashIn/initBulkCashIn/'+id, data);
  }

  getAllCashIns(): Observable<CashIn[]> {
    return this.http.get<CashIn[]>(environment.apiUrl+'/cashIn');
}

getCashInsByMethode(methode: string): Observable<any> {
  return this.http.get(environment.apiUrl+'/cashIn/methode/'+methode);
}

getCashInsByPNR(pnr: string): Observable<any> {
  return this.http.get(environment.apiUrl+'/cashIn/pnr/'+pnr);
}

}
