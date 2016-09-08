import { Statement } from "./statement";
import * as Reuse from "./reuse";
import * as Combi from "../combi";

let str = Combi.str;
let seq = Combi.seq;
let alt = Combi.alt;
let opt = Combi.opt;
let reg = Combi.regex;
let plus = Combi.plus;

export class MethodDef extends Statement {

  public static get_matcher(): Combi.IRunnable {
    let field = reg(/^!?(\/\w+\/)?\w+$/);

    let type = alt(new Reuse.Type(), new Reuse.TypeTable());

    let fieldType = seq(field, type);
    let fieldsValue = seq(new Reuse.PassByValue(), type);
    let fieldsOrValue = seq(alt(new Reuse.PassByValue(), field), type);

    let importing  = seq(str("IMPORTING"),
                         plus(seq(fieldsOrValue, opt(str("OPTIONAL")))),
                         opt(seq(str("PREFERRED PARAMETER"), field)));

    let exporting  = seq(str("EXPORTING"),  plus(fieldsOrValue));
    let changing   = seq(str("CHANGING"),   plus(seq(fieldType, opt(str("OPTIONAL")))));
    let returning  = seq(str("RETURNING"),  plus(fieldsValue));
    let raising    = seq(str("RAISING"),    plus(new Reuse.ClassName()));
    let exceptions = seq(str("EXCEPTIONS"), plus(reg(/^\w+?$/)));

    let parameters = seq(opt(alt(str("ABSTRACT"), str("FINAL"), str("FOR TESTING"))),
                         opt(importing),
                         opt(exporting),
                         opt(changing),
                         opt(returning),
                         opt(alt(raising, exceptions)));

    let event = seq(str("FOR EVENT"),
                    new Reuse.Field(),
                    str("OF"),
                    new Reuse.Field(),
                    opt(seq(str("IMPORTING"), plus(field))));

    let ret = seq(alt(str("CLASS-METHODS"), str("METHODS")),
                  new Reuse.Field(),
                  alt(event, parameters, str("REDEFINITION")));

    return ret;
  }

}