<template>
  <Menubar :model="menuItems">
    <template #start>
      <div class="p-mr-2">
        <router-link to="/">
          Soile <!--<img src="path/to/your/logo.png" alt="Logo" />-->
        </router-link>
      </div>
    </template>
  </Menubar>
  <Dialog v-model:visible="showLoginDialog" header="Login">
    <Login @submitted="showLoginDialog = false" />
  </Dialog>
</template>

<script>
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import Dialog from 'primevue/dialog'
import { computed, ref } from 'vue'
import Login from './LoginForm.vue'
import { useAuthStore } from '@/stores/auth.js'

export default {
  name: 'TopNavbar',
  components: { Login, Menubar, Button, Menu, Dialog },

  computed:
  {
    menuItems() {
      return [
      this.isResearcher ? {
          label: "Project Management",
          icon: 'pi pi-file-edit',
          to: '/management'          
        } : {},
        {
          label: this.isLoggedIn ? 'Profile' : 'Login',
          icon: this.isLoggedIn ? 'pi pi-user' : 'pi pi-sign-in',
          items: this.isLoggedIn ? [
            {
              label: "Profile",
              icon: 'pi pi-user',
              routerLink: '/user'
            },
            {
              label: "Logout",
              icon: 'pi pi-fw pi-power-off',
              command: async () => await this.authStore.logout()
            }
          ] : undefined,
          command: this.isLoggedIn ? undefined : () => this.showLoginDialog = true
        }
        
      ]

    }
  },
  setup() {
    const authStore = useAuthStore()
    const showLoginDialog = ref(false)
    const isLoggedIn = computed(() => authStore.authed)
    const isAdmin = computed(() => authStore.isAdmin())
    const isResearcher = computed(() => authStore.isResearcher())
    return {
      showLoginDialog,
      isLoggedIn,
      authStore,
      isResearcher,
      isAdmin
    }
  }
}
</script>