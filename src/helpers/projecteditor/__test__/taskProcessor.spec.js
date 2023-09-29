import { describe, it, expect } from "vitest";

import {
  checkOutput,
  extractElangOutputOptions,
  extractQMarkUpOutputOptions,
} from "../taskProcessor";

describe("taskProcessor", () => {
  it("ChecksVariablesCorrectly", () => {
    var expression = "smoker";
    expect(checkOutput(expression)).toBe(true);
    var expression = "meansmoker";
    expect(checkOutput(expression)).toBe(false);
    var expression = "";
    expect(checkOutput(expression)).toBe(false);
    var expression = "mean";
    expect(checkOutput(expression)).toBe(false);
    var expression = "smo ker";
    expect(checkOutput(expression)).toBe(false);
    var expression = "smoker+";
    expect(checkOutput(expression)).toBe(false);
  });
  it("Parses QMarkup Correctly", () => {
    const QMarkUpMock = {
      mapping: [
        { dbcolumn: "a", defaultValue: "No" },
        { dbcolumn: "b", defaultValue: "1" },
        { dbcolumn: "c", defaultValue: 1 },
        { dbcolumn: "c", defaultValue: 2 },
        { dbcolumn: "d", defaultValue: "" },
        { dbcolumn: "e", defaultValue: 0 },
      ],
    };
    expect(extractQMarkUpOutputOptions(QMarkUpMock).outputs).toEqual([
      "b",
      "c",
      "e",
    ]);
  });

  it("Parses ELang Correctly", () => {
    const elangCode = `
    function gamedone()
      # Showing number of games played
      helptext("games played")
      helptext(games)
      savevariable("test" 2)
      storesingle("newout" 2)      
      storesingle("test" 2)      
      # Adding 1 to games played
      games <- plus(games 1)
    
      # Check if games played is greater than maxgames(15), return true or false
      return gt(games maxgames)
    end
        `;
    expect(extractElangOutputOptions(elangCode).outputs).toEqual([
      "test",
      "newout",
    ]);
  });
});
