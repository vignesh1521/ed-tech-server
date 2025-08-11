

---

⚠️ IMPORTANT – SERVER NOTICE

This project now uses Next.js with a built-in GraphQL server.
The old standalone server you may have hosted previously is no longer needed and should be ignored.

Please use this frontend app only, as it already contains the backend functionality via Apollo Server (GraphQL) inside the pages/api directory.

---

---

## 🚀 Ed-Tech GraphQL Server

This is a **GraphQL API** built using **Apollo Server** and **Express.js**, designed for an Ed-Tech platform. It supports user authentication, course enrollment, and role-based access.

Hosted on: [ed-tech-server.vercel.app](https://ed-tech-server-8cydjzo8v-vignesh-s-projects-319e4451.vercel.app)

---

### 📦 Features

* 🔐 JWT-based Authentication
* 👥 Role-based Access (`admin`, `user`)
* 📘 Enroll Users in Courses
* 🌐 CORS Support
* 📤 Deployable on Vercel as a Serverless Function

---

### 📁 Project Structure

```bash
├── auth.js             # JWT Auth Utility
├── users.js            # In-memory user and course data
├── schema.js           # GraphQL TypeDefs & Resolvers
├── graphql.js          # Main Express + ApolloServer setup (entry point for Vercel)
├── README.md
```

---

### 🔧 Local Development

#### 1. Clone the repo

```bash
git clone https://github.com/your-username/ed-tech-server.git
cd ed-tech-server
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Run locally

```bash
node graphql.js
```

> You may need to modify the entry point if you're not using Vercel locally.

---

### 🚀 Deploy to Vercel

1. Push your project to a GitHub repo.
2. Go to [vercel.com](https://vercel.com), connect your GitHub repo.
3. Set the entry point as `api/graphql.js`.
4. Deploy.

---

### 🛠 GraphQL Playground

Once deployed, access the playground at:

```
https://<your-vercel-app>.vercel.app/
```

---

### 🔐 Authentication

Use JWT tokens in the `Authorization` header as:

```
Authorization: Bearer <token>
```

---

### 👤 Sample Users

```js
{
  id: 1,
  username: "admin",
  password: "admin123",
  role: "admin"
},
{
  id: 2,
  username: "john",
  password: "user123",
  role: "user"
}
```

---

### 📚 Example Queries

```graphql
mutation {
  login(username: "john", password: "user123") {
    token
  }
}
```

```graphql
query {
  courses {
    id
    title
  }
}
```

---
