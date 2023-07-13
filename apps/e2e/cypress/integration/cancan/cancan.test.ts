describe('CanCan Page', () => {
  // it('loads items hot collections', () => {
  //   cy.visit('/cancan')
  //   cy.getBySel('nfts-hot-collections').should('be.visible')
  //   cy.getBySel('hot-collection-card').should('have.length.at.least', 1)
  // })

  // it('loads newest Items', () => {
  //   cy.visit('/cancan')
  //   cy.getBySel('nfts-newest').should('be.visible')
  //   cy.getBySel('newest-nft-card').should('have.length.at.least', 10)
  // })

  // it.skip('shows subgraph health indicator', () => {
  //   cy.visit('/cancan')
  //   cy.get('#open-settings-dialog-button').click()
  //   cy.get('#toggle-subgraph-health-button').click({ force: true })
  //   cy.get(`[aria-label="Close the dialog"]`).click({ force: true })
  //   cy.getBySel('subgraph-health-indicator').should('be.visible')
  // })

  // // collections
  // it('loads Items collections', () => {
  //   cy.visit('/cancan/collections')
  //   cy.getBySel('nft-collections-title').should('be.visible')
  //   cy.getBySel('hot-collection-card').should('have.length.at.least', 9)
  // })

  // activity
  it('list Item', () => {
    cy.visit('/cancan/collections/1')
    cy.get('#ship-modal').should('not.be.visible')
    cy.getBySel('product-register').click({ force: true })
  })

})
