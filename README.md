# M&N Restaurant (Mohamad & Noor)

Production-style full-stack restaurant web app for the **M&N chain**, with a **bottle-themed** UI (glass highlights, subtle bubbles, warm modern dining).

## Tech stack

- **Next.js App Router** + **React** + **TypeScript**
- **Tailwind** + **shadcn/ui-style components**
- **Prisma ORM** + **PostgreSQL**
- **NextAuth (Credentials)** + **bcrypt**
- **Zod** validation + **React Hook Form**

## Features

- **Customer pages**: Home, Menu (category filter + search), Dish details (`/menu/[slug]`), About, Gallery, Locations & Hours, Reservations (stored in DB), Contact (stored in DB), Catering/Events
- **Auth**: `/login`, `/signup`, bcrypt hashing, role-based redirect (**ADMIN/STAFF → `/admin`**, **USER → `/`**)
- **Admin** (`/admin`, protected):
  - **Menu items CRUD** (includes featured, availability, **soft delete via `archived`**)
  - **Categories CRUD**
  - **Reservations management** (status updates)
  - **Contact messages management** (status updates)
  - **User list + role management** (**ADMIN-only** role updates)
  - **Pagination + search**
- **Design requirement**: Decorative **YOLO-style “tasty”** bounding boxes over food images (purely visual; **not stored in DB**)
- **Dark mode** toggle

## Local run (pnpm)

1. Install deps:

```bash
pnpm install
```

2. Create `.env` from `.env.example` and set **DATABASE_URL** (MySQL):

```bash
copy .env.example .env
```

For XAMPP/phpMyAdmin, your `.env` will look like:

```text
DATABASE_URL="mysql://root:@localhost:3306/mn"
```

3. Run migrations:

```bash
pnpm prisma migrate dev
```

4. Seed sample data:

```bash
pnpm prisma db seed
```

5. Start dev server:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Seeded accounts

Password for all seeded users: **`Password123!`**

- **Admin**: `admin@mn.local`
- **Staff**: `staff@mn.local`
- **User**: `user@mn.local`

## Optional: Docker Postgres

Start Postgres:

```bash
docker compose up -d
```

Then set (Postgres only):

```text
DATABASE_URL="postgresql://mn:mn@localhost:5432/mn?schema=public"
```

## Notes

- This repo is now configured for **MySQL** via Prisma. For production, you should also set a strong NextAuth secret (e.g. `NEXTAUTH_SECRET`) in your deployment environment.
