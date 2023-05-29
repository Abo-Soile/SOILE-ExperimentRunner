<template>
  <iframe ref="soilehtml" class="experimentview" :srcdoc="soilehtml">        
  </iframe>
</template>

<script>

import { createSoileInstance }  from '@/helpers/experimentlang/soile2.js'
import soilehtmlpage from './soile.html?raw'
import testPhase from './testPhase.js?raw'

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
      needToSetHandeler: false,
      soileContentWindow : undefined,
      soileContentDocument : undefined,
      soilehtml : soilehtmlpage
    }
  },
  unmount() {    
    this.active = false;
  },

  methods: {
    handleSubmit(data)
    {
      this.$emit('handleSubmit', data)
    },
    handleError(data)
    {
      this.$emit('handleError', data)
    },
  },
  mounted() {

    this.soileContentWindow = this.$refs.soilehtml.contentWindow
    console.log(this.soileContentWindow)
    this.soileContentDocument = this.soileContentWindow.document
    this.soileContentWindow.handleSubmit = this.handleSubmit;
    this.soileContentWindow.handleError = this.handleError;
    const soileStyle = this.soileContentDocument.createElement("link");
    soileStyle.setAttribute("rel", "stylesheet");
    soileStyle.setAttribute("href", "/soile.css");            
    this.soileContentDocument.head.appendChild(soileStyle);

    this.soileContentWindow.SOILE2 = createSoileInstance();

    const currentScript = this.soileContentDocument.createElement("script");    
    currentScript.type = "text/javascript";
    currentScript.id = "testPhase";
    currentScript.innerHTML = testPhase;
    this.soileContentDocument.body.appendChild(currentScript);    
    this.soileContentWindow.start(this.code);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scope>
.h3 {
  margin: 40px 0 0;
}

.ul {
  list-style-type: none;
  padding: 0;
}

.li {
  display: inline-block;
  margin: 0 10px;
}

.a {
  color: #42b983;
}

*.hiddenelem {
  visibility: hidden;
}
*.invisibleElement {
  visibility: hidden;
}

.experimentview {
  width: 100%;
  height: 100%;
}
</style>
