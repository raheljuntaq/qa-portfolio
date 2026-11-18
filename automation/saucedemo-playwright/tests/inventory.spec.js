import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

let loginPage;
let inventoryPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
});

test('TC-PRODUCT-01 - All products are displayed with name, price, and Add to cart button', async ({ page }) => {
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.productNames).toHaveCount(6);
    await expect(inventoryPage.productPrices).toHaveCount(6);
    await expect(page.locator('[data-test^="add-to-cart"]')).toHaveCount(6);
});

test('TC-PRODUCT-03 - Sort products by Name (A to Z)', async () => {
    // Default = A to Z
    await inventoryPage.sortBy('za');
    await inventoryPage.sortBy('az');

    await expect(inventoryPage.productNames).toHaveText([
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        'Sauce Labs Bolt T-Shirt',
        'Sauce Labs Fleece Jacket',
        'Sauce Labs Onesie',
        'Test.allTheThings() T-Shirt (Red)',
    ]);
});

test('TC-PRODUCT-05 - Sort products by Name (Z to A)', async () => {
    await inventoryPage.sortBy('za');

    await expect(inventoryPage.productNames).toHaveText([
        'Test.allTheThings() T-Shirt (Red)',
        'Sauce Labs Onesie',
        'Sauce Labs Fleece Jacket',
        'Sauce Labs Bolt T-Shirt',
        'Sauce Labs Bike Light',
        'Sauce Labs Backpack',
    ]);
});

test('TC-PRODUCT-07 - Sort products by Price (low to high)', async () => {
    await inventoryPage.sortBy('lohi');

    await expect(inventoryPage.productPrices).toHaveText([
        '$7.99', '$9.99', '$15.99', '$15.99', '$29.99', '$49.99',
    ]);
});

test('TC-PRODUCT-09 - Sort products by Price (high to low)', async () => {
    await inventoryPage.sortBy('hilo');

    await expect(inventoryPage.productPrices).toHaveText([
        '$49.99', '$29.99', '$15.99', '$15.99', '$9.99', '$7.99',
    ]);
});

test('TC-PRODUCT-11 - Add a product to the cart from the product list', async () => {
    await inventoryPage.addToCart('Sauce Labs Backpack');

    await expect(inventoryPage.removeButton('Sauce Labs Backpack')).toBeVisible();
    await expect(inventoryPage.cartBadge).toHaveText('1');
});

test('TC-PRODUCT-12 - Remove a product from the product list', async () => {
    // Precondition: Sauce Labs Backpack is already in the cart
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.removeFromCart('Sauce Labs Backpack');

    await expect(inventoryPage.addToCartButton('Sauce Labs Backpack')).toBeVisible();
    await expect(inventoryPage.cartBadge).toBeHidden();
});