import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Bot } from '../models/bot';
import { Order } from '../models/order';
import { OrderStatus } from '../enums/order-status';
import { OrderType } from '../enums/order-type';
import { BotStatus } from '../enums/bot-status';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  orderList$: Observable<Order[]> = new Observable<Order[]>();
  botList$: Observable<Bot[]> = new Observable<Bot[]>();

  private orderListChange: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);
  private botListChange: BehaviorSubject<Bot[]> = new BehaviorSubject<Bot[]>([]);

  private orderIDCount: number = 0;
  private botIDCount: number = 0;

  constructor() {
    this.orderList$ = this.orderListChange.asObservable();
    this.botList$ = this.botListChange.asObservable();
  }

  addNormalOrder() {
    let newOrder: Order = new Order({
      id: this.orderIDCount += 1,
      type: OrderType.NORMAL,
      status: OrderStatus.PENDING,
      createDate: new Date()
    });

    let currentOrderList: Order[] = this.orderListChange.getValue();
    currentOrderList.push(newOrder);
    this.orderListChange.next(currentOrderList);
    this.assignBotToOrder();
  }

  addVipOrder() {
    let vipOrder: Order = new Order({
      id: this.orderIDCount += 1,
      type: OrderType.VIP,
      status: OrderStatus.PENDING,
      createDate: new Date()
    });

    let firstNormalOrder: number = this.orderListChange.getValue().findIndex(
      (element) => element.type == OrderType.NORMAL
    );
    let currentOrderList: Order[] = this.orderListChange.getValue();

    if(firstNormalOrder != -1) {
      currentOrderList.splice(firstNormalOrder, 0, vipOrder);
    } else {
      currentOrderList.push(vipOrder);
    }

    this.orderListChange.next(currentOrderList);
    this.assignBotToOrder();
  }

  addNewBot() {
    let newBot: Bot = new Bot({
      id: this.botIDCount += 1,
      status: BotStatus.INACTIVE,
      createDate: new Date()
    });

    let currentBotList: Bot[] = this.botListChange.getValue();
    currentBotList.push(newBot);
    this.botListChange.next(currentBotList);

    this.assignBotToOrder();
  }

  removeBot() {
    let currentBotList: Bot[] = this.botListChange.getValue();
    let botToRemove: Bot | undefined = currentBotList.pop();

    this.botListChange.next(currentBotList);
  }

  assignBotToOrder() {
    let allCurrentBot: Bot[] = this.botListChange.getValue();
    let allCurrentOrder: Order[] = this.orderListChange.getValue();

    let inactiveBot: Bot | undefined = allCurrentBot.find(
      (element) => element.status == BotStatus.INACTIVE
    );
    let latestPendingOrder: Order | undefined = allCurrentOrder.find(
      (element) => element.status == OrderStatus.PENDING
    );

    console.log('inactiveBot', inactiveBot);
    console.log('latestPendingOrder', latestPendingOrder);

    if (!inactiveBot || !latestPendingOrder) return;

    inactiveBot.status = BotStatus.ACTIVE;
    inactiveBot.currentOrderID = latestPendingOrder.id;
    this.botListChange.next(allCurrentBot);

    latestPendingOrder.status = OrderStatus.PREPARING;
    this.orderListChange.next(allCurrentOrder);

    setTimeout(() => {
      console.log('cooking...');
      
      let latestBotList: Bot[] = this.botListChange.getValue();
      let latestOrderList: Order[] = this.orderListChange.getValue();

      let botToUpdate: Bot | undefined = latestBotList.find(
        (element) => element.id == inactiveBot.id
      );
      let orderToUpdate: Order | undefined = latestOrderList.find(
        (element) => element.id == inactiveBot.currentOrderID
      );

      if(botToUpdate) {
        botToUpdate.status = BotStatus.INACTIVE;
        botToUpdate.currentOrderID = undefined;
        this.botListChange.next(latestBotList);
      }

      if(orderToUpdate) {
        orderToUpdate.status = OrderStatus.COMPLETE;
        this.orderListChange.next(latestOrderList);
      }

      this.assignBotToOrder();
      console.log('bot order complete');
    }, 10000)
  }
}
