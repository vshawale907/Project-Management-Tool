import express from "express";
import cors from "cors";
import { serve } from "inngest/express";
import { inngest } from "./inngest/client.js";
import { functions } from "./inngest/index.js";
import workspaceRouter from "./routes/workspaceroutes.js";
import { protect } from "./middlewares/authMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

// THIS ROUTE IS WHAT INNGEST CALLS
app.use(
    "/api/inngest",
    serve({
        client: inngest,
        functions,
    })
);

// Routes

app.use("/api/workspaces", protect, workspaceRouter)  

app.get("/", (_, res) => {
    res.send("Server running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
