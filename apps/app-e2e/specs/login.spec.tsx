import { test, expect } from '@playwright/test'

test('login page has title', async ({ page }) => {
  await page.goto('/sign-in')

  await expect(page).toHaveTitle(/Sign In/)
})
