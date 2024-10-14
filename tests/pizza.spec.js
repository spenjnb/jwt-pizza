import { test, expect } from "playwright-test-coverage";
import {
  mockMenuEndpoint,
  mockFranchiseEndpoint,
  mockAuthEndpoint,
  mockOrderEndpoint,
  mockRegisterEndpoint,
  mockAdminUser,
  mockFranchiseAdminEndpoint,
  mockDeleteFranchiseEndpoint,
} from "./mocks/endpoints";

test.describe("JWT Pizza", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("home page", async ({ page }) => {
    expect(await page.title()).toBe("JWT Pizza");
  });

  test("register new user", async ({ page }) => {
    await mockRegisterEndpoint(page);

    await page.getByRole("link", { name: "Register" }).click();
    await expect(page.getByRole("list")).toContainText("register");
    await expect(page.getByRole("heading")).toContainText(
      "Welcome to the party"
    );
    await page.getByPlaceholder("Full name").click();
    await page.getByPlaceholder("Full name").fill("Ryan");
    await page.getByPlaceholder("Email address").click();
    await page.getByPlaceholder("Email address").fill("Ryan@email.com");
    await page.getByPlaceholder("Password").click();
    await page.getByPlaceholder("Password").fill("password");
    await page.getByRole("button", { name: "Register" }).click();

    await page.getByRole("link", { name: "R", exact: true }).click();
    await expect(page.getByLabel("Global")).toContainText("R");
    await page.getByRole("link", { name: "R", exact: true }).click();
    await expect(page.getByRole("heading")).toContainText("Your pizza kitchen");
    await expect(
      page.getByRole("img", { name: "Employee stock photo" })
    ).toBeVisible();
    await expect(page.getByRole("list")).toContainText("diner-dashboard");
    await expect(page.getByRole("main")).toContainText("Ryan");
    await expect(page.getByRole("main")).toContainText("email");
    await expect(page.getByRole("main")).toContainText("diner");
    await expect(page.getByRole("main")).toContainText(
      "How have you lived this long without having a pizza? Buy one now!"
    );
    await page.getByRole("link", { name: "Buy one" }).click();
    await expect(page.getByRole("heading")).toContainText(
      "Awesome is a click away"
    );
  });

  test("purchase with login", async ({ page }) => {
    await mockMenuEndpoint(page);
    await mockFranchiseEndpoint(page);
    await mockOrderEndpoint(page);
    await mockAuthEndpoint(page);

    // Go to order page
    await page.getByRole("button", { name: "Order now" }).click();

    // Create order
    await expect(page.locator("h2")).toContainText("Awesome is a click away");
    await page.getByRole("combobox").selectOption("4");
    await page
      .getByRole("link", { name: "Image Description Veggie A" })
      .click();
    await page
      .getByRole("link", { name: "Image Description Pepperoni" })
      .click();
    await expect(page.locator("form")).toContainText("Selected pizzas: 2");
    await page.getByRole("button", { name: "Checkout" }).click();

    // Login
    await page.getByPlaceholder("Email address").click();
    await page.getByPlaceholder("Email address").fill("d@jwt.com");
    await page.getByPlaceholder("Email address").press("Tab");
    await page.getByPlaceholder("Password").fill("a");
    await page.getByRole("button", { name: "Login" }).click();

    // Pay
    await expect(page.getByRole("main")).toContainText(
      "Send me those 2 pizzas right now!"
    );
    await expect(page.locator("tbody")).toContainText("Veggie");
    await expect(page.locator("tbody")).toContainText("Pepperoni");
    await expect(page.locator("tfoot")).toContainText("0.008 ₿");
    await page.getByRole("button", { name: "Pay now" }).click();

    // Check balance
    await expect(page.getByText("0.008")).toBeVisible();
  });

  test("test logout", async ({ page }) => {
    await mockAuthEndpoint(page);

    await page.getByRole("link", { name: "Login" }).click();
    await page.getByPlaceholder("Email address").click();
    await page.getByPlaceholder("Email address").fill("d@jwt.com");
    await page.getByPlaceholder("Email address").press("Tab");
    await page.getByPlaceholder("Password").fill("a");
    await page.getByRole("button", { name: "Login" }).click();

    await page.getByRole("link", { name: "Logout" }).click();
    await expect(page.locator("#navbar-dark")).toContainText("Login");
  });

  test("test main elements", async ({ page }) => {
    await page.getByLabel("Global").getByRole("img").click();
    await expect(page.getByLabel("Global").getByRole("img")).toBeVisible();
    await expect(page.getByLabel("Global").locator("span")).toContainText(
      "JWT Pizza"
    );
    await page.getByRole("link", { name: "Order" }).click();
    await page
      .getByLabel("Global")
      .getByRole("link", { name: "Franchise" })
      .click();
    await page.getByRole("link", { name: "Login", exact: true }).click();
    await page.getByRole("link", { name: "Register" }).click();
    await page.getByRole("link", { name: "home" }).click();
    await expect(page.locator("#navbar-dark")).toContainText("Franchise");
    await expect(page.locator("#navbar-dark")).toContainText("Login");
    await expect(page.locator("#navbar-dark")).toContainText("Register");
    await expect(page.getByRole("heading")).toContainText(
      "The web's best pizza"
    );
    await expect(page.getByRole("listitem")).toContainText("home");
    await expect(page.getByRole("link", { name: "home" })).toBeVisible();
    await expect(page.locator(".w-screen")).toBeVisible();

    await page.locator(".hs-carousel-active\\:bg-blue-700").first().click();
    await expect(page.getByRole("main")).toContainText(
      "Most amazing pizza experience of my life. — Megan Fox, Springville"
    );
    await page.locator(".hs-carousel-pagination > span:nth-child(2)").click();
    await expect(page.getByRole("main")).toContainText(
      "Milan reborn! — 张伟, Provo"
    );
    await page.locator("span:nth-child(3)").click();
    await expect(page.getByRole("main")).toContainText(
      "All I can say is WOW! — José García, Orem"
    );
    await page.locator("span:nth-child(4)").click();
    await expect(page.getByRole("main")).toContainText(
      "Best pizza ever. I can eat this every day! — Terrence Jones, Mapleton"
    );
    await expect(page.getByRole("contentinfo")).toContainText("Franchise");
    await expect(page.getByRole("contentinfo")).toContainText("About");
    await expect(page.getByRole("contentinfo")).toContainText("History");
  });

  test('test "Order" page', async ({ page }) => {
    await mockFranchiseEndpoint(page);
    await mockMenuEndpoint(page);
    await mockOrderEndpoint(page);

    await page.getByRole("link", { name: "Order" }).click();
    await expect(page.locator("form")).toContainText(
      "Pick your store and pizzas from below. Remember to order extra for a midnight party."
    );
    await expect(page.locator("form")).toContainText(
      "What are you waiting for? Pick a store and then add some pizzas!"
    );
    await expect(page.getByRole("list")).toContainText("menu");

    await page.getByRole("combobox").selectOption("5");
    await expect(page.getByRole("combobox")).toContainText(
      "choose storeLehiSpringvilleAmerican ForkSpanish Fork"
    );

    await expect(page.locator("form")).toContainText(
      "What are you waiting for? Pick a store and then add some pizzas!"
    );
    await expect(
      page.getByRole("link", { name: "Image Description Veggie A" })
    ).toBeVisible();
    await page
      .getByRole("link", { name: "Image Description Pepperoni" })
      .click();
  });

  test("test about page", async ({ page }) => {
    await page.getByRole("link", { name: "About" }).click();
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("list")).toContainText("homeabout");
    await expect(page.getByRole("main")).toContainText("The secret sauce");
    await expect(page.getByRole("main").getByRole("img").first()).toBeVisible();
    await expect(page.getByRole("main")).toContainText("Our employees");
    await expect(page.getByText("JamesMariaAnnaBrian")).toBeVisible();
    await expect(page.getByText("At JWT Pizza, our amazing")).toBeVisible();
    await expect(page.getByText("Our talented employees at JWT")).toBeVisible();
    await expect(page.getByText("JWT Pizza is home to a team")).toBeVisible();
    await expect(page.getByText("At JWT Pizza, our employees")).toBeVisible();
  });

  test("test history page", async ({ page }) => {
    await page.getByRole("link", { name: "History" }).click();
    await expect(page.getByRole("list")).toContainText("homehistory");
    await expect(page.getByRole("heading")).toContainText("Mama Rucci, my my");
    await expect(page.getByRole("main").getByRole("img")).toBeVisible();
    await expect(page.getByRole("main").locator("div").nth(3)).toBeVisible();
  });

  test("adminDashboard", async ({ page }) => {
    await mockAdminUser(page);

    // login as admin
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByPlaceholder("Email address").click();
    await page.getByPlaceholder("Email address").fill("frank@jwt.com");
    await page.getByPlaceholder("Email address").press("Tab");
    await page.getByPlaceholder("Password").fill("b");
    await page.getByRole("button", { name: "Login" }).click();

    await page.getByRole("link", { name: "FD" }).click();

    await page.getByRole("link", { name: "Admin" }).click();
    await expect(page.getByRole("heading")).toContainText(
      "Mama Ricci's kitchen"
    );

    await expect(page.getByRole("list")).toContainText("homeadmin-dashboard");
    await expect(
      page
        .locator("#root div")
        .filter({ hasText: "Keep the dough rolling and" })
        .nth(3)
    ).toBeVisible();
    await expect(page.getByRole("main")).toContainText(
      "Keep the dough rolling and the franchises signing up."
    );
    await expect(page.getByRole("row")).toContainText("Franchise");
    await expect(page.getByRole("row")).toContainText("Franchisee");
    await expect(page.getByRole("row")).toContainText("Store");
    await expect(page.getByRole("row")).toContainText("Action");
    await expect(page.getByRole("button")).toContainText("Add Franchise");
    await page.getByRole("button", { name: "Add Franchise" }).click();
    await expect(page.locator("#navbar-dark")).toContainText("Admin");

    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByRole("row")).toContainText("Franchise");
    await expect(page.getByRole("row")).toContainText("Franchisee");
    await expect(page.getByRole("row")).toContainText("Store");
    await expect(page.getByRole("row")).toContainText("Revenue");
    await expect(page.getByRole("row")).toContainText("Action");
    await expect(page.locator("#navbar-dark")).toContainText("Logout");
  });

  test("test create franchise", async ({ page }) => {
    await mockAdminUser(page);
    await mockFranchiseAdminEndpoint(page);

    // login as admin
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByPlaceholder("Email address").click();
    await page.getByPlaceholder("Email address").fill("frank@jwt.com");
    await page.getByPlaceholder("Email address").press("Tab");
    await page.getByPlaceholder("Password").fill("b");
    await page.getByRole("button", { name: "Login" }).click();

    // admin dashboard
    await page.getByRole("link", { name: "Admin" }).click();

    await expect(page.getByRole("heading")).toContainText(
      "Mama Ricci's kitchen"
    );
    await page
      .getByRole("button", { name: "Add Franchise" })
      .click({ timeout: 1000 });

    await expect(page.getByRole("heading")).toContainText("Create franchise");
    await expect(page.locator("form")).toContainText(
      "Want to create franchise?"
    );
    await expect(page.getByText("JWT Pizza", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "FD" })).toBeVisible();
    await expect(page.getByText("© 2024 JWT Pizza LTD. All")).toBeVisible();

    // create franchise
    await page.getByPlaceholder("franchise name").click();
    await expect(page.getByRole("list")).toContainText(
      "homeadmin-dashboardcreate-franchise"
    );

    await page.getByPlaceholder("franchise name").fill("franchise Test");
    await page.getByPlaceholder("franchise name").press("Tab");
    await page.getByPlaceholder("franchisee admin email").fill("frank@jwt.com");
    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
    await page.getByRole("button", { name: "Create" }).click();
  });

  test("test close franchise", async ({ page }) => {
    await mockAdminUser(page);
    await mockFranchiseAdminEndpoint(page);
    await mockDeleteFranchiseEndpoint(page);

    // login as admin
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByPlaceholder("Email address").click();
    await page.getByPlaceholder("Email address").fill("frank@jwt.com");
    await page.getByPlaceholder("Email address").press("Tab");
    await page.getByPlaceholder("Password").fill("b");
    await page.getByRole("button", { name: "Login" }).click();

    // admin dashboard
    await page.getByRole("link", { name: "Admin" }).click();

    await expect(page.getByRole("heading")).toContainText(
      "Mama Ricci's kitchen"
    );

    await expect(
      page
        .getByRole("row", { name: "LotaPizza Frank franchise" })
        .getByRole("button")
    ).toBeVisible();
    await expect(
      page.getByRole("row", { name: "Lehi 0.9 ₿ Close" }).getByRole("button")
    ).toBeVisible();
    await expect(page.getByRole("table")).toContainText("LotaPizza");
    await expect(page.getByRole("table")).toContainText("PizzaCorp");
    await expect(page.getByRole("table")).toContainText("topSpot");
    await expect(page.getByRole("table")).toContainText("Kai franchise");
    await expect(page.getByRole("table")).toContainText("American Fork");
    await expect(page.getByRole("table")).toContainText("0.8 ₿");
    await page
      .getByRole("row", { name: "topSpot Ryan franchise Close" })
      .getByRole("button")
      .click();

    await expect(page.getByRole("main")).toContainText(
      "Are you sure you want to close the topSpot franchise? This will close all associated stores and cannot be restored. All outstanding revenue with not be refunded."
    );
    await expect(page.getByRole("heading")).toContainText(
      "Sorry to see you go"
    );
    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
    await expect(page.getByRole("list")).toContainText(
      "homeadmin-dashboardclose-franchise"
    );
    await page.getByRole("button", { name: "Close" }).click();
  });
});
