import { BotStatus } from "../enums/bot-status";

export class Bot {
    id?: number;
    status?: BotStatus;
    createDate?: Date;

    public constructor(init?: Partial<Bot>){
        Object.assign(this, init);
    }
}