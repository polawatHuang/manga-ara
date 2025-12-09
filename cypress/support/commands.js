// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to login
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
})

// Custom command to logout
Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('token')
    win.localStorage.removeItem('user')
  })
})

// Custom command to check if logged in
Cypress.Commands.add('isLoggedIn', () => {
  cy.window().then((win) => {
    return win.localStorage.getItem('token') !== null
  })
})

// Custom command to intercept API calls
Cypress.Commands.add('mockApiResponse', (endpoint, data, statusCode = 200) => {
  cy.intercept('GET', endpoint, {
    statusCode: statusCode,
    body: data,
  }).as('apiCall')
})
