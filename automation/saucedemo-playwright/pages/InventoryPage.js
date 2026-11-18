export class InventoryPage {
    constructor(page) {
        this.page = page;
        this.title = page.locator('[data-test="title"]');
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
        this.productNames = page.locator('[data-test="inventory-item-name"]');
        this.productPrices = page.locator('[data-test="inventory-item-price"]');
        this.cartLink = page.locator('[data-test="shopping-cart-link"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.menuButton = page.getByRole('button', { name: 'Open Menu' });
        this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    }

    async goto() {
        await this.page.goto('/inventory.html');
    }

    // Sort options: 'az', 'za', 'lohi', 'hilo'
    async sortBy(option) {
        await this.sortDropdown.selectOption(option);
    }

    // Example: 'Sauce Labs Backpack' -> 'sauce-labs-backpack'
    toSlug(productName) {
        return productName.toLowerCase().replace(/ /g, '-');
    }

    addToCartButton(productName) {
        return this.page.locator(`[data-test="add-to-cart-${this.toSlug(productName)}"]`);
    }

    removeButton(productName) {
        return this.page.locator(`[data-test="remove-${this.toSlug(productName)}"]`);
    }

    productTitleLink(productName) {
        return this.productNames.filter({ hasText: productName });
    }

    async addToCart(productName) {
        await this.addToCartButton(productName).click();
    }

    async removeFromCart(productName) {
        await this.removeButton(productName).click();
    }

    async openProduct(productName) {
        await this.productTitleLink(productName).click();
    }

    async openCart() {
        await this.cartLink.click();
    }

    async logout() {
        await this.menuButton.click();
        await this.logoutLink.click();
    }
}