/// <reference path="cypress" />
/// <reference path="../support/index.d.ts" />

describe('Test the registeration process process', () => {
  beforeEach(() => {
    cy.visit('localhost:8080/#/account/signUp')
  });

  it('Test the login to be success and the user have the registeration code', () => {
    //TODO: find and fill the full name input
    cy.get('#fullName').type('almudather yahya');
    //TODO: find and fill the email input
    cy.get('#regEmail').type('wollof8@gmail.com');
    //TODO: fill the signup password
    cy.get('#regPassword').type('shadow20@20')
    //TODO: fill the signUp password2
    cy.get('#regPassword2').type('shadow20@20')
    //TODO: find the signUp button and make the action
    cy.get('#siginUpAction').as('signUpAction').click();
    //TODO: if the registeration is success
    // Go to the account confirm code page
    cy.url().should('contain', 'confirm')
  });
});
