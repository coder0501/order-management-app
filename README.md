# Crave Order Management

A full-stack order management feature for a food delivery app, built for the Raftlabs Full Stack Developer assessment.

## Stack

- React 19, TypeScript, Vite
- Express 5 REST API
- MongoDB with Mongoose
- Zod request validation
- Socket.IO order status events
- Vitest, Testing Library, and Supertest

Tailwind CSS was intentionally not added. The UI uses focused CSS with a small dependency surface, while Lucide provides accessible interface icons.

## Features

- Menu display with images, descriptions, prices, ratings, and categories
- Popular, pizza, burger, and sides filters
- Cart with add, remove, and quantity controls
- Checkout with name, address, and phone validation
- Order creation through the REST API
- MongoDB persistence with in-memory fallback for demos
- Order status simulation: received, preparing, out for delivery
- Socket.IO status broadcasts for live order tracking
- REST endpoints for menu and order CRUD/status operations
- Client and API test coverage

## Project Structure

```text
client/                 React + Vite application
  src/App.tsx           Page orchestration and state
  src/components/       Menu, cart, checkout, and status components
  src/data/menu.ts      Menu data
  src/types.ts          Shared client domain types
  src/App.test.tsx      Component interaction tests
  src/App.css           Responsive visual system
server/                 Express + MongoDB API
  src/app.ts             HTTP application composition
  src/server.ts          Production dependency wiring and bootstrap
  src/domain/            Menu and order domain types/data
  src/routes/            HTTP route handlers
  src/services/          Order pricing and business logic
  src/repositories/      Memory and MongoDB persistence adapters
  src/realtime/          Socket.IO status scheduling/publication
  src/validation/        Zod request schemas
  src/index.test.ts     API endpoint tests
```

## Run Locally

Prerequisite: Node.js 20 or newer. MongoDB is optional because the API falls back to memory when MongoDB is unavailable.

Terminal 1:

```powershell
Copy-Item server/.env.example server/.env
npm run dev --prefix server
```

Terminal 2:

```powershell
npm run dev --prefix client
```

Open http://localhost:5173.

To use MongoDB, set `MONGODB_URI` in `server/.env` before starting the API. Set `VITE_API_URL` in `client/.env` if the API is hosted somewhere other than `http://localhost:4000`.

## Test and Validate

Run the complete checks:

```powershell
npm test --prefix client
npm run lint --prefix client
npm run build --prefix client
npm test --prefix server
npm run build --prefix server
```

Expected result:

- Client: 3 tests passing
- Server: 12 tests passing
- Client lint: no errors
- Both production builds: successful

Manual acceptance flow:

1. Open the client and select a category.
2. Add two different menu items.
3. Open Cart and change quantities in both directions.
4. Select Checkout and confirm empty fields are rejected.
5. Submit valid details such as `Alex Morgan`, `12 Willow Street`, and `555-123-4567`.
6. Confirm the order banner appears.
7. With the API running, confirm status changes arrive through Socket.IO after approximately five seconds.
8. Stop the API and repeat checkout to verify the local demo fallback message and local status simulation.

## API

- `GET /health`
- `GET /api/menu`
- `POST /api/orders`
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status`
- `DELETE /api/orders/:id`
- Socket.IO: emit `order:watch` with an order ID; listen for `order:updated`

Example order body:

```json
{
  "customer": {
    "name": "Alex Morgan",
    "address": "12 Willow Street",
    "phone": "555-123-4567"
  },
  "items": [{ "menuItemId": 1, "quantity": 2 }]
}
```

## Submission Checklist

- Push the repository to a public GitHub repository.
- Deploy the client to Vercel or Netlify.
- Deploy the API to Render, Railway, or another Node-compatible host.
- Configure `MONGODB_URI`, `CLIENT_ORIGIN`, and `VITE_API_URL` in deployment settings.
- Add the live client URL, API URL, repository URL, and Loom URL to the final submission.
- In the Loom walkthrough, explain the component structure, API validation, persistence fallback, status events, tests, and AI-assisted development decisions.

## Deployment Note

### Deploy the client to Vercel

1. Push the repository to GitHub.
2. In Vercel, choose **New Project** and import the repository.
3. Set **Root Directory** to `client`.
4. Keep the framework preset as **Vite**.
5. Set the build command to `npm run build` and output directory to `dist`.
6. Add `VITE_API_URL` with the public URL of the deployed API, for example `https://crave-api.onrender.com`.
7. Deploy and open the generated Vercel URL.

The Express API should be deployed separately to Render, Railway, Fly.io, or another Node-compatible host. Configure `PORT`, `CLIENT_ORIGIN` with the Vercel URL, and `MONGODB_URI` in that host's environment settings. For Render, set the root directory to `server`, build command to `npm install --include=dev && npm run build`, and start command to `npm start`. The output directory is empty because this is a Node service. Tests are excluded from the production TypeScript bundle but remain available through `npm test`.

The MongoDB URI previously pasted into `.env.example` contained a real username and password. It has been removed from the repository example, but that password must still be rotated in MongoDB Atlas immediately because it has been exposed in chat and may exist in local or Git history. Never commit real credentials. Use `server/.env` locally and deployment-provider environment variables in production.
