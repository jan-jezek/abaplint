import {ExpressionNode} from "../../nodes";
import {CurrentScope} from "../_current_scope";
import {ObjectReferenceType, VoidType, DataReference} from "../../types/basic";
import {TypeNameOrInfer} from "../../2_statements/expressions";
import {AbstractType} from "../../types/basic/_abstract_type";
import {ReferenceType} from "../_reference";

export class NewObject {
  public runSyntax(node: ExpressionNode, scope: CurrentScope, targetType: AbstractType | undefined, filename: string): AbstractType {
    const typeToken = node.findDirectExpression(TypeNameOrInfer)?.getFirstToken();
    const typeName = typeToken?.getStr();
    if (typeName === undefined) {
      throw new Error("NewObject, child TypeNameOrInfer not found");
    } else if (typeName === "#" && targetType) {
      return targetType;
    } else if (typeName === "#") {
      throw new Error("NewObject, todo, infer type");
    }

    const objDefinition = scope.findObjectDefinition(typeName);
    if (objDefinition) {
      scope.addReference(typeToken, objDefinition, ReferenceType.ClassReference, filename);
      return new ObjectReferenceType(typeName);
    }

    const type = scope.findType(typeName);
    if (type) {
      // todo: scope.addReference
      return new DataReference(type.getType());
    }

    if (scope.getDDIC().inErrorNamespace(typeName) === false) {
      return new VoidType(typeName);
    } else {
      throw new Error("Type \"" + typeName + "\" not found in scope, NewObject");
    }

  }
}