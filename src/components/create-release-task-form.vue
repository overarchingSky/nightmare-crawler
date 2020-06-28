<template>
  <div class="regular-release">
    <form novalidate class="md-layout md-gutter">
      <md-field class="firstName">
        <label for="first-name">First Name</label>
        <md-input
          name="first-name"
          id="first-name"
          autocomplete="given-name"
          v-model="form.firstName"
        />
      </md-field>
      <md-field class="lastName">
        <label for="last-name">Last Name</label>
        <md-input
          name="last-name"
          id="last-name"
          autocomplete="family-name"
          v-model="form.lastName"
        />
      </md-field>
      <md-field class="gender">
        <label for="gender">Gender</label>
        <md-select name="gender" id="gender" v-model="form.gender" md-dense>
          <md-option></md-option>
          <md-option value="M">M</md-option>
          <md-option value="F">F</md-option>
        </md-select>
        <!-- <span class="md-error">The gender is required</span> -->
      </md-field>
      <md-field class="age">
        <label for="age">Age</label>
        <md-input type="number" id="age" name="age" autocomplete="age" v-model="form.age" />
      </md-field>
      <md-field class="email">
        <label for="email">Email</label>
        <md-input type="email" name="email" id="email" autocomplete="email" v-model="form.email" />
      </md-field>
    </form>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: "create-release-task-form",
  data() {
    return {
      form: {
        firstName: null,
        lastName: null,
        gender: null,
        age: null,
        email: null
      }
    };
  },
  methods: {}
};
</script>
