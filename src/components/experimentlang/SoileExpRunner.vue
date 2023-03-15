<template>
  <div class="container main">
        <div id="display">          
          <p id="message"></p>
    </div>
  </div>
</template>

<script>

import SOILE2 from '../../javascript/soile2.js'


export default {
  name: 'SoileExpRunner',
  props: {
    msg: String,
    completed: {
      type: Number,
      default: 50
    },
    phasesLeft: {
      type: Number,
      default: 2
    }
  },
  data()
  {
    return {
      persistentData : {},
      active: false,
      needToSetHandeler: false
    }
  },
  unmount() {    
    console.log("Unmounting SOILE")
    window.SOILE2 = undefined;    
    this.active = false;
  },

  methods: {
    suppressKeys(e)
    {
      if (this.active) {
        //Preventing scroll on arrowkeys 37-40 and navigation on backspace 8
        if ([37, 38, 39, 40, 8, 32].indexOf(e.keyCode) > -1) {
          //console.log(e);
          if (e.target.tagName == "INPUT" || e.target.type == "text" || e.target.tagName == "TEXTAREA") {
            return
          }

          e.preventDefault();

          // Do whatever else you want with the keydown event (i.e. your navigation).
        }
      }
    }
  },

  mounted() {
    window.SOILE2 = SOILE2;
    this.active = true;
    if(this.needToSetHandeler)
    {
      //Preventing scroll on arrowkeys 37-40 and navigation on backspace 8
      document.addEventListener("keydown",this.suppressKeys, false);
    }
    //console.log(window.testJS);

    function startFunc() {
      console.log("Starting!!!");
    }

    function sendData(d) {
      // Placeholder till we ge this right.
      console.log(d);
      //Send data xhr,
      /*xhr.post(document.URL, {timeout:10000,data:JSON.stringify(d)}).then(
        function(response) {

          if (typeof response !== 'undefined') {
            response = JSON.parse(response);
          }

          if(response.redirect) {
            console.log("JSON_REDIRECTING");
            window.location.replace(response.redirect);
          }

          else {
            //Navigate to next phase
            var url = document.URL;
            var currentPhase = parseInt(url.substr(url.lastIndexOf("/")+1));
            url = url.slice(0, url.lastIndexOf("/")+1);

            if(!isNaN(currentPhase)) {
              console.log("Redirecting " + isNaN(currentPhase));
              window.location.href = url+(currentPhase+1);
            }else {
              location.reload();
            }
          }
        },function(error) {
          console.log("Sending data failed, retrying...");
          setTimeout(function() {
            console.log("...resending");
            sendData(d);
          }, 1000);
        });
        */
    }

    function end(expdata, duration, score, persistantData) {
      console.log("Test over");
      console.log(expdata);

      var d = {};
      d = {};
      d.exp = expdata;
      d.duration = duration;
      d.score = score;
      d.persistantData = persistantData;

      //Showing loadingscreen at the end when sending data.
      SOILE2.util.enableLoadScreen();

      sendData(d);
    }

    function startSoile(data) {
      console.log("Starting soile");
      SOILE2.util.enableLoadScreen();
      SOILE2.util.setPersistantData(this.persistantData);
     
      /* This can most likely be completely ignored, as it's effect is almost irrelevant.
      if (typeof window.testConfig !== "undefined") {
        SOILE2.util.setPilotMode(window.testConfig.pilotMode);
      }*/

      SOILE2.util.setStartFunction(startFunc);
      SOILE2.util.eval(data);
      SOILE2.util.setEndFunction(end);

      SOILE2.start();
    }
    startSoile(test.testData)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scope>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

*.hiddenelem {
  visibility: hidden;
}
*.invisibleElement {
  visibility: hidden;
}
</style>
