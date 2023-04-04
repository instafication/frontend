import { trpc } from '$lib/trpc/client';
import { getUserId } from './AuthManager';

async function getAllNotifications() {
    console.log("getAllNotifications");
    const notifications = await trpc.getAllNotifications.query()
    console.log("notifications: " + notifications);
    return notifications;
}

async function getLatestNotifications() {
    const notifications = await trpc.getLatestNotifications.query()
    return notifications;
}


async function updateProfileById(id: string, email: string, phone: string): Promise<void> {
    await trpc.updateprofileById.query({
        id: id,
        email: email,
        phone: phone
    });
    console.log("Profile updated successfully!");
}

export { getAllNotifications, getLatestNotifications }