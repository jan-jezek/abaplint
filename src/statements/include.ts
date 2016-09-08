import { Statement } from "./statement";
import * as Combi from "../combi";
import * as Reuse from "./reuse";

let str  = Combi.str;
let seq  = Combi.seq;

export class Include extends Statement {
  public static get_matcher(): Combi.IRunnable {
    return seq(str("INCLUDE"), new Reuse.Field());
  }
}