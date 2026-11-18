export class CartPage {
    constructor(page) {
        this.page = page;
        this.cartItems = page.locator('[data-test="inventory-item"]');
        this.itemNames = page.locator('[data-test="inventory-item-name"]');
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
        this.checkoutButton = page.locator('[data-test="checkout"]');
    }

    async goto() {
        await this.page.goto('/cart.html');
    }

    // Example: 'Sauce Labs Backpack' -> 'sauce-labs-backpack'
    toSlug(productName) {
        return productName.toLowerCase().replace(/ /g, '-');
    }

    removeButton(productName) {
        return this.page.locator(`[data-test="remove-${this.toSlug(productName)}"]`);
    }

    async removeItem(productName) {
        await this.removeButton(productName).click();
    }

    async getItemNames() {
        return await this.itemNames.allTextContents();
    }

    async continueShopping() {
        await this.continueShoppingButton.click();
    }

    async checkout() {
        await this.checkoutButton.click();
    }
}