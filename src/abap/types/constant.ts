import {Type} from "./type";

export class Constant {
  private name: string;
  private type: Type;

  constructor() {
    this.name = undefined;
    this.type = undefined;
  }

  public getName() {
    return this.name;
  }

  public getType() {
    return this.type;
  }
}