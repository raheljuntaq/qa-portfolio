import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

let loginPage;
let inventoryPage;
let cartPage;
let checkoutPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    // Precondition
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.addToCart('Sauce Labs Bike Light');
    await inventoryPage.openCart();
    await cartPage.checkout();
});

test('TC-CHECKOUT-03 - Checkout with all fields empty', async ({ page }) => {
    await checkoutPage.clickContinue();

    await expect(page).toHaveURL('/checkout-step-one.html');
    await expect(checkoutPage.alert).toHaveText('Error: First Name is required');
});

test('TC-CHECKOUT-04 - Checkout with First Name empty', async ({ page }) => {
    await checkoutPage.fillInformation('', 'Pithaloka', '15111');
    await checkoutPage.clickContinue();

    await expect(page).toHaveURL('/checkout-step-one.html');
    await expect(checkoutPage.alert).toHaveText('Error: First Name is required');
});

test('TC-CHECKOUT-05 - Checkout with Last Name empty', async ({ page }) => {
    await checkoutPage.fillInformation('Rahel', '', '15111');
    await checkoutPage.clickContinue();

    await expect(page).toHaveURL('/checkout-step-one.html');
    await expect(checkoutPage.alert).toHaveText('Error: Last Name is required');
});

test('TC-CHECKOUT-06 - Checkout with Postal Code empty', async ({ page }) => {
    await checkoutPage.fillInformation('Rahel', 'Pithaloka', '');
    await checkoutPage.clickContinue();

    await expect(page).toHaveURL('/checkout-step-one.html');
    await expect(checkoutPage.alert).toHaveText('Error: Postal Code is required');
});

test('TC-CHECKOUT-09 - Checkout overview matches the cart and totals are calculated correctly', async ({ page }) => {
    await checkoutPage.fillInformation('Rahel', 'Pithaloka', '15111');
    await checkoutPage.clickContinue();

    await expect(page).toHaveURL('/checkout-step-two.html');
    expect(await checkoutPage.getItemNames()).toEqual(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
    await expect(checkoutPage.subtotalLabel).toHaveText('Item total: $39.98');
    await expect(checkoutPage.taxLabel).toHaveText('Tax: $3.20');
    await expect(checkoutPage.totalLabel).toHaveText('Total: $43.18');
});

test('TC-CHECKOUT-10 - Complete the order', async ({ page }) => {
    await checkoutPage.fillInformation('Rahel', 'Pithaloka', '15111');
    await checkoutPage.clickContinue();
    await checkoutPage.finish();

    await expect(page).toHaveURL('/checkout-complete.html');
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    await expect(inventoryPage.cartBadge).toBeHidden();
});

test('TC-CHECKOUT-11 - Cancel checkout', async ({ page }) => {
    await checkoutPage.cancel();

    await expect(page).toHaveURL('/cart.html');
    expect(await cartPage.getItemNames()).toEqual(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
});

