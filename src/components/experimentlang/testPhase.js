var SOILE2 = window.SOILE2;

console.log(window);
console.log(SOILE2);
function suppressKeys(e) {
  //Preventing scroll on arrowkeys 37-40 and navigation on backspace 8
  if ([37, 38, 39, 40, 8, 32].indexOf(e.keyCode) > -1) {
    //console.log(e);
    if (
      e.target.tagName == "INPUT" ||
      e.target.type == "text" ||
      e.target.tagName == "TEXTAREA"
    ) {
      return;
    }

    e.preventDefault();

    // Do whatever else you want with the keydown event (i.e. your navigation).
  }
}

function startFunc() {
  console.log("Starting!!!");
}

function sendData(d) {
  // Placeholder till we ge this right.
  console.log(d);
  const outputData = [];
  for (const output of window.outputs) {
    if (output in d.exp.single) {
      const outValue = d.exp.single[output];
      if (isNaN(outValue)) {
        throw new Error(
          "Output values have to be numbers! Received " +
            outValue +
            " for output " +
            output
        );
      }
      outputData.push({ name: output, value: parseFloat(outValue) });
    } else {
      throw new Error(
        "Missing required output " +
          output +
          " cannot submit this questionnaire"
      );
    }
  }
  const jsonData = [];
  for (const field in d.exp) {
    // exclude stuff that is null or undefined.
    if (d.exp[field] != null && d.exp[field] != undefined) {
      jsonData.push({ name: field, value: d.exp[field] });
    }
  }
  const persistantData = [];
  for (const field in window.persistantFields) {
    persistantData.push({ name: field, value: d.exp[field] });
  }
  window.handleSubmit({
    outputData: outputData,
    persistantData: persistantData,
    resultData: { fileData: [], jsonData: jsonData },
  });
}

function startFunc() {
  console.log("Starting!!!");
}

function end(expdata, duration, score, persistantData) {
  console.log("Test over");
  console.log(expdata);

  var d = {};
  d = {};
  d.exp = expdata;
  d.exp.duration = duration;
  d.exp.score = score;
  d.persistantData = persistantData;
  //Showing loadingscreen at the end when sending data.
  SOILE2.util.enableLoadScreen();

  sendData(d);
}

function startSoile(data) {
  console.log("Starting soile");
  SOILE2.util.enableLoadScreen();
  SOILE2.util.setPersistantData(window.persistantData);
  SOILE2.util.setDebug((event) => {
    console.log(event);
  });
  /* This can most likely be completely ignored, as it's effect is almost irrelevant.
    if (typeof window.testConfig !== "undefined") {
      SOILE2.util.setPilotMode(window.testConfig.pilotMode);
    }*/

  SOILE2.util.setStartFunction(startFunc);
  console.log(data);
  console.log(SOILE2);
  SOILE2.util.eval(data);
  SOILE2.util.setEndFunction(end);

  try {
    SOILE2.start();
  } catch (e) {
    console.log(e);
    window.handleError(e);
  }
}

window.start = startSoile;
