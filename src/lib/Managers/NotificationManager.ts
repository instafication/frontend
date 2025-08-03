import { trpc } from '$lib/trpc/client';
import { getUserId } from './AuthManager';
import { toast } from 'svelte-sonner';

async function getAllNotifications() {
	try {
		const notifications = await trpc.getAllNotifications.query();
		return notifications;
	} catch (error) {
		console.error('Error getting all notifications:', error);
		return [];
	}
}

async function getLatestNotifications(count: number = 5) {
	try {
		const notifications = await trpc.getLatestNotifications.query(count);
		return notifications;
	} catch (error) {
		console.error('Error getting latest notifications:', error);
		return [];
	}
}

export { getAllNotifications, getLatestNotifications };
