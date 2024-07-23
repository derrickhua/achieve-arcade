# Achieve Arcade

Achieve Arcade is a productivity app that turns achieving your goals into a fun and engaging experience through gamification. With Achieve Arcade, you can boost your productivity, stay motivated, and track your progress with a unique gaming twist.

## Features

### Player Data and Goal Knight
![Home Screen](https://i.imgur.com/FATralS.png)

### Habit Farm and Task Slayer
![Task Management](https://i.imgur.com/PTkHnEm.png)

### Daily Schedule and Rewards System
![Daily Schedule](https://i.imgur.com/LtXiM8g.png)

### Mobile Comptaible
![Mobile Compatible](https://i.imgur.com/hKzCEKz.png)

## Tech Stack

- **Front-end**: Next.js, Tailwind CSS, shadcn ui, React Lucide
- **Back-end**: Express.js, Stripe, Mailgun, Mongoose
- **Database**: MongoDB
- **Node.js**: For both front-end and back-end development

## Installation

To get started with Achieve Arcade, follow these steps:

### Front-end

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/achieve-arcade.git
   ```

2. **Navigate to the Front-end Directory**

   ```bash
   cd achieve-arcade/frontend
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Create a `.env.local` File**

   Create a `.env.local` file in the `frontend` directory and set your environment variables:

   ```plaintext
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXT_PUBLIC_NEXTAUTH_SECRET=your-next-public-nextauth-secret
   JWT_SECRET=your-jwt-secret
   NEXT_PUBLIC_JWT_SECRET=your-next-public-jwt-secret
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   NEXT_PUBLIC_REFRESH_TOKEN_SECRET=your-next-public-refresh-token-secret
   REFRESH_TOKEN_SECRET=your-refresh-token-secret
   ```

5. **Start the Front-end Application**

   ```bash
   npm run dev
   ```

   or

   ```bash
   npm start
   ```

   The front-end application will be running at `http://localhost:3000`.

### Back-end

1. **Navigate to the Back-end Directory**

   ```bash
   cd achieve-arcade/backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` File**

   Create a `.env` file in the `backend` directory and set your environment variables:

   ```plaintext
   JWT_SECRET=your-jwt-secret
   REFRESH_TOKEN_SECRET=your-refresh-token-secret
   NEXTAUTH_SECRET=your-nextauth-secret
   PORT=8000
   OPENAI_API_KEY=your-openai-api-key
   ASSISTANT_ID=your-assistant-id
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
   MONGODB_URI=your-mongodb-uri
   NEXTAUTH_URL=http://localhost:3000
   MAILGUN_API_KEY=your-mailgun-api-key
   ```

4. **Start the Back-end Server**

   ```bash
   node server.js
   ```

   The back-end server will be running at `http://localhost:8000`.

