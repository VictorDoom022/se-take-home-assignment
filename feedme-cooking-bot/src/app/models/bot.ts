import { BotStatus } from "../enums/bot-status";

export class Bot {
    id?: number;
    status?: BotStatus;
    currentOrderID?: number;
    createDate?: Date;

    public constructor(init?: Partial<Bot>){
        Object.assign(this, init);
    }
}