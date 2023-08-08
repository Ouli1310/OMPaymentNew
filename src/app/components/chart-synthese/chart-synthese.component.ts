import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { throws } from 'assert';
import { sum } from 'chartist';
import { Transaction } from 'src/app/model/transactionRequest';
import { Entite, Profil, User } from 'src/app/model/user';
import { ProfilService } from 'src/app/service/profil.service';
import { TokenStorageService } from 'src/app/service/token-storage.service';
import { TransactionService } from 'src/app/service/transaction.service';
import { UserService } from 'src/app/service/user.service';
import { MomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';


export const MY_DATE_FORMATS = {
    parse: {
      dateInput: 'DD-MM-YYYY',
    },
    display: {
      dateInput: 'DD-MM-YYYY',
      //monthYearLabel: 'MMMM YYYY',
      //dateA11yLabel: 'LL',
      //monthYearA11yLabel: 'MMMM YYYY'
    },
};

export interface data5 {
	[key: string]: any;
}


@Component({
  selector: 'app-chart-synthese',
  templateUrl: './chart-synthese.component.html',
  styleUrls: ['./chart-synthese.component.css'],
  providers: [
	{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
	CurrencyPipe
  ]
})




export class ChartSyntheseComponent implements OnInit {

  range!: FormGroup;
  profil: Profil = new Profil();
  transactionEntite1!: Transaction[];
  transactionEntite2!: Transaction[];
  transactionEntite: Transaction[] = [];
  userId!: any;
  user!: User;
  options1!: data5;
  entitePercent1!: string;
  entitePercent2!: string;
  entitePercent!: number;
  percentage: any[] = []
  sumValue: number = 0;
  sumValue1!: number;
  sumValue2!: number;
  somme: any [] = []
  sommeTotale: number = 0
  pipe = new DatePipe('en-US');
  range2: any;
  transactions: Transaction[] = []
  startDate!: Date
  endDate!: Date
  entites: Entite[] = []
  list: any[] = []
  names: any[] = []
  listOfList: any[] = []
  constructor(
	private userService: UserService, 
	private profilService: ProfilService, 
	private transactionService: TransactionService,
	private tokenStorage: TokenStorageService,
	private datePipe: DatePipe,
	private currencyPipe: CurrencyPipe,
	private router: Router
	) { 
		
	}

  ngOnInit(): void {

	if (this.tokenStorage.getToken() == null) {
		console.error("No token");
		this.router.navigate([''])
  
	  }

	this.range = new FormGroup({
		start: new FormControl<Date | null>(null),
		end: new FormControl<Date | null>(null),
	  });

	this.userId = this.tokenStorage.getUser();
    console.log(this.userId)
    this.userService.getUserById(this.userId.id).subscribe(
      data => {
        this.user = data
        console.log(this.user)
        console.log(this.user.msisdn)
		this.getTransactionsByEntite(this.user)
      }
    )
  }

  get start() {
    return this.range.get('start');
  }

  
  get end() {
    return this.range.get('end');
  }

  get f() {
    return this.range.controls;
  }
 /** dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement)
  {
	console.log(dateRangeStart.valueAsDate);
	console.log(dateRangeEnd.valueAsDate);
	this.transactionService.getTransactionBetween2Dates(dateRangeStart.valueAsDate, dateRangeEnd.valueAsDate).subscribe(
			data => {
				this.transactions = data
				console.log(this.transactions)
			}
		)
	  }  */


	  onSubmit() {
		console.log(this.f['start'].value)
		this.startDate = this.f['start'].value._d
		console.log("START", this.startDate)
		console.log(this.datePipe.transform(this.startDate,'YYYY-MM-dd'));
		
		
		this.endDate = this.f['end'].value?._d
		console.log("END", this.endDate)
		console.log(this.datePipe.transform(this.endDate,'YYYY-MM-dd'));

		
		if(this.endDate == null) {

			this.transactionService.getSommeTotaleByDay(this.userId.id, this.datePipe.transform(this.startDate,'YYYY-MM-dd')).subscribe(
				data => {
					console.log(data)
					this.sommeTotale = data

					this.transactionService.getListSommesPerDay(this.datePipe.transform(this.startDate,'YYYY-MM-dd')).subscribe (
						data => {
							this.somme = data
							console.log(this.somme)
							this.percentage = []
							for(let i = 0; i<this.somme.length; i++) {
								this.percentage.push(((this.somme[i]*100)/this.sommeTotale).toPrecision(3))
							}
							console.log(this.somme)
							console.log(this.percentage)

							this.transactionService.getAllEntite().subscribe (
								data => {
									this.entites = data
									let names: any [] = []
											this.entites.forEach((d) => {
												names.push(
												 d.name
												
											   );
											 });
											 console.log(names)
			
							
											this.transactionService.getListTransactionsAgencesPerDay(this.datePipe.transform(this.startDate,'YYYY-MM-dd')).subscribe(
												data => {
													this.list = data
													console.log(this.list)

													
											 let colors = ["#058dc7", "#50b432",  ]
										
											 this.options1 = {
											 
												 "PART DE MARCHE PAR AGENCE": [{
												   type: "pie",
												   name: "PART DE MARCHE PAR AGENCE",
												   startAngle: 90,
												   cursor: "pointer",
												   explodeOnClick: false,
												   showInLegend: true,
												   legendMarkerType: "square",
												   click: this.visitorsChartDrilldownHandler,
												   indexLabelPlacement: "outside",
												   indexLabelFontColor: "black",
												   dataPoints: [
													 { y: this.somme[0], name: names[0], color: colors[0], indexLabel: this.percentage[0] + "%"},
													 { y: this.somme[1], name: names[1], color: colors[1], indexLabel: this.percentage[1] + "%"},
													 { y: this.somme[2], name: names[2], color: colors[2], indexLabel: this.percentage[2] + "%"},
													 { y: this.somme[3], name: names[3], color: colors[3], indexLabel: this.percentage[3] + "%"},
													 { y: this.somme[4], name: names[4], color: colors[4], indexLabel: this.percentage[4] + "%"},
													 { y: this.somme[5], name: names[5], color: colors[5], indexLabel: this.percentage[5] + "%"},
													 { y: this.somme[6], name: names[6], color: colors[6], indexLabel: this.percentage[6] + "%"},
													 { y: this.somme[7], name: names[7], color: colors[7], indexLabel: this.percentage[7] + "%"},
						  
												   ]
												 }],
						  
												 "Agence 1": [{
													 color: "#058dc7",
													 name: names[0],
													 type: "column",
													 dataPoints: this.list[0]
													 
														 
												 }],
						  
												 "Agence 2": [{
													 color: "#50b432",
													 name: names[1],
													 type: "column",
													 dataPoints: this.list[1]
													 
														 
												 }],
						  
												 "HEAD": [{
													 color: "#50b432",
													 name: names[2],
													 type: "column",
													 dataPoints: this.list[2]
													 
														 
												 }],
						  
												 "CALL CENTER": [{
													 color: "#50b432",
													 name: names[3],
													 type: "column",
													 dataPoints: this.list[3]
													 
														 
												 }],
						  
												 "CTO": [{
													 color: "#50b432",
													 name: names[4],
													 type: "column",
													 dataPoints: this.list[4]
													 
														 
												 }],
						  
												 "ZIG": [{
													 color: "#50b432",
													 name: names[5],
													 type: "column",
													 dataPoints: this.list[5]
													 
														 
												 }],
						  
												 "ATO": [{
													 color: "#50b432",
													 name: names[6],
													 type: "column",
													 dataPoints: this.list[6]
													 
														 
												 }],
						  
												 "FrequentFlyers": [{
													 color: "#50b432",
													 name: names[7],
													 type: "column",
													 dataPoints: this.list[7]
													 
														 
												 }],
												 
											   };
											   
											   this.chart.options.data = this.options1["PART DE MARCHE PAR AGENCE"];
											   this.chart.render();
												}
											 )
							
										
							 
											 
													
									
								}
							)
			
						}
					 )

				}
			)

			

			
			
				
				
		} else {

			this.transactionService.getSommeTotaleBetweenDates(this.userId.id, this.datePipe.transform(this.startDate,'YYYY-MM-dd'), this.datePipe.transform(this.endDate,'YYYY-MM-dd')).subscribe(
				data => {
					console.log(data)
					this.sommeTotale = data

					this.transactionService.getListSommesBetweenDates(this.datePipe.transform(this.startDate,'YYYY-MM-dd'), this.datePipe.transform(this.endDate,'YYYY-MM-dd')).subscribe (
						data => {
							this.somme = data
							console.log(this.somme)
							this.percentage = []
							for(let i = 0; i<this.somme.length; i++) {
								this.percentage.push(((this.somme[i]*100)/this.sommeTotale).toPrecision(3))
							}
							console.log(this.somme)
							console.log(this.percentage)

							this.transactionService.getAllEntite().subscribe (
								data => {
									this.entites = data
									let names: any [] = []
											this.entites.forEach((d) => {
												names.push(
												 d.name
												
											   );
											 });
											 console.log(names)
			
							
											this.transactionService.getListTransactionsAgencesBetweenDates(this.datePipe.transform(this.startDate,'YYYY-MM-dd'), this.datePipe.transform(this.endDate,'YYYY-MM-dd')).subscribe(
												data => {
													this.list = data
													console.log(this.list)

													let colors = ["#058dc7", "#50b432",  ]
										
													this.options1 = {
													
														"PART DE MARCHE PAR AGENCE": [{
														  type: "pie",
														  name: "PART DE MARCHE PAR AGENCE",
														  startAngle: 90,
														  cursor: "pointer",
														  explodeOnClick: false,
														  showInLegend: true,
														  legendMarkerType: "square",
														  click: this.visitorsChartDrilldownHandler,
														  indexLabelPlacement: "outside",
														  indexLabelFontColor: "black",
														  dataPoints: [
															{ y: this.somme[0], name: names[0], color: colors[0], indexLabel: this.percentage[0] + "%"},
															{ y: this.somme[1], name: names[1], color: colors[1], indexLabel: this.percentage[1] + "%"},
															{ y: this.somme[2], name: names[2], color: colors[2], indexLabel: this.percentage[2] + "%"},
															{ y: this.somme[3], name: names[3], color: colors[3], indexLabel: this.percentage[3] + "%"},
															{ y: this.somme[4], name: names[4], color: colors[4], indexLabel: this.percentage[4] + "%"},
															{ y: this.somme[5], name: names[5], color: colors[5], indexLabel: this.percentage[5] + "%"},
															{ y: this.somme[6], name: names[6], color: colors[6], indexLabel: this.percentage[6] + "%"},
															{ y: this.somme[7], name: names[7], color: colors[7], indexLabel: this.percentage[7] + "%"},
								 
														  ]
														}],
								 
														"Agence 1": [{
															color: "#058dc7",
															name: names[0],
															type: "column",
															dataPoints: this.list[0]
															
																
														}],
								 
														"Agence 2": [{
															color: "#50b432",
															name: names[1],
															type: "column",
															dataPoints: this.list[1]
															
																
														}],
								 
														"HEAD": [{
															color: "#50b432",
															name: names[2],
															type: "column",
															dataPoints: this.list[2]
															
																
														}],
								 
														"CALL CENTER": [{
															color: "#50b432",
															name: names[3],
															type: "column",
															dataPoints: this.list[3]
															
																
														}],
								 
														"CTO": [{
															color: "#50b432",
															name: names[4],
															type: "column",
															dataPoints: this.list[4]
															
																
														}],
								 
														"ZIG": [{
															color: "#50b432",
															name: names[5],
															type: "column",
															dataPoints: this.list[5]
															
																
														}],
								 
														"ATO": [{
															color: "#50b432",
															name: names[6],
															type: "column",
															dataPoints: this.list[6]
															
																
														}],
								 
														"FrequentFlyers": [{
															color: "#50b432",
															name: names[7],
															type: "column",
															dataPoints: this.list[7]
															
																
														}],
														
													  };
													  
													  this.chart.options.data = this.options1["PART DE MARCHE PAR AGENCE"];
													  this.chart.render();
												}
											 )
							
										
							 
										
											 
													
									
								}
							)
			
						}
					 )

				}
			)

			

			
		}
	  }
	  
 
  getTransactionsByEntite(user: User) {
 	console.log("userrrrrr", user)
    this.profilService.getProfilById(user.profil).subscribe(
		data => {
		console.log(data)
		this.profil = data.code;
		console.log(this.profil) 
				})

  }

  
  chart: any;
	isButtonVisible = false;
 
	visitorsChartDrilldownHandler = (e: any) => {
		this.chart.options = this.visitorsDrilldownedChartOptions;	
		this.chart.options.data = this.options1[e.dataPoint.name];
		this.chart.options.title = { text: e.dataPoint.name }
		//this.chart.options.title = this.options1[e.name];
		this.chart.render();
		this.isButtonVisible = true;
	}
 
	visitorsDrilldownedChartOptions = {
		animationEnabled: true,
		theme: "light2",
		axisY: {
			gridThickness: 0,
			lineThickness: 1
		},
		data: []
		
	};
 
	newVSReturningVisitorsOptions = {
		animationEnabled: true,
		theme: "light2",
		title: {
			text: "PART DE MARCHE PAR AGENCE"
		},
		subtitles: [{
			backgroundColor: "#2eacd1",
			fontSize: 16,
			fontColor: "white",
			padding: 5
		}],
		data: []
	};
 
	handleClick(event: Event) { 
		this.chart.options = this.newVSReturningVisitorsOptions;
		this.chart.options.data = this.options1["PART DE MARCHE PAR AGENCE"];
		this.chart.render(); 
		this.isButtonVisible = false;
	  } 	
	 
/**getChartInstance(chart: object) {
		
	
		 
		
		this.transactionService.getAllTransactions().subscribe (
			data => {
				this.transactions = data
				console.log(this.transactions)
				this.transactionService.getSommeTotale(this.userId.id).subscribe(
					data => {
						console.log(data)
						this.sommeTotale = data
					}
				)
				console.log(this.sommeTotale)
				this.transactionService.getAllEntite().subscribe( 
					data => {
						this.entites = data
						console.log(this.entites)
						console.log(this.entites.length)
						for(let i = 1; i<=this.entites.length; i++) {
							this.transactionService.getTransactionsByEntite(i).subscribe(
								data => {
									console.log(data)
									this.transactionEntite = data
									console.log("TRANSACTION ENTITE1", this.transactionEntite)
									console.log("TRANSACTION ENTITE1 LENGTH", this.transactionEntite.length)
									
									

									this.sumValue = 0
									this.entitePercent = 0
						
						let nombreEnFrancs = this.currencyPipe.transform(this.sumValue, 'frs', 'symbol', '1.2-2', 'fr-FR');
						
					
						this.somme.push(this.sumValue)
						console.log(this.somme)
						this.percentage.push(this.entitePercent.toPrecision(3))
						console.log(this.percentage)
					
						 let listDate: { label: any, y: number; }[] = [];
						 for(let i = 0; i<this.transactionEntite.length; i++) {
							
							listDate.push({label: this.datePipe.transform(this.transactionEntite[i].date,'dd-MM-YYYY'), y: this.transactionEntite[i].value})
							console.log("LIST", listDate);
							console.log("LIST", listDate.length);

							
						}
						this.list.push(listDate)
							console.log(this.list);

					
										
										
						let names: string[] = []
						this.entites.forEach(function(d) {
							names.push(
							 d.name
							
						   );
						 });
						 console.log(names)
						 this.chart = chart;
						 this.chart.options = this.newVSReturningVisitorsOptions;

						 let colors = ["#058dc7", "#50b432",  ]
					
							this.options1 = {
							
								"PART DE MARCHE PAR AGENCE": [{
								  type: "pie",
								  name: "PART DE MARCHE PAR AGENCE",
								  startAngle: 90,
								  cursor: "pointer",
								  explodeOnClick: false,
								  showInLegend: true,
								  legendMarkerType: "square",
								  click: this.visitorsChartDrilldownHandler,
								  indexLabelPlacement: "outside",
								  indexLabelFontColor: "black",
								  dataPoints: [
									{ y: this.somme[0], name: names[0], color: colors[0], indexLabel: this.percentage[0] + "%"},
									{ y: this.somme[1], name: names[1], color: colors[1], indexLabel: this.percentage[1] + "%"},
									{ y: this.somme[2], name: names[2], color: colors[2], indexLabel: this.percentage[2] + "%"},
									{ y: this.somme[3], name: names[3], color: colors[3], indexLabel: this.percentage[3] + "%"},
									{ y: this.somme[4], name: names[4], color: colors[4], indexLabel: this.percentage[4] + "%"},
									{ y: this.somme[5], name: names[5], color: colors[5], indexLabel: this.percentage[5] + "%"},
									{ y: this.somme[6], name: names[6], color: colors[6], indexLabel: this.percentage[6] + "%"},
									{ y: this.somme[7], name: names[7], color: colors[7], indexLabel: this.percentage[7] + "%"},

								  ]
								}],
	
								"Agence 1": [{
									color: "#058dc7",
									name: names[0],
									type: "column",
									dataPoints: this.list[0]
									
										
								}],

								"Agence 2": [{
									color: "#50b432",
									name: names[1],
									type: "column",
									dataPoints: this.list[1]
									
										
								}],

								"HEAD": [{
									color: "#50b432",
									name: names[2],
									type: "column",
									dataPoints: this.list[2]
									
										
								}],

								"CALL CENTER": [{
									color: "#50b432",
									name: names[3],
									type: "column",
									dataPoints: this.list[3]
									
										
								}],

								"CTO": [{
									color: "#50b432",
									name: names[4],
									type: "column",
									dataPoints: this.list[4]
									
										
								}],

								"ZIG": [{
									color: "#50b432",
									name: names[5],
									type: "column",
									dataPoints: this.list[5]
									
										
								}],

								"ATO": [{
									color: "#50b432",
									name: names[6],
									type: "column",
									dataPoints: this.list[6]
									
										
								}],

								"FrequentFlyers": [{
									color: "#50b432",
									name: names[7],
									type: "column",
									dataPoints: this.list[7]
									
										
								}],
								
							  };
							  
							  this.chart.options.data = this.options1["PART DE MARCHE PAR AGENCE"];
							  this.chart.render();
						 
						
				
									
					})
					}
									
									
								
									
									 
									 
						
									
							})
				
			} )
			}  
 */	
			getChartInstance(chart: object) {
		
				this.transactionService.getSommeTotale(this.userId.id).subscribe(
					data => {
						console.log(data)
						this.sommeTotale = data

						this.transactionService.getListSommes().subscribe (
							data => {
								this.somme = data
								console.log(this.somme)
								for(let i = 0; i<this.somme.length; i++) {
									this.percentage.push(((this.somme[i]*100)/this.sommeTotale).toPrecision(3))
								}
								console.log(this.somme)
								console.log(this.percentage)

								this.transactionService.getAllEntite().subscribe (
									data => {
										this.entites = data
										let names: any [] = []
												this.entites.forEach((d) => {
													names.push(
													 d.name
													
												   );
												 });
												 console.log(names)
				
								
												this.transactionService.getListTransactionsAgences().subscribe(
													data => {
														this.list = data
														console.log(this.list)

														this.chart = chart;
														this.chart.options = this.newVSReturningVisitorsOptions;
										
														let colors = ["#058dc7", "#50b432",  ]
												   
														   this.options1 = {
														   
															   "PART DE MARCHE PAR AGENCE": [{
																 type: "pie",
																 name: "PART DE MARCHE PAR AGENCE",
																 startAngle: 90,
																 cursor: "pointer",
																 explodeOnClick: false,
																 showInLegend: true,
																 legendMarkerType: "square",
																 click: this.visitorsChartDrilldownHandler,
																 indexLabelPlacement: "outside",
																 indexLabelFontColor: "black",
																 dataPoints: [
																   { y: this.somme[0], name: names[0], color: colors[0], indexLabel: this.percentage[0] + "%"},
																   { y: this.somme[1], name: names[1], color: colors[1], indexLabel: this.percentage[1] + "%"},
																   { y: this.somme[2], name: names[2], color: colors[2], indexLabel: this.percentage[2] + "%"},
																   { y: this.somme[3], name: names[3], color: colors[3], indexLabel: this.percentage[3] + "%"},
																   { y: this.somme[4], name: names[4], color: colors[4], indexLabel: this.percentage[4] + "%"},
																   { y: this.somme[5], name: names[5], color: colors[5], indexLabel: this.percentage[5] + "%"},
																   { y: this.somme[6], name: names[6], color: colors[6], indexLabel: this.percentage[6] + "%"},
																   { y: this.somme[7], name: names[7], color: colors[7], indexLabel: this.percentage[7] + "%"},
										
																 ]
															   }],
										
															   "Agence 1": [{
																   color: "#058dc7",
																   name: names[0],
																   type: "column",
																   dataPoints: this.list[0]
																   
																	   
															   }],
										
															   "Agence 2": [{
																   color: "#50b432",
																   name: names[1],
																   type: "column",
																   dataPoints: this.list[1]
																   
																	   
															   }],
										
															   "HEAD": [{
																   color: "#50b432",
																   name: names[2],
																   type: "column",
																   dataPoints: this.list[2]
																   
																	   
															   }],
										
															   "CALL CENTER": [{
																   color: "#50b432",
																   name: names[3],
																   type: "column",
																   dataPoints: this.list[3]
																   
																	   
															   }],
										
															   "CTO": [{
																   color: "#50b432",
																   name: names[4],
																   type: "column",
																   dataPoints: this.list[4]
																   
																	   
															   }],
										
															   "ZIG": [{
																   color: "#50b432",
																   name: names[5],
																   type: "column",
																   dataPoints: this.list[5]
																   
																	   
															   }],
										
															   "ATO": [{
																   color: "#50b432",
																   name: names[6],
																   type: "column",
																   dataPoints: this.list[6]
																   
																	   
															   }],
										
															   "FrequentFlyers": [{
																   color: "#50b432",
																   name: names[7],
																   type: "column",
																   dataPoints: this.list[7]
																   
																	   
															   }],
															   
															 };
															 
															 this.chart.options.data = this.options1["PART DE MARCHE PAR AGENCE"];
															 this.chart.render();
														
															   
													}
												 )
								
											
				
											
										
									}
								)
				
							}
						 )

					}
				)

				

				
				

			
   

				

				
		 
		
				}
			}
								
							
							
						

				
					
		
		
		
			

	
		
	
