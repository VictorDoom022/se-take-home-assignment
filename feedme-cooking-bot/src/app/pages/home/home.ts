import { Component } from '@angular/core';
import { Order } from '../../models/order';
import { Bot } from '../../models/bot';
import { OrderType } from '../../enums/order-type';
import { OrderStatus } from '../../enums/order-status';

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
  }

}
