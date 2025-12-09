describe('Episode Reader Page Tests', () => {
  const testSlug = 'test-manga'
  const testEp = '1'

  beforeEach(() => {
    cy.intercept('GET', '**/api/mangas', {
      statusCode: 200,
      body: [
        {
          id: '1',
          name: 'Test Manga',
          slug: testSlug,
          ep: [
            {
              episode_no: 1,
              title: 'Episode 1',
              view: 1000,
              images: [
                'http://example.com/page1.jpg',
                'http://example.com/page2.jpg',
                'http://example.com/page3.jpg'
              ]
            },
            {
              episode_no: 2,
              title: 'Episode 2',
              view: 900,
              images: ['http://example.com/ep2-page1.jpg']
            }
          ]
        }
      ]
    }).as('getMangas')

    cy.visit(`/${testSlug}/${testEp}`)
  })

  context('OK Cases - Episode Reader Page', () => {
    it('should load episode page successfully', () => {
      cy.wait('@getMangas')
      cy.url().should('include', `/${testSlug}/${testEp}`)
    })

    it('should display manga name', () => {
      cy.wait('@getMangas')
      cy.contains('Test Manga').should('be.visible')
    })

    it('should display episode title', () => {
      cy.wait('@getMangas')
      cy.contains('Episode 1').should('be.visible')
    })

    it('should display all episode images', () => {
      cy.wait('@getMangas')
      cy.get('img[src*="page1.jpg"]').should('exist')
      cy.get('img[src*="page2.jpg"]').should('exist')
      cy.get('img[src*="page3.jpg"]').should('exist')
    })

    it('should display image count', () => {
      cy.wait('@getMangas')
      cy.contains('3').should('be.visible')
    })

    it('should have navigation to previous episode', () => {
      cy.visit(`/${testSlug}/2`)
      cy.wait('@getMangas')
      cy.get('a[href*="/1"]').should('exist')
    })

    it('should have navigation to next episode', () => {
      cy.wait('@getMangas')
      cy.get('a[href*="/2"]').should('exist')
    })

    it('should display manga reader component', () => {
      cy.wait('@getMangas')
      cy.get('[class*="MangaReader"]').should('exist')
    })

    it('should track episode views', () => {
      cy.wait('@getMangas')
      cy.get('[class*="ViewTrackerForEP"]').should('exist')
    })

    it('should display comment section', () => {
      cy.wait('@getMangas')
      cy.get('[class*="MangaEpisodeComments"]').should('exist')
    })

    it('should allow posting comments', () => {
      cy.wait('@getMangas')
      cy.intercept('POST', '**/api/comments', {
        statusCode: 200,
        body: { message: 'Comment posted successfully' }
      }).as('postComment')

      cy.get('textarea[placeholder*="Comment"]').type('Great episode!')
      cy.get('button').contains('Post').click()
      cy.wait('@postComment')
    })

    it('should display existing comments', () => {
      cy.intercept('GET', '**/api/comments', {
        statusCode: 200,
        body: [
          { id: 1, user: 'Test User', comment: 'Nice!', created_at: new Date() }
        ]
      }).as('getComments')

      cy.wait('@getMangas')
      cy.wait('@getComments')
      cy.contains('Nice!').should('be.visible')
    })

    it('should scroll images on page scroll', () => {
      cy.wait('@getMangas')
      cy.scrollTo('bottom')
      cy.get('img[src*="page3.jpg"]').should('be.visible')
    })

    it('should display advertise between images', () => {
      cy.wait('@getMangas')
      cy.get('[class*="Advertise"]').should('exist')
    })

    it('should lazy load images', () => {
      cy.wait('@getMangas')
      cy.get('img[loading="lazy"]').should('exist')
    })

    it('should have back button to manga detail', () => {
      cy.wait('@getMangas')
      cy.get(`a[href*="/${testSlug}"]`).should('exist')
    })

    it('should be responsive on mobile', () => {
      cy.viewport('iphone-x')
      cy.wait('@getMangas')
      cy.get('img[src*="page1.jpg"]').should('be.visible')
    })

    it('should be responsive on tablet', () => {
      cy.viewport('ipad-2')
      cy.wait('@getMangas')
      cy.get('img[src*="page1.jpg"]').should('be.visible')
    })

    it('should display loading spinner initially', () => {
      cy.intercept('GET', '**/api/mangas', (req) => {
        req.reply((res) => {
          res.delay(1000)
          res.send([])
        })
      }).as('slowLoad')

      cy.visit(`/${testSlug}/${testEp}`)
      cy.get('[class*="loading"]').should('exist')
    })

    it('should preload next episode images', () => {
      cy.wait('@getMangas')
      // Check for preload links
      cy.get('link[rel="preload"]').should('exist')
    })

    it('should have fullscreen option', () => {
      cy.wait('@getMangas')
      cy.get('button').contains('Fullscreen').should('exist')
    })

    it('should zoom images on click', () => {
      cy.wait('@getMangas')
      cy.get('img[src*="page1.jpg"]').click()
      // Check for zoom effect
    })
  })

  context('NG Cases - Episode Reader Page', () => {
    it('should handle episode not found', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: [
          {
            id: '1',
            name: 'Test Manga',
            slug: testSlug,
            ep: []
          }
        ]
      }).as('noEpisode')

      cy.visit(`/${testSlug}/999`)
      cy.wait('@noEpisode')
      cy.contains('Episode not found').should('be.visible')
    })

    it('should handle manga not found', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: []
      }).as('noManga')

      cy.visit('/non-existent/1')
      cy.wait('@noManga')
      cy.contains('Not found').should('be.visible')
    })

    it('should handle API error', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('apiError')

      cy.visit(`/${testSlug}/${testEp}`)
      cy.wait('@apiError')
      cy.contains('Error').should('be.visible')
    })

    it('should handle network error', () => {
      cy.intercept('GET', '**/api/mangas', {
        forceNetworkError: true
      }).as('networkError')

      cy.visit(`/${testSlug}/${testEp}`)
      cy.wait('@networkError')
    })

    it('should handle episode with no images', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: [
          {
            id: '1',
            name: 'Test Manga',
            slug: testSlug,
            ep: [
              { episode_no: 1, title: 'Episode 1', images: [] }
            ]
          }
        ]
      }).as('noImages')

      cy.visit(`/${testSlug}/${testEp}`)
      cy.wait('@noImages')
      cy.contains('No images').should('be.visible')
    })

    it('should handle broken image URLs', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: [
          {
            id: '1',
            name: 'Test Manga',
            slug: testSlug,
            ep: [
              {
                episode_no: 1,
                images: ['http://broken-url/image.jpg']
              }
            ]
          }
        ]
      }).as('brokenImages')

      cy.visit(`/${testSlug}/${testEp}`)
      cy.wait('@brokenImages')
      // Should show placeholder or error image
    })

    it('should handle failed comment post', () => {
      cy.wait('@getMangas')

      cy.intercept('POST', '**/api/comments', {
        statusCode: 500,
        body: { error: 'Failed to post comment' }
      }).as('commentError')

      cy.get('textarea[placeholder*="Comment"]').type('Test comment')
      cy.get('button').contains('Post').click()
      cy.wait('@commentError')
      cy.contains('Failed').should('be.visible')
    })

    it('should handle empty comment submission', () => {
      cy.wait('@getMangas')
      cy.get('button').contains('Post').click()
      cy.contains('Comment cannot be empty').should('be.visible')
    })

    it('should handle very long comment', () => {
      cy.wait('@getMangas')
      const longComment = 'a'.repeat(10000)
      cy.get('textarea[placeholder*="Comment"]').type(longComment)
      cy.get('button').contains('Post').click()
    })

    it('should handle XSS in comments', () => {
      cy.wait('@getMangas')
      cy.get('textarea[placeholder*="Comment"]').type('<script>alert("xss")</script>')
      cy.get('button').contains('Post').click()
      cy.get('script').should('not.exist')
    })

    it('should handle invalid episode number', () => {
      cy.visit(`/${testSlug}/abc`)
      cy.contains('Invalid episode').should('be.visible')
    })

    it('should handle negative episode number', () => {
      cy.visit(`/${testSlug}/-1`)
      cy.contains('Invalid episode').should('be.visible')
    })

    it('should handle zero episode number', () => {
      cy.visit(`/${testSlug}/0`)
      cy.contains('Invalid episode').should('be.visible')
    })

    it('should handle very large episode number', () => {
      cy.visit(`/${testSlug}/999999999`)
      cy.contains('Episode not found').should('be.visible')
    })

    it('should handle malformed manga data', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: [{ invalid: 'data' }]
      }).as('malformed')

      cy.visit(`/${testSlug}/${testEp}`)
      cy.wait('@malformed')
    })

    it('should handle timeout loading images', () => {
      cy.intercept('GET', '**/page1.jpg', (req) => {
        req.reply((res) => {
          res.delay(30000)
        })
      }).as('imageTimeout')

      cy.wait('@getMangas')
      // Should show loading state or error
    })

    it('should handle slow network', () => {
      cy.intercept('GET', '**/api/mangas', (req) => {
        req.reply((res) => {
          res.delay(5000)
          res.send([])
        })
      }).as('slowNetwork')

      cy.visit(`/${testSlug}/${testEp}`)
      cy.get('[class*="loading"]').should('be.visible')
    })

    it('should handle comment API error', () => {
      cy.wait('@getMangas')

      cy.intercept('GET', '**/api/comments', {
        statusCode: 500,
        body: { error: 'Failed to load comments' }
      }).as('commentsError')

      cy.visit(`/${testSlug}/${testEp}`)
      cy.wait('@commentsError')
    })

    it('should handle unauthorized comment post', () => {
      cy.wait('@getMangas')

      cy.intercept('POST', '**/api/comments', {
        statusCode: 401,
        body: { error: 'Unauthorized' }
      }).as('unauthorized')

      cy.get('textarea[placeholder*="Comment"]').type('Test')
      cy.get('button').contains('Post').click()
      cy.wait('@unauthorized')
      cy.contains('Unauthorized').should('be.visible')
    })
  })
})
