import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { Form, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Customer, IdType, Method, Money, Partner, QrcodeRequest, TransactionRequest } from 'src/app/model/transactionRequest';
import { User } from 'src/app/model/user';
import { TokenStorageService } from 'src/app/service/token-storage.service';
import { TransactionService } from 'src/app/service/transaction.service';
import { UserService } from 'src/app/service/user.service';
import {MatDialog} from '@angular/material/dialog';
import { DialogAnimationsExampleDialogComponent } from '../../dialog-animations-example-dialog/dialog-animations-example-dialog.component';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';



/**@Component({
  selector: 'app-error-message-popup',
  template: `
    <h1 mat-dialog-title>Error</h1>
    <div mat-dialog-content>
      {{data.message}}
    </div>
    <div mat-dialog-actions>
  <button mat-button mat-dialog-close style="margin-right: 20px;"> No </button>
  <button mat-button mat-dialog-close cdkFocusInitial> Ok </button>
</div>
  `
})

export class ErrorMessagePopupComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorMessagePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
} */

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent implements OnInit {

  @ViewChild('qrCodeImg', { static: false })
  qrCodeImg!: ElementRef<HTMLImageElement>;

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
  methodes!: Method[];
  methodeChoisie!: string;
  idTypes!: IdType[];
  idTypeChoisi: IdType = new IdType();
  idTypeNumb: IdType = new IdType();
  idTypeMsisdn: IdType = new IdType();
  idPartner!: any;
  codeP!: any
  newToken!: any;
  qrCode!: any
  qrCodeImage: string = '';
  safeImageUrl!: SafeResourceUrl;

  
  constructor(private tokenStorage: TokenStorageService, private router: Router, private formBuilder: UntypedFormBuilder, private userService: UserService, private transactionService: TransactionService, public dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {

    if(this.tokenStorage.getToken() == null) {
      console.error("No token");
      this.router.navigate([''])
       
     }



     this.firstForm = this.formBuilder.group({
      methode: ['', Validators.required],
      idTypeP: ['', Validators.required],
      idP: ['', Validators.required],
      code: ['', Validators.required]
    })

    this.secondeForm = this.formBuilder.group({
      idTypeClient: ['', Validators.required],
      idClient: ['', Validators.required],
      otpClient: ['', Validators.required]
    })

  

    this.forthForm = this.formBuilder.group({
      value: ['', Validators.required],
      unit: ['', Validators.required]
    })

    this.fifthForm = this.formBuilder.group({
      reference: ['', Validators.required],
      receiveNotification: ['', Validators.required]
    })

  




    this.user = this.tokenStorage.getUser();
    console.log(this.user)

    this.userService.getUserById(this.user.id).subscribe(
      data => {
        this.user1 = data
        console.log(this.user1)
        console.log(this.user1.msisdn)
        this.idPartner = this.user1.msisdn
        this.codeP = this.user1.code

      }
    )

    this.userService.getUserPinCode(this.user.id).subscribe(
      data => {
        console.log(data)
        this.pinCode = data;
      }
    );

    this.transactionService.getAllMethod().subscribe(
      data => {
        this.methodes = data
        console.log(this.methodes)
        this.methodeChoisie = this.methodes[0].name
      }
    )

    this.transactionService.getAllIdType().subscribe(
      data => {
        this.idTypes = data
       this.idTypeMsisdn = this.idTypes[0]
      }
    )

    this.transactionService.newTokenTransaction(this.user.id).subscribe(
      data => {
        this.newToken = data
        console.log(this.newToken)
        const qrcodeRequest = new QrcodeRequest();
    qrcodeRequest.callbackCancelUrl = "https://my-cancel-url.com";
    qrcodeRequest.callbackSuccessUrl = "https://my-success-url.com";
    qrcodeRequest.code = this.codeP;
    qrcodeRequest.name = this.user1.firstName;
    qrcodeRequest.validity = 86000

    this.transactionService.initiateQrcode(this.user.id, qrcodeRequest).subscribe (
      data => {
        console.log(data)
        this.qrCode = data.qrCode
        this.safeImageUrl = this.base64ToImage(this.qrCode);
      }
    )
      }
    )

  }

  base64ToImage(base64Data: string): SafeResourceUrl {
    const imageData = `data:image/png;base64,${base64Data}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(imageData);
  }

  /**onQRCodeImageLoad(): void {IO
    const imgElement = document.querySelector('img');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if(imgElement != null) {
      context?.drawImage(imgElement, 0, 0);
    }
    const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
    
    const qrCodeResult = jsQR(imageData!.data, imageData!.width, imageData!.height);
    if (qrCodeResult) {
      const scannedData = qrCodeResult.data;
      // Process the scanned data as needed
      console.log(scannedData);
    } else {
      console.log('No QR code found in the image');
    }
  }*/



  get methode() {
    return this.firstForm.get('methode');
  }

  get idTypeP() {
    return this.firstForm.get('idTypeP');
  }

  get idP() {
    return this.firstForm.get('idP');
  }

  get code() {
    return this.firstForm.get('code');
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

 

  get value() {
    return this.forthForm.get('value');
  }

  get unit() {
    return this.forthForm.get('unit');
  }

  get j() {
    return this.forthForm.controls;
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

 /**  getMethodeChoisi(m: Method) {
    this.methodeChoisie = m.name;
    console.log(this.methodeChoisie)
    if(this.methodeChoisie == "CLASSIC") {
      this.idTypeNumb = this.idTypes[0]

    }else {
      this.idTypeNumb = this.idTypes[1]
    }

    this.userService.getIdByIdType(this.user.id, this.idTypeNumb.id).subscribe(
      data => {
        this.idPartner = data
        console.log(this.idPartner)
      }
    )
  
console.log(this.idTypeNumb)
  }- */

  openModal(errorMessage: string) {
    this.errorMessage = errorMessage;
    console.log(this.errorMessage)
   
    this.dialog.open(DialogAnimationsExampleDialogComponent, {
      width: '250px',
      data: {message: this.errorMessage}
     
    });
  }

  initQrcode() {

    

  }

 

  initTransaction() {
    const transactionRequest = new TransactionRequest();

    transactionRequest.method = this.methodeChoisie;
  
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
      
     
      transactionRequest.amount = amount;
      transactionRequest.partner = partner;
      transactionRequest.customer = customer;
      transactionRequest.reference = this.k['reference'].value;
      transactionRequest.receiveNotification = false;
  
      console.log(transactionRequest);
      this.transactionService.initTransasction(this.user.id, transactionRequest).subscribe(
        {
          next: data => {
            this.isSuccessful = true;
            console.log(data)
        console.log(this.isSuccessful)
        this.router.navigate(['/ompayment/transactions'])

          },   error: err => {
            this.errorMessage = err.error;
            console.log(this.errorMessage)
            
          this.openModal(err.error.text)
          }
        }
     
      )
    
 
    }

    goToTransactions() {
      this.router.navigate(["/ompayment/transactions"])
    }
   

}
