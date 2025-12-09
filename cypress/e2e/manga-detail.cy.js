describe('Manga Detail Page Tests', () => {
  const testSlug = 'test-manga'

  beforeEach(() => {
    cy.intercept('GET', '**/api/mangas', {
      statusCode: 200,
      body: [
        {
          id: '1',
          name: 'Test Manga',
          slug: testSlug,
          description: 'This is a test manga description',
          backgroundImage: 'http://example.com/bg.jpg',
          tag: ['Action', 'Adventure'],
          view: 5000,
          ep: [
            { episode_no: 1, title: 'Episode 1', view: 1000, images: ['img1.jpg'] },
            { episode_no: 2, title: 'Episode 2', view: 900, images: ['img2.jpg'] },
            { episode_no: 3, title: 'Episode 3', view: 800, images: ['img3.jpg'] }
          ]
        },
        {
          id: '2',
          name: 'Another Manga',
          slug: 'another-manga',
          tag: ['Romance']
        }
      ]
    }).as('getMangas')

    cy.visit(`/${testSlug}`)
  })

  context('OK Cases - Manga Detail Page', () => {
    it('should load manga detail page successfully', () => {
      cy.wait('@getMangas')
      cy.url().should('include', `/${testSlug}`)
    })

    it('should display manga name', () => {
      cy.wait('@getMangas')
      cy.contains('Test Manga').should('be.visible')
    })

    it('should display manga description', () => {
      cy.wait('@getMangas')
      cy.contains('This is a test manga description').should('be.visible')
    })

    it('should display manga background image', () => {
      cy.wait('@getMangas')
      cy.get('img[src*="bg.jpg"]').should('exist')
    })

    it('should display episode list', () => {
      cy.wait('@getMangas')
      cy.contains('Episode 1').should('be.visible')
      cy.contains('Episode 2').should('be.visible')
      cy.contains('Episode 3').should('be.visible')
    })

    it('should display episode view counts', () => {
      cy.wait('@getMangas')
      cy.contains('1000').should('be.visible')
    })

    it('should have search functionality', () => {
      cy.wait('@getMangas')
      cy.get('input[placeholder*="Search"]').should('exist')
    })

    it('should search episodes by number', () => {
      cy.wait('@getMangas')
      cy.get('input[placeholder*="Search"]').type('1')
      cy.contains('Episode 1').should('be.visible')
      cy.contains('Episode 2').should('not.be.visible')
    })

    it('should search episodes by title', () => {
      cy.wait('@getMangas')
      cy.get('input[placeholder*="Search"]').type('Episode 2')
      cy.contains('Episode 2').should('be.visible')
      cy.contains('Episode 1').should('not.be.visible')
    })

    it('should clear search results', () => {
      cy.wait('@getMangas')
      cy.get('input[placeholder*="Search"]').type('1')
      cy.get('input[placeholder*="Search"]').clear()
      cy.contains('Episode 1').should('be.visible')
      cy.contains('Episode 2').should('be.visible')
    })

    it('should display share button', () => {
      cy.wait('@getMangas')
      cy.get('button').contains('Share').should('exist')
    })

    it('should copy URL to clipboard when share is clicked', () => {
      cy.wait('@getMangas')
      cy.get('button').contains('Share').click()
      // Verify clipboard functionality
    })

    it('should navigate to episode page when clicking episode', () => {
      cy.wait('@getMangas')
      cy.contains('Episode 1').click()
      cy.url().should('include', `/${testSlug}/1`)
    })

    it('should display advertise component', () => {
      cy.wait('@getMangas')
      cy.get('[class*="Advertise"]').should('exist')
    })

    it('should display recommended manga section', () => {
      cy.wait('@getMangas')
      cy.get('[class*="CardComponent"]').should('exist')
    })

    it('should track page views', () => {
      cy.wait('@getMangas')
      cy.get('[class*="ViewTracker"]').should('exist')
    })

    it('should display tags', () => {
      cy.wait('@getMangas')
      cy.contains('Action').should('be.visible')
      cy.contains('Adventure').should('be.visible')
    })

    it('should be responsive on mobile', () => {
      cy.viewport('iphone-x')
      cy.wait('@getMangas')
      cy.contains('Test Manga').should('be.visible')
    })

    it('should be responsive on tablet', () => {
      cy.viewport('ipad-2')
      cy.wait('@getMangas')
      cy.contains('Test Manga').should('be.visible')
    })

    it('should sort episodes by number', () => {
      cy.wait('@getMangas')
      cy.get('select').select('Newest')
      cy.contains('Episode 3').should('be.visible')
    })

    it('should display total episode count', () => {
      cy.wait('@getMangas')
      cy.contains('3').should('be.visible')
    })
  })

  context('NG Cases - Manga Detail Page', () => {
    it('should handle manga not found', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: []
      }).as('emptyMangas')

      cy.visit('/non-existent-manga')
      cy.wait('@emptyMangas')
      cy.contains('Not Found').should('be.visible')
    })

    it('should handle API error', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('apiError')

      cy.visit(`/${testSlug}`)
      cy.wait('@apiError')
      cy.contains('Error').should('be.visible')
    })

    it('should handle network error', () => {
      cy.intercept('GET', '**/api/mangas', {
        forceNetworkError: true
      }).as('networkError')

      cy.visit(`/${testSlug}`)
      cy.wait('@networkError')
    })

    it('should handle manga with no episodes', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: [
          {
            id: '1',
            name: 'Test Manga',
            slug: testSlug,
            description: 'Test',
            ep: []
          }
        ]
      }).as('noEpisodes')

      cy.visit(`/${testSlug}`)
      cy.wait('@noEpisodes')
      cy.contains('No episodes').should('be.visible')
    })

    it('should handle manga with null episodes', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: [
          {
            id: '1',
            name: 'Test Manga',
            slug: testSlug,
            ep: null
          }
        ]
      }).as('nullEpisodes')

      cy.visit(`/${testSlug}`)
      cy.wait('@nullEpisodes')
    })

    it('should handle malformed manga data', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: [{ invalid: 'data' }]
      }).as('malformed')

      cy.visit(`/${testSlug}`)
      cy.wait('@malformed')
    })

    it('should handle search with no results', () => {
      cy.wait('@getMangas')
      cy.get('input[placeholder*="Search"]').type('nonexistent')
      cy.contains('No episodes found').should('be.visible')
    })

    it('should handle very long search query', () => {
      cy.wait('@getMangas')
      cy.get('input[placeholder*="Search"]').type('a'.repeat(1000))
    })

    it('should handle missing manga images', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: [
          {
            id: '1',
            name: 'Test Manga',
            slug: testSlug,
            backgroundImage: null,
            ep: []
          }
        ]
      }).as('noImage')

      cy.visit(`/${testSlug}`)
      cy.wait('@noImage')
    })

    it('should handle special characters in slug', () => {
      const specialSlug = 'test-manga-!@#$%'
      cy.visit(`/${encodeURIComponent(specialSlug)}`)
    })

    it('should handle Thai characters in slug', () => {
      const thaiSlug = 'มังงะทดสอบ'
      cy.visit(`/${encodeURIComponent(thaiSlug)}`)
    })

    it('should handle loading state', () => {
      cy.intercept('GET', '**/api/mangas', (req) => {
        req.reply((res) => {
          res.delay(1000)
          res.send([])
        })
      }).as('slowLoad')

      cy.visit(`/${testSlug}`)
      cy.get('[class*="loading"]').should('exist')
    })

    it('should handle timeout', () => {
      cy.intercept('GET', '**/api/mangas', (req) => {
        req.reply((res) => {
          res.delay(30000)
        })
      }).as('timeout')

      cy.visit(`/${testSlug}`)
    })

    it('should handle XSS in manga name', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: [
          {
            id: '1',
            name: '<script>alert("xss")</script>',
            slug: testSlug,
            ep: []
          }
        ]
      }).as('xss')

      cy.visit(`/${testSlug}`)
      cy.wait('@xss')
      cy.get('script').should('not.exist')
    })

    it('should handle SQL injection in search', () => {
      cy.wait('@getMangas')
      cy.get('input[placeholder*="Search"]').type("1' OR '1'='1")
    })
  })
})
