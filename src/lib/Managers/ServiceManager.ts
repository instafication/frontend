import { trpc } from '$lib/trpc/client';
import { getUserId } from './AuthManager';


async function parseUserDataById(id: string): Promise<{ email: string, phone: string, credits: number }> {
    // const userId = await getUserId();    
    // const email = await trpc.email.query(userId);
    // const phone = await trpc.phone.query(userId);
    // const credits = await trpc.credits.query(userId);
    return { email: "", phone: "", credits: 0 };
    // return { email, phone, credits };
}

/*
    model services {
    id      String   @id @default(uuid())
    user    String //UUID
    name    String? //Service name
    notification String? // "Email or SMS"
    frequency Int? @default(0) //Minutes between checks, 0 = disabled
    last_checked BigInt? @default(0) // Example 1620000000
    options Json? @default("{}") //Options for the service
    @@schema("public")
    }
*/


/*
Input object = [
    {
        service: "Stockholm Studentbostäder",
        notification: "Email",
        frequency: 60,
        last_checked: 1620000000,
        options: {}
    },
]*/


/*

model services {
  id      String   @id @default(uuid())
  user    String //UUID
  name    String? //Service name
  notification String? // "Email or SMS"
  notificationWithIn Int? // "Timestamp, notification within 1 hour, within 1 day or 2 days"
  last_checked BigInt? @default(0) // Example 1620000000
  options Json? @default("{}") //Options for the service
  @@schema("public")
}

  */



async function createService(name: string, notificationMethod: string, notificationWithinTime: number, options: {}): Promise<void> {
    const UUID = await getUserId();

    console.log(UUID, name, notificationMethod, notificationWithinTime, options);

    const response = await trpc.createService.query({
        user: UUID,
        name: name,
        notificationMethod: notificationMethod,
        notificationWithinTime: notificationWithinTime,
        options: options
    });

    console.log(response);
}

async function getServiceConfiguration(serviceName: string): Promise<any> {
    const UUID: string = await getUserId();   // "5736f6cb-f2ad-4424-9baf-2891d58f9c7a";
    try {
        const serviceConfiguration = await trpc.getConfiguration.query({
            user: UUID,
            name: serviceName
        });

        console.log(serviceConfiguration);

        if (serviceConfiguration == null) {
            return null;
        } else {
            return serviceConfiguration;
        }

    } catch (error) {
        console.log("Error: " + error);
    }


}

export { createService, getServiceConfiguration }