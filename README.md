# Booker App

> Application for the administration and request of hotel rooms with updated information on the availability of rooms.

<a href="https://hotel-booker-app.vercel.app" target="_blank">Demo</a>

<a href="https://www.linkedin.com/in/brisa-d%C3%ADaz" target="_blank">Author</a>

## 📸 Screenshots

![image](https://drive.google.com/uc?export=view&id=1BeuzcHiiQB3jrnf3U9NU873S9Hv8dPwO)
![image](https://drive.google.com/uc?export=view&id=16cPv56ggrVwkn_SsJF0h8Vmd1FVVd4md)
![image](https://drive.google.com/uc?export=view&id=1SxItKVerWXuiiu4s97-6PnfAJd9w0dkC)
![image](https://drive.google.com/uc?export=view&id=10JtbkZQjLCkmUcJax65Kl_iwLeOvUXxY)
![image](https://drive.google.com/uc?export=view&id=1lB-2MrAYusnInF_1n-1S81ZVuKm1ZfLa)

## 🛠 Main Technologies Used

- Next.js
- Typescript
- Apollo Client
- Apollo Server
- Material-UI
- React Big Calendar
- Draft.js
- React Hook Form
- Nexus
- Postgresql
- Prisma
- Cloudinary

## ✨ Features

- Search by hotel name or location with real-time suggestions.
- Hotel filtering by category, facilities, services, activities, spoken languages and restrictions.
- Pagination.
- Push notifications.
- Ability to check availability and reserve hotel rooms.
- Authentication.
- Multi hotels and admins support.
- Ability to customize hotel and room thumbnails.
- Ability to edit hotel and rooms genetic information and booking logistics.
- Ability to categorize, assign available quota and unique identifier to each hotel room.
- Ability to visualize, search, filter, accept or reject booking requests.
- Possibility of uploading and managing reservations made by external methods.
- Ability to visualize information, search, filter guests.
- Ability to view the calendar of active, canceled or completed reservations, to be able to view details and cancel reservations.
- Ability to manage through a folder system and upload media files to cloudinary.

## 🤐 Environment variables

- `APP_SECRET` _Jwt secret key_
- `NEXT_PUBLIC_HOST` _Application hots name_
- `NEXT_PUBLIC_BACKEND_URL` _HOST/api/graphql_
- `DATABASE_URL` _Postgresql database connection string_
- `NODE_ENV` _production/development_
- `CLOUDINARY_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## 💻 Set up

Clone the project

```bash
  git clone https://github.com/BrisaDiaz/hotel_booker_app.git
```

Go to the project directory

```bash
  cd hotel_booker_app
```

Install dependencies

```bash
  npm install
```

Create and seed the database

```bash
npx prisma migrate dev --name init

npx prisma db seed

```

Start the server

```bash
  npm run dev

  #or

  npm run build

  npm start

```
