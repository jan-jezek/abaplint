import {ClassDefinition, InterfaceDefinition, FormDefinition} from "../types";
import {TypedIdentifier} from "../types/_typed_identifier";
import {Registry} from "../../registry";
import {Globals} from "./_globals";

interface IVar {
  name: string;
  identifier?: TypedIdentifier;
}

export interface IScopeInfo {
  scopeName: string;
  vars: IVar[];
  cdef: ClassDefinition[];
  idef: InterfaceDefinition[];
  form: FormDefinition[];
  type: TypedIdentifier[];
}

export class Scope {

  private readonly scopes: IScopeInfo[];

  public static buildDefault(reg: Registry): Scope {
    return new Scope(Globals.get(reg.getConfig().getSyntaxSetttings().globalConstants));
  }

  private constructor(builtin?: TypedIdentifier[]) {
    this.scopes = [];
    this.push("_builtin");
    if (builtin) {
      this.addList(builtin);
    }
    this.push("_global");
  }

  public get() {
    return this.scopes;
  }

  public addType(type: TypedIdentifier | undefined) {
    if (type === undefined) {
      return;
    }
    this.scopes[this.scopes.length - 1].type.push(type);
  }

  public addClassDefinition(c: ClassDefinition) {
    this.scopes[this.scopes.length - 1].cdef.push(c);
  }

  public addFormDefinitions(f: FormDefinition[]) {
    this.scopes[this.scopes.length - 1].form = this.scopes[this.scopes.length - 1].form.concat(f);
  }

  public findClassDefinition(name: string): ClassDefinition | undefined {
    // todo, this should probably search the nearest first? in case there are shadowed variables?
    for (const scope of this.scopes) {
      for (const cdef of scope.cdef) {
        if (cdef.getName().toUpperCase() === name.toUpperCase()) {
          return cdef;
        }
      }
    }
    return undefined;
  }

  public findFormDefinition(name: string): FormDefinition | undefined {
    // todo, this should probably search the nearest first? in case there are shadowed variables?
    for (const scope of this.scopes) {
      for (const form of scope.form) {
        if (form.getName().toUpperCase() === name.toUpperCase()) {
          return form;
        }
      }
    }
    return undefined;
  }

  public addInterfaceDefinition(i: InterfaceDefinition) {
    this.scopes[this.scopes.length - 1].idef.push(i);
  }

  public findInterfaceDefinition(name: string): InterfaceDefinition | undefined {
    // todo, this should probably search the nearest first? in case there are shadowed variables?
    for (const scope of this.scopes) {
      for (const idef of scope.idef) {
        if (idef.getName().toUpperCase() === name.toUpperCase()) {
          return idef;
        }
      }
    }
    return undefined;
  }

  public addIdentifier(identifier: TypedIdentifier | undefined) {
    if (identifier === undefined) {
      return;
    }
    this.scopes[this.scopes.length - 1].vars.push({name: identifier.getName(), identifier});
  }

  public addNamedIdentifier(name: string, identifier: TypedIdentifier) {
    this.scopes[this.scopes.length - 1].vars.push({name, identifier});
  }

  public addName(name: string) {
    this.scopes[this.scopes.length - 1].vars.push({name});
  }

  public addList(identifiers: TypedIdentifier[], prefix?: string | undefined) {
    for (const id of identifiers) {
      if (prefix) {
        this.addNamedIdentifier(prefix + id.getName(), id);
      } else {
        this.addIdentifier(id);
      }
    }
  }

  public getCurrentScope(): TypedIdentifier[] {
    const ret: TypedIdentifier[] = [];
    for (const v of this.scopes[this.scopes.length - 1].vars) {
      if (v.identifier) {
        ret.push(v.identifier);
      }
    }
    return ret;
  }

  public getCurrentTypes(): TypedIdentifier[] {
    return this.scopes[this.scopes.length - 1].type;
  }

  public resolveType(name: string): TypedIdentifier |undefined {
    // todo, this should probably search the nearest first? in case there are shadowed variables?
    for (const scope of this.scopes) {
      for (const local of scope.type) {
        if (local.getName().toUpperCase() === name.toUpperCase()) {
          return local;
        }
      }
    }
    return undefined;
  }

  public resolveVariable(name: string): TypedIdentifier | string | undefined {
    // todo, this should probably search the nearest first? in case there are shadowed variables?
    for (const scope of this.scopes) {
      for (const local of scope.vars) {
        if (local.name.toUpperCase() === name.toUpperCase()) {
          return local.identifier ? local.identifier : local.name;
        }
      }
    }
    return undefined;
  }

  public getParentName(): string {
    return this.scopes[this.scopes.length - 2].scopeName;
  }

  public push(name: string): Scope {
    this.scopes.push({
      scopeName: name,
      vars: [],
      cdef: [],
      idef: [],
      form: [],
      type: [],
    });
    return this;
  }

  public pop(): IScopeInfo {
    if (this.scopes.length === 1) {
      throw new Error("something wrong, top scope popped");
    }
    return this.scopes.pop()!;
  }
}
