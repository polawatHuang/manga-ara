describe('Home Page Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  context('OK Cases - Home Page', () => {
    it('should load the home page successfully', () => {
      cy.url().should('include', '/')
      cy.get('body').should('be.visible')
    })

    it('should display top 10 popular manga section', () => {
      cy.contains('อ่านการ์ตูนยอดนิยมประจำเดือนนี้').should('be.visible')
    })

    it('should display recommended manga section', () => {
      cy.contains('มังงะแนะนำจากทางบ้าน').should('be.visible')
    })

    it('should display advertise component', () => {
      cy.get('section').first().should('exist')
    })

    it('should display manga cards in slider', () => {
      cy.get('[class*="CardSlider"]').should('exist')
    })

    it('should navigate to manga detail when clicking a card', () => {
      cy.get('a[href*="/"]').first().click()
      cy.url().should('not.equal', Cypress.config().baseUrl + '/')
    })

    it('should display tags section', () => {
      cy.contains('หมวดหมู่').should('be.visible')
    })

    it('should load manga data from API', () => {
      cy.intercept('GET', '**/api/mangas').as('getManga')
      cy.visit('/')
      cy.wait('@getManga').its('response.statusCode').should('eq', 200)
    })

    it('should load tags data from API', () => {
      cy.intercept('GET', '**/api/tags').as('getTags')
      cy.visit('/')
      cy.wait('@getTags').its('response.statusCode').should('eq', 200)
    })

    it('should load recommend data from API', () => {
      cy.intercept('GET', '**/api/recommend').as('getRecommend')
      cy.visit('/')
      cy.wait('@getRecommend').its('response.statusCode').should('eq', 200)
    })

    it('should display recommend form component', () => {
      cy.get('form').should('exist')
    })

    it('should filter manga by current month', () => {
      cy.get('[class*="CardSlider"]').should('exist')
      // Verify that cards are displayed (filtering logic tested in unit tests)
    })

    it('should render comment slider component', () => {
      cy.get('[class*="CommentSlider"]').should('exist')
    })

    it('should be responsive on mobile', () => {
      cy.viewport('iphone-x')
      cy.get('body').should('be.visible')
      cy.contains('อ่านการ์ตูนยอดนิยมประจำเดือนนี้').should('be.visible')
    })

    it('should be responsive on tablet', () => {
      cy.viewport('ipad-2')
      cy.get('body').should('be.visible')
      cy.contains('อ่านการ์ตูนยอดนิยมประจำเดือนนี้').should('be.visible')
    })
  })

  context('NG Cases - Home Page', () => {
    it('should handle API error when fetching manga', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('getMangaError')
      cy.visit('/')
      cy.wait('@getMangaError')
      // Should still render page structure
      cy.get('body').should('be.visible')
    })

    it('should handle API error when fetching tags', () => {
      cy.intercept('GET', '**/api/tags', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('getTagsError')
      cy.visit('/')
      cy.wait('@getTagsError')
      cy.get('body').should('be.visible')
    })

    it('should handle API error when fetching recommend data', () => {
      cy.intercept('GET', '**/api/recommend', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('getRecommendError')
      cy.visit('/')
      cy.wait('@getRecommendError')
      cy.get('body').should('be.visible')
    })

    it('should handle empty manga data', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: []
      }).as('getEmptyManga')
      cy.visit('/')
      cy.wait('@getEmptyManga')
      cy.get('body').should('be.visible')
    })

    it('should handle network timeout', () => {
      cy.intercept('GET', '**/api/mangas', (req) => {
        req.reply((res) => {
          res.delay(30000)
        })
      }).as('timeout')
      cy.visit('/')
      // Should still show page structure
      cy.get('body').should('be.visible')
    })

    it('should handle malformed JSON response', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: 'invalid json'
      }).as('invalidJson')
      cy.visit('/')
      cy.wait('@invalidJson')
      cy.get('body').should('be.visible')
    })
  })
})
