# Booker App

## 🔗 Demo

- https://hotel-booker-app.vercel.app

## 📸 Screenshots

![image](https://drive.google.com/uc?export=view&id=1BeuzcHiiQB3jrnf3U9NU873S9Hv8dPwO)
![image](https://drive.google.com/uc?export=view&id=15o9ZMGA8dkih23vmddhdu9AH6Ys3H9IX)
![image](https://drive.google.com/uc?export=view&id=1SxItKVerWXuiiu4s97-6PnfAJd9w0dkC)
![image](https://drive.google.com/uc?export=view&id=10JtbkZQjLCkmUcJax65Kl_iwLeOvUXxY)
![image](https://drive.google.com/uc?export=view&id=1lB-2MrAYusnInF_1n-1S81ZVuKm1ZfLa)

## 💾 Technologies and tools:

- Next.js
- Typescript
- Apollo Client
- Apollo Server
- Material-UI
- React-hook-form
- Nexus
- Postgresql
- Prisma
- Cloudinary

## 📋 Features:

- File handling from server enabled.
- Images upload to cloudinary.
- Advance Image optimization.
- Database seed.
- Client end server side authentication.
- Session persistence.
- Complex searches.
- SSR and ISR.
- SSR cache-control headers.
- Dynamics layouts.
- Full guest, hotels, rooms and bookings management system.
- Multi hotels support.

## 🤐 Environment variables

- `APP_SECRET` _Jwt secret key_
- `NEXT_PUBLIC_HOST` _Application hots name_
- `NEXT_PUBLIC_BACKEND_URL` _HOST/api/graphql_
- `DATABASE_URL` _Postgresql database connection string_
- `NODE_ENV` _production/development_
- `CLOUDINARY_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## 🕹Set up project

#### 1. Install my-project with npm

```bash
  npm install my-project

  cd my-project
```

#### 2. Create and seed the database

```bash
npx prisma migrate dev --name init

npx prisma db seed

```

#### 3. Start the app

```bash
  npm run dev

```

## 🗃 Database ERD:

![image](https://drive.google.com/uc?export=view&id=1Fnpi7pzcDLktRp9rdkQafaUBlgGlGYkQ)
