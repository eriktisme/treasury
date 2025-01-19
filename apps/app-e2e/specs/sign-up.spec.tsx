import { test, expect } from '@playwright/test'

test('sign up page has title', async ({ page }) => {
  await page.goto('/sign-up')

  await expect(page).toHaveTitle(/Sign up/)
})
