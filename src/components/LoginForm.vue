<template> 
<b-dropdown-form @submit="submitForm" ref="loginForm">
    <b-form-group label="Username or Email" label-for="dropdown-form-email" @submit.stop.prevent>
      <b-form-input
        id="dropdown-form-email"
        size="sm"
        v-model="form.nameOrEmail"
        placeholder="email@example.com"
        ref="nameOrEmail"
        required
      ></b-form-input>
    </b-form-group>

    <b-form-group label="Password" label-for="dropdown-form-password" @submit.stop.prevent>
      <b-form-input
        id="dropdown-form-password"
        type="password"
        v-model="form.password"
        size="sm"
        placeholder="Password"
        ref="password"
        required
      ></b-form-input>
    </b-form-group>

    <b-form-checkbox v-model="form.rememberMe" class="mb-3">Remember me</b-form-checkbox>
    <b-button type="submit" variant="primary" size="sm" >Sign In</b-button>
  </b-dropdown-form>
</template>

<script>

export default {
    name: 'DropDownLoginForm',
    data() {
        return {

         form: {
            nameOrEmail: "",
            password: "",
            rememberMe: false
        }
        }
    }, 
    methods: {
      submitForm()
      {
        console.log(this.form);
        this.$emit("collapse");
        this.resetData();
      },
      resetData()
      {
        this.form.nameOrEmail = "",
        this.form.password = "",
        this.form.rememberMe = false
        
      }
    }
  
  }
  </script>