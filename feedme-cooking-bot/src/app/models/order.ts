import { OrderStatus } from "../enums/order-status";
import { OrderType } from "../enums/order-type";

export class Order {

    id?: number;
    type?: OrderType;
    status?: OrderStatus;
    createDate?: Date;

    public constructor(init?: Partial<Order>){
        Object.assign(this, init);
    }
}