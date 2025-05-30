import { Page, expect } from '@playwright/test'
import {
  getPlotsEntityNotFound,
  getPlotsEntityWithFilingNoSis,
  getPlotsEntityWithFilingWithSis
} from '~/playwright/mocks/handlers/plots/entity'
import { getFeesBtrRegsigin } from '~/playwright/mocks/handlers/fees'
import { getBusiness } from '~/playwright/mocks/handlers/business'
import { SubmissionTypeE } from '~/enums/submission-type-e'
import { getBusinessContacts } from '~/playwright/mocks/handlers/businessContacts'

export const visitBeneficialOwnerChangeWithPreviousSubmissionHasSIs = async (
  page: Page,
  businessIdentifier: string | undefined = undefined,
  submissionType: SubmissionTypeE | undefined = undefined
) => {
  if (!businessIdentifier) {
    businessIdentifier = 'BC0871427'
  }
  if (!submissionType) {
    submissionType = SubmissionTypeE.INITIAL_FILING
  }
  await getPlotsEntityWithFilingWithSis(page, businessIdentifier)
  await getFeesBtrRegsigin(page)
  await getBusiness(page, businessIdentifier, true)
  await getBusinessContacts(page, businessIdentifier)
  await page.goto(
    `http://localhost:3000/${businessIdentifier}/beneficial-owner-change?submissionType=${submissionType}`
  )
  await expect(page.getByText('File Transparency Register')).toBeVisible()
}
export const visitBeneficialOwnerChangeWithPreviousSubmissionNoSIsa = async (
  page: Page,
  businessIdentifier: string | undefined = undefined,
  submissionType: SubmissionTypeE | undefined = undefined
) => {
  if (!businessIdentifier) {
    businessIdentifier = 'BC0871427'
  }
  if (!submissionType) {
    submissionType = SubmissionTypeE.INITIAL_FILING
  }

  await getPlotsEntityWithFilingNoSis(page, businessIdentifier)
  await getFeesBtrRegsigin(page)
  await getBusiness(page, businessIdentifier, true)
  await getBusinessContacts(page, businessIdentifier)
  await page.goto(
    `http://localhost:3000/${businessIdentifier}/beneficial-owner-change?submissionType=${submissionType}`
  )
  await expect(page.getByText('File Transparency Register')).toBeVisible()
}

export const visitBeneficialOwnerChangeWithoutPreviousSubmission = async (
  page: Page,
  businessIdentifier: string | undefined = undefined,
  submissionType: SubmissionTypeE | undefined = undefined
) => {
  if (!businessIdentifier) {
    businessIdentifier = 'BC0871427'
  }
  if (!submissionType) {
    submissionType = SubmissionTypeE.INITIAL_FILING
  }

  await getPlotsEntityNotFound(page, businessIdentifier)
  await getFeesBtrRegsigin(page)
  await getBusiness(page, businessIdentifier, true)
  await getBusinessContacts(page, businessIdentifier)
  await page.goto(
    `http://localhost:3000/${businessIdentifier}/beneficial-owner-change?submissionType=${submissionType}`
  )
  await expect(page.getByText('File Transparency Register')).toBeVisible()
}
