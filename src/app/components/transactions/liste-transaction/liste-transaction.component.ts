
import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ThemeService } from 'ng2-charts';
import { Entite, Profil, User } from 'src/app/model/user';
import { TokenStorageService } from 'src/app/service/token-storage.service';
import { TransactionService } from 'src/app/service/transaction.service';
import { UserService } from 'src/app/service/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { Transaction } from 'src/app/model/transactionRequest';
import * as XLSX from 'xlsx';
import { MatSort } from '@angular/material/sort';
import { forkJoin, map, Observable, startWith, Subject, Subscription, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { ProfilService } from 'src/app/service/profil.service';
import { EntiteService } from 'src/app/service/entite.service';
import { DataService } from 'src/app/service/data.service';
import { Console } from 'console';
import { DatePipe } from '@angular/common';
import { WebSocketService } from 'src/app/service/web-socket.service';




@Component({
  selector: 'app-liste-transaction',
  templateUrl: './liste-transaction.component.html',
  styleUrls: ['./liste-transaction.component.css']
})
export class ListeTransactionComponent implements OnInit {

  isNewTransaction!: boolean
  displayedColumns: string[] = ['id', 'transactionId', 'reference', 'agent', 'partnerId', 'customerId', 'date', 'valeur', 'description', 'status'];
  columns: string[] = ['', 'transactionId', 'reference', 'agent', 'partnerId', 'customerId', 'date', 'valeur', 'description', 'status'];

  user: any;
  user1: User = new User();
  newToken!: any;
  transacReu: any;
  status!: string;
  msisdn!: string;
  partner: string = '';
  pg!: MatPaginator
  list1: any;
  dates: any;
  profil!: string;
  myControl = new FormControl('');
  filteredOptions!: Observable<Entite[]>;
  filteredNames!: Observable<User[]>;
  public isLogged$!: Observable<boolean>;
  dataSource: MatTableDataSource<Transaction> = new MatTableDataSource();
  filteredData: any[] = []
  originalData: any[] = []
  transactions: Transaction[] = [];
  fileName= 'ExcelSheet.xlsx';
  entites: Entite[] = [];
  usersEntite: User[] = []
  email!: string;
  firstName!: string
  user2: User = new User();
  entite: Entite = new Entite()
  subscription!: Subscription;
  pageData: any[] = [];
  pageSize: number = 0;
  pageSizeOptions: number[] = [5, 10, 20];
  entiteName!: string
  transactionRemb: any[] = []
  public showPopup = false;
  public popupMessage = '';


 // @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  columnChoisi: string = "";
  currentFilterValue: string = "";
  notificationSubscription!: Subscription;
  notifications: string[] = [];

  constructor(
    private transactionService: TransactionService, 
    private tokenStorage: TokenStorageService, 
    private router: Router, 
    private userService: UserService, 
    private authService: AuthService, 
    private profilService: ProfilService,
    private entiteService: EntiteService,
    private dataServ: DataService,
    private datePipe: DatePipe,
    private webSocketService: WebSocketService
    ) { }
 



  ngOnInit(): void {

    this.isLogged$ = this.authService.isLoggedIn
 
    
   // this.setPageData(0);

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
      this.getUsersEntite(this.user1)
        
        console.log("USER 1", this.user1)
        this.getTransactions(this.user1)
      }
    
    )

    this.webSocketService.connectWebSocket();
    this.webSocketService.getNotification().subscribe((message) => {
      this.popupMessage = message;
      this.showPopup = true;
      setTimeout(() => {
        this.showPopup = false;
      }, 60000); // Pop-up will disappear after 3 seconds
    });
  
   

      this.getEntites()
      this.getTransactionRemb()

  }

/**
  
ngAfterViewInit() {
  // Initialize paginator
  console.log(this.dataSource)
  this.dataSource.paginator = this.paginator;
}*/

 /** setPageData(pageIndex: number): void {
    console.log(this.transactions)
    const startIndex = pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pageData = this.transactions.slice(startIndex, endIndex);
    console.log(this.pageData)
  }
*/
    
  

  getEntites() {
    this.entiteService.getAllEntites().subscribe(
      data => {
        this.entites = data
        console.log(this.entites)
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || '')),
        );
      }
    )
  }

  getUsersEntite(user: User) {
    console.log(user)
   
    this.userService.getUsersByEntite(user.entite).subscribe(
      data => {
        this.usersEntite = data
        console.log("USERS ENTTE", this.usersEntite)
        this.filteredNames = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter1(value || '')),
        );
    
      }
    )
    
  }

  getTransactionRemb() {
    this.transactionService.getTransactionsRemboursees().subscribe(
      data => {
        this.transactionRemb = data
        console.log(this.transactionRemb)
      }
    )
  }

  isReferenceIncluded(reference: string): boolean {
    return this.transactionRemb.map(item => item.reference).includes(reference);
  }

  getTooltipText(reference: string): string {
    const transaction = this.transactionRemb.find(item => item.reference === reference);
    if (transaction) {
      return `CashIn Initial: ${transaction.cashInInitial} XOF, Somme Totale: ${transaction.sommeTotale} XOF`;
    }
    return '';
  }

  getTransactions(user: User) {
    console.log("userrrrrr", this.user)
    this.subscription = this.dataServ.currentProfil.subscribe(profil => {
      this.profil = profil
      console.warn('profil transaction', this.profil)
    })
     
          if(this.profil == 'AD' || this.profil == 'DAF') {
            console.log("AAAAAAAAAAAA")
     
            this.transactionService.getAllTransactions().subscribe(
              data => {
               
                    this.transactions = data
                    console.log(this.transactions)
                    forkJoin(
                      this.transactions.map(transaction => {
                        return this.userService.getUserByEmail(transaction.agent);
                      })
                    ).subscribe( 
                      results => {
                        results.forEach((data, index) => {
                          this.transactions[index].agent = data.firstName;
                        });
                      }
                    );
                    this.dataSource = new MatTableDataSource(data)
                    console.log('datasource', this.dataSource.data)
                    this.dataSource.paginator = this.paginator;
                  }
            )
               
               
                
              }
            
           else if(this.profil == 'CA') {
            this.userService.getUserById(this.user.id).subscribe(
              data => {
                console.log("currentUser", data)
                this.user1 = data
            this.transactionService.getTransactionsByEntite(this.user1.entite).subscribe(
              data => {
                this.transactions = data;
                forkJoin(
                  this.transactions.map(transaction => {
                    return this.userService.getUserByEmail(transaction.agent);
                  })
                ).subscribe(
                  results => {
                    results.forEach((data, index) => {
                      this.transactions[index].agent = data.firstName;
                    });
                  }
                );
                console.log(this.transactions)
                
                this.dataSource = new MatTableDataSource(data)
                console.log('datasource', this.dataSource.data)
                this.dataSource.paginator = this.paginator;
              }
            )}
            ) 
    
          }else
            {
            this.userService.getUserById(this.user.id).subscribe(
              data => {
                console.log("currentUser", data)
                this.user1 = data
            this.transactionService.getTransactionsByAgent(this.user1.email).subscribe(
              data => {
                this.transactions = data;
                console.log("transactons", this.transactions)
              
                forkJoin(
                  this.transactions.map(transaction => {
                    return this.userService.getUserByEmail(transaction.agent);
                  })
                ).subscribe(
                  results => {
                    results.forEach((data, index) => {
                      this.transactions[index].agent = data.firstName;
                    });
                  }
                );
             
              console.log(this.transactions)
                this.dataSource = new MatTableDataSource(data)
                console.log('datasource', this.dataSource.data)
                this.dataSource.paginator = this.paginator;
                
              }
              
            )})
            
          
          
    
  

      
  
  
        }
  
   
  }

  private _filter1(value: string): User[] {
    console.log(this.usersEntite)
  
    const filterValue = value.toLowerCase();
//console.log("this datasource",   this.getTransactions(this.user1))
    return this.usersEntite.filter(option => option.firstName?.toLowerCase().includes(filterValue));
  }

  private _filter(value: string): Entite[] {
    console.log(this.entites)
    const filterValue = value.toLowerCase();
//console.log("this datasource",   this.getTransactions(this.user1))
    return this.entites.filter(option => option.msisdn?.toLowerCase().includes(filterValue));
  }



  NewTransactionOrList(): boolean {
    this.isNewTransaction = !this.isNewTransaction
    return this.isNewTransaction
  }

  transactionsByStatus(status: string) {
    this.transactionService.getTransactionsByMethodeAndStatus("CLASSIC", status).subscribe(
      data => {
        this.transactions = data
      })
  }

  getNewTokenTransaction() {

    this.transactionService.newTokenTransaction(this.user1.id).subscribe(
      data => {
        this.newToken = data
        console.log(this.newToken)
        this.router.navigate(['ompayment/transactions/add-transaction'])
      }
    )


  }

  getNameChoisi(event: any) {
  
        this.entiteName = event.value
        console.log("current partner idw", this.entite)
     
  }

  getfirstNameChoisi(event: any) {
    this.firstName = event.value
    this.userService.getUserByFirstName(this.firstName).subscribe(
      data => {
        this.user2 = data
        this.email = this.user2.email
        console.log(this.email)
      }
    )
   
  }


  getTransactionsRéussies() {
    this.transactionService.getTransactionsByStatus("SUCCESS").subscribe(
      data => {
        this.transacReu = data;
        console.log(this.transacReu)
      }
    )
  }

  applyFilter(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value;
    // this.transactions.data.filter = filterValue.trim().toLowerCase();
    console.log('show value', filterValue)

    console.log(typeof filterValue)

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase()
    this.dataSource.filter = filterValue

    console.log('after filter ', this.dataSource.data)
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getColumnChoisi(event: any) {
    this.columnChoisi = event.value
    console.log(this.columnChoisi)
    this.filteredData = []; // reset filteredData to empty array
    this.dataSource = new MatTableDataSource(this.transactions);
  }

  applyFilter1(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value;

    console.log(filterValue)

      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase()
  
  
   
    this.currentFilterValue = filterValue; // store current filter value

    if (this.currentFilterValue === "") { // if search term is cleared
      this.clearSearch(); // clear the search
      return;
    }

    console.log(typeof filterValue)

      this.filteredData = this.dataSource.data.filter((item: any) =>
      {
        let columnValue = item[this.columnChoisi]
        console.log(columnValue)
        if(typeof columnValue === 'string') {
          return columnValue?.toLowerCase().includes(filterValue)
        } else {
          return columnValue?.includes(filterValue); 
        }
      
      }
     
    );
     


   
    console.log(this.filteredData)
    if (this.filteredData.length > 0) {
      this.dataSource = new MatTableDataSource(this.filteredData);
    } else {
      this.dataSource =  new MatTableDataSource(this.transactions);
    }

    console.log(this.dataSource.data)
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  
clearSearch() {
  this.currentFilterValue = "";
  this.filteredData = [];
  this.dataSource = new MatTableDataSource(this.transactions);
}

  applyFilterByStatus(stat: string) {
    console.log('get status ', stat)
    let sta = stat?.trim()
    sta = sta.toLowerCase()
    this.dataSource.filter = sta
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilterByName(stat: string) {
    this.entiteService.getEntiteByName(stat).subscribe (
      data => {
        console.log('get status ', stat)
        let sta = data.msisdn?.trim()
        sta = sta.toLowerCase()
        this.dataSource.filter = sta
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }
    )
   
  }

  exportexcel(): void
  {
    /* pass here the table id */
    let element = document.getElementById('table');
    
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
 
  }


}

