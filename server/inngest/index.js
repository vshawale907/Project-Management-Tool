import { inngest } from "./client";
import { prisma } from "../prisma";

/* ================= USER EVENTS ================= */

export const syncUserCreation = inngest.createFunction(
    { id: "sync-user-created" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        const { data } = event;

        await prisma.user.create({
            data: {
                id: data.id,
                email: data.email_addresses?.[0]?.email_address ?? "",
                name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
                image: data.image_url,
            },
        });
    }
);

export const syncUserUpdate = inngest.createFunction(
    { id: "sync-user-updated" },
    { event: "clerk/user.updated" },
    async ({ event }) => {
        const { data } = event;

        await prisma.user.update({
            where: { id: data.id },
            data: {
                email: data.email_addresses?.[0]?.email_address ?? "",
                name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
                image: data.image_url,
            },
        });
    }
);

export const syncUserDeletion = inngest.createFunction(
    { id: "sync-user-deleted" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        await prisma.user.delete({
            where: { id: event.data.id },
        });
    }
);

/* ================= WORKSPACE EVENTS ================= */

export const syncWorkspaceCreation = inngest.createFunction(
    { id: "sync-workspace-created" },
    { event: "clerk/organization.created" },
    async ({ event }) => {
        const { data } = event;

        await prisma.workspace.create({
            data: {
                id: data.id,
                name: data.name,
                slug: data.slug,
                image_url: data.image_url,
                ownerId: data.created_by,
            },
        });

        // Creator becomes ADMIN
        await prisma.workspaceMember.create({
            data: {
                userId: data.created_by,
                workspaceId: data.id,
                role: "ADMIN",
            },
        });
    }
);

export const syncWorkspaceUpdate = inngest.createFunction(
    { id: "sync-workspace-updated" },
    { event: "clerk/organization.updated" },
    async ({ event }) => {
        const { data } = event;

        await prisma.workspace.update({
            where: { id: data.id },
            data: {
                name: data.name,
                slug: data.slug,
                image_url: data.image_url,
            },
        });
    }
);

export const syncWorkspaceDeletion = inngest.createFunction(
    { id: "sync-workspace-deleted" },
    { event: "clerk/organization.deleted" },
    async ({ event }) => {
        await prisma.workspace.delete({
            where: { id: event.data.id },
        });
    }
);

/* ================= WORKSPACE MEMBER ================= */

export const syncWorkspaceMemberCreation = inngest.createFunction(
    { id: "sync-workspace-member-added" },
    { event: "clerk/organizationInvitation.accepted" },
    async ({ event }) => {
        const { data } = event;

        await prisma.workspaceMember.create({
            data: {
                userId: data.user_id,
                workspaceId: data.organization_id,
                role: data.role_name.toUpperCase(),
            },
        });
    }
);

/* ================= EXPORT ALL ================= */

export const functions = [
    syncUserCreation,
    syncUserUpdate,
    syncUserDeletion,
    syncWorkspaceCreation,
    syncWorkspaceUpdate,
    syncWorkspaceDeletion,
    syncWorkspaceMemberCreation,
];
