describe('API Tests - Authentication', () => {
  const API_BASE = Cypress.env('API_URL') || 'http://localhost:3000'

  context('OK Cases - Auth API', () => {
    it('POST /api/auth/register - should register new user', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/auth/register`,
        body: {
          email: 'newuser@test.com',
          password: 'password123',
          display_name: 'New User'
        }
      }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('user_id')
        expect(response.body).to.have.property('email', 'newuser@test.com')
      })
    })

    it('POST /api/auth/login - should login with valid credentials', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/auth/login`,
        body: {
          email: 'admin@test.com',
          password: 'password123'
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('token')
        expect(response.body).to.have.property('user')
        expect(response.body.user).to.have.property('email')
      })
    })

    it('POST /api/auth/verify - should verify valid token', () => {
      const token = 'valid-token-123'
      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/auth/verify`,
        body: { token }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('valid', true)
        expect(response.body).to.have.property('user')
      })
    })

    it('POST /api/auth/logout - should logout successfully', () => {
      const token = 'test-token'
      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/auth/logout`,
        body: { token }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('message')
      })
    })
  })

  context('NG Cases - Auth API', () => {
    it('POST /api/auth/register - should reject duplicate email', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/auth/register`,
        body: {
          email: 'existing@test.com',
          password: 'password123'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(409)
        expect(response.body).to.have.property('error')
      })
    })

    it('POST /api/auth/register - should reject missing email', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/auth/register`,
        body: {
          password: 'password123'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
      })
    })

    it('POST /api/auth/register - should reject missing password', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/auth/register`,
        body: {
          email: 'test@test.com'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
      })
    })

    it('POST /api/auth/login - should reject invalid credentials', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/auth/login`,
        body: {
          email: 'wrong@test.com',
          password: 'wrongpassword'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401)
      })
    })

    it('POST /api/auth/login - should reject missing credentials', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/auth/login`,
        body: {},
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
      })
    })

    it('POST /api/auth/verify - should reject invalid token', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/auth/verify`,
        body: { token: 'invalid-token' },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401)
      })
    })

    it('POST /api/auth/verify - should reject expired token', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/auth/verify`,
        body: { token: 'expired-token' },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401)
      })
    })

    it('POST /api/auth/logout - should require token', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/auth/logout`,
        body: {},
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
      })
    })
  })
})

describe('API Tests - Manga', () => {
  const API_BASE = 'https://manga.cipacmeeting.com'

  context('OK Cases - Manga API', () => {
    it('GET /api/mangas - should return manga list', () => {
      cy.request('GET', `${API_BASE}/api/mangas`).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
      })
    })

    it('POST /api/mangas - should create new manga', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/mangas`,
        body: {
          name: 'New Manga',
          slug: 'new-manga',
          description: 'Test description',
          backgroundImage: 'http://example.com/img.jpg',
          tag: ['Action']
        },
        headers: {
          'Authorization': 'Bearer admin-token'
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('manga_id')
      })
    })

    it('PUT /api/mangas - should update manga', () => {
      cy.request({
        method: 'PUT',
        url: `${API_BASE}/api/mangas`,
        body: {
          id: '1',
          name: 'Updated Manga',
          slug: 'updated-manga'
        },
        headers: {
          'Authorization': 'Bearer admin-token'
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    it('DELETE /api/mangas - should delete manga', () => {
      cy.request({
        method: 'DELETE',
        url: `${API_BASE}/api/mangas`,
        body: { id: '999' },
        headers: {
          'Authorization': 'Bearer admin-token'
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  })

  context('NG Cases - Manga API', () => {
    it('POST /api/mangas - should reject missing required fields', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/mangas`,
        body: {},
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 401])
      })
    })

    it('PUT /api/mangas - should reject invalid manga ID', () => {
      cy.request({
        method: 'PUT',
        url: `${API_BASE}/api/mangas`,
        body: {
          id: 'invalid',
          name: 'Test'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 404])
      })
    })

    it('DELETE /api/mangas - should reject non-existent manga', () => {
      cy.request({
        method: 'DELETE',
        url: `${API_BASE}/api/mangas`,
        body: { id: '999999' },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([404, 200])
      })
    })
  })
})

describe('API Tests - Tags', () => {
  const API_BASE = 'https://manga.cipacmeeting.com'

  context('OK Cases - Tags API', () => {
    it('GET /api/tags - should return tags list', () => {
      cy.request('GET', `${API_BASE}/api/tags`).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
      })
    })

    it('POST /api/tags - should create new tag', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/tags`,
        body: { name: 'New Tag' }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('tag_id')
      })
    })

    it('DELETE /api/tags - should delete tag', () => {
      cy.request({
        method: 'DELETE',
        url: `${API_BASE}/api/tags`,
        body: { id: '999' }
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  })

  context('NG Cases - Tags API', () => {
    it('POST /api/tags - should reject duplicate tag', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/tags`,
        body: { name: 'Action' },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([409, 400])
      })
    })

    it('POST /api/tags - should reject empty tag name', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/tags`,
        body: { name: '' },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
      })
    })

    it('DELETE /api/tags - should reject invalid tag ID', () => {
      cy.request({
        method: 'DELETE',
        url: `${API_BASE}/api/tags`,
        body: { id: 'invalid' },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 404])
      })
    })
  })
})

describe('API Tests - Menubar', () => {
  const API_BASE = 'https://manga.cipacmeeting.com'

  context('OK Cases - Menubar API', () => {
    it('GET /api/menubar - should return menubar items', () => {
      cy.request('GET', `${API_BASE}/api/menubar`).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
      })
    })

    it('POST /api/menubar - should create menu item', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/menubar`,
        body: {
          name: 'New Menu',
          href: '/new',
          is_active: true
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    it('DELETE /api/menubar - should delete menu item', () => {
      cy.request({
        method: 'DELETE',
        url: `${API_BASE}/api/menubar`,
        body: { id: '999' }
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  })

  context('NG Cases - Menubar API', () => {
    it('POST /api/menubar - should reject missing name', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/menubar`,
        body: { href: '/test' },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
      })
    })

    it('POST /api/menubar - should reject missing href', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/menubar`,
        body: { name: 'Test' },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
      })
    })
  })
})

describe('API Tests - Recommend', () => {
  const API_BASE = 'https://manga.cipacmeeting.com'

  context('OK Cases - Recommend API', () => {
    it('GET /api/recommend - should return recommendations', () => {
      cy.request('GET', `${API_BASE}/api/recommend`).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
      })
    })

    it('POST /api/recommend - should create recommendation', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/recommend`,
        body: {
          name: 'Recommended Manga',
          slug: 'recommended-manga',
          commenter: 'User',
          comment: 'Great manga!',
          background_image: 'http://example.com/img.jpg'
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    it('PUT /api/recommend - should update recommendation', () => {
      cy.request({
        method: 'PUT',
        url: `${API_BASE}/api/recommend`,
        body: {
          id: '1',
          status: 'approved'
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    it('DELETE /api/recommend - should delete recommendation', () => {
      cy.request({
        method: 'DELETE',
        url: `${API_BASE}/api/recommend`,
        body: { id: '999' }
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  })

  context('NG Cases - Recommend API', () => {
    it('POST /api/recommend - should reject missing required fields', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/recommend`,
        body: {},
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
      })
    })
  })
})

describe('API Tests - Upload', () => {
  const API_BASE = 'https://manga.cipacmeeting.com'

  context('OK Cases - Upload API', () => {
    it('POST /api/upload - should upload files', () => {
      const formData = new FormData()
      const blob = new Blob(['test'], { type: 'image/jpeg' })
      formData.append('files', blob, 'test.jpg')
      formData.append('mangaSlug', 'test-manga')
      formData.append('episode', '1')

      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/upload`,
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  })

  context('NG Cases - Upload API', () => {
    it('POST /api/upload - should reject missing files', () => {
      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/upload`,
        body: {},
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
      })
    })

    it('POST /api/upload - should reject invalid file type', () => {
      const formData = new FormData()
      const blob = new Blob(['test'], { type: 'text/plain' })
      formData.append('files', blob, 'test.txt')

      cy.request({
        method: 'POST',
        url: `${API_BASE}/api/upload`,
        body: formData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 415])
      })
    })
  })
})
