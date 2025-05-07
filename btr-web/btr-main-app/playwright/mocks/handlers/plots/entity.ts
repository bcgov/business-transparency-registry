import { Page } from '@playwright/test'
import { existingSiResponseWithSis } from '~/playwright/mocks/data/plots/entity/hasSis'
import { existingSiResponseNoSis } from '~/playwright/mocks/data/plots/entity/noSis'

const _getPlotsEntity =
  async (page: Page, data: string | undefined = undefined, businessIdentifier: string | undefined = undefined) => {
    if (!businessIdentifier) {
      businessIdentifier = '**'
    }
    await page.route(`**/api/v1/plots/entity/${businessIdentifier}`, async (route) => {
      // handling only GET requests
      if (route.request().method() !== 'GET') {
        await route.fallback()
        return
      }

      if (data === undefined) {
        await route.fulfill({
          status: 404,
          body: 'Not Found'
        })
      } else {
        await route.fulfill({
          status: 200,
          body: data
        })
      }
    })
  }

export const getPlotsEntityWithFilingNoSis = async (page: Page, businessIdentifier: string | undefined = undefined) => {
  return await _getPlotsEntity(page, JSON.stringify(existingSiResponseNoSis), businessIdentifier)
}

export const getPlotsEntityWithFilingWithSis =
  async (page: Page, businessIdentifier: string | undefined = undefined) => {
    return await _getPlotsEntity(page, JSON.stringify(existingSiResponseWithSis), businessIdentifier)
  }

export const getPlotsEntityNotFound = async (page: Page, businessIdentifier: string | undefined = undefined) => {
  return await _getPlotsEntity(page, undefined, businessIdentifier)
}
