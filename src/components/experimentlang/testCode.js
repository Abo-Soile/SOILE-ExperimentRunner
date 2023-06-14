(function () {
  var soile2 = SOILE2;
  console.log("Starting to execute code");
  console.log(soile2);
  var __gvars, __vals, __fns, __vars;
  soile2.bin.emptymsg();
  soile2.rt.dyn.clear();
  soile2.rt.reset_defs();
  __gvars = soile2.defs.gvars;
  __vals = soile2.defs.vals;
  __fns = soile2.defs.fns;
  __vars = soile2.defs.vars;
  __vals["imgurl"] = "Circle.png";

  __gvars["reactimg"] = soile2.bin.imagefile(__vals["imgurl"]);

  __gvars["games"] = 0;

  __gvars["maxgames"] = 5;

  __gvars["reacted"] = 0;

  __fns["userReacted"] = function () {
    __gvars["reacted"] = 1;
    soile2.bin.resume();
  };

  __fns["gamedone"] = function () {
    soile2.bin.helptext("games played");
    soile2.bin.helptext(__gvars["games"]);
    __gvars["games"] = soile2.bin.plus(__gvars["games"], 1);
    return soile2.bin.gt(__gvars["games"], __gvars["maxgames"]);
  };
  soile2.rt.reset_piarray();
  soile2.rt.set_piarray(
    (function () {
      var instructions = [];
      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "helptext",
        params: function () {
          return ["Starting Test"];
        },
      });

      instructions.push({
        opcode: 5,
        ms: function () {
          return soile2.rt.milliseconds(2000);
        },
      });

      instructions.push({ opcode: 4, jmp: 3 });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "showmsg",
        params: function () {
          return ["Press h when the circle appears"];
        },
      });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "helptext",
        params: function () {
          return ["Displaying instructions"];
        },
      });

      instructions.push({
        opcode: 5,
        ms: function () {
          return soile2.rt.milliseconds(soile2.bin.seconds(7));
        },
      });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "hidemsg",
        params: function () {
          return [];
        },
      });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "helptext",
        params: function () {
          return ["Hiding instructions"];
        },
      });

      instructions.push({
        opcode: 2,
        jmp: 10,
        cond: function () {
          return soile2.rt.truthvalue(soile2.bin.not(__fns["gamedone"]()));
        },
      });

      instructions.push({ opcode: 4, jmp: 17 });

      instructions.push({ opcode: 4, jmp: 3 });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "helptext",
        params: function () {
          return ["Final phase, storing results"];
        },
      });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "count",
        params: function () {
          return ["reacted", 1];
        },
      });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "count",
        params: function () {
          return ["reacted", 0];
        },
      });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "average",
        params: function () {
          return ["rt"];
        },
      });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "showmsg",
        params: function () {
          return [""];
        },
      });

      instructions.push({ opcode: -1 });

      instructions.push({
        opcode: 6,
        func: function () {
          var __vars = soile2.defs.vars;
          __vars["i"] = 0;

          __vars["s"] = 0;
        },
      });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "helptext",
        params: function () {
          return ["Starting Mainphase"];
        },
      });

      instructions.push({
        opcode: 0,
        host: soile2.defs.gvars,
        name: "reacted",
        value: function () {
          return 0;
        },
      });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "setstimuli",
        params: function () {
          return [[soile2.bin.randomnumber(2, 3)]];
        },
      });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "helptext",
        params: function () {
          return [""];
        },
      });

      instructions.push({
        opcode: 0,
        host: soile2.defs.vars,
        name: "i",
        value: function () {
          return 0;
        },
      });

      instructions.push({
        opcode: 0,
        host: soile2.defs.vars,
        name: "s",
        value: function () {
          return 0;
        },
      });

      instructions.push({
        opcode: 0,
        host: soile2.defs.vars,
        name: "s",
        value: function () {
          return soile2.bin.stimulus();
        },
      });

      instructions.push({
        opcode: 5,
        ms: function () {
          return soile2.rt.milliseconds(soile2.bin.seconds(__vars["s"]));
        },
      });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "onkeypress",
        params: function () {
          return ["h", __fns["userReacted"]];
        },
      });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "starttimer",
        params: function () {
          return [];
        },
      });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "show",
        params: function () {
          return [__gvars["reactimg"], { top: 100, left: 300 }];
        },
      });

      instructions.push({
        opcode: 5,
        ms: function () {
          return soile2.rt.milliseconds(soile2.bin.seconds(3));
        },
      });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "helptext",
        params: function () {
          return ["Hiding image"];
        },
      });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "hide",
        params: function () {
          return [__gvars["reactimg"]];
        },
      });

      instructions.push({
        opcode: 0,
        host: soile2.defs.vars,
        name: "i",
        value: function () {
          return soile2.bin.elapsedtime();
        },
      });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "onkeypress",
        params: function () {
          return ["h"];
        },
      });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "storerow",
        params: function () {
          return ["rt", __vars["i"]];
        },
      });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "storerow",
        params: function () {
          return ["waittime", __vars["s"]];
        },
      });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "storerow",
        params: function () {
          return ["reacted", __gvars["reacted"]];
        },
      });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "helptext",
        params: function () {
          return ["Enditeration"];
        },
      });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "helptext",
        params: function () {
          return [""];
        },
      });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "newrow",
        params: function () {
          return [];
        },
      });

      instructions.push({
        opcode: 2,
        jmp: 42,
        cond: function () {
          return soile2.rt.truthvalue(soile2.rt.stimuli.hasmore());
        },
      });

      instructions.push({ opcode: 4, jmp: 21 });

      instructions.push({
        opcode: 1,
        host: soile2.bin,
        name: "helptext",
        params: function () {
          return [""];
        },
      });

      instructions.push({ opcode: 7 });

      instructions.push({
        opcode: 2,
        jmp: 46,
        cond: function () {
          return soile2.rt.truthvalue(__fns["gamedone"]());
        },
      });

      instructions.push({ opcode: 4, jmp: 11 });

      instructions.push({ opcode: 4, jmp: 17 });
      return function (idx) {
        return instructions[idx];
      };
    })()
  );
  soile2.rt.pi_index.set(0);
  soile2.rt.finalize_defs();
})();
