import express from "express";
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());


// Routes
app.get("/", (req, res) => {
    res.send("Server is Live");
});
// Inngest webhook route
app.use("/api/inngest", serve({ client: inngest, functions }));

// Export app for serverless environments (Vercel). Start a listener for local dev only.
export default app;

if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
