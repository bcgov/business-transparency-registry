import { Page } from '@playwright/test'
import { businessSlim } from '~/playwright/mocks/data/business/slim'

export const getBusiness =
  async (page: Page, businessIdentifier: string | undefined = undefined, slim: boolean = true) => {
    if (!businessIdentifier) {
      businessIdentifier = businessSlim.identifier
    } else {
      businessSlim.identifier = businessIdentifier
    }

    let url = `**/api/v2/businesses/${businessIdentifier}`
    if (slim) {
      url += '?slim=true'
    }

    await page.route(url, async (route) => {
      // handling only GET requests
      if (route.request().method() !== 'GET') {
        await route.fallback()
        return
      }
      await route.fulfill({
        status: 200,
        body: JSON.stringify(businessSlim)
      })
    })
  }
