/// <reference path="cypress" />
/// <reference path="../support/index.d.ts" />

describe('Test the login process', () => {
  beforeEach(() => {
    cy.visit('localhost:8080/#/account/login')
  });

  it('Test the login to be success and the user have the registeration code', () => {
    //TODO:1) find and fill the email input
    cy.get('#email').type('admin@admin.com');
    //TODO:2) find and fill the password input
    cy.get('#password').type('admin');
    //TODO:3) find the login button and make the action
    cy.get('#loginBtn').as('loginAction').click();
    //TODO: if the registeration is success
    // Go to the home page
    cy.url().should('eq', 'http://localhost:8080/#/home')
  });

  it('Test the login to be success and the user do not have the registeration code, the registeration code page must be shown', () => {
    //TODO:1) find and fill the email input
    cy.get('#email').type('man@admin.com');
    //TODO:2) find and fill the password input
    cy.get('#password').type('man');
    //TODO:3) find the login button and make the action
    cy.get('#loginBtn').as('loginAction').click();
    //TODO: if the user don't have the registeration code, the platform redirected him to the
    // registeration code page
    cy.url().should('contain', 'registerationCode')
  });
});

// ** The following code is an example to show you how to write some tests for your home page **
//
// describe('Home page tests', () => {
//   beforeEach(() => {
//     cy.visit('/');
//   });
//   it('has pretty background', () => {
//     cy.dataCy('landing-wrapper')
//       .should('have.css', 'background').and('match', /(".+(\/img\/background).+\.png)/);
//   });
//   it('has pretty logo', () => {
//     cy.dataCy('landing-wrapper img')
//       .should('have.class', 'logo-main')
//       .and('have.attr', 'src')
//       .and('match', /^(data:image\/svg\+xml).+/);
//   });
//   it('has very important information', () => {
//     cy.dataCy('instruction-wrapper')
//       .should('contain', 'SETUP INSTRUCTIONS')
//       .and('contain', 'Configure Authentication')
//       .and('contain', 'Database Configuration and CRUD operations')
//       .and('contain', 'Continuous Integration & Continuous Deployment CI/CD');
//   });
// });
