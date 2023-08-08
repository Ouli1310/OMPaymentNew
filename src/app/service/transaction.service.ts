import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'process';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Transaction } from '../model/transactionRequest';
import { AuthInterceptor } from '../_helpers/auth.interceptor';
import { TokenStorageService } from './token-storage.service';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
    
 })
};

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient, private tokenService: TokenStorageService) { }

  token = this.tokenService.getToken();

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(environment.apiUrl+'/transaction');
}

getTransactionByTransactionId(transactionId: String): Observable<any> {
  return this.http.get(environment.apiUrl+'/transaction/'+transactionId);
}

getTransactionsByStatus(status: string): Observable<any> {
  return this.http.get(environment.apiUrl+'/transaction/status/'+status);
}

getTransactionsByStatusAndCashIn(status: string, cashIn: boolean): Observable<any> {
  return this.http.get(environment.apiUrl+'/transaction/status/'+status+'/isCashIn/'+cashIn);
}

getTransactionsByMethodeAndStatus(methode: string, status: string): Observable<any> {
  return this.http.get(environment.apiUrl+'/transaction/methode/'+methode+'/status/'+status);
}

getTransactionsByPartnerId(partnerId: string): Observable<any> {
  return this.http.get(environment.apiUrl+'/transaction/partner/'+partnerId);
}

getTransactionsByPartnerIdAndStatus(partnerId: string, status: string): Observable<any> {
  return this.http.get(environment.apiUrl+'/transaction/partner/'+partnerId+"/"+status);
}

getTransactionsByEntite(entite: number): Observable<any> {
  return this.http.get(environment.apiUrl+'/transaction/entite/'+entite);
}

getTransactionsByEntiteAndStatus(entite: number, status: string): Observable<any> {
  return this.http.get(environment.apiUrl+'/transaction/entite/'+entite+'/'+status);
}

getTransactionsByAgent(email: string): Observable<any> {
  return this.http.get(environment.apiUrl+'/transaction/agent/'+email);
}

getTransactionsByAgentAndDay(email: any, day: any): Observable<any> {
  return this.http.get(environment.apiUrl+'/transaction/agent/'+email+'/day/'+day)
}

getTransactionsByAgentAndStatus(email: string, status: string): Observable<any> {
  return this.http.get(environment.apiUrl+'/transaction/agent/'+email+'/'+status);
}

getTransactionsByDay(day: any): Observable<any> {
  return this.http.get(environment.apiUrl+'/transaction/day/'+day)
}

getTransactionsByMethodeAndDay(methode: any, day: any): Observable<any> {
  return this.http.get(environment.apiUrl+'/transaction/methode/'+methode+'/day/'+day)
}

getTransactionsByEntiteAndDay(entite: any, day: any): Observable<any> {
  return this.http.get(environment.apiUrl+'/transaction/entite/'+entite+'/day/'+day)
}

getTransactionsByMethodeAndEntiteAndDay(methode: any, entite: any, day: any): Observable<any> {
  return this.http.get(environment.apiUrl+'/transaction/methode/'+methode+'/entite/'+entite+'/day/'+day)
}

getTransactionBetween2Dates(date1: any, date2: any): Observable<any> {
  return this.http.get(environment.apiUrl+'/transaction/dates/'+date1+'/'+date2);
}

getTransactionByMethodeAndBetween2Dates(methode: any, date1: any, date2: any): Observable<any> {
  return this.http.get(environment.apiUrl+'/transaction/methode/'+methode+'/dates/'+date1+'/'+date2);
}

getTransactionByEntiteAndBetween2Dates(entite: number, date1: any, date2: any): Observable<any> {
  return this.http.get(environment.apiUrl+'/transaction/entite/'+entite+'/dates/'+date1+'/'+date2);
}

getTransactionByMethodeAndEntiteAndBetween2Dates(methode: any, entite: number, date1: any, date2: any): Observable<any> {
  return this.http.get(environment.apiUrl+'/transaction/methode/'+methode+'/entite/'+entite+'/dates/'+date1+'/'+date2);
}

getAllMethod(): Observable<any> {
  return this.http.get(environment.apiUrl+"/transaction/method");
}

getAllIdType(): Observable<any> {
  return this.http.get(environment.apiUrl+"/transaction/idType");
}

getTransactionsByMethode(methode: string): Observable<any> {
  return this.http.get(environment.apiUrl+'/transaction/method/'+methode);
}

getTransactionsByPNR(pnr: string): Observable<any> {
  return this.http.get(environment.apiUrl+'/transaction/pnr/'+pnr);
}

getTransactionsByPNRAndStatus(pnr: string, status: string): Observable<any> {
  return this.http.get(environment.apiUrl+'/transaction/pnr/'+pnr+'/status/'+status);
}

getTransactionsByPNRAndStatusAndCashIn(pnr: string, status: string, cashIn: boolean): Observable<any> {
  return this.http.get(environment.apiUrl+'/transaction/pnr/'+pnr+'/status/'+status+'/isCashIn/'+cashIn);
}

getTransactionsByMethodeAndPNRAndStatus(methode: string, pnr: string, status: string): Observable<any> {
  return this.http.get(environment.apiUrl+'/transaction/pnr/'+pnr+'/status/'+status);
}

newTokenTransaction(id: any): Observable<any> {
  return this.http.post(environment.apiUrl+'/transaction/newToken/'+id, null, {responseType: 'text'});
}

initTransasction(id: any, data: any): Observable<any> {
  return this.http.post<any>(environment.apiUrl+'/transaction/initTransaction/'+id, data);
}

oneStepPayment(id: any, data: any): Observable<any> {
  return this.http.post<any>(environment.apiUrl+'/transaction/oneStepPayment/'+id, data);
}

getProfile(id: any, msisdn: any): Observable<any> {
  return this.http.get<any>(environment.apiUrl+'/transaction/getProfile/'+id+'?msisdn='+msisdn+'&type=retailer')
}

getAllStatus(): Observable<any> {
  return this.http.get(environment.apiUrl+"/status/")
}

getAllEntite(): Observable<any> {
  return this.http.get<any>(environment.apiUrl+"/entite/")
}

getSommeTotale(id: number): Observable<any> {
  return this.http.get<any>(environment.apiUrl+'/transaction/sommeTotale/'+id)
}

getSommeTotaleByDay(id: number, day: any): Observable<any> {
  return this.http.get<any>(environment.apiUrl+'/transaction/sommeTotale/'+id+'/'+day)
}

getSommeTotaleBetweenDates(id: number, date1: any, date2: any): Observable<any> {
  return this.http.get<any>(environment.apiUrl+'/transaction/sommeTotale/'+id+'/'+date1+'/'+date2)
}

getSommeTotaleParAgence(id: number): Observable<any> {
  return this.http.get<any>(environment.apiUrl+'/transaction/sommeTotale/agence/'+id)
}

getSommeTotaleParAgenceByDay(id: number, day: any): Observable<any> {
  return this.http.get<any>(environment.apiUrl+'/transaction/sommeTotale/agence/'+id+'/day/'+day)
}

getListSommes(): Observable<any> {
  return this.http.get<any>(environment.apiUrl+'/transaction/listeSommeParAgence')
}

getListTransactionsAgences(): Observable<any> {
  return this.http.get<any>(environment.apiUrl+'/transaction/listeTransactionParAgence')
}

getListSommesPerDay(day: any): Observable<any> {
  return this.http.get<any>(environment.apiUrl+'/transaction/listeSommeParAgenceAndDay/'+day)
}

getListTransactionsAgencesPerDay(day: any): Observable<any> {
  return this.http.get<any>(environment.apiUrl+'/transaction/listeTransactionParAgenceParDay/'+day)
}

getListSommesBetweenDates(date1: any, date2: any): Observable<any> {
  return this.http.get<any>(environment.apiUrl+'/transaction/listeSommeParAgenceAndBetweenDates/'+date1+'/'+date2)
}

getListTransactionsAgencesBetweenDates(date1: any, date2: any): Observable<any> {
  return this.http.get<any>(environment.apiUrl+'/transaction/listeTransactionParAgenceBetweenDates/'+date1+'/'+date2)
}

getListStatus(): Observable<any> {
  return this.http.get<any>(environment.apiUrl+'/transaction/listeTransactionParStatus')
}

getListStatusAndDay(day: any): Observable<any> {
  return this.http.get<any>(environment.apiUrl+'/transaction/listeTransactionParStatusAndDay/'+day)
}

getListStatusAndAgenceAndDay(entite: any, day: any): Observable<any> {
  return this.http.get<any>(environment.apiUrl+'/transaction/listeTransactionParStatusAndAgenceAndDay/'+entite+'/'+day)
}

getListStatusParAgence(entite: number): Observable<any> {
  return this.http.get<any>(environment.apiUrl+'/transaction/listeTransactionParStatusParAgence/'+entite)
}

getListStatusParAgent(email: string): Observable<any> {
  return this.http.get<any>(environment.apiUrl+'/transaction/listeTransactionParStatusParAgent/agent/'+email)
}

getListStatusParAgentAndDay(email: string, day: any): Observable<any> {
  return this.http.get<any>(environment.apiUrl+'/transaction/listeTransactionParStatusParAgentAndDay/agent/'+email+'/day/'+day)
}

getTransactionsRemboursees(): Observable<any> {
  return this.http.get<any>(environment.apiUrl+'/transaction/compare')
}

initiateQrcode(id: any, data: any): Observable<any> {
  return this.http.post<any>(environment.apiUrl+'/transaction/initQrcode/'+id, data)
}

postNotifQrcode(id: any, data: any): Observable<any> {
  return this.http.post<any>(environment.apiUrl+'/transaction/sendNotifQrcode/'+id, data)
}

getNotifQrcode(id: any): Observable<any> {
  return this.http.get<any>(environment.apiUrl+'/transaction/getNotifQrcode/'+id)
}



}
