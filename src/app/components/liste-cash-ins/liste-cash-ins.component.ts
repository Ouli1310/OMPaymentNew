import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ThemeService } from 'ng2-charts';
import { Observable, Subscription } from 'rxjs';
import { CashIn, Transaction } from 'src/app/model/transactionRequest';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { CashInService } from 'src/app/service/cash-in.service';
import { DataService } from 'src/app/service/data.service';
import { ProfilService } from 'src/app/service/profil.service';
import { TokenStorageService } from 'src/app/service/token-storage.service';
import { TransactionService } from 'src/app/service/transaction.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-liste-cash-ins',
  templateUrl: './liste-cash-ins.component.html',
  styleUrls: ['./liste-cash-ins.component.css']
})
export class ListeCashInsComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['id', 'transactionId', 'reference', 'partnerId', 'customerId', 'date', 'valeur', 'status', 'methode'];

  cashIns: CashIn[] = []
  dataSource: MatTableDataSource<CashIn> = new MatTableDataSource();
  isNewTransaction!: boolean;
  user!: User
  user1: User = new User()
  newToken: any
  public isLogged$!: Observable<boolean>;
  profil!: string
  subscription!: Subscription

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private cashInService: CashInService,
    private tokenStorage: TokenStorageService, 
    private router: Router, 
    private transactionService: TransactionService,
    private userService: UserService, 
    private authService: AuthService, 
    private profilService: ProfilService,
    private dataServ: DataService
  ) { }

  ngOnInit(): void {

    this.isLogged$ = this.authService.isLoggedIn

    this.subscription = this.dataServ.currentProfil.subscribe(profil => this.profil = profil)
    console.log('profil from cashIn ', this.profil)

    if (this.tokenStorage.getToken() == null) {
      console.error("No token");
      this.router.navigate([''])

    }
    this.isNewTransaction = false
    this.user = this.tokenStorage.getUser();
    console.log(this.user)
    this.userService.getUserById(this.user.id).subscribe(
      data => {
        this.user1 = data
      })
    this.getCashIns()

  }


  getCashIns() {
   
            this.cashInService.getAllCashIns().subscribe(
              data => {
               
                    this.cashIns = data
                    console.log('transactions', this.dataSource.data)
                    this.dataSource = new MatTableDataSource(data)
                    console.log('datasource', this.dataSource.data)
                    console.log('datasource', this.dataSource.data)
                    this.dataSource.paginator = this.paginator;
                  }
            )

                }
 

                NewTransactionOrList(): boolean {

                  this.isNewTransaction = !this.isNewTransaction
                  return this.isNewTransaction
                }

                getNewTokenTransaction() {
                  this.transactionService.newTokenTransaction(this.user1.id).subscribe(
                    data => {
                      this.newToken = data
                      console.log(this.newToken)
                      this.router.navigate(['ompayment/cashIn/add-cashIn'])
                    }
                  )
              
              
                }
            
              
              
                applyFilter(event: Event) {
                  let filterValue = (event.target as HTMLInputElement).value;
                  // this.transactions.data.filter = filterValue.trim().toLowerCase();
                  console.log('show value', filterValue)
              
                  filterValue = filterValue.trim(); // Remove whitespace
                  filterValue = filterValue.toLowerCase()
                  this.dataSource.filter = filterValue
              
                  console.log('after filter ', this.dataSource.data)
                  if (this.dataSource.paginator) {
                    this.dataSource.paginator.firstPage();
                  }
                }

                applyFilterByMethode(methode: string) {
                 
                  console.log('get methode ', methode)
                  let met = methode?.trim()
                  met = met?.toLowerCase()
                  this.cashInService.getCashInsByMethode(methode).subscribe(
                    data => {
                     
                          this.cashIns = data
                          console.log('cashIns', this.dataSource.data)
                          this.dataSource = new MatTableDataSource(data)
                          console.log('cashIns', this.dataSource.data)
                          if (this.dataSource.paginator) {
                            this.dataSource.paginator.firstPage();
                          }
                        }
                  )
                
                }

                ngOnDestroy(): void {
                  //this.subscription.unsubscribe()
                } 
              

}
