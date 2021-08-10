// import { gql } from 'apollo-boost';
import gql from 'graphql-tag';
// import { prisma } from '../src/generated/prisma-client';
// import { client } from './utils/getClient';
 
import { apolloClient } from 'src/apollo/client.js';
import axios from 'axios'

const URL_end_point = 'http://127.0.0.1:8000/api/graphql/'
jest.setTimeout(30000);
describe('Getting login credentials', () => {

	it('making a login request successfully', async () => {
		const LoginUserWithEmail = gql`
		mutation LoginUser($email:String!, $password: String!){
			tokenAuth(
				email: $email,
				password: $password,
			) {
				success,
				errors,
				token,
				user {
					id,
					username,
					firstName,
					lastName,
					fullName,
					verified,
					affiliateSet {
						edges {
							node {
								id,
								pk,
								affiliateLink
							}
						}
					}
				},
				refreshToken
			}
		}
		`;

		// try {
		// 	const res = await axios.post(URL_end_point,
		// 		{
		// 			query: LoginUserWithEmail,
		// 			varaibles: {
		// 				email: 'admin@admin.com',
		// 				password: 'admin'
		// 			}
		// 		},
		// 		{
		// 			headers: {
		// 				'Content-Type': 'application/json'
		// 			}
		// 		}
		// 	)

		
		// 	console.log('eeeeeeeeeeeeeeeeeeee')
		// 	console.log(res)
		// 	console.log('eeeeeeeeeeeeeeeeeeee')
		// } catch (error) {
		// 	console.log('eeeeeeeeeeeeeeeeeeee')
		// 	console.log(Object.keys(error))
		// 	console.log(error.networkError)
		// 	console.log(error.message)
		// 	console.log('eeeeeeeeeeeeeeeeeeee')
			
		// }
		await expect(
			apolloClient.mutate({
			mutation: LoginUserWithEmail,
			varaibles: {
				email: 'admin@admin.com',
				password: 'admin'
			}
		})
		).rejects.toThrowError("credentials are not valid");
	})

})