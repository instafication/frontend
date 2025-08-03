// import { getUserId } from './AuthManager';
// import { toast } from 'svelte-sonner';

// async function createService(
// 	name: string,
// 	notificationMethod: string,
// 	notificationWithinTime: number,
// 	options: unknown
// ): Promise<boolean> {
// 	const UUID = await getUserId();
// 	if (!UUID) {
// 		toast.error('You must be logged in to create a service');
// 		throw new Error('User not authenticated');
// 	}

// 	console.log(UUID, name, notificationMethod, notificationWithinTime, options);

// 	try {
// 		const response = await trpc.createService.query({
// 			user: UUID,
// 			name: name,
// 			notificationMethod: notificationMethod,
// 			notificationWithinTime: notificationWithinTime,
// 			options: options
// 		});

// 		console.log(response);
// 		return response;
// 	} catch (error) {
// 		toast.error('Failed to create service');
// 		console.error(error);
// 		throw error;
// 	}
// }

// async function removeService(serviceName: string): Promise<boolean> {
// 	const UUID: string = await getUserId();
// 	const response = await trpc.removeService.query({ user: UUID, name: serviceName });
// 	return response;
// }

// async function getServiceConfiguration(serviceName: string): Promise<unknown> {
// 	const UUID: string = await getUserId();
// 	if (!UUID) {
// 		return null;
// 	}

// 	try {
// 		const serviceConfiguration = await trpc.getConfiguration.query({
// 			user: UUID,
// 			name: serviceName
// 		});

// 		console.log(serviceConfiguration);

// 		if (serviceConfiguration == null) {
// 			console.log('Service configuration not found');
// 			return null;
// 		} else {
// 			return serviceConfiguration;
// 		}
// 	} catch (error) {
// 		console.error('Error getting service configuration:', error);
// 		return null;
// 	}
// }

// export { createService, getServiceConfiguration, removeService };
