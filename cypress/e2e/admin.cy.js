describe('Admin Page Tests', () => {
  beforeEach(() => {
    // Setup authentication
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'test-admin-token')
      win.localStorage.setItem('user', JSON.stringify({
        user_id: 1,
        email: 'admin@test.com',
        role: 'admin'
      }))
    })

    cy.intercept('POST', '**/api/auth?action=verify', {
      statusCode: 200,
      body: {
        valid: true,
        user: { user_id: 1, email: 'admin@test.com', role: 'admin' }
      }
    }).as('verifyAuth')

    cy.visit('/admin')
  })

  context('OK Cases - Admin Page Access', () => {
    it('should load admin page successfully', () => {
      cy.url().should('include', '/admin')
    })

    it('should verify authentication token on load', () => {
      cy.wait('@verifyAuth')
    })

    it('should display admin tabs', () => {
      cy.contains('manga').should('be.visible')
      cy.contains('episodes').should('be.visible')
      cy.contains('tags').should('be.visible')
      cy.contains('menubar').should('be.visible')
    })

    it('should default to manga tab', () => {
      cy.get('[class*="active"]').contains('manga').should('exist')
    })

    it('should switch between tabs', () => {
      cy.contains('episodes').click()
      cy.contains('tags').click()
      cy.contains('menubar').click()
      cy.contains('manga').click()
    })
  })

  context('OK Cases - Manga Management', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: [
          {
            id: '1',
            name: 'Test Manga',
            slug: 'test-manga',
            description: 'Test description',
            backgroundImage: 'http://example.com/img.jpg',
            tag: ['Action', 'Adventure']
          }
        ]
      }).as('getMangas')

      cy.intercept('GET', '**/api/tags', {
        statusCode: 200,
        body: [
          { id: '1', name: 'Action' },
          { id: '2', name: 'Adventure' }
        ]
      }).as('getTags')
    })

    it('should load manga list', () => {
      cy.wait('@getMangas')
      cy.contains('Test Manga').should('be.visible')
    })

    it('should load tag options for select', () => {
      cy.wait('@getTags')
    })

    it('should display manga form fields', () => {
      cy.get('input[placeholder*="Manga Name"]').should('exist')
      cy.get('input[placeholder*="Slug"]').should('exist')
      cy.get('textarea[placeholder*="Description"]').should('exist')
    })

    it('should create new manga successfully', () => {
      cy.intercept('POST', '**/api/mangas', {
        statusCode: 200,
        body: { message: 'Manga added successfully', manga_id: 2 }
      }).as('createManga')

      cy.get('input[placeholder*="Manga Name"]').type('New Manga')
      cy.get('input[placeholder*="Slug"]').type('new-manga')
      cy.get('textarea[placeholder*="Description"]').type('New description')
      cy.get('button').contains('Create').click()

      cy.wait('@createManga')
      cy.contains('Manga added successfully').should('be.visible')
    })

    it('should edit existing manga', () => {
      cy.wait('@getMangas')
      
      cy.intercept('PUT', '**/api/mangas', {
        statusCode: 200,
        body: { message: 'Manga updated successfully' }
      }).as('updateManga')

      cy.get('button').contains('Edit').first().click()
      cy.get('input[placeholder*="Manga Name"]').clear().type('Updated Manga')
      cy.get('button').contains('Update').click()

      cy.wait('@updateManga')
      cy.contains('Manga updated successfully').should('be.visible')
    })

    it('should delete manga', () => {
      cy.wait('@getMangas')

      cy.intercept('DELETE', '**/api/mangas', {
        statusCode: 200,
        body: { message: 'Manga deleted successfully' }
      }).as('deleteManga')

      cy.get('button').contains('Delete').first().click()
      cy.wait('@deleteManga')
    })

    it('should upload manga background image', () => {
      const fileName = 'test-image.jpg'
      cy.fixture(fileName, 'base64').then(fileContent => {
        cy.get('input[type="file"]').first().attachFile({
          fileContent,
          fileName,
          mimeType: 'image/jpeg',
          encoding: 'base64'
        })
      })
    })

    it('should select tags for manga', () => {
      cy.wait('@getTags')
      // Interact with react-select component
      cy.get('[class*="react-select"]').first().click()
      cy.contains('Action').click()
    })

    it('should reset form after creating manga', () => {
      cy.get('input[placeholder*="Manga Name"]').type('Test')
      cy.get('button').contains('Reset').click()
      cy.get('input[placeholder*="Manga Name"]').should('have.value', '')
    })

    it('should search manga in list', () => {
      cy.wait('@getMangas')
      cy.get('input[placeholder*="Search"]').type('Test Manga')
      cy.contains('Test Manga').should('be.visible')
    })

    it('should filter manga by tag', () => {
      cy.wait('@getMangas')
      cy.get('select').select('Action')
      cy.contains('Test Manga').should('be.visible')
    })
  })

  context('OK Cases - Episode Management', () => {
    beforeEach(() => {
      cy.contains('episodes').click()

      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: [
          {
            id: '1',
            name: 'Test Manga',
            slug: 'test-manga',
            ep: [
              { episode_no: 1, title: 'Episode 1', view: 100 }
            ]
          }
        ]
      }).as('getMangas')
    })

    it('should display episode form', () => {
      cy.get('input[placeholder*="Episode"]').should('exist')
    })

    it('should create new episode', () => {
      cy.intercept('POST', '**/api/mangas/*/episodes', {
        statusCode: 200,
        body: { message: 'Episode added successfully' }
      }).as('createEpisode')

      cy.get('input[placeholder*="Episode Number"]').type('2')
      cy.get('input[placeholder*="Episode Title"]').type('Episode 2')
      cy.get('button').contains('Add Episode').click()

      cy.wait('@createEpisode')
    })

    it('should upload episode images', () => {
      cy.intercept('POST', '**/api/upload', {
        statusCode: 200,
        body: { message: 'Files uploaded successfully' }
      }).as('uploadImages')

      const fileName = 'page1.jpg'
      cy.fixture(fileName, 'base64').then(fileContent => {
        cy.get('input[type="file"][multiple]').attachFile({
          fileContent,
          fileName,
          mimeType: 'image/jpeg',
          encoding: 'base64'
        })
      })
    })

    it('should delete episode', () => {
      cy.wait('@getMangas')
      
      cy.intercept('DELETE', '**/api/mangas/*/episodes/*', {
        statusCode: 200,
        body: { message: 'Episode deleted successfully' }
      }).as('deleteEpisode')

      cy.get('button').contains('Delete Episode').first().click()
      cy.wait('@deleteEpisode')
    })

    it('should edit episode details', () => {
      cy.wait('@getMangas')

      cy.intercept('PUT', '**/api/mangas/*/episodes/*', {
        statusCode: 200,
        body: { message: 'Episode updated successfully' }
      }).as('updateEpisode')

      cy.get('button').contains('Edit Episode').first().click()
      cy.get('input[placeholder*="Episode Title"]').clear().type('Updated Title')
      cy.get('button').contains('Update Episode').click()

      cy.wait('@updateEpisode')
    })
  })

  context('OK Cases - Tags Management', () => {
    beforeEach(() => {
      cy.contains('tags').click()

      cy.intercept('GET', '**/api/tags', {
        statusCode: 200,
        body: [
          { id: '1', name: 'Action' },
          { id: '2', name: 'Romance' }
        ]
      }).as('getTags')
    })

    it('should load tags list', () => {
      cy.wait('@getTags')
      cy.contains('Action').should('be.visible')
      cy.contains('Romance').should('be.visible')
    })

    it('should create new tag', () => {
      cy.intercept('POST', '**/api/tags', {
        statusCode: 200,
        body: { message: 'Tag added successfully', tag_id: 3 }
      }).as('createTag')

      cy.get('input[placeholder*="Tag Name"]').type('Comedy')
      cy.get('button').contains('Add Tag').click()

      cy.wait('@createTag')
      cy.contains('Tag added successfully').should('be.visible')
    })

    it('should delete tag', () => {
      cy.wait('@getTags')

      cy.intercept('DELETE', '**/api/tags', {
        statusCode: 200,
        body: { message: 'Tag deleted successfully' }
      }).as('deleteTag')

      cy.get('button').contains('Delete').first().click()
      cy.wait('@deleteTag')
    })

    it('should prevent duplicate tag names', () => {
      cy.wait('@getTags')

      cy.intercept('POST', '**/api/tags', {
        statusCode: 409,
        body: { error: 'Tag already exists' }
      }).as('duplicateTag')

      cy.get('input[placeholder*="Tag Name"]').type('Action')
      cy.get('button').contains('Add Tag').click()

      cy.wait('@duplicateTag')
      cy.contains('Tag already exists').should('be.visible')
    })
  })

  context('OK Cases - Menubar Management', () => {
    beforeEach(() => {
      cy.contains('menubar').click()

      cy.intercept('GET', '**/api/menubar', {
        statusCode: 200,
        body: [
          { id: '1', name: 'Home', href: '/', is_active: true },
          { id: '2', name: 'Tags', href: '/tags', is_active: true }
        ]
      }).as('getMenubar')
    })

    it('should load menubar items', () => {
      cy.wait('@getMenubar')
      cy.contains('Home').should('be.visible')
      cy.contains('Tags').should('be.visible')
    })

    it('should create new menu item', () => {
      cy.intercept('POST', '**/api/menubar', {
        statusCode: 200,
        body: { message: 'Menubar added successfully', menu_id: 3 }
      }).as('createMenu')

      cy.get('input[placeholder*="Menu Name"]').type('About')
      cy.get('input[placeholder*="Menu URL"]').type('/about')
      cy.get('button').contains('Add Menu').click()

      cy.wait('@createMenu')
    })

    it('should delete menu item', () => {
      cy.wait('@getMenubar')

      cy.intercept('DELETE', '**/api/menubar', {
        statusCode: 200,
        body: { message: 'Menubar deleted successfully' }
      }).as('deleteMenu')

      cy.get('button').contains('Delete').first().click()
      cy.wait('@deleteMenu')
    })

    it('should toggle menu active status', () => {
      cy.wait('@getMenubar')
      cy.get('input[type="checkbox"]').first().click()
    })
  })

  context('NG Cases - Admin Page', () => {
    it('should redirect to login if not authenticated', () => {
      cy.window().then((win) => {
        win.localStorage.removeItem('token')
      })

      cy.intercept('POST', '**/api/auth?action=verify', {
        statusCode: 401,
        body: { error: 'Invalid token' }
      }).as('verifyFail')

      cy.visit('/admin')
      cy.wait('@verifyFail')
      cy.url().should('include', '/login')
    })

    it('should handle API error when loading manga', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('getMangaError')

      cy.visit('/admin')
      cy.wait('@getMangaError')
      cy.contains('Error loading manga').should('be.visible')
    })

    it('should handle failed manga creation', () => {
      cy.intercept('POST', '**/api/mangas', {
        statusCode: 400,
        body: { error: 'Missing required fields' }
      }).as('createMangaFail')

      cy.get('input[placeholder*="Manga Name"]').type('Test')
      cy.get('button').contains('Create').click()

      cy.wait('@createMangaFail')
      cy.contains('Missing required fields').should('be.visible')
    })

    it('should handle failed manga update', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: [{ id: '1', name: 'Test', slug: 'test' }]
      })

      cy.intercept('PUT', '**/api/mangas', {
        statusCode: 500,
        body: { error: 'Update failed' }
      }).as('updateFail')

      cy.get('button').contains('Edit').first().click()
      cy.get('input[placeholder*="Manga Name"]').clear().type('Updated')
      cy.get('button').contains('Update').click()

      cy.wait('@updateFail')
      cy.contains('Update failed').should('be.visible')
    })

    it('should handle failed manga deletion', () => {
      cy.intercept('GET', '**/api/mangas', {
        statusCode: 200,
        body: [{ id: '1', name: 'Test', slug: 'test' }]
      })

      cy.intercept('DELETE', '**/api/mangas', {
        statusCode: 403,
        body: { error: 'Cannot delete manga with episodes' }
      }).as('deleteFail')

      cy.get('button').contains('Delete').first().click()
      cy.wait('@deleteFail')
      cy.contains('Cannot delete').should('be.visible')
    })

    it('should handle upload failure', () => {
      cy.intercept('POST', '**/api/upload', {
        statusCode: 500,
        body: { error: 'Upload failed' }
      }).as('uploadFail')

      const fileName = 'test.jpg'
      cy.fixture(fileName, 'base64').then(fileContent => {
        cy.get('input[type="file"]').first().attachFile({
          fileContent,
          fileName,
          mimeType: 'image/jpeg',
          encoding: 'base64'
        })
      })

      cy.wait('@uploadFail')
    })

    it('should validate required fields', () => {
      cy.get('button').contains('Create').click()
      // Should show validation errors
    })

    it('should handle network timeout', () => {
      cy.intercept('POST', '**/api/mangas', (req) => {
        req.reply((res) => {
          res.delay(30000)
        })
      }).as('timeout')

      cy.get('input[placeholder*="Manga Name"]').type('Test')
      cy.get('button').contains('Create').click()
    })

    it('should handle unauthorized access', () => {
      cy.intercept('POST', '**/api/auth?action=verify', {
        statusCode: 403,
        body: { error: 'Access denied' }
      }).as('forbidden')

      cy.visit('/admin')
      cy.wait('@forbidden')
      cy.url().should('include', '/login')
    })

    it('should handle expired session', () => {
      cy.intercept('POST', '**/api/auth?action=verify', {
        statusCode: 401,
        body: { error: 'Token expired' }
      }).as('expired')

      cy.visit('/admin')
      cy.wait('@expired')
      cy.url().should('include', '/login')
    })
  })
})
