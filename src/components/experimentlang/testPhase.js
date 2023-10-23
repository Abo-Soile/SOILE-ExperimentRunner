var SOILE2 = window.SOILE2;
console.log(window);
console.log(SOILE2);
var currentCode;
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
  console.log(d.exp);
  console.log(d.exp.single);
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
  const persistentData = [];
  for (const field in d.persistentData) {
    persistentData.push({ name: field, value: d.persistentData[field] });
  }
  window.handleSubmit({
    outputData: outputData,
    persistentData: persistentData,
    resultData: { fileData: [], jsonData: jsonData },
  });
}

function end(expdata, duration, score, persistentData) {
  console.log("Test over");
  console.log(expdata);

  var d = {};
  d = {};
  d.exp = expdata;
  d.exp.duration = duration;
  d.exp.score = score;
  d.persistentData = persistentData;
  //Showing loadingscreen at the end when sending data.
  SOILE2.util.enableLoadScreen();

  sendData(d);
}

function startSoile(data) {
  console.log("Starting soile");
  console.log(window.persistentData);
  SOILE2.util.enableLoadScreen();
  SOILE2.util.setPersistantData(window.persistentData);
  SOILE2.util.setDebug((event) => {
    console.log(event);
  });
  /* This can most likely be completely ignored, as it's effect is almost irrelevant.
    if (typeof window.testConfig !== "undefined") {
      SOILE2.util.setPilotMode(window.testConfig.pilotMode);
    }*/

  SOILE2.util.setStartFunction(startFunc);
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
function goFullScreen() {
  if (typeof document.documentElement.requestFullscreen === "function") {
    document.documentElement.requestFullscreen().catch(() => {
      console.warn("Unable to go fullscreen.");
    });
  } else if (
    typeof document.documentElement.mozRequestFullScreen === "function"
  ) {
    document.documentElement.mozRequestFullScreen();
  } else if (
    typeof document.documentElement.webkitRequestFullscreen === "function"
  ) {
    document.documentElement.webkitRequestFullscreen();
  } else if (
    typeof document.documentElement.msRequestFullscreen === "function"
  ) {
    document.documentElement.msRequestFullscreen();
  } else {
    console.warn("Unable to go fullscreen.");
  }
}


const button = document.getElementById("startButton");
button.textContent = window.soileconfig.startText;
const startArea = document.getElementById("startArea");
button.addEventListener("click", function() {
  startArea.classList.add("hiddenelem")
  goFullScreen();
  startSoile(currentCode);
})

function setCode(code)
{
  console.log("Setting code");
  currentCode = code;
}

window.start = setCode;
