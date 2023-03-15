<script>
export default {
    props: {
        id: {
            type: String,
            required: true
        },
        psychoJSVersion: {
            type: String,
            required: true
        },

    },
    data() {
        return {
            isMounted: false,
            isScritpSet: false,
            resultHandling: undefined,
            currentScript: undefined,
            psychoPyCSS: undefined,
            loadedScripts: [],
            loadedStyles: [],
            neededScriptLocation: ["https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js",
                "https://cdn.jsdelivr.net/npm/jquery-ui-dist@1.12.1/jquery-ui.min.js",
                "https://cdn.jsdelivr.net/npm/preloadjs@1.0.1/lib/preloadjs.min.js"],
            neededStyleLocations: ["https://cdn.jsdelivr.net/npm/jquery-ui-dist@1.12.1/jquery-ui.min.css"],
            psychoJSCSSLocation: "./lib/psychojs-$.css"
        }
    },
    methods: {
        handleData(filename, data, mimetype) {
            
            console.log(filename);            
            console.log(data);
            console.log(mimetype);
        },
        clearScript() {
            if (this.currentScript) {
                this.currentScript.remove();
            }
        },
        clearScripts() {
            while(this.loadedStyles.length > 0)
            {
                const style = this.loadedStyles.pop();
                style.remove();
            }
            while(this.loadedScripts.length > 0)
            {
                const script = this.loadedScripts.pop();
                script.remove();
            }
            if(this.psychoPyCSS)
            {
                this.psychoPyCSS.remove();
                this.psychoPyCSS = undefined;
            }
            this.clearScript()
        },
        setupScript() {
            this.clearScript()
            this.$http.get("/api/projectexec/" + this.$route.params.id + "/getCodeType")
                .then(response => {
                    this.psychoJSVersion = response.data.codeVersion;
                    this.setupCSS();
                    //and now, load the Javascript.                
                    const currentScript = document.createElement("script");
                    currentScript.setAttribute("src", "/projectexec/" + this.$route.params.id + "/execute");
                    currentScript.setAttribute("type", "module");
                    document.body.appendChild(currentScript);
                    if (!this.resultHandling) {
                        window.reportResult = this.handleData;
                        this.resultHandling = true;
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        setupCSS() {
            if (this.psychoPyCSS) {
                this.psychoPyCSS.remove();
            }
            console.log("Adding psychoJS CSS")
            const currentStyle = this.psychoJSCSSLocation.replace("$", this.psychoJSVersion);
            this.psychoPyCSS = document.createElement("link");
            this.psychoPyCSS.setAttribute("rel", "stylesheet");
            this.psychoPyCSS.setAttribute("href", currentStyle);            
            document.head.appendChild(this.psychoPyCSS);
        }

    },
    mounted() {
        for (const style of this.neededStyleLocations) {

            const currentStyle = document.createElement("link");
            currentStyle.setAttribute("rel", "stylesheet");
            currentStyle.setAttribute("href", style);
            document.head.appendChild(currentStyle);
            this.loadedStyles.push(currentStyle);
        }

        for (const script of this.neededScriptLocation) {

            const currentScript = document.createElement("script");
            currentScript.setAttribute("src", script);            
            document.body.appendChild(currentScript);
            this.loadedScripts.push(currentScript);
        }
        this.setupScript();
    },
    unmounted() {/*  */
        this.clearScripts();
    },
    watch:
    {
        id() {
            this.clearScript();
            if (!this.isScritpSet) {
                this.isScritpSet = true;
            }
        },
        psychoJSVersion(newValue) {
            if (this.psychoPyCSS) {
                this.psychoPyCSS.remove();
            }
            console.log("Adding psychoJS CSS")
            const currentStyle = this.psychoJSCSSLocation.replace("$", newValue);
            this.psychoPyCSS = document.createElement("link");
            this.psychoPyCSS.setAttribute("rel", "stylesheet");
            this.psychoPyCSS.setAttribute("href", currentStyle);
            document.head.appendChild(this.psychoPyCSS);
            // if we set the psychoJSVersion, we have a new script.             
        }
    }
};
</script>

<template>
    <div id="root">

    </div>
    {{ $route.path }}
    {{ $route.params }}
</template>



<style scoped>

</style>
