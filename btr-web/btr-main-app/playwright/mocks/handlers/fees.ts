import { Page } from '@playwright/test'
import { feesBtrRegsigin } from '~/playwright/mocks/data/fees/btr'

export const getFeesBtrRegsigin = async (page: Page) => {
  await page.route('**/api/v1/fees/BTR/REGSIGIN', async (route) => {
    // handling only GET requests
    if (route.request().method() !== 'GET') {
      await route.fallback()
      return
    }
    await route.fulfill({
      status: 200,
      body: JSON.stringify(feesBtrRegsigin)
    })
  })
}
