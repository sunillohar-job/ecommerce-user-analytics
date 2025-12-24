import { MongoClient } from "mongodb";
import "dotenv/config";

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.MONGO_DB;

const USERS_COUNT = 20;
const MAX_SESSIONS_PER_USER = 4;

const USERS = [
  { fname: "Aarav", lname: "Sharma" },
  { fname: "Emily", lname: "Johnson" },
  { fname: "Rohan", lname: "Mehta" },
  { fname: "Sophia", lname: "Williams" },
  { fname: "Kunal", lname: "Verma" },
  { fname: "Liam", lname: "Brown" },
  { fname: "Neha", lname: "Gupta" },
  { fname: "Olivia", lname: "Miller" },
  { fname: "Arjun", lname: "Singh" },
  { fname: "Noah", lname: "Davis" },
  { fname: "Priya", lname: "Kapoor" },
  { fname: "Isabella", lname: "Wilson" },
  { fname: "Rahul", lname: "Iyer" },
  { fname: "James", lname: "Anderson" },
  { fname: "Ananya", lname: "Chatterjee" },
  { fname: "Mia", lname: "Taylor" },
  { fname: "Vikram", lname: "Patel" },
  { fname: "Benjamin", lname: "Thomas" },
  { fname: "Sneha", lname: "Nair" },
  { fname: "Charlotte", lname: "Moore" }
];

const EVENT_TYPES = [
  "PAGE_VIEW",
  "SEARCH",
  "ADD_TO_CART",
  "SCROLL_DEPTH",
  "REMOVE_FROM_CART",
  "ORDER_PLACED"
];

const PRODUCT_NAMES = [
  { id: 1001, name: "iphone 15", price: 999.99 },
  { id: 1002, name: "samsung galaxy", price: 899.49 },
  { id: 1003, name: "macbook air", price: 1199.00 },
  { id: 1004, name: "sony headphones", price: 199.99 },
  { id: 1005, name: "nike shoes", price: 149.95 },
  { id: 1006, name: "adidas jacket", price: 129.50 },
  { id: 1007, name: "apple watch", price: 399.99 },
  { id: 1008, name: "dell monitor", price: 279.00 },
  { id: 1009, name: "gaming mouse", price: 59.99 },
  { id: 1010, name: "bluetooth speaker", price: 89.49 }
];


const COUNTRIES = ["UK", "US", "IN", "DE", "FR"];
const LANGUAGES = ["en", "de", "fr"];
const DEVICES = ["desktop", "mobile"];
const BROWSERS = ["chrome", "firefox", "safari", "edge"];

const PAGE_VIEW_PAGES = ["home", "deals", "category", "product", "search"];

const randomFrom = arr => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function randomAmount() {
  return Number((Math.random() * 500 + 20).toFixed(2));
}

async function ensureCollection(db, name) {
  const collections = await db.listCollections({ name }).toArray();
  if (collections.length === 0) {
    await db.createCollection(name);
    console.log(`📦 Created collection: ${name}`);
  }
}

async function run() {
  let client;
  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);

    await ensureCollection(db, "users");
    await ensureCollection(db, "sessions");
    await ensureCollection(db, "events");

    const usersCol = db.collection("users");
    const sessionsCol = db.collection("sessions");
    const eventsCol = db.collection("events");

    console.log("🧹 Cleaning collections...");
    await Promise.all([
      usersCol.deleteMany({}),
      sessionsCol.deleteMany({}),
      eventsCol.deleteMany({}),
      usersCol.dropIndexes(),
      sessionsCol.dropIndexes(),
      eventsCol.dropIndexes()
    ]);

    const users = [];
    const sessions = [];
    const events = [];

    const baseTime = new Date();

    for (let u = 1; u <= USERS_COUNT; u++) {
      const userId = `u${1000 + u}`;

      const createdAt = new Date(baseTime.getTime() - randomInt(5, 20) * 86400000);
      const lastActiveAt = new Date(
        createdAt.getTime() + randomInt(1, 5) * 86400000
      );
      const { fname, lname } = randomFrom(USERS);
      users.push({
        userId,
        createdAt,
        lastActiveAt,
        fname,
        lname,
        age: randomInt(18, 60),
        country: randomFrom(COUNTRIES),
        language: randomFrom(LANGUAGES),
        metadata: {}
      });

      const sessionCount = randomInt(1, MAX_SESSIONS_PER_USER);
      for (let s = 1; s <= sessionCount; s++) {
        const sessionId = `${userId}_s${s}`;

        const startedAt = new Date(
          lastActiveAt.getTime() + randomInt(1, 120) * 60000
        );
        const lastActivityAt = new Date(
          startedAt.getTime() + randomInt(2, 10) * 60000
        );
        const endedAt = new Date(
          lastActivityAt.getTime() + randomInt(1, 5) * 60000
        );

        sessions.push({
          sessionId,
          userId,
          startedAt,
          lastActivityAt,
          endedAt,
          metadata: {}
        });

        const eventCount = randomInt(1, EVENT_TYPES.length);

        let previousTimeStamp = new Date(
          startedAt.getTime() + randomInt(1, 90) * 1000
        );
        for (let e = 0; e < eventCount; e++) {
          const eventType = EVENT_TYPES[e];
          const timestamp = new Date(
            previousTimeStamp.getTime() + randomInt(1, 90) * 1000
          );
          previousTimeStamp = timestamp;

          let page = "/home";
          let metadata = {
            device: randomFrom(DEVICES),
            browser: randomFrom(BROWSERS)
          };

          if (eventType === "PAGE_VIEW") {
            const pageType = randomFrom(PAGE_VIEW_PAGES);
            page = `/${pageType}`;
            if (pageType === "product") {
              const product = randomFrom(PRODUCT_NAMES);
              metadata = { ...metadata, productId: product.id, productName: product.name, price: product.price };
            }
          }

          if (eventType === "ADD_TO_CART") {
            page = `/product`;
            const product = randomFrom(PRODUCT_NAMES);
            metadata = { ...metadata, productId: product.id, productName: product.name, price: product.price };
          }

          if (eventType === "REMOVE_FROM_CART") {
            page = `/checkout`;
            const product = randomFrom(PRODUCT_NAMES);
            metadata = { ...metadata, productId: product.id, productName: product.name, price: product.price };
          }

          if (eventType === "ORDER_PLACED") {
            page = "/checkout";
            metadata.amount = randomAmount();
            metadata.items = randomInt(1, 10);
          }

          if (eventType === "SEARCH") {
            page = "/search";
            const product = randomFrom(PRODUCT_NAMES);
            metadata.query = product.name;
            metadata.resultCount = randomInt(0, 20);
          }

          if (eventType === "SCROLL_DEPTH") {
            const pageType = randomFrom(PAGE_VIEW_PAGES);
            page = `/${pageType}`;
            metadata.scrollPercent = randomInt(10, 100);
          }

          events.push({
            userId,
            sessionId,
            eventType,
            page,
            timestamp,
            metadata
          });
        }
      }
    }

    console.log("📥 Inserting data...");
    await usersCol.insertMany(users);
    await sessionsCol.insertMany(sessions);
    await eventsCol.insertMany(events);

    console.log("⚡ Creating indexes...");

    await usersCol.createIndex({ userId: 1 }, { unique: true });
    await usersCol.createIndex({ country: 1 });
    await usersCol.createIndex({ lastActiveAt: -1 });

    await sessionsCol.createIndex({ sessionId: 1 }, { unique: true });
    await sessionsCol.createIndex({ userId: 1 });
    await sessionsCol.createIndex({ startedAt: -1 });

    await eventsCol.createIndex({ userId: 1 });
    await eventsCol.createIndex({ sessionId: 1 });
    await eventsCol.createIndex({ eventType: 1 });
    await eventsCol.createIndex({ timestamp: -1 });
    await eventsCol.createIndex({ sessionId: 1, timestamp: 1 });

    console.log("✅ Updated analytics mock data created successfully");
    await client.close();
  } catch (error) {
    console.error("❌ Error creating mock data:", error);
  } finally {
    if (client) {
      await client.close();
    }
    process.exit(0);
  }
}

run().catch(console.error);
