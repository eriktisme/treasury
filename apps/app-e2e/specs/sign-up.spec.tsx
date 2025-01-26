import { test, expect } from '@playwright/test'

test('sign up page has title', async ({ page }) => {
  await page.goto('/auth/sign-up')

  await expect(page).toHaveTitle(/Sign Up/)
})
