import { PrismaClient } from "@prisma/client";
import { Inngest } from "inngest";


// Create a client to send and receive events
export const inngest = new Inngest({ id: "project managment" });

const syncuserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        const { data } = event
        await Prisma.user.create({
            data: {
                id: data.id,
                email: data?.email_addresses[0]?.email_addres,
                name: data?.first_name + " " + data?.last_name,
                image: data?.image_url,

            }
        })
    }
)

//ingest function to delete user from database

const syncuserDeletion = inngest.createFunction(
    { id: 'delete-user-from-clerk' },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        const { data } = event
        await Prisma.user.create({
            where: {
                id: data.id,
            }
        })
    }
)

//Inngest function to update user database

const syncuserUpdation = inngest.createFunction(
    { id: 'update-user-from-clerk' },
    { event: 'clerk/user.updated' },
    async ({ event }) => {
        const { data } = event
        await Prisma.user.create({
            where: {
                id: data.id
            },

            data: {
                id: data.id,
                email: data?.email_addresses[0]?.email_addres,
                name: data?.first_name + " " + data?.last_name,
                image: data?.image_url,

            }
        })
    }
)



// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncuserCreation,
    syncuserDeletion,
    syncuserUpdation
];