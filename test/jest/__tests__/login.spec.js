import { gql } from 'apollo-boost';
import { prisma } from '../src/generated/prisma-client';
import { client } from './utils/getClient';

import { apolloClient } from 'src/apollo/client.js';

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

		await expect(client.mutate({
			mutation: LoginUserWithEmail,
			varaibles: {
				email: 'admin@admin.com',
				password: 'admin'
			}
		})).rejects.toThrowError("credentials are not valid");
	})

})