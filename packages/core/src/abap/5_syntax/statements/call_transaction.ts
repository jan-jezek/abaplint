import * as Expressions from "../../2_statements/expressions";
import {StatementNode} from "../../nodes";
import {CurrentScope} from "../_current_scope";
import {Target} from "../expressions/target";
import {Source} from "../expressions/source";
import {StatementSyntax} from "../_statement_syntax";

export class CallTransaction implements StatementSyntax {
  public runSyntax(node: StatementNode, scope: CurrentScope, filename: string): void {

    for (const s of node.findDirectExpressions(Expressions.Source)) {
      new Source().runSyntax(s, scope, filename);
    }

    for (const t of node.findDirectExpressions(Expressions.Target)) {
      new Target().runSyntax(t, scope, filename);
    }

  }
}