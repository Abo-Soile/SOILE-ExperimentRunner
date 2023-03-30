<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand><router-link
          to="/"
          class="nav-item nav-link"
          active-class="active"
          exact
        >Soile platform</router-link></b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#">Link</b-nav-item>
          <b-nav-item href="#" disabled>Disabled</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ms-auto">  
          <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
        </b-nav-form>       
          <b-nav-item-dropdown text="Lang" right>
            <b-dropdown-item href="#">EN</b-dropdown-item>
            <b-dropdown-item href="#">ES</b-dropdown-item>
            <b-dropdown-item href="#">RU</b-dropdown-item>
            <b-dropdown-item href="#">FA</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown v-if="authStore.user || authStore.projectToken" ref="userDropDown">
            <template #button-content>
              <em>{{authStore.user}}</em>
            </template>
            <!-- Using 'button-content' slot -->
            <b-dropdown-item v-if="authStore.user" href="#">User Details</b-dropdown-item>
            <b-dropdown-item-button @click="authStore.logout()">Logout</b-dropdown-item-button>            
          </b-nav-item-dropdown>
          <b-nav-item-dropdown v-else ref="loginDropDown">
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>User</em>
            </template>
            <Login @collapse="closeLogin" />
          </b-nav-item-dropdown>
          
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>
<script>
import Login from './LoginForm.vue'
import { useAuthStore } from '@/stores/auth.js'


export default {
  name: 'TopNavBar',
  props: {
    loggedIn: Boolean,
  },
  components: {
    Login
  },
  methods:
  {
    closeLogin() {    
      this.$refs.loginDropDown?.hide(true);
      this.$refs.userDropDown?.hide(true);
    },
  },
  setup() {    
    const authStore = useAuthStore();
    return {
      authStore
    }
  }
}
</script>