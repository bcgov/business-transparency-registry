import { Page } from '@playwright/test'
import { businessContacts } from '~/playwright/mocks/data/business/contacts'

export const getBusinessContacts = async (page: Page, businessIdentifier: string | undefined = undefined) => {
  if (!businessIdentifier) {
    businessIdentifier = businessContacts.businessIdentifier
  } else {
    businessContacts.businessIdentifier = businessIdentifier
  }

  const url = `**/api/v1/entities/${businessIdentifier}`

  await page.route(url, async (route) => {
    // handling only GET requests
    if (route.request().method() !== 'GET') {
      await route.fallback()
      return
    }
    await route.fulfill({
      status: 200,
      body: JSON.stringify(businessContacts)
    })
  })
}
