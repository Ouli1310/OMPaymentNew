import { ThisReceiver } from '@angular/compiler';
import { Component, Input, OnInit, AfterViewInit, ChangeDetectionStrategy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ChartDataSets, ChartOptions } from 'chart.js';
import * as Chartist from 'chartist';
import {
  IBarChartOptions,
  IChartistAnimationOptions,
  IChartistData,
  plugins
} from 'chartist';
import { ChartEvent, ChartType } from 'ng-chartist';
import { Label, ThemeService } from 'ng2-charts';
import { Status, Transaction } from 'src/app/model/transactionRequest';
import { Entite, User } from 'src/app/model/user';
import { ProfilService } from 'src/app/service/profil.service';
import { TokenStorageService } from 'src/app/service/token-storage.service';
import { TransactionService } from 'src/app/service/transaction.service';
import { UserService } from 'src/app/service/user.service';
import { DatePipe } from '@angular/common';
import { EntiteService } from 'src/app/service/entite.service';
import { Observable, startWith, map, zip } from 'rxjs';
import { Router } from '@angular/router';
import * as Chart from 'chart.js';
export interface LegendItem {
  title: string;
  imageClass: string;
}

export interface data5 {
	[key: string]: any;
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, data5 {

  userId: any;
  user: User = new User;
  pipe = new DatePipe('en-US');
  partnerId: string = "";
  entiteName: string = "";
  transactions: Transaction[] = [];
  allTransactions: any = []
  i: any
  status: Status[] = []
  list: Array<number> = []
  listSucces: Array<any> = []
  listInit: Array<any> = []
  numbers: Array<any> = []
  data1!: IChartistData;
  data2!: IChartistData;
  profil!: string;
  user1: User = new User();
  range!: FormGroup
  sommeTotale: number = 0
  entites: Entite[] = []
  myControl = new FormControl('');
  filteredOptions!: Observable<Entite[]>;
  msisdn!: String
  recette: number = 0
  listOfList: any[] = []
  keysArray: any[] = []
  valuesArray: any[] = []
  list1: any[] = []
  startDate!: Date
  endDate!: Date
  form!: UntypedFormGroup;
  dateControl = new FormControl();
  entiteControl = new FormControl();
  dateSelect!: Date

  @ViewChild('lineChart') chartRef!: ElementRef;
  chart!: Chart;
  @ViewChild('chartContainer') private containerRef!: ElementRef<HTMLDivElement>;
;


  //numbByStatus!: {status: Status, number: number[]}[]
  
  constructor(
    private transactionService: TransactionService, 
    private tokenStorage: TokenStorageService, 
    private userServ: UserService, 
    private profilService: ProfilService,
    private entiteService: EntiteService,
    private router: Router,
    private datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder
    ) {
  }

  public ngOnInit(): void {

    if (this.tokenStorage.getToken() == null) {
      console.error("No token");
      this.router.navigate([''])

    }
  

    

    this.userId = this.tokenStorage.getUser();
    console.log(this.userId)
    this.userServ.getUserById(this.userId.id).subscribe(
      data => {
        this.user = data
        console.log(this.user)
        console.log(this.user.msisdn)
        this.chartOr1(this.user);
        this.getTransactions(this.user)

      }
    )
   
    this.getEntites()

    this.getDate()

  }

  getDate() {
    
    this.dateControl.valueChanges.subscribe((selectedDate: Date) => {
      console.log('Selected date: ', selectedDate);
      // You can do whatever you want with the selected date here
      this.dateSelect = selectedDate
      console.log(this.dateSelect)
     this.getEntiteAndDate()

    });
 
  }

  getEntiteAndDate() {

    console.log('Selected date:', this.dateSelect);
    console.log('Selected entite:', this.entiteName);

    if(this.dateSelect == null && this.entiteName != '') {
      this.entiteService.getEntiteByName(this.entiteName).subscribe (
        data => {
          let entite = data
        
           this.transactionService.getListStatusParAgence(entite.id).subscribe (
            data => {
              this.list1 = data
              this.listOfList = [this.list1]
              console.log(this.listOfList)
              console.log(Object.values(this.listOfList[0]))
    
              this.keysArray = Object.keys(this.listOfList[0]);
              this.valuesArray = Object.values(this.listOfList[0]);
              console.log(this.keysArray[0])
    
              this.data1 = {
                labels: this.keysArray,
                series: [this.valuesArray as Array<number>]
            };
    
              console.log(this.data1)
            
            }
          ) 
          this.transactionService.getTransactionsByEntite(entite?.id).subscribe(
            data => {
              this.transactions = data
              this.sommeTotale = 0
              this.transactionService.getSommeTotaleParAgence(entite.id).subscribe (
                data => {
                  this.sommeTotale = data
                  console.log(this.sommeTotale)
                  this.recette = (this.sommeTotale*99)/100
                }
               )
                let labels: Date[] = []
                let series: number[] = []
                this.transactions?.forEach(transaction => {
                  labels.push(transaction.date)
                  series.push(transaction.value)
                })
                this.data2 = {
                  labels: labels,
                  series: [series]
                }
                this.chart = new Chart(this.chartRef.nativeElement, {
                  type: 'line',
                  data: {
                    labels: labels,
                    datasets: [{
                      label: 'Transactions',
                      data: series,
                      borderColor: 'red',
                      fill: false
                    }]
                  },
                  options: {
                    scales: {
                      xAxes: [{
                        display: false
                      }]
                    },
                    tooltips: {
                      callbacks: {
                        label: (tooltipItem, data) => {
                          
                          const label = data.datasets && tooltipItem.datasetIndex != null && data.datasets[tooltipItem.datasetIndex]?.label || '';
                  const x = data.labels && tooltipItem.index != null && data.labels[tooltipItem.index];
                  const y = data.datasets && tooltipItem.datasetIndex != null && tooltipItem.index != null && data.datasets[tooltipItem.datasetIndex]?.data?.[tooltipItem.index] || null;
                  return `${x}, ${y}`+' XOF';
                        }
                      }
                    }
                  }
                });
                this.resizeChart();
              }
            
           
          )
        
  
        
        }
      )
    } else if(this.dateSelect != null && this.entiteName == '') {

      this.profilService.getProfilById(this.user.profil).subscribe(data => {
        console.log(data)
        this.profil = data.code;
        console.log(this.profil)
        if (this.profil == 'AD') {

      this.transactionService.getListStatusAndDay(this.datePipe.transform(this.dateSelect,'YYYY-MM-dd')).subscribe(
        data => {
          this.list1 = data
          this.listOfList = [this.list1]
          console.log(this.listOfList)
          console.log(Object.values(this.listOfList[0]))

          this.keysArray = Object.keys(this.listOfList[0]);
          this.valuesArray = Object.values(this.listOfList[0]);
          console.log(this.keysArray[0])

          this.data1 = {
            labels: this.keysArray,
            series: [this.valuesArray as Array<number>]
        };

          console.log(this.data1)
        }
      )

      this.transactionService.getTransactionsByDay(this.datePipe.transform(this.dateSelect,'YYYY-MM-dd')).subscribe(
        data => {
          this.transactions = data
          this.sommeTotale = 0
          this.transactionService.getSommeTotaleByDay(this.user.id, this.datePipe.transform(this.dateSelect,'YYYY-MM-dd')).subscribe (
            data => {
              this.sommeTotale = data
              console.log(this.sommeTotale)
              this.recette = (this.sommeTotale*99)/100
            }
           )
            let labels: Date[] = []
            let series: number[] = []
            this.transactions?.forEach(transaction => {
              labels.push(transaction.date)
              series.push(transaction.value)
            })
            this.data2 = {
              labels: labels,
              series: [series]
            }
            this.chart = new Chart(this.chartRef.nativeElement, {
              type: 'line',
              data: {
                labels: labels,
                datasets: [{
                  label: 'Transactions',
                  data: series,
                  borderColor: 'red',
                  fill: false
                }]
              },
              options: {
                scales: {
                  xAxes: [{
                    display: false
                  }]
                },
                tooltips: {
                  callbacks: {
                    label: (tooltipItem, data) => {
                      
                      const label = data.datasets && tooltipItem.datasetIndex != null && data.datasets[tooltipItem.datasetIndex]?.label || '';
              const x = data.labels && tooltipItem.index != null && data.labels[tooltipItem.index];
              const y = data.datasets && tooltipItem.datasetIndex != null && tooltipItem.index != null && data.datasets[tooltipItem.datasetIndex]?.data?.[tooltipItem.index] || null;
              return `${x}, ${y}`+' XOF';
                    }
                  }
                }
              }
            });
            this.resizeChart();
          }
        
       
      ) } else if(this.profil == 'CA') {

        this.transactionService.getListStatusAndAgenceAndDay(this.user.entite, this.datePipe.transform(this.dateSelect,'YYYY-MM-dd')).subscribe(
          data => {
            this.list1 = data
            this.listOfList = [this.list1]
            console.log(this.listOfList)
            console.log(Object.values(this.listOfList[0]))
  
            this.keysArray = Object.keys(this.listOfList[0]);
            this.valuesArray = Object.values(this.listOfList[0]);
            console.log(this.keysArray[0])
  
            this.data1 = {
              labels: this.keysArray,
              series: [this.valuesArray as Array<number>]
          };
  
            console.log(this.data1)
          }
        )
  
        this.transactionService.getTransactionsByEntiteAndDay(this.user.entite, this.datePipe.transform(this.dateSelect,'YYYY-MM-dd')).subscribe(
          data => {
            this.transactions = data
            this.sommeTotale = 0
            this.transactionService.getSommeTotaleByDay(this.user.id, this.datePipe.transform(this.dateSelect,'YYYY-MM-dd')).subscribe (
              data => {
                this.sommeTotale = data
                console.log(this.sommeTotale)
                this.recette = (this.sommeTotale*99)/100
              }
             )
              let labels: Date[] = []
              let series: number[] = []
              this.transactions?.forEach(transaction => {
                labels.push(transaction.date)
                series.push(transaction.value)
              })
              this.data2 = {
                labels: labels,
                series: [series]
              }
              this.chart = new Chart(this.chartRef.nativeElement, {
                type: 'line',
                data: {
                  labels: labels,
                  datasets: [{
                    label: 'Transactions',
                    data: series,
                    borderColor: 'red',
                    fill: false
                  }]
                },
                options: {
                  scales: {
                    xAxes: [{
                      display: false
                    }]
                  },
                  tooltips: {
                    callbacks: {
                      label: (tooltipItem, data) => {
                        
                        const label = data.datasets && tooltipItem.datasetIndex != null && data.datasets[tooltipItem.datasetIndex]?.label || '';
                const x = data.labels && tooltipItem.index != null && data.labels[tooltipItem.index];
                const y = data.datasets && tooltipItem.datasetIndex != null && tooltipItem.index != null && data.datasets[tooltipItem.datasetIndex]?.data?.[tooltipItem.index] || null;
                return `${x}, ${y}`+' XOF';
                      }
                    }
                  }
                }
              });
              this.resizeChart();
            }
          
        )
      } else if(this.profil == 'A') {
        this.transactionService.getListStatusParAgentAndDay(this.user.email, this.datePipe.transform(this.dateSelect,'YYYY-MM-dd')).subscribe(
          data => {
            this.list1 = data
            this.listOfList = [this.list1]
            console.log(this.listOfList)
            console.log(Object.values(this.listOfList[0]))
  
            this.keysArray = Object.keys(this.listOfList[0]);
            this.valuesArray = Object.values(this.listOfList[0]);
            console.log(this.keysArray[0])
  
            this.data1 = {
              labels: this.keysArray,
              series: [this.valuesArray as Array<number>]
          };
  
            console.log(this.data1)
          }
        )
  
        this.transactionService.getTransactionsByAgentAndDay(this.user.email, this.datePipe.transform(this.dateSelect,'YYYY-MM-dd')).subscribe(
          data => {
            this.transactions = data
            this.sommeTotale = 0
            this.transactionService.getSommeTotaleByDay(this.user.id, this.datePipe.transform(this.dateSelect,'YYYY-MM-dd')).subscribe (
              data => {
                this.sommeTotale = data
                console.log(this.sommeTotale)
                this.recette = (this.sommeTotale*99)/100
              }
             )
              let labels: Date[] = []
              let series: number[] = []
              this.transactions?.forEach(transaction => {
                labels.push(transaction.date)
                series.push(transaction.value)
              })
              this.data2 = {
                labels: labels,
                series: [series]
              }
              this.chart = new Chart(this.chartRef.nativeElement, {
                type: 'line',
                data: {
                  labels: labels,
                  datasets: [{
                    label: 'Transactions',
                    data: series,
                    borderColor: 'red',
                    fill: false
                  }]
                },
                options: {
                  scales: {
                    xAxes: [{
                      display: false
                    }]
                  },
                  tooltips: {
                    callbacks: {
                      label: (tooltipItem, data) => {
                        
                        const label = data.datasets && tooltipItem.datasetIndex != null && data.datasets[tooltipItem.datasetIndex]?.label || '';
                const x = data.labels && tooltipItem.index != null && data.labels[tooltipItem.index];
                const y = data.datasets && tooltipItem.datasetIndex != null && tooltipItem.index != null && data.datasets[tooltipItem.datasetIndex]?.data?.[tooltipItem.index] || null;
                return `${x}, ${y}`+' XOF';
                      }
                    }
                  }
                }
              });
              this.resizeChart();
            }
          
         
        )
      }

        })

      
      
    } else if(this.dateSelect != null && this.entiteName != '') {
      this.entiteService.getEntiteByName(this.entiteName).subscribe (
        data => {
          let entite = data
        
           this.transactionService.getListStatusAndAgenceAndDay(entite.id, this.datePipe.transform(this.dateSelect,'YYYY-MM-dd')).subscribe (
            data => {
              this.list1 = data
              this.listOfList = [this.list1]
              console.log(this.listOfList)
              console.log(Object.values(this.listOfList[0]))
    
              this.keysArray = Object.keys(this.listOfList[0]);
              this.valuesArray = Object.values(this.listOfList[0]);
              console.log(this.keysArray[0])
    
              this.data1 = {
                labels: this.keysArray,
                series: [this.valuesArray as Array<number>]
            };
    
              console.log(this.data1)
            
            }
          ) 
          this.transactionService.getTransactionsByEntiteAndDay(entite?.id, this.datePipe.transform(this.dateSelect,'YYYY-MM-dd')).subscribe(
            data => {
              this.transactions = data
              this.sommeTotale = 0
              this.transactionService.getSommeTotaleParAgenceByDay(entite.id, this.datePipe.transform(this.dateSelect,'YYYY-MM-dd')).subscribe (
                data => {
                  this.sommeTotale = data
                  console.log(this.sommeTotale)
                  this.recette = (this.sommeTotale*99)/100
                }
               )
                let labels: Date[] = []
                let series: number[] = []
                this.transactions?.forEach(transaction => {
                  labels.push(transaction.date)
                  series.push(transaction.value)
                })
                this.data2 = {
                  labels: labels,
                  series: [series]
                }
                this.chart = new Chart(this.chartRef.nativeElement, {
                  type: 'line',
                  data: {
                    labels: labels,
                    datasets: [{
                      label: 'Transactions',
                      data: series,
                      borderColor: 'red',
                      fill: false
                    }]
                  },
                  options: {
                    scales: {
                      xAxes: [{
                        display: false
                      }]
                    },
                    tooltips: {
                      callbacks: {
                        label: (tooltipItem, data) => {
                          
                          const label = data.datasets && tooltipItem.datasetIndex != null && data.datasets[tooltipItem.datasetIndex]?.label || '';
                  const x = data.labels && tooltipItem.index != null && data.labels[tooltipItem.index];
                  const y = data.datasets && tooltipItem.datasetIndex != null && tooltipItem.index != null && data.datasets[tooltipItem.datasetIndex]?.data?.[tooltipItem.index] || null;
                  return `${x}, ${y}`+' XOF';
                        }
                      }
                    }
                  }
                });
                this.resizeChart();
              }
            
           
          )
        
  
        
        }
      )
    }

  }

  getEntites() {
    this.entiteService.getAllEntites().subscribe(
      data => {
        this.entites = data
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''), map(value => this._filter(value || '')),
        )
      }
    )
  }

  private _filter(value: string): Entite[] {
    console.log(this.entites)
    const filterValue = value.toLowerCase();
//console.log("this datasource",   this.getTransactions(this.user1))
    return this.entites.filter(option => option.msisdn?.toLowerCase().includes(filterValue));
  }


chartOr1(user: User) {
  console.log("userrrrrr", this.user)
  this.profilService.getProfilById(this.user.profil).subscribe(data => {
    console.log(data)
    this.profil = data.code;
    console.log(this.profil)
    if (this.profil == 'AD') {
      this.transactionService.getListStatus().subscribe (
        data => {

          this.list1 = data
          this.listOfList = [this.list1]
          console.log(this.listOfList)
          console.log(Object.values(this.listOfList[0]))

          this.keysArray = Object.keys(this.listOfList[0]);
          this.valuesArray = Object.values(this.listOfList[0]);
          console.log(this.keysArray[0])

          this.data1 = {
            labels: this.keysArray,
            series: [this.valuesArray as Array<number>]
        };

          console.log(this.data1)
        }
      )
    
     
       
    } else if(this.profil == 'CA') {
      this.transactionService.getListStatusParAgence(this.user.entite).subscribe (
        data => {
          this.list1 = data
          this.listOfList = [this.list1]
          console.log(this.listOfList)
          console.log(Object.values(this.listOfList[0]))

          this.keysArray = Object.keys(this.listOfList[0]);
          this.valuesArray = Object.values(this.listOfList[0]);
          console.log(this.keysArray[0])

          this.data1 = {
            labels: this.keysArray,
            series: [this.valuesArray as Array<number>]
        };

          console.log(this.data1)
        
        }
      )
     
     }
    else {
      
      
          this.transactionService.getListStatusParAgent(this.user.email).subscribe (
            data => {
              this.list1 = data
              this.listOfList = [this.list1]
              console.log(this.listOfList)
              console.log(Object.values(this.listOfList[0]))
    
              this.keysArray = Object.keys(this.listOfList[0]);
              this.valuesArray = Object.values(this.listOfList[0]);
              console.log(this.keysArray[0])
    
              this.data1 = {
                labels: this.keysArray,
                series: [this.valuesArray as Array<number>]
            };
    
              console.log(this.data1)
            
            }
          )
    




} })

}

@HostListener('window:resize')
onResize() {
  this.resizeChart();
}

private resizeChart() {
  const container = this.containerRef.nativeElement;
  const canvas = this.chartRef.nativeElement;
  canvas.style.width = container.offsetWidth + 'px';
  canvas.style.height = '275px';
  console.log(canvas.style.width)
  console.log(canvas.style.height)
  this.chart.resize();
}



  getTransactions(user: User) {
    console.log("userrrrrr", this.user)
    this.profilService.getProfilById(this.user.profil).subscribe(data => {
      console.log(data)
      this.profil = data.code;
      console.log(this.profil)

      if (this.profil == 'AD') {

       

        this.transactionService.getAllTransactions().subscribe(
          data => {
            this.transactions = data;
            console.log(this.transactions)
           this.transactionService.getSommeTotale(this.userId.id).subscribe (
            data => {
              this.sommeTotale = data
              console.log(this.sommeTotale)
              this.recette = (this.sommeTotale*99)/100
            }
           )
          
            console.log("liistTransactons", this.transactions)
            let labels: Date[] = []
            let series: number[] = []
            this.transactions.forEach(transaction => {
              if (transaction.date != null && transaction.value != null) {
                let formatDate = this.pipe.transform(transaction.date, 'dd/MM/yy')
                labels.push(transaction.date)
                series.push(transaction.value)
              }

            })
            console.log("lables", labels)
            console.log("series", series)
            
            this.data2 = {
              labels: labels,
              series: [series]
            }

            this.chart = new Chart(this.chartRef.nativeElement, {
              type: 'line',
          
              data: {
                labels: labels,
                datasets: [{
                  label: 'Transactions',
                  data: series,
                  borderColor: 'red',
                  fill: false, 
                  
                }]
              },
              options: {
                
                scales: {
                  xAxes: [{
                    display: false
                  }]
                },
                tooltips: {
                  callbacks: {
                    label: (tooltipItem, data) => {
                      
                      const label = data.datasets && tooltipItem.datasetIndex != null && data.datasets[tooltipItem.datasetIndex]?.label || '';
              const x = data.labels && tooltipItem.index != null && data.labels[tooltipItem.index];
              const y = data.datasets && tooltipItem.datasetIndex != null && tooltipItem.index != null && data.datasets[tooltipItem.datasetIndex]?.data?.[tooltipItem.index] || null;
                return `${x}, ${y}`+' XOF';
                    }
                  }
                }
              }
            });
            this.resizeChart();
          }
        )
      } else if(this.profil == 'CA') {
        this.transactionService.getTransactionsByEntite(this.user.entite).subscribe (
          data => {
            this.transactions = data
            for(let i = 0; i<this.transactions.length; i++) {
              if(this.transactions[i].status == "SUCCESS") {
                this.sommeTotale += this.transactions[i].value
              }
             
              
            }
            this.recette = (this.sommeTotale*99)/100
            let labels: Date[] = []
            let series: number[] = []
            this.transactions.forEach(transaction => {
              if (transaction.date != null && transaction.value != null) {
                let formatDate = this.pipe.transform(transaction.date, 'dd/MM/yy')
                labels.push(transaction.date)
                series.push(transaction.value)
              }

            })
            this.data2 = {
              labels: labels,
              series: [series]
            }
            this.chart = new Chart(this.chartRef.nativeElement, {
              type: 'line',
              data: {
                labels: labels,
                datasets: [{
                  label: 'Transactions',
                  data: series,
                  borderColor: 'red',
                  fill: false
                }]
              },
              options: {
                scales: {
                  xAxes: [{
                    display: false
                  }]
                },
                tooltips: {
                  callbacks: {
                    label: (tooltipItem, data) => {
                      
                      const label = data.datasets && tooltipItem.datasetIndex != null && data.datasets[tooltipItem.datasetIndex]?.label || '';
              const x = data.labels && tooltipItem.index != null && data.labels[tooltipItem.index];
              const y = data.datasets && tooltipItem.datasetIndex != null && tooltipItem.index != null && data.datasets[tooltipItem.datasetIndex]?.data?.[tooltipItem.index] || null;
              return `${x}, ${y}`+' XOF';
                    }
                  }
                }
              }
            });
            this.resizeChart();
          }
        )
      }
      
      else {
        this.userServ.getUserById(this.user.id).subscribe(
          data => {
            console.log("currentUser", data)
            this.user1 = data
            this.transactionService.getTransactionsByAgent(this.user1.email).subscribe(
              data => {
                this.transactions = data;
                console.log(this.transactions)
                this.transactionService.getSommeTotale(this.userId.id).subscribe (
                  data => {
                    this.sommeTotale = data
                    console.log(this.sommeTotale)
                    this.recette = (this.sommeTotale*99)/100
                  }
                 )
                let labels: Date[] = []
                let series: number[] = []
                this.transactions.forEach(transaction => {
                  labels.push(transaction.date)
                  series.push(transaction.value)
                })
                this.data2 = {
                  labels: labels,
                  series: [series]
                }

                this.chart = new Chart(this.chartRef.nativeElement, {
                  type: 'line',
                  data: {
                    labels: labels,
                    datasets: [{
                      label: 'Transactions',
                      data: series,
                      borderColor: 'red',
                      fill: false
                    }]
                  },
                  options: {
                    scales: {
                      xAxes: [{
                        display: false
                      }]
                    },
                    tooltips: {
                      callbacks: {
                        label: (tooltipItem, data) => {
                          
                          const label = data.datasets && tooltipItem.datasetIndex != null && data.datasets[tooltipItem.datasetIndex]?.label || '';
                  const x = data.labels && tooltipItem.index != null && data.labels[tooltipItem.index];
                  const y = data.datasets && tooltipItem.datasetIndex != null && tooltipItem.index != null && data.datasets[tooltipItem.datasetIndex]?.data?.[tooltipItem.index] || null;
                  return `${x}, ${y}`+' XOF';
                        }
                      }
                    }
                  }
                });
                this.resizeChart();
              }
            )
          })
      }


    })



  }


  type1: ChartType = 'Line';




  type: ChartType = 'Bar';


  options: IBarChartOptions = {
    axisX: {
      showGrid: false
    },
    axisY: {
      onlyInteger: true
    },
    height: 300
  };

  optionsLine: Chartist.ILineChartOptions = {
    axisX: {
      showLabel: false,
    }, height: 300
  }


  events: ChartEvent = {
    draw: (data1) => {
      if (data1.type === 'bar') {
        data1.element.animate({
          y2: <IChartistAnimationOptions>{
            dur: '0.5s',
            from: data1.y1,
            to: data1.y2,
            easing: 'easeOutQuad'
          }
        });
      }
    }
  };

  getNameChoisi(event: any) {
    console.log(event)
    this.entiteName = event.option.value
    console.log(this.entiteName)
    this.getEntiteAndDate()
   

    
  }





  @Input()
  control!: FormControl;


}

