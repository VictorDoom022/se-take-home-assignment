import { Component } from '@angular/core';
import { Order } from '../../models/order';
import { Bot } from '../../models/bot';
import { OrderType } from '../../enums/order-type';
import { OrderStatus } from '../../enums/order-status';
import { BotStatus } from '../../enums/bot-status';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  currentOrderIDCount: number = 0;
  currentOrderList: Order[] = [];

  botList: Bot[] = [];
  botIDCount: number = 0;

  constructor() { }

  addNormalOrder() {
    this.currentOrderList.push(
      new Order({
        id: this.currentOrderIDCount += 1,
        type: OrderType.NORMAL,
        status: OrderStatus.PENDING,
        createDate: new Date()
      })
    );
    this.assignBotToOrder();
  }

  addVipOrder() {
    let vipOrder = new Order({
      id: this.currentOrderIDCount += 1,
      type: OrderType.VIP,
      status: OrderStatus.PENDING,
      createDate: new Date()
    });

    let firstNormalOrder: number = this.currentOrderList.findIndex((element) => element.type == OrderType.NORMAL);

    if (firstNormalOrder != -1) {
      this.currentOrderList.splice(firstNormalOrder, 0, vipOrder);
    } else {
      this.currentOrderList.push(vipOrder);
    }
    this.assignBotToOrder();
  }

  addNewBot() {
    this.botList.push(
      new Bot({
        id: this.botIDCount += 1,
        status: BotStatus.INACTIVE,
        createDate: new Date()
      })
    );
    this.assignBotToOrder();
  }

  removeBot() {
    if(this.botList.length == 0) return;
    let botToRemove: Bot | undefined = this.botList.pop();

    if (!botToRemove) return;

    let effectedOrder: Order | undefined = this.currentOrderList.find(
      (element) => element.id == botToRemove.currentOrderID
    );

    if(!effectedOrder) return;
    // TODO: Check if the effected order state after bot is removed. 
  }

  assignBotToOrder() {
    let inactiveBot: Bot | undefined = this.botList.find(
      (element) => element.status == BotStatus.INACTIVE
    );
    let latestPendingOrder: Order | undefined = this.currentOrderList.find(
      (element) => element.status == OrderStatus.PENDING
    );

    console.log(inactiveBot);
    console.log(latestPendingOrder);
    
    if (!inactiveBot || !latestPendingOrder) return;

    console.log('running');
    
    inactiveBot.status == BotStatus.ACTIVE;
    inactiveBot.currentOrderID = latestPendingOrder.id;

    setTimeout(() => {
      latestPendingOrder.status = OrderStatus.COMPLETE;
      inactiveBot.status = BotStatus.INACTIVE;
      inactiveBot.currentOrderID = undefined;

      this.assignBotToOrder();
      console.log('bot order complete');
      
    }, 10000);
  }

}
