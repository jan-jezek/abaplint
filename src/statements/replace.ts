import { Statement } from "./statement";
import * as Combi from "../combi";
import * as Reuse from "./reuse";

let str = Combi.str;
let seq = Combi.seq;
let alt = Combi.alt;
let opt = Combi.opt;

export class Replace extends Statement {

  public static get_matcher(): Combi.IRunnable {
    let option = alt(str("ALL OCCURRENCES"), str("FIRST OCCURRENCE"));

    return seq(str("REPLACE"),
               opt(option),
               opt(str("OF")),
               opt(str("REGEX")),
               new Reuse.Source(),
               opt(seq(str("IN"), new Reuse.Target())),
               str("WITH"),
               new Reuse.Source(),
               opt(seq(str("INTO"), new Reuse.Target())),
               opt(str("IGNORING CASE")));
  }

}