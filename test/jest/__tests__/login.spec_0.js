//TODO: Import the component to be tested
import VueI18n from 'vue-i18n'
import Login from 'src/components/Account/Login'
//TODO: Import the testing function
// import { mount } from '@vue/test-utils'
import { mount, createLocalVue } from '@vue/test-utils';
import * as All from 'quasar';
const { Quasar } = All;
//TODO: import Vuex
import Vuex from 'vuex';

import AccountHeader from "src/components/utils/accountHeader";
import GoogleAuthentication from 'src/components/Account/GoogleAuthentication';
import FacebookAuthentication from 'src/components/Account/FacebookAuthentication';

const components = Object.keys(All).reduce((object, key) => {
  const val = All[key];
  if (val && val.component && val.component.name != null) {
    object[key] = val;
  }
  return object;
}, {});

//TODO: Make the test
describe('Sabri Login functioality', () => {
	const localVue = createLocalVue();
	//TODO: Using i18n language
	localVue.use(VueI18n)
	//TODO: Using Vuex store
	localVue.use(Vuex)
	//TODO: Using Quasar
  localVue.use(Quasar, { components }); // , lang: langEn
	//TODO: Creating new i18n language object
	const i18n = new VueI18n()
  const wrapper = mount(Login, {
    localVue,
		components: {
			AccountHeader,
			GoogleAuthentication,
			FacebookAuthentication
		},
		i18n
  });
  const vm = wrapper.vm;
	// it('has a created hook', async () => {
	// 	//TODO: Test the login functionality
	// 	//TODO:
	// 	//TODO:
	// 	//TODO:
	// 	//TODO:
	// 	//TODO:
  // });
})