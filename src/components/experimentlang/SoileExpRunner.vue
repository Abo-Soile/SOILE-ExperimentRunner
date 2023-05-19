<template>
  <div class="container main">
        <div id="display">          
          <p id="message"></p>
    </div>
  </div>
</template>

<script>

import SOILE2 from '@/helpers/experimentlang/soile2.js'


export default {
  name: 'SoileExpRunner',
  props: {
    code: {
      type: String,
      required: true
    },
    outputs: {
      required: true,
      type: Array
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
    },
    startSoile(data) {
      console.log("Starting soile");
      SOILE2.util.enableLoadScreen();
      SOILE2.util.setPersistantData(this.persistantData);
      SOILE2.util.setDebug((event) => { console.log(event)})
      /* This can most likely be completely ignored, as it's effect is almost irrelevant.
      if (typeof window.testConfig !== "undefined") {
        SOILE2.util.setPilotMode(window.testConfig.pilotMode);
      }*/

      SOILE2.util.setStartFunction(this.startFunc);
      SOILE2.util.eval(data);
      SOILE2.util.setEndFunction(this.end);

      try{
        SOILE2.start();
      }
      catch(e)
      {
        console.log(e)
        this.$emit("handleError", e)
      }
    },
    end(expdata, duration, score, persistantData) {
      console.log("Test over");
      console.log(expdata);

      var d = {};
      d = {};
      d.exp = expdata;
      d.exp.duration = duration;
      d.exp.score = score;
      d.persistantData = persistantData;
      this.persistentData = persistantData;
      //Showing loadingscreen at the end when sending data.
      SOILE2.util.enableLoadScreen();

      this.sendData(d);
    },
    startFunc() {
      console.log("Starting!!!");
    },

    sendData(d) {
      // Placeholder till we ge this right.
      console.log(d);
      const outputData = [];
      for(const output of this.outputs)
      {
        if(output in d.exp.single)
        {
          const outValue = d.exp.single[output]
          if(isNaN(outValue))
          {
            throw new Error("Output values have to be numbers! Received " + outValue + " for output " + output)
          }
          outputData.push({name : output, value: parseFloat(outValue)})
        }
        else{
          throw new Error("Missing required output " + output + " cannot submit this questionnaire");
        }
      }
      const jsonData = []
      for(const field in d.exp)
      {
        // exclude stuff that is null or undefined.
        if(d.exp[field] != null && d.exp[field] != undefined)
        {
          jsonData.push({name: field, value : d.exp[field]})
        }
      }
      this.$emit('handleSubmit', {outputData: outputData, resultData: { fileData: [], jsonData : jsonData}})
    }
  },
  mounted() {
    console.log("Mounting soile with code: ")
    if(typeof this.code === 'string')
    {
    console.log(this.code);    
    window.SOILE2 = SOILE2;
    this.active = true;
    if(this.needToSetHandeler)
    {
      //Preventing scroll on arrowkeys 37-40 and navigation on backspace 8
      document.addEventListener("keydown",this.suppressKeys, false);
    }
    this.startSoile(this.code);
    //console.log(window.testJS)        
    }

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
