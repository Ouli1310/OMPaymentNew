import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { CashInRequest } from 'src/app/model/cashInRequest';
import { CashIn, Customer, IdType, Method, Money, Partner, Transaction } from 'src/app/model/transactionRequest';
import { User } from 'src/app/model/user';
import { CashInService } from 'src/app/service/cash-in.service';
import { TokenStorageService } from 'src/app/service/token-storage.service';
import { TransactionService } from 'src/app/service/transaction.service';
import { UserService } from 'src/app/service/user.service';
import { DialogAnimationsExampleDialogComponent } from '../dialog-animations-example-dialog/dialog-animations-example-dialog.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-cash-in',
  templateUrl: './cash-in.component.html',
  styleUrls: ['./cash-in.component.css']
})
export class CashInComponent implements OnInit {


  
  firstForm!: UntypedFormGroup;
  secondeForm!: UntypedFormGroup;
  thirdForm!: UntypedFormGroup;
  forthForm!: UntypedFormGroup;
  fifthForm!: UntypedFormGroup;
  sixthForm!: UntypedFormGroup;
  seventhForm!: UntypedFormGroup;
  eighthForm!: UntypedFormGroup;
  pinCode!: any;
  user: any;
  user1: User = new User();
  isSuccessful = false;
  errorMessage = '';
  methodes = ["REMBOURSEMENT", "DEPOT", "BULK"];
  methodeChoisie!: string;
  idTypes!: IdType[];
  idTypeChoisi: IdType = new IdType();
  idTypeNumb: IdType = new IdType();
  idTypeMsisdn: IdType = new IdType();
  idPartner!: any;
  filteredOptions!: Observable<Transaction[]>;
  filteredTrans!: Observable<Transaction[]>
  filteredNumeros!: Observable<Transaction[]>
  myControl = new FormControl('');
  myControl1 = new FormControl('')
  myControl2 = new FormControl('')
  transactions: Transaction[] = []
  transactionsParPNR: Transaction[] = []
  pnrChoisi!: string
  referenceTrans!: any
  numClientTrans: string[] = []
  numbClient!: any
  montantTrans!: number
  montantCashIn!: number
  cashInsParPNR: CashIn[] = []
  newCashIn!: number
  numbClientChoisi!: string 
  montantTransChoisi: any[] = []
  formList!: FormGroup;
  importFile = false
  fileImported = false
  fileList: any


  constructor(
    private tokenStorage: TokenStorageService, 
    private router: Router, 
    private formBuilder: UntypedFormBuilder, 
    private userService: UserService,
    private cashInService: CashInService,
    private transactionService: TransactionService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

   
   
    if(this.tokenStorage.getToken() == null) {
      console.error("No token");
      this.router.navigate([''])
       
     }

     this.firstForm = this.formBuilder.group({
      methode: ['', Validators.required]
     
    })

    this.secondeForm = this.formBuilder.group({
      idTypeClient: ['', Validators.required],
      idClient: ['', Validators.required],
      otpClient: ['', Validators.required]
    })

    this.thirdForm = this.formBuilder.group({
      idTypeP: ['', Validators.required],
      idP: ['', Validators.required]
    })

    this.forthForm = this.formBuilder.group({
      montantValue: ['', Validators.required],
      cashInValue: ['', Validators.required],
      value: ['', Validators.required],
      unit: ['', Validators.required]
    })

    this.fifthForm = this.formBuilder.group({
      pnr: ['', Validators.required],
      reference: ['', Validators.required],
      receiveNotification: ['', Validators.required]
    })

  

    this.formList = this.fb.group({
      forms: this.fb.array([this.createForm()])
    });


    this.user = this.tokenStorage.getUser();
    console.log(this.user)

    this.userService.getUserById(this.user.id).subscribe(
      data => {
        this.user1 = data
        console.log(this.user1)
        console.log(this.user1.msisdn)
        this.idPartner = this.user1.msisdn
      }
    )

    this.userService.getUserPinCode(this.user.id).subscribe(
      data => {
        console.log(data)
        this.pinCode = data;
      }
    );

    
    this.transactionService.getAllIdType().subscribe(
      data => {
        this.idTypes = data
       this.idTypeMsisdn = this.idTypes[0]
      }
    )

   this.getTransactions()
   console.log(this.transactions)

  }

  createForm(): FormGroup {
    return this.fb.group({
      idClient: [''],
      montant: ['']
    });
  }

  get forms() {
    return this.formList.get('forms') as FormArray;
  }

  addForm() {
    this.forms.push(this.createForm());
  }
  
  removeForm(index: number) {
    this.forms.removeAt(index);
  }

  onSubmit() {
    console.log(this.formList.get('forms')?.value)
    console.log(this.formList.get('forms')?.value.length)
    const cashInRequest: CashInRequest[] = [] ;
    for(let i = 0; i<this.formList.get('forms')?.value.length; i++) {
     

      const amount: Money = {
        unit: 'XOF',
        value: this.formList.get('forms')?.value[i].montant
      }
      console.log(amount)

      const partner: Partner = {
        encryptedPinCode: this.pinCode,
        idType: 'MSISDN',
        id: this.idPartner
      }
      console.log(partner)


      const customer: Customer = {
        idType: 'MSISDN',
        id: this.formList.get('forms')?.value[i].idClient,
        otp: ''
      }
      console.log(customer)
  
      

      cashInRequest.push({partner: partner, customer: customer, receiveNotification: false, reference: this.k['pnr'].value, amount: amount})

    }

      console.log(cashInRequest);

      this.cashInService.initBulkCashIn(this.user.id, cashInRequest).subscribe(
        {
          next: data => {
            this.isSuccessful = true;
            console.log(data)
        console.log(this.isSuccessful)
        this.router.navigate(['/ompayment/cashIn'])
          },   error: err => {
            this.errorMessage = err.error.message;
            console.log("fffffffffffffffffffffff")
            console.log(err.error)
            this.openModal(err.error.text)
          }
        }
     
      )
    
    

  }



  getTransactions() {
    this.transactionService.getTransactionsByStatus("SUCCESS").subscribe (
      data => {
        this.transactions = data
        console.log(this.transactions)
      
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
      }
    )
  }




  private _filter(value: string): Transaction[] {
    console.log(this.transactions)
    const filterValue = value?.toLowerCase();
//console.log("this datasource",   this.getTransactions(this.user1))
    return this.transactions.filter(option => option.reference?.toLowerCase().includes(filterValue));
  }

  getMethodeChoisie(event: any) {
    this.methodeChoisie = event.value
    console.log(this.methodeChoisie)
  }



  
 
  getPNRChoisi(event: any) {

    this.pnrChoisi = event.option.value
    console.log("PNR CHOSIIIIII", this.pnrChoisi)

    this.cashInService.getCashInsByPNR(this.pnrChoisi).subscribe (
      data => {
        this.cashInsParPNR = data
        console.log(this.cashInsParPNR)
        this.montantCashIn = 0
        for(let i = 0; i<this.cashInsParPNR.length; i++) {
          console.log(this.cashInsParPNR[i].value)
          this.montantCashIn += this.cashInsParPNR[i].value
        }
        console.log(this.montantCashIn)
      }
    )
   
    this.getTransactionsParPNR(this.pnrChoisi)
 
}

getTransactionsParPNR(p: string) {
  console.log(this.pnrChoisi)
  
  this.transactionService.getTransactionsByPNRAndStatus(this.pnrChoisi, "SUCCESS").subscribe (
    data => {
      console.log(data)
      this.transactionsParPNR = data
      this.montantTrans = 0
      for(let i = 0; i<this.transactionsParPNR.length; i++) {
        this.montantTrans += this.transactionsParPNR[i].value
      }

      console.log(this.montantTrans)
    
     
    }

    
  )
}




/**getReferenceTransactionChoisi(event: any) {

  console.log(event)
  this.referenceTrans = event.value
  console.log("ReferenceTrans CHOSIIIIII", this.referenceTrans)
  console.log("ReferenceTrans CHOSIIIIII", this.referenceTrans.length)
  for(let i = 0; i<this.referenceTrans.length; i++) {
    this.montantTrans = []
    this.numClientTrans = []
    this.transactionService.getTransactionByTransactionId(this.referenceTrans[i]).subscribe (
      data => {
        this.montantTrans.push(data.value)
        console.log(this.montantTrans)
        this.numClientTrans.push(data.customerId)
        console.log(this.numClientTrans)
       
      }
      
    )
    console.log(this.numClientTrans)
    console.log(this.montantTrans)
  }
  

} */

getNumeroClientChoisi(event: any) {
  this.numbClientChoisi = event.option.value
  console.log(this.numbClientChoisi)
}

getMontantChoisi(event: any) {
  this.montantTransChoisi = event.value
  console.log(this.montantTransChoisi)
}
  

get methode() {
  return this.firstForm.get('methode');
}

get f() {
  return this.firstForm.controls;
}


  get idTypeClient() {
    return this.secondeForm.get('idTypeClient');
  }

  get idClient() {
    return this.secondeForm.get('idClient');
  }

  get otpClient() {
    return this.secondeForm.get('otpClient');
  }

  get g() {
    return this.secondeForm.controls;
  }

  get idTypeP() {
    return this.thirdForm.get('idTypeP');
  }

  get idP() {
    return this.thirdForm.get('idP');
  }

  get h() {
    return this.thirdForm.controls;
  }

  get montantValue() {
    return this.forthForm.get('montantValue');
  }

  get cashInValue() {
    return this.forthForm.get('cashInValue');
  }

  get value() {
    return this.forthForm.get('value');
  }

  get unit() {
    return this.forthForm.get('unit');
  }

  get j() {
    return this.forthForm.controls;
  }

  get pnr() {
    return this.fifthForm.get('pnr');
  }

  get reference() {
    return this.fifthForm.get('reference');
  }

  get receiveNotification() {
    return this.fifthForm.get('receiveNotification');
  }

  get k() {
    return this.fifthForm.controls;
  }

  openModal(errorMessage: string) {
    this.errorMessage = errorMessage;
    console.log(this.errorMessage)
   
    this.dialog.open(DialogAnimationsExampleDialogComponent, {
      width: '250px',
      data: {message: this.errorMessage}
     
    });
  }



  onButtonClick() {
    this.importFile = true
    const fileInput = document.getElementById('fileInput');
    fileInput?.click();
  }

  onFileChange(event: any) {
    this.fileImported = true
    console.log(this.fileImported)
    console.log(event)
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => {
      const workbook = XLSX.read(reader.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      this.fileList = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      console.log(this.fileList); // Output the extracted data to the console
      console.log(this.fileList[0][0])
      console.log(this.fileList.length);

      this.forms.clear();

      this.fileList.forEach((row: any[]) => {
        const formGroup = this.fb.group({
          idClient: new FormControl(row[0]),
          montant: new FormControl(row[1])
        });
        this.forms.push(formGroup);
        
      });
  
      console.log(this.forms.value)

    };
  }


  initCashIn() {

    if(this.methodeChoisie == 'DEPOT') {
      const cashInRequest = new CashInRequest();

        const amount: Money = {
          unit: 'XOF',
          value: this.j['value'].value
        }
        console.log(amount)

        const partner: Partner = {
          encryptedPinCode: this.pinCode,
          idType: 'MSISDN',
          id: this.idPartner
        }
        console.log(partner)
       
        const customer: Customer = {
          idType: 'MSISDN',
          id: this.g['idClient'].value,
          otp: ''
        }
        console.log(customer)
        
       
        cashInRequest.amount = amount;
        cashInRequest.partner = partner;
        cashInRequest.customer = customer;
        cashInRequest.reference = this.k['pnr'].value;
        cashInRequest.receiveNotification = false;
    
        console.log(cashInRequest);

      
          this.cashInService.initCashIn(this.user.id, cashInRequest).subscribe(
            {
              next: data => {
                this.isSuccessful = true;
                console.log(data)
            console.log(this.isSuccessful)
            this.router.navigate(['/ompayment/cashIn'])
              },   error: err => {
                this.errorMessage = err.error.message;
                console.log("fffffffffffffffffffffff")
                console.log(err.error)
                this.openModal(err.error.text)
              }
            }
         
          )
        
    }
  
else if(this.methodeChoisie == 'REMBOURSEMENT') {


      const cashInRequest = new CashInRequest();

      const amount: Money = {
        unit: 'XOF',
        value: this.j['value'].value
      }
      console.log(amount)

      const partner: Partner = {
        encryptedPinCode: this.pinCode,
        idType: 'MSISDN',
        id: this.idPartner
      }
      console.log(partner)


      const customer: Customer = {
        idType: 'MSISDN',
        id: this.numbClientChoisi,
        otp: ''
      }
      console.log(customer)
      
     
      cashInRequest.amount = amount;
      cashInRequest.partner = partner;
      cashInRequest.customer = customer;
      cashInRequest.reference = this.pnrChoisi;
      cashInRequest.receiveNotification = false;
  
      console.log(cashInRequest);
   
      
        this.cashInService.initCashIn(this.user.id, cashInRequest).subscribe(
          {
            next: data => {
              this.isSuccessful = true;
              console.log(data)
          console.log(this.isSuccessful)
          this.router.navigate(['/ompayment/cashIn'])
            },   error: err => {
              console.log(err)
              this.errorMessage = err.error.message;
              console.log("fffffffffffffffffffffff")
              console.log(err.error)
              this.openModal(err.error.text)
            }
          }
       
        )
      
      

    
    /**else if(this.referenceTrans.length > 1) {

      

      const amount: Money[] = []

      for(let i = 0; i<this.montantTrans.length; i++) {
        amount.push( {
          unit: 'XOF',
          value: this.montantTrans[i]
        } )
       
      }

      console.log(amount)
      const partner: Partner = {
        encryptedPinCode: this.pinCode,
        idType: this.idTypeMsisdn.name,
        id: this.idPartner
      }

      console.log(partner)
      const customer: Customer[] = []
      for(let i = 0; i<this.numbClientChoisi.length; i++) {
        customer.push( {
          idType: this.idTypeMsisdn.name,
          id: this.numbClientChoisi[i],
          otp: ''
        } )
       
      }
     
       
      console.log(customer)

      if(this.numbClientChoisi.length == amount.length) {
        for(let i = 0; i<this.numbClientChoisi.length; i++) {
          console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAA")
          const cashInRequest: CashInRequest[] = [] ;
          cashInRequest.push({partner: partner, customer: customer[i], receiveNotification: false, reference: this.pnrChoisi, amount: amount[i]})
          console.log(cashInRequest)

       
      }

      console.log(cashInRequest)

      this.cashInService.initBulkCashIn(this.user.id, cashInRequest, this.referenceTrans).subscribe(
        {
          next: data => {
            this.isSuccessful = true;
            console.log(data)
        console.log(this.isSuccessful)
        this.router.navigate(['/ompayment/cashIn'])
          },   error: err => {
            this.errorMessage = err.error.message;
            console.log("fffffffffffffffffffffff")
            console.log(err.error)
            this.openModal(err.error.text)
          }
        }
     
      )


    } else if(this.numbClientChoisi.length < amount.length) {
      console.log(this.numbClientChoisi.length)
   
      for(let i = 0; i<amount.length; i++) {
        const customer: Customer = {
          idType: this.idTypeMsisdn.name,
          id: this.numbClientChoisi[0],
          otp: ''
        }
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAA")
        cashInRequest.push({partner: partner, customer: customer, receiveNotification: false, reference: this.pnrChoisi, amount: amount[i]})
        console.log(cashInRequest)

     
    }

    console.log(cashInRequest)

    this.cashInService.initBulkCashIn(this.user.id, cashInRequest, this.referenceTrans).subscribe(
      {
        next: data => {
          this.isSuccessful = true;
          console.log(data)
      console.log(this.isSuccessful)
      this.router.navigate(['/ompayment/cashIn'])
        },   error: err => {
          this.errorMessage = err.error.message;
          console.log("fffffffffffffffffffffff")
          console.log(err.error)
          this.openModal(err.error.text)
        }
      }
   
    )

    }
    
    
    }*/
  }

  }

   
   

    goToCashIns() {
      this.router.navigate(["/ompayment/cashIn"])
    }
   


  }


