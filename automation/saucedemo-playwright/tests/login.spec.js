import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

let loginPage;
let inventoryPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
});

test('TC-LOGIN-01 - Login with valid credentials', async ({page}) => {
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL('/inventory.html');
});

test('TC-LOGIN-02 - Login with invalid username', async ({page}) => {
    await loginPage.login('invalid_user', 'secret_sauce');
    await loginPage.loginButton.click();

    await expect(loginPage.alert).toContainText('Epic sadface: Username and password do not match any user in this service');
});

test('TC-LOGIN-03 - Login with invalid password', async ({page}) => {

    await loginPage.login('standard_user', 'invalid_password');
    await loginPage.loginButton.click();

    await expect(loginPage.alert).toContainText('Epic sadface: Username and password do not match any user in this service');
});

test('TC-LOGIN-04 - Login with empty username and password', async ({page}) => {
    
    await loginPage.loginButton.click();
    await expect(loginPage.alert).toContainText('Epic sadface: Username is required');
});

test('TC-LOGIN-10 - Successful logout', async ({ page }) => {
    // Precondition: user is logged in and on the inventory page
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL('/inventory.html');

    await inventoryPage.logout();

    // 1. User is moved back to the login page and URL changes to base URL
    await expect(page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();

    // 2. Session is ended: opening the inventory page directly is blocked
    await inventoryPage.goto();
    await expect(page).toHaveURL('/');
    await expect(loginPage.alert).toContainText('when you are logged in');
});


test('TC-LOGIN-11 - Login with locked out user', async ({page}) => {

    await loginPage.login('locked_out_user', 'secret_sauce');
    await loginPage.loginButton.click();

    await expect(loginPage.alert).toContainText('Epic sadface: Sorry, this user has been locked out.');
});
