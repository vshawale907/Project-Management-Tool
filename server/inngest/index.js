import { PrismaClient } from "@prisma/client";
import { Inngest } from "inngest";

const prisma = new PrismaClient();

// Create a client to send and receive events
export const inngest = new Inngest({ id: "project-management" });

/* -------------------- USER CREATION -------------------- */
const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        const { data } = event;

        await prisma.user.create({
            data: {
                id: data.id,
                email: data.email_addresses?.[0]?.email_address || "",
                name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
                image: data.image_url,
            },
        });
    }
);

/* -------------------- USER DELETION -------------------- */
const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-from-clerk" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        const { data } = event;

        await prisma.user.delete({
            where: {
                id: data.id,
            },
        });
    }
);

/* -------------------- USER UPDATE -------------------- */
const syncUserUpdation = inngest.createFunction(
    { id: "update-user-from-clerk" },
    { event: "clerk/user.updated" },
    async ({ event }) => {
        const { data } = event;

        await prisma.user.update({
            where: {
                id: data.id,
            },
            data: {
                email: data.email_addresses?.[0]?.email_address || "",
                name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
                image: data.image_url,
            },
        });
    }
);

/* -------------------- EXPORT FUNCTIONS -------------------- */
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
];
