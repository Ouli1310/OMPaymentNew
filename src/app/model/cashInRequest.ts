import { Customer, Money, Partner } from "./transactionRequest";

export class CashInRequest {
    partner!: Partner;
    customer!: Customer;
    amount!: Money;
    reference!: string;
    receiveNotification!: boolean;
}