// TextMate-based syntax highlighting is implemented in this file.
// typespec.tmLanguage is generated by running this script.

import { mkdir, writeFile } from "fs/promises";
import { resolve } from "path";
import * as tm from "tmlanguage-generator";

type IncludeRule = tm.IncludeRule<TypeSpecScope>;
type BeginEndRule = tm.BeginEndRule<TypeSpecScope>;
type MatchRule = tm.MatchRule<TypeSpecScope>;
type Grammar = tm.Grammar<TypeSpecScope>;

export type TypeSpecScope =
  // Constants
  | "constant.numeric.tsp"
  | "string.unquoted.plain.out.yaml"
  // Entities
  | "keyword.other.tsp"
  // Punctuation
  | "punctuation.separator.key-value.mapping.yaml";

const meta: typeof tm.meta = tm.meta;
const identifierStart = "[_$[:alpha:]]";
// cspell:disable-next-line
const identifierContinue = "[_$[:alnum:]]";
const alphaNumericalData = `\\b${identifierStart}${identifierContinue}*\\b`;
const universalEnd = `(?=\n)`;

/**
 * Universal end with extra end char: `=`
 */
const hexNumber = "\\b(?<!\\$)0(?:x|X)[0-9a-fA-F][0-9a-fA-F_]*(n)?\\b(?!\\$)";
const binaryNumber = "\\b(?<!\\$)0(?:b|B)[01][01_]*(n)?\\b(?!\\$)";
const decimalNumber =
  "(?<!\\$)(?:" +
  "(?:\\b[0-9][0-9_]*(\\.)[0-9][0-9_]*[eE][+-]?[0-9][0-9_]*(n)?\\b)|" + // 1.1E+3
  "(?:\\b[0-9][0-9_]*(\\.)[eE][+-]?[0-9][0-9_]*(n)?\\b)|" + // 1.E+3
  "(?:\\B(\\.)[0-9][0-9_]*[eE][+-]?[0-9][0-9_]*(n)?\\b)|" + // .1E+3
  "(?:\\b[0-9][0-9_]*[eE][+-]?[0-9][0-9_]*(n)?\\b)|" + // 1E+3
  "(?:\\b[0-9][0-9_]*(\\.)[0-9][0-9_]*(n)?\\b)|" + // 1.1
  "(?:\\b[0-9][0-9_]*(\\.)(n)?\\B)|" + // 1.
  "(?:\\B(\\.)[0-9][0-9_]*(n)?\\b)|" + // .1
  "(?:\\b[0-9][0-9_]*(n)?\\b(?!\\.))" + // 1
  ")(?!\\$)";
const anyNumber = `(?:${hexNumber}|${binaryNumber}|${decimalNumber})`;

const numericValue: MatchRule = {
  key: "numeric-literal",
  scope: "constant.numeric.tsp",
  match: anyNumber,
};

const stringValue: MatchRule = {
  key: "string-value",
  scope: "string.unquoted.plain.out.yaml",
  match: alphaNumericalData,
};

const specEntry: BeginEndRule = {
  key: "spec-entry",
  scope: meta,
  begin: `(${alphaNumericalData})\\s*(:)\\s*`,
  beginCaptures: {
    "1": { scope: "keyword.other.tsp" },
  },
  end: `(?<=\\})|${universalEnd}`,
  patterns: [numericValue, stringValue],
};

const statement: IncludeRule = {
  key: "statement",
  patterns: [specEntry],
};

const grammar: Grammar = {
  $schema: tm.schema,
  name: "TravelingSalesmanProblem",
  scopeName: "source.tsp",
  fileTypes: ["tsp"],
  patterns: [statement],
};

async function main() {
  const plist = await tm.emitPList(grammar, {
    errorSourceFilePath: resolve("./src/tmlanguage.ts"),
  });
  const json = await tm.emitJSON(grammar, {
    errorSourceFilePath: resolve("./src/tmlanguage.ts"),
  });
  await mkdir("grammars", { recursive: true });
  await writeFile("grammars/TravelingSalesmanProblem.tmLanguage", plist);
  await writeFile("grammars/TravelingSalesmanProblem-tmlanguage.json", json);
}

await main();
