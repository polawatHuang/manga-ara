describe('Tags Page Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/mangas', {
      statusCode: 200,
      body: [
        {
          id: '1',
          name: 'Manga 1',
          slug: 'manga-1',
          tag: ['Action', 'Adventure'],
          ep: [
            { episode_no: 1, view: 500 },
            { episode_no: 2, view: 300 }
          ]
        },
        {
          id: '2',
          name: 'Manga 2',
          slug: 'manga-2',
          tag: ['Romance', 'Action'],
          ep: [
            { episode_no: 1, view: 1000 }
          ]
        },
        {
          id: '3',
          name: 'Manga 3',
          slug: 'manga-3',
          tag: ['Comedy'],
          ep: [
            { episode_no: 1, view: 200 }
          ]
        }
      ]
    }).as('getMangas')

    cy.visit('/tags')
  })

  context('OK Cases - Tags Page', () => {
    it('should load tags page successfully', () => {
      cy.wait('@getMangas')
      cy.url().should('include', '/tags')
    })

    it('should display page title', () => {
      cy.wait('@getMangas')
      cy.contains('หมวดหมู่').should('be.visible')
    })

    it('should display all unique tags', () => {
      cy.wait('@getMangas')
      cy.contains('Action').should('be.visible')
      cy.contains('Adventure').should('be.visible')
      cy.contains('Romance').should('be.visible')
      cy.contains('Comedy').should('be.visible')
    })

    it('should display tag count', () => {
      cy.wait('@getMangas')
      cy.contains('Action').parent().should('contain', '1800') // 500+300+1000
    })

    it('should have sort by A-Z option', () => {
      cy.wait('@getMangas')
      cy.get('select').should('contain', 'A-Z')
    })

    it('should have sort by popularity option', () => {
      cy.wait('@getMangas')
      cy.get('select').should('contain', 'ยอดนิยม')
    })

    it('should sort tags A-Z by default', () => {
      cy.wait('@getMangas')
      cy.get('select').should('have.value', 'A-Z')
    })

    it('should sort tags alphabetically', () => {
      cy.wait('@getMangas')
      cy.get('select').select('A-Z')
      // Verify order
      const tags = []
      cy.get('[class*="tag"]').each(($el) => {
        tags.push($el.text())
      }).then(() => {
        const sorted = [...tags].sort()
        expect(tags).to.deep.equal(sorted)
      })
    })

    it('should sort tags by popularity', () => {
      cy.wait('@getMangas')
      cy.get('select').select('ยอดนิยม')
      // Action should be first (1800 views)
      cy.get('[class*="tag"]').first().should('contain', 'Action')
    })

    it('should navigate to tag detail page when clicking tag', () => {
      cy.wait('@getMangas')
      cy.contains('Action').click()
      cy.url().should('include', '/tags/Action')
    })

    it('should display tag card', () => {
      cy.wait('@getMangas')
      cy.get('[class*="tag-card"]').should('exist')
    })

    it('should be responsive on mobile', () => {
      cy.viewport('iphone-x')
      cy.wait('@getMangas')
      cy.contains('Action').should('be.visible')
    })

    it('should be responsive on tablet', () => {
      cy.viewport('ipad-2')
      cy.wait('@getMangas')
      cy.contains('Action').should('be.visible')
    })

    it('should display loading state initially', () => {
      cy.intercept('GET', '**/api/mangas', (req) => {
        req.reply((res) => {
          res.delay(1000)
          res.send([])
        })
      }).as('slowLoad')

      cy.visit('/tags')
      cy.get('[class*="loading"]').should('be.visible')
    })

    it('should aggregate view counts correctly', () => {
      cy.wait('@getMangas')
      // Comedy: 200, Adventure: 800, Romance: 1000, Action: 1800
      cy.contains('Action').parent().should('contain', '1800')
    })

    it('should handle multiple tags per manga', () => {
      cy.wait('@getMangas')
      // Manga 1 has Action and Adventure
      cy.contains('Action').should('be.visible')
      cy.contains('Adventure').should('be.visible')
    })

    it('should not duplicate tags', () => {
      cy.wait('@getMangas')
      cy.get('a').contains('Action').should('have.length', 1)
    })
  })

  context('NG Cases - Tags Page', () => {
    it('should handle API error', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('apiError')

      cy.visit('/tags')
      cy.wait('@apiError')
      cy.contains('Error').should('be.visible')
    })

    it('should handle network error', () => {
      cy.intercept('GET', '**/api/mangas', {
        forceNetworkError: true
      }).as('networkError')

      cy.visit('/tags')
      cy.wait('@networkError')
    })

    it('should handle empty manga list', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: []
      }).as('emptyMangas')

      cy.visit('/tags')
      cy.wait('@emptyMangas')
      cy.contains('No tags').should('be.visible')
    })

    it('should handle manga with no tags', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: [
          { id: '1', name: 'Manga 1', tag: [], ep: [] }
        ]
      }).as('noTags')

      cy.visit('/tags')
      cy.wait('@noTags')
      cy.contains('No tags').should('be.visible')
    })

    it('should handle manga with null tags', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: [
          { id: '1', name: 'Manga 1', tag: null, ep: [] }
        ]
      }).as('nullTags')

      cy.visit('/tags')
      cy.wait('@nullTags')
    })

    it('should handle manga with no episodes', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: [
          { id: '1', name: 'Manga 1', tag: ['Action'], ep: [] }
        ]
      }).as('noEpisodes')

      cy.visit('/tags')
      cy.wait('@noEpisodes')
      cy.contains('Action').parent().should('contain', '0')
    })

    it('should handle malformed manga data', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: [{ invalid: 'data' }]
      }).as('malformed')

      cy.visit('/tags')
      cy.wait('@malformed')
    })

    it('should handle timeout', () => {
      cy.intercept('GET', '**/api/mangas', (req) => {
        req.reply((res) => {
          res.delay(30000)
        })
      }).as('timeout')

      cy.visit('/tags')
    })

    it('should handle invalid JSON response', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: 'invalid json'
      }).as('invalidJson')

      cy.visit('/tags')
      cy.wait('@invalidJson')
    })

    it('should handle special characters in tag names', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: [
          {
            id: '1',
            tag: ['Action!@#$%'],
            ep: [{ episode_no: 1, view: 100 }]
          }
        ]
      }).as('specialChars')

      cy.visit('/tags')
      cy.wait('@specialChars')
      cy.contains('Action!@#$%').should('be.visible')
    })

    it('should handle Thai characters in tag names', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: [
          {
            id: '1',
            tag: ['แอ็คชั่น'],
            ep: [{ episode_no: 1, view: 100 }]
          }
        ]
      }).as('thaiChars')

      cy.visit('/tags')
      cy.wait('@thaiChars')
      cy.contains('แอ็คชั่น').should('be.visible')
    })

    it('should handle very long tag names', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: [
          {
            id: '1',
            tag: ['A'.repeat(1000)],
            ep: [{ episode_no: 1, view: 100 }]
          }
        ]
      }).as('longTag')

      cy.visit('/tags')
      cy.wait('@longTag')
    })

    it('should handle negative view counts', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: [
          {
            id: '1',
            tag: ['Action'],
            ep: [{ episode_no: 1, view: -100 }]
          }
        ]
      }).as('negativeViews')

      cy.visit('/tags')
      cy.wait('@negativeViews')
    })

    it('should handle zero view counts', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: [
          {
            id: '1',
            tag: ['Action'],
            ep: [{ episode_no: 1, view: 0 }]
          }
        ]
      }).as('zeroViews')

      cy.visit('/tags')
      cy.wait('@zeroViews')
      cy.contains('Action').parent().should('contain', '0')
    })

    it('should handle missing view property in episodes', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: [
          {
            id: '1',
            tag: ['Action'],
            ep: [{ episode_no: 1 }]
          }
        ]
      }).as('missingView')

      cy.visit('/tags')
      cy.wait('@missingView')
    })
  })
})

describe('Tag Detail Page Tests', () => {
  const testTag = 'Action'

  beforeEach(() => {
    cy.intercept('GET', '**/api/mangas', {
      statusCode: 200,
      body: [
        {
          id: '1',
          name: 'Action Manga 1',
          slug: 'action-manga-1',
          tag: ['Action', 'Adventure'],
          backgroundImage: 'http://example.com/img1.jpg'
        },
        {
          id: '2',
          name: 'Action Manga 2',
          slug: 'action-manga-2',
          tag: ['Action'],
          backgroundImage: 'http://example.com/img2.jpg'
        },
        {
          id: '3',
          name: 'Romance Manga',
          slug: 'romance-manga',
          tag: ['Romance'],
          backgroundImage: 'http://example.com/img3.jpg'
        }
      ]
    }).as('getMangas')

    cy.visit(`/tags/${testTag}`)
  })

  context('OK Cases - Tag Detail Page', () => {
    it('should load tag detail page successfully', () => {
      cy.wait('@getMangas')
      cy.url().should('include', `/tags/${testTag}`)
    })

    it('should display tag name', () => {
      cy.wait('@getMangas')
      cy.contains(testTag).should('be.visible')
    })

    it('should display manga with matching tag', () => {
      cy.wait('@getMangas')
      cy.contains('Action Manga 1').should('be.visible')
      cy.contains('Action Manga 2').should('be.visible')
    })

    it('should not display manga without matching tag', () => {
      cy.wait('@getMangas')
      cy.contains('Romance Manga').should('not.exist')
    })

    it('should display manga count', () => {
      cy.wait('@getMangas')
      cy.contains('2').should('be.visible')
    })

    it('should navigate to manga detail when clicking', () => {
      cy.wait('@getMangas')
      cy.contains('Action Manga 1').click()
      cy.url().should('include', '/action-manga-1')
    })

    it('should be responsive on mobile', () => {
      cy.viewport('iphone-x')
      cy.wait('@getMangas')
      cy.contains('Action Manga 1').should('be.visible')
    })

    it('should handle URL encoded tag names', () => {
      const encodedTag = encodeURIComponent('Action & Adventure')
      cy.visit(`/tags/${encodedTag}`)
    })
  })

  context('NG Cases - Tag Detail Page', () => {
    it('should handle tag not found', () => {
      cy.visit('/tags/NonExistentTag')
      cy.wait('@getMangas')
      cy.contains('No manga found').should('be.visible')
    })

    it('should handle API error', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('apiError')

      cy.visit(`/tags/${testTag}`)
      cy.wait('@apiError')
    })

    it('should handle empty manga list', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: []
      }).as('empty')

      cy.visit(`/tags/${testTag}`)
      cy.wait('@empty')
      cy.contains('No manga found').should('be.visible')
    })
  })
})
