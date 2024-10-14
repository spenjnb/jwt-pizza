import { expect } from "@playwright/test";

// Mock the FRANCHISEROUTER endpoint

// Mock the franchise endpoint
export async function mockFranchiseEndpoint(page) {
  await page.route("*/**/api/franchise", async (route) => {
    const franchiseRes = [
      {
        id: 2,
        name: "LotaPizza",
        stores: [
          { id: 4, name: "Lehi" },
          { id: 5, name: "Springville" },
          { id: 6, name: "American Fork" },
        ],
      },
      { id: 3, name: "PizzaCorp", stores: [{ id: 7, name: "Spanish Fork" }] },
      { id: 4, name: "topSpot", stores: [] },
    ];
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: franchiseRes });
  });
}

// Mock the franchise as admin endpoint
export async function mockFranchiseAdminEndpoint(page) {
  await page.route("*/**/api/franchise", async (route) => {
    const method = route.request().method();
    if (method === "GET") {
      const franchiseRes = [
        {
          id: 2,
          name: "LotaPizza",
          admins: [{ id: 50, name: "Frank franchise", email: "frank@jwt.com" }],
          stores: [{ id: 4, name: "Lehi", totalRevenue: 0.9 }],
        },
        {
          id: 3,
          name: "PizzaCorp",
          admins: [{ id: 51, name: "Kai franchise", email: "kai@jwt.com" }],
          stores: [{ id: 5, name: "Springville", totalRevenue: 0.8 }],
        },
        {
          id: 4,
          name: "topSpot",
          admins: [{ id: 52, name: "Ryan franchise", email: "ryan@jwt.com" }],
          stores: [{ id: 6, name: "American Fork", totalRevenue: 0.7 }],
        },
      ];
      expect(route.request().method()).toBe("GET");
      await route.fulfill({ json: franchiseRes });
    } else if (method === "POST") {
      const newFranchiseReq = {
        name: "franchise Test",
        admins: [{ email: "frank@jwt.com" }],
      };
      const newFranchiseRes = {
        name: "franchise Test",
        admins: [{ email: "frank@jwt.com", id: 50, name: "Frank franchise" }],
      };
      expect(route.request().method()).toBe("POST");
      expect(route.request().postDataJSON()).toMatchObject(newFranchiseReq);
      await route.fulfill({ json: newFranchiseRes });
    }
  });
}

// Mock the franchise as franchisee endpoint
export async function mockFranchiseFranchiseeEndpoint(page) {
  await page.route("*/**/api/franchise/24", async (route) => {
    const method = route.request().method();
    const franchiseRes = [
      {
        id: 2,
        name: "LotaPizza",
        admins: [{ id: 50, name: "Franchisee", email: "frank@jwt.com" }],
        stores: [{ id: 4, name: "Lehi", totalRevenue: 0.9 }],
      },
    ];
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: franchiseRes });
  });
}

// Mock the franchise as diner endpoint
export async function mockCreateNewFranchiseEndpoint(page) {
  await page.route("*/**/api/franchise", async (route) => {
    const newFranchiseReq = {
      name: "franchise Test",
      admins: [{ email: "frank@jwt.com" }],
    };
    const newFranchiseRes = {
      name: "franchise Test",
      admins: [{ email: "frank@jwt.com", id: 50, name: "Frank franchise" }],
    };
    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toMatchObject(newFranchiseReq);
    await route.fulfill({ json: newFranchiseRes });
  });
}

// Mock the delete franchise endpoint
export async function mockDeleteFranchiseEndpoint(page) {
  await page.route("*/**/api/franchise/4", async (route) => {
    const deleteFranchiseRes = { message: "franchise deleted" };
    expect(route.request().method()).toBe("DELETE");
    await route.fulfill({ json: deleteFranchiseRes });
  });
}

// Mock AUTH endpoint (login, register, logout)

// Mock the login endpoint
export async function mockAuthEndpoint(page) {
  await page.route("*/**/api/auth", async (route) => {
    const method = route.request().method();
    if (method === "PUT") {
      const loginReq = { email: "d@jwt.com", password: "a" };
      const loginRes = {
        user: {
          id: 3,
          name: "Kai Chen",
          email: "d@jwt.com",
          roles: [{ role: "diner" }],
        },
        token: "abcdef",
      };
      expect(route.request().method()).toBe("PUT");
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    } else if (method === "DELETE") {
      const logoutRes = { message: "logout successful" };
      expect(route.request().method()).toBe("DELETE");
      await route.fulfill({ json: logoutRes });
    }
  });
}

// Mock the admin login endpoint
export async function mockAdminUser(page) {
  await page.route("*/**/api/auth", async (route) => {
    const loginReq = { email: "frank@jwt.com", password: "b" };
    const loginRes = {
      user: {
        id: 14,
        name: "Frank Davis",
        email: "frank@jwt.com",
        roles: [{ role: "admin" }],
      },
      token: "abcdef321",
    };
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });
}

// Mock the franchisee login endpoint
export async function mockFranchiseeUserEndpoint(page) {
  await page.route("*/**/api/auth", async (route) => {
    const loginReq = { email: "franchisee@jwt.com", password: "f" };
    const loginRes = {
      user: {
        id: 24,
        name: "Christ Wallace",
        email: "franchisee@jwt.com",
        roles: [{ role: "franchisee" }],
      },
      token: "abcdef789",
    };
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });
}

// Mock the register endpoint
export async function mockRegisterEndpoint(page) {
  await page.route("*/**/api/auth", async (route) => {
    const registerReq = {
      name: "Ryan",
      email: "Ryan@email.com",
      password: "password",
    };
    const registerRes = {
      user: {
        id: 3,
        name: "Ryan",
        email: "email",
        roles: [{ role: "diner" }],
      },
      token: "abcdef123",
    };
    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toMatchObject(registerReq);
    await route.fulfill({ json: registerRes });
  });
}

// Mock the ORDERROUTER endpoint

// This is a POST request that creates an order
export async function mockOrderEndpoint(page) {
  await page.route("*/**/api/order", async (route) => {
    const orderReq = {
      items: [
        { menuId: 1, description: "Veggie", price: 0.0038 },
        { menuId: 2, description: "Pepperoni", price: 0.0042 },
      ],
      storeId: "4",
      franchiseId: 2,
    };
    const orderRes = {
      order: {
        items: [
          { menuId: 1, description: "Veggie", price: 0.0038 },
          { menuId: 2, description: "Pepperoni", price: 0.0042 },
        ],
        storeId: "4",
        franchiseId: 2,
        id: 23,
      },
      jwt: "eyJpYXQ",
    };
    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toMatchObject(orderReq);
    await route.fulfill({ json: orderRes });
  });
}

// Mock the menu endpoint
export async function mockMenuEndpoint(page) {
  await page.route("*/**/api/order/menu", async (route) => {
    const menuRes = [
      {
        id: 1,
        title: "Veggie",
        image: "pizza1.png",
        price: 0.0038,
        description: "A garden of delight",
      },
      {
        id: 2,
        title: "Pepperoni",
        image: "pizza2.png",
        price: 0.0042,
        description: "Spicy treat",
      },
    ];
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: menuRes });
  });
}

// Mock create new store endpoint
export async function mockCreateNewStoreEndpoint(page) {
  await page.route("*/**/api/franchise/24/store", async (route) => {
    const newStoreReq = { franchiseId: 24, name: "new store" };
    const newStoreRes = { id: 5, franchiseId: 2, name: "new store" };
    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toMatchObject(newStoreReq);
    await route.fulfill({ json: newStoreRes });
  });
}

export async function mockDocsEndpoint(page) {
  await page.route("*/**/api/docs", async (route) => {
    const docsRes = [
      {
        version: "20241003.014227",
        endpoints: [
          {
            method: "POST",
            path: "/api/auth",
            description: "Register a new user",
            example:
              'curl -X POST localhost:3000/api/auth -d \'{"name":"pizza diner", "email":"d@jwt.com", "password":"diner"}\' -H \'Content-Type: application/json\'',
            response: {
              user: {
                id: 2,
                name: "pizza diner",
                email: "d@jwt.com",
                roles: [
                  {
                    role: "diner",
                  },
                ],
              },
              token: "tttttt",
            },
          },
          {
            method: "PUT",
            path: "/api/auth",
            description: "Login existing user",
            example:
              'curl -X PUT localhost:3000/api/auth -d \'{"email":"a@jwt.com", "password":"admin"}\' -H \'Content-Type: application/json\'',
            response: {
              user: {
                id: 1,
                name: "常用名字",
                email: "a@jwt.com",
                roles: [
                  {
                    role: "admin",
                  },
                ],
              },
              token: "tttttt",
            },
          },
          {
            method: "PUT",
            path: "/api/auth/:userId",
            requiresAuth: true,
            description: "Update user",
            example:
              'curl -X PUT localhost:3000/api/auth/1 -d \'{"email":"a@jwt.com", "password":"admin"}\' -H \'Content-Type: application/json\' -H \'Authorization: Bearer tttttt\'',
            response: {
              id: 1,
              name: "常用名字",
              email: "a@jwt.com",
              roles: [
                {
                  role: "admin",
                },
              ],
            },
          },
          {
            method: "DELETE",
            path: "/api/auth",
            requiresAuth: true,
            description: "Logout a user",
            example:
              "curl -X DELETE localhost:3000/api/auth -H 'Authorization: Bearer tttttt'",
            response: {
              message: "logout successful",
            },
          },
          {
            method: "GET",
            path: "/api/order/menu",
            description: "Get the pizza menu",
            example: "curl localhost:3000/api/order/menu",
            response: [
              {
                id: 1,
                title: "Veggie",
                image: "pizza1.png",
                price: 0.0038,
                description: "A garden of delight",
              },
            ],
          },
          {
            method: "PUT",
            path: "/api/order/menu",
            requiresAuth: true,
            description: "Add an item to the menu",
            example:
              'curl -X PUT localhost:3000/api/order/menu -H \'Content-Type: application/json\' -d \'{ "title":"Student", "description": "No topping, no sauce, just carbs", "image":"pizza9.png", "price": 0.0001 }\'  -H \'Authorization: Bearer tttttt\'',
            response: [
              {
                id: 1,
                title: "Student",
                description: "No topping, no sauce, just carbs",
                image: "pizza9.png",
                price: 0.0001,
              },
            ],
          },
          {
            method: "GET",
            path: "/api/order",
            requiresAuth: true,
            description: "Get the orders for the authenticated user",
            example:
              "curl -X GET localhost:3000/api/order  -H 'Authorization: Bearer tttttt'",
            response: {
              dinerId: 4,
              orders: [
                {
                  id: 1,
                  franchiseId: 1,
                  storeId: 1,
                  date: "2024-06-05T05:14:40.000Z",
                  items: [
                    {
                      id: 1,
                      menuId: 1,
                      description: "Veggie",
                      price: 0.05,
                    },
                  ],
                },
              ],
              page: 1,
            },
          },
          {
            method: "POST",
            path: "/api/order",
            requiresAuth: true,
            description: "Create a order for the authenticated user",
            example:
              'curl -X POST localhost:3000/api/order -H \'Content-Type: application/json\' -d \'{"franchiseId": 1, "storeId":1, "items":[{ "menuId": 1, "description": "Veggie", "price": 0.05 }]}\'  -H \'Authorization: Bearer tttttt\'',
            response: {
              order: {
                franchiseId: 1,
                storeId: 1,
                items: [
                  {
                    menuId: 1,
                    description: "Veggie",
                    price: 0.05,
                  },
                ],
                id: 1,
              },
              jwt: "1111111111",
            },
          },
          {
            method: "GET",
            path: "/api/franchise",
            description: "List all the franchises",
            example: "curl localhost:3000/api/franchise",
            response: [
              {
                id: 1,
                name: "pizzaPocket",
                stores: [
                  {
                    id: 1,
                    name: "SLC",
                  },
                ],
              },
            ],
          },
          {
            method: "GET",
            path: "/api/franchise/:userId",
            requiresAuth: true,
            description: "List a user's franchises",
            example:
              "curl localhost:3000/api/franchise/4  -H 'Authorization: Bearer tttttt'",
            response: [
              {
                id: 2,
                name: "pizzaPocket",
                admins: [
                  {
                    id: 4,
                    name: "pizza franchisee",
                    email: "f@jwt.com",
                  },
                ],
                stores: [
                  {
                    id: 4,
                    name: "SLC",
                    totalRevenue: 0,
                  },
                ],
              },
            ],
          },
          {
            method: "POST",
            path: "/api/franchise",
            requiresAuth: true,
            description: "Create a new franchise",
            example:
              'curl -X POST localhost:3000/api/franchise -H \'Content-Type: application/json\' -H \'Authorization: Bearer tttttt\' -d \'{"name": "pizzaPocket", "admins": [{"email": "f@jwt.com"}]}\'',
            response: {
              name: "pizzaPocket",
              admins: [
                {
                  email: "f@jwt.com",
                  id: 4,
                  name: "pizza franchisee",
                },
              ],
              id: 1,
            },
          },
          {
            method: "DELETE",
            path: "/api/franchise/:franchiseId",
            requiresAuth: true,
            description: "Delete a franchises",
            example:
              "curl -X DELETE localhost:3000/api/franchise/1 -H 'Authorization: Bearer tttttt'",
            response: {
              message: "franchise deleted",
            },
          },
          {
            method: "POST",
            path: "/api/franchise/:franchiseId/store",
            requiresAuth: true,
            description: "Create a new franchise store",
            example:
              "curl -X POST localhost:3000/api/franchise/1/store -H 'Content-Type: application/json' -d '{\"franchiseId\": 1, \"name\":\"SLC\"}' -H 'Authorization: Bearer tttttt'",
            response: {
              id: 1,
              franchiseId: 1,
              name: "SLC",
            },
          },
          {
            method: "DELETE",
            path: "/api/franchise/:franchiseId/store/:storeId",
            requiresAuth: true,
            description: "Delete a store",
            example:
              "curl -X DELETE localhost:3000/api/franchise/1/store/1  -H 'Authorization: Bearer tttttt'",
            response: {
              message: "store deleted",
            },
          },
        ],
        config: {
          factory: "https://pizza-factory.cs329.click",
          db: "127.0.0.1",
        },
      },
    ];
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: docsRes });
  });
}
