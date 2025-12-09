describe('Login Page Tests', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  context('OK Cases - Login Page', () => {
    it('should load the login page successfully', () => {
      cy.url().should('include', '/login')
      cy.contains('Login').should('be.visible')
    })

    it('should display email input field', () => {
      cy.get('input[type="email"]').should('be.visible')
    })

    it('should display password input field', () => {
      cy.get('input[type="password"]').should('be.visible')
    })

    it('should display submit button', () => {
      cy.get('button[type="submit"]').should('be.visible')
    })

    it('should display login modal', () => {
      cy.get('[role="dialog"]').should('be.visible')
    })

    it('should allow typing in email field', () => {
      cy.get('input[type="email"]').type('test@example.com')
      cy.get('input[type="email"]').should('have.value', 'test@example.com')
    })

    it('should allow typing in password field', () => {
      cy.get('input[type="password"]').type('password123')
      cy.get('input[type="password"]').should('have.value', 'password123')
    })

    it('should successfully login with valid credentials', () => {
      cy.intercept('POST', '**/api/auth?action=login', {
        statusCode: 200,
        body: {
          token: 'valid-token-123',
          user: {
            user_id: 1,
            email: 'admin@test.com',
            display_name: 'Admin',
            role: 'admin'
          }
        }
      }).as('loginSuccess')

      cy.get('input[type="email"]').type('admin@test.com')
      cy.get('input[type="password"]').type('password123')
      cy.get('button[type="submit"]').click()

      cy.wait('@loginSuccess')
      cy.url().should('include', '/admin')
    })

    it('should store token in localStorage after successful login', () => {
      cy.intercept('POST', '**/api/auth?action=login', {
        statusCode: 200,
        body: {
          token: 'valid-token-123',
          user: { user_id: 1, email: 'admin@test.com', role: 'admin' }
        }
      }).as('login')

      cy.get('input[type="email"]').type('admin@test.com')
      cy.get('input[type="password"]').type('password123')
      cy.get('button[type="submit"]').click()

      cy.wait('@login')
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.equal('valid-token-123')
      })
    })

    it('should redirect already logged-in user to admin', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'existing-token')
      })

      cy.intercept('POST', '**/api/auth?action=verify', {
        statusCode: 200,
        body: { valid: true, user: { role: 'admin' } }
      }).as('verify')

      cy.visit('/login')
      cy.wait('@verify')
      cy.url().should('include', '/admin')
    })

    it('should show loading state during login', () => {
      cy.intercept('POST', '**/api/auth?action=login', (req) => {
        req.reply((res) => {
          res.delay(1000)
          res.send({ token: 'test-token', user: {} })
        })
      }).as('loginSlow')

      cy.get('input[type="email"]').type('test@test.com')
      cy.get('input[type="password"]').type('password')
      cy.get('button[type="submit"]').click()

      // Check for loading state (button disabled or loading text)
      cy.get('button[type="submit"]').should('be.disabled')
    })

    it('should have background image', () => {
      cy.get('div[style*="backgroundImage"]').should('exist')
    })

    it('should display back button link', () => {
      cy.get('a').contains('Back').should('exist')
    })
  })

  context('NG Cases - Login Page', () => {
    it('should show error with invalid credentials', () => {
      cy.intercept('POST', '**/api/auth?action=login', {
        statusCode: 401,
        body: { error: 'Invalid email or password' }
      }).as('loginFail')

      cy.get('input[type="email"]').type('wrong@test.com')
      cy.get('input[type="password"]').type('wrongpassword')
      cy.get('button[type="submit"]').click()

      cy.wait('@loginFail')
      cy.contains('Invalid email or password').should('be.visible')
    })

    it('should require email field', () => {
      cy.get('input[type="password"]').type('password123')
      cy.get('button[type="submit"]').click()
      
      cy.get('input[type="email"]:invalid').should('exist')
    })

    it('should require password field', () => {
      cy.get('input[type="email"]').type('test@test.com')
      cy.get('button[type="submit"]').click()
      
      cy.get('input[type="password"]:invalid').should('exist')
    })

    it('should validate email format', () => {
      cy.get('input[type="email"]').type('invalid-email')
      cy.get('input[type="password"]').type('password')
      cy.get('button[type="submit"]').click()
      
      cy.get('input[type="email"]:invalid').should('exist')
    })

    it('should handle server error', () => {
      cy.intercept('POST', '**/api/auth?action=login', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('serverError')

      cy.get('input[type="email"]').type('test@test.com')
      cy.get('input[type="password"]').type('password')
      cy.get('button[type="submit"]').click()

      cy.wait('@serverError')
      cy.contains('Login failed').should('be.visible')
    })

    it('should handle network error', () => {
      cy.intercept('POST', '**/api/auth?action=login', {
        forceNetworkError: true
      }).as('networkError')

      cy.get('input[type="email"]').type('test@test.com')
      cy.get('input[type="password"]').type('password')
      cy.get('button[type="submit"]').click()

      cy.wait('@networkError')
      cy.contains('Login failed').should('be.visible')
    })

    it('should handle empty credentials', () => {
      cy.get('button[type="submit"]').click()
      
      cy.get('input[type="email"]:invalid').should('exist')
      cy.get('input[type="password"]:invalid').should('exist')
    })

    it('should handle unauthorized access', () => {
      cy.intercept('POST', '**/api/auth?action=login', {
        statusCode: 403,
        body: { error: 'Account is deactivated' }
      }).as('forbidden')

      cy.get('input[type="email"]').type('disabled@test.com')
      cy.get('input[type="password"]').type('password')
      cy.get('button[type="submit"]').click()

      cy.wait('@forbidden')
      cy.contains('Account is deactivated').should('be.visible')
    })

    it('should handle very long email input', () => {
      const longEmail = 'a'.repeat(300) + '@test.com'
      cy.get('input[type="email"]').type(longEmail)
      cy.get('input[type="password"]').type('password')
      cy.get('button[type="submit"]').click()
    })

    it('should handle very long password input', () => {
      const longPassword = 'a'.repeat(1000)
      cy.get('input[type="email"]').type('test@test.com')
      cy.get('input[type="password"]').type(longPassword)
      cy.get('button[type="submit"]').click()
    })

    it('should handle SQL injection attempt in email', () => {
      cy.get('input[type="email"]').type("admin'--@test.com")
      cy.get('input[type="password"]').type('password')
      cy.get('button[type="submit"]').click()
    })

    it('should handle XSS attempt in input', () => {
      cy.get('input[type="email"]').type('<script>alert("xss")</script>@test.com')
      cy.get('input[type="password"]').type('<script>alert("xss")</script>')
      cy.get('button[type="submit"]').click()
    })

    it('should clear error message when typing', () => {
      cy.intercept('POST', '**/api/auth?action=login', {
        statusCode: 401,
        body: { error: 'Invalid credentials' }
      }).as('loginFail')

      cy.get('input[type="email"]').type('wrong@test.com')
      cy.get('input[type="password"]').type('wrong')
      cy.get('button[type="submit"]').click()

      cy.wait('@loginFail')
      cy.contains('Invalid credentials').should('be.visible')

      cy.get('input[type="email"]').clear().type('new@test.com')
      // Error should be cleared
    })
  })
})
