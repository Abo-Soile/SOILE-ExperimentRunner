<template>
    <div>
        <h1> Please log </h1>
        <b-form @submit="onSubmit" @reset="onReset">
            <b-form-group
        id="input-group-1"
        label="Email address or Username:"
        label-for="input-1"
        description="We'll never share your email with anyone else."
      >
        <b-form-input
          id="input-1"
          v-model="form.email"
          type="email"
          placeholder="Enter email"
          required
        ></b-form-input>
      </b-form-group>
        </b-form>
        <div v-if="OAuthLogins">
            <div v-for="oAuth in OAuthLogins" :key="oAuth.welcome">
                <OAuthButton :oAuthURL="oAuth.oAuthURL" :Welcome="oAuth.welcome" :image="oAuth.image" />
            </div>
        </div>
    </div>
</template>

<script>

import OAuthButton from "@/components/Auth/OAuthButton.vue"
import { useAuthStore } from '@/stores';


export default {
    name: 'LoginModal',
    props: {
        anonymousLogin:
        {
            type: Boolean,
            required: true
        },
        OAuthLogins: {
            type: Array,
            required: false
        },
    },
    emits: ['loginEvent', 'anonymousUse'],
    data() {
        return {
            username: "",
            password: "",
        }
    },
    components: { OAuthButton },
    methods: {
        handleSubmit() {
            this.$emit("loginEvent", { "username": this.username, "password": this.password, "provider": "local" });
        },
        handleEnter() {
            this.handleSubmit()
            // and close this
            this.$bvModal.hide("login-modal")
        },
        cancelLogin() {
            if (this.anonymousLogin) {
                this.$emit("anonymousUse");
            }
        }
    },
    computed: {

        cancelLabel() {
            return this.anonymousLogin ? 'Use Anonymously' : 'Cancel'
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
