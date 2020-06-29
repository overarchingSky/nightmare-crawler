import Vue from 'vue'
import { ValidationObserver,ValidationProvider, extend } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'

Vue.component('ValidationObserver',ValidationObserver)
Vue.component('ValidationProvider',ValidationProvider)

Object.keys(rules).forEach(rule => {
    extend(rule, rules[rule]);
});