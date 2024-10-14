import { expect } from "@playwright/test";

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

export async function mockListAllFranchisesEndpoint(page) {
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

export async function mockAuthEndpoint(page) {
  await page.route("*/**/api/auth", async (route) => {
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
  });
}

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
