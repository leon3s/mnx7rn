import ts from "typescript";

const file = '../src/test-file.ts';

const program = ts.createProgram([file], {
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS
});

let output: DocEntry[] = [];
const checker = program.getTypeChecker();

interface DocEntry {
  name?: string;
  fileName?: string;
  documentation?: string;
  type?: string;
  doc_tag?: any[];
  constructors?: DocEntry[];
  parameters?: DocEntry[];
  returnType?: string;
  properties?: DocEntry[];
  parent_type?: string;
  api_res?: any;
}

/** visit nodes finding exported classes */
function visit(node: ts.Node) {
  // Only consider exported nodes
  if (!isNodeExported(node)) {
    return;
  }
  
  if (ts.isModuleDeclaration(node)) {
    console.log('IS MODULE !');
  }
  // checker.getExportsOfModule(node.name);
  if (ts.isClassDeclaration(node) && node.name) {
    // This is a top level class, get its symbol
    let symbol = checker.getSymbolAtLocation(node.name);
    if (symbol) {
      if (symbol.getJsDocTags().length) {
        output.push(serializeClass(symbol));
      }
    }
    // No need to walk any further, class expressions/inner declarations
    // cannot be exported
  } else if (ts.isModuleDeclaration(node)) {
    // This is a namespace, visit its children
    ts.forEachChild(node, visit);
  }
}

/** Serialize a symbol into a json object */
function srlzSymbol(symbol: ts.Symbol): DocEntry {
  let type = checker.getTypeOfSymbolAtLocation(
    symbol,
    symbol.valueDeclaration!!
  );
  return {
    name: symbol.getName(),
    doc_tag: symbol.getJsDocTags(),
    documentation: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
    type: checker.typeToString(
      checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
    ),
    ...type.getCallSignatures().map((s) => {
      const details = srlzSign(s);
      const t = s.getReturnType();
      const res = t.getProperty('res');
      if (res) {
        let type = checker.getTypeOfSymbolAtLocation(res, res.valueDeclaration!!);
        console.log(type.getProperties().map((p) => {
          const details = srlzSymbol(p);
          let t = checker.getTypeOfSymbolAtLocation(p, p.valueDeclaration!!);
          const c = t.getProperty('schema_type');
          if (c) {
            t = checker.getTypeOfSymbolAtLocation(c, c.valueDeclaration!!);
            console.log(t.isClassOrInterface);
            console.log(t.getProperties().map(srlzSymbol));
          }
          return details;
        }));
      }
      const fn = t.getProperty('fn');
      if (fn) {
      }
      return details;
    })[0],
  };
}

/** Serialize a class symbol information */
function serializeClass(symbol: ts.Symbol) {
  let details = srlzSymbol(symbol);
  const declaredType = checker.getDeclaredTypeOfSymbol(symbol);
  const properties = declaredType.getApparentProperties().filter((s) => !!s.getJsDocTags().length).map((s) => {
    return srlzSymbol(s);
  });
  details.properties = properties;
  details.doc_tag = symbol.getJsDocTags();
  let class_type = checker.getTypeOfSymbolAtLocation(
    symbol,
    symbol.valueDeclaration!!
  );
  details.constructors = class_type
    .getConstructSignatures().filter((s) => !!s.getJsDocTags().length)
    .map(srlzSign);
  return details;
}

/** Serialize a construct signature */
function srlzSign(signature: ts.Signature): DocEntry {
  return {
    doc_tag: signature.getJsDocTags(),
    parameters: signature.parameters.map(srlzSymbol),
    returnType: checker.typeToString(signature.getReturnType()),
    documentation: ts.displayPartsToString(signature.getDocumentationComment(checker))
  };
}

/** True if this is visible outside this file, false otherwise */
function isNodeExported(node: ts.Node): boolean {
  return (
    (ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !== 0 ||
    (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
  );
}

for (const sourceFile of program.getSourceFiles()) {
  if (!sourceFile.isDeclarationFile) {
    // Walk the tree to search for classes
    ts.forEachChild(sourceFile, visit);
  }
}

output = output.filter((output) => {
  if (!output.doc_tag) return false;
  return !output.doc_tag?.find(({value}) => value === 'api_ctrl')
});

console.dir(output, { depth: null });

// const sourceFile = program.getSourceFile(file);
// if (sourceFile) {
//   console.log(sourceFile);
// }
