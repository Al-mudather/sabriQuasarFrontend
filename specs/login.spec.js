//TODO: Import the component to be tested
import Login from 'src/components/Account/Login'
//TODO: Import the testing function
// import { mount } from '@vue/test-utils'
import { mountQuasar } from '@quasar/quasar-app-extension-testing-unit-jest';
//TODO: import Vuex
// import Vuex from 'vuex';

//TODO: Make the test
test('Login in success', () => {
	//TODO: Get the wrapper
	const wrapper = mountQuasar (Login)
	console.log('lllllllllllllllllllllllll')
	console.log(wrapper)
	console.log('lllllllllllllllllllllllll')
})
