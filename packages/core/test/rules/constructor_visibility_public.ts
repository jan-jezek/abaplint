import {Registry} from "../../src/registry";
import {ConstructorVisibilityPublic} from "../../src/rules";
import {expect} from "chai";
import {MemoryFile} from "../../src/files/memory_file";

describe("rule, constructor_visibility_public", () => {
  it("constructor_visibility_public test", async () => {
    const abap = `
    CLASS zcl_abapgit_persist_settings DEFINITION PUBLIC CREATE PRIVATE.
      PRIVATE SECTION.
        METHODS constructor.
    ENDCLASS.
    CLASS ZCL_ABAPGIT_PERSIST_SETTINGS IMPLEMENTATION.
      METHOD constructor.
      ENDMETHOD.
    ENDCLASS.`;

    const reg = new Registry().addFile(new MemoryFile("zcl_abapgit_persist_settings.clas.abap", abap));
    await reg.parseAsync();
    const rule = new ConstructorVisibilityPublic();
    const issues = rule.initialize(reg).run(reg.getFirstObject()!);

    expect(issues.length).to.equals(1);
  });

  it("constructor_visibility_public test", async () => {
    const abap = `
    CLASS zcl_abapgit_persist_settings DEFINITION PUBLIC CREATE PRIVATE.
      PUBLIC SECTION.
        METHODS constructor.
    ENDCLASS.
    CLASS ZCL_ABAPGIT_PERSIST_SETTINGS IMPLEMENTATION.
      METHOD constructor.
      ENDMETHOD.
    ENDCLASS.`;

    const reg = new Registry().addFile(new MemoryFile("zcl_abapgit_persist_settings.clas.abap", abap));
    await reg.parseAsync();
    const rule = new ConstructorVisibilityPublic();
    const issues = rule.initialize(reg).run(reg.getFirstObject()!);

    expect(issues.length).to.equals(0);
  });

  it("local class, no error", async () => {
    const abap = `
CLASS lcl_bar DEFINITION.
  PRIVATE SECTION.
    METHODS: constructor.
ENDCLASS.

CLASS lcl_bar IMPLEMENTATION.
  METHOD constructor.
  ENDMETHOD.
ENDCLASS.`;

    const reg = new Registry().addFile(new MemoryFile("zfoobar.prog.abap", abap));
    await reg.parseAsync();
    const rule = new ConstructorVisibilityPublic();
    const issues = rule.initialize(reg).run(reg.getFirstObject()!);

    expect(issues.length).to.equals(0);
  });
});

