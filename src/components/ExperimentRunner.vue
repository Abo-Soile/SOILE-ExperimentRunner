<template>
    <SoileExpRunner v-if="type=='elang'"></SoileExpRunner>
    <PsychoJsRunner v-if="type=='psychojs'"></PsychoJsRunner>
    <SoileQuestionnaire v-if="type=='qlang'"></SoileQuestionnaire>
</template>
  
<script>



export default {
    name: 'HelloWorld',
    data() {
        return {
            id : '',
            type : '',
            version: '',
        }
    },
    methods: {
        listExperiments()
        {

        },
        signUp(Experiment, Token)
        {
            console.log(Experiment + " / " + Token)
        }   

    },
    beforeMount()
    {
        console.log("Current route: " );
        console.log(this.$route)
    },
    async beforeRouteUpdate(to, from)
    {
        console.log(to)
        console.log(from)
    },
    mounted()
    {
        
    }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
  