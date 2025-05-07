import { test, expect } from '@playwright/test'

import { visitBeneficialOwnerChangeWithPreviousSubmissionHasSIs } from '~/playwright/mocks'

test('test it loads the page', async ({ page }) => {
  const businessIdentifier = 'BC0871427'
  await visitBeneficialOwnerChangeWithPreviousSubmissionHasSIs(page, businessIdentifier)

  // fetching by text
  await expect(page.getByText('File Transparency Register')).toBeVisible()

  // instead of magic 3 we could count rows in the response that are not ceased, which is a bit complicated
  // fetching by data-cy attribute
  await expect(page.getByTestId('summary-table-row')).toHaveCount(3)

  expect(page.url()).toContain(`${businessIdentifier}/beneficial-owner-change`)
})
