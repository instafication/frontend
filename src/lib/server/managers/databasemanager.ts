import { generateRandomUUID } from '../../Inbox/Utils';
import { supabase, signUp } from "$lib/Managers/AuthManager";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class DatabaseManager {

  public static Ping = async () => {
    const res = await prisma.profiles.findFirst({
      where: {
        email: "test@test.com"
      }
    })
    return res;
  }


  public static Scraper = class {

    public static async idExists(id: string) {
      // e.x. id : string = "medicinaren"
      const scraper = await prisma.scraper.findUnique({
        where: { id },
      });
      return scraper !== null;
    }

    public static async createArea(id: string, last_update: number) {
      // e.x. id : string = "medicinaren"
      await prisma.scraper.create({
        data: {
          id: id,
          last_update: last_update,
        },
      });
    }

    public static async updateLastUpdated(id: string, last_update: number) {
      // e.x. id : string = "medicinaren"
      await prisma.scraper.update({
        where: { id: id },
        data: { last_update: last_update },
      });
    }

    public static async getLastUpdated(id: string) {
      // e.x. id : string = "medicinaren"
      return await prisma.scraper.findUnique({
        where: { id },
      });
    }

  }

  public static Profiles = class {

    public static async updateProfileById(id: string, email: string, phone: string) {
      const hasUpdated = await prisma.profiles.update({
        where: { id },
        data: { email, phone },
      });
      return hasUpdated;
    }

    public static async getRawUserData(id: string): Promise<{}> {
      const userObj = await prisma.profiles.findUnique({
        where: { id },
      });
      if (userObj != null) {
        return userObj?.raw_user_meta_data || {};
      } else {
        return { "Message": "Error" };
      }
    }

    public static async getCreditsById(id: string): Promise<number> {
      const userObj = await prisma.profiles.findUnique({
        where: { id },
      });

      if (userObj != null) {
        return userObj.credits;
      } else {
        return -1;
      }

    }
    public static async getCreditsByPhone(phone: string): Promise<number> {
      const userObj = await prisma.profiles.findUnique({
        where: { phone },
      });
      console.log(`Credits: ${userObj?.credits}`)
      return userObj?.credits || -1;
    }

    public static async getPhoneById(id: string): Promise<string> {

      const userObj = await prisma.profiles.findUnique({
        where: { id },
      });
      return userObj?.phone || "";

    }

    public static async getEmailById(id: string): Promise<string> {

      const userObj = await prisma.profiles.findUnique({
        where: { id },
      });
      return userObj?.email || "";

    }




    public static async getUserIdByPhone(phone: string): Promise<string> {
      const userObj = await prisma.profiles.findUnique({
        where: { phone },
      });
      return userObj?.id || "";
    }

    public static async checkIfPhoneNumberExistsInRows(phone: string): Promise<boolean> {
      const userObj = await prisma.profiles.findMany({
        where: { phone },
      });
      return userObj !== null;
    }

    public static async userExistsByPhone(phone: string): Promise<boolean> {

      const exists = !!await prisma.profiles.findFirst({
        where: {
          phone: phone
        },
      });
      return exists;
    }




    public static Me = class {


      public static deleteAccount() {

      }

      // public static async getCredits(): Promise<number> {

      //   const id = await getUserId();
      //   console.log("ID: " + id);
      //   const userObj = await prisma.profiles.findUnique({
      //     where: { id },
      //   });
      //   console.log("Credits: " + userObj?.credits)
      //   return userObj?.credits || -1;

      // }


    }

    // public static async createFreeUserByEmail(email: string): Promise<boolean> {
    //   console.log(`[DatabaseManager] createFreeUserByEmail with email: ${email}`);

    //   const hasCreated = await prisma.profiles.create({
    //     data: {
    //       id: generateRandomUUID(),
    //       email: email,
    //     },
    //   });
    //   return hasCreated !== null;
    // }

    // public static async createPaidUserByEmail(email: string, datePaid: string): Promise<boolean> {
    //   console.log(`[DatabaseManager] createPaidUserByEmail with email: ${email}`);

    //   const hasCreated = await prisma.profiles.create({
    //     data: {
    //       id: generateRandomUUID(),
    //       email: email,
    //       datePaid: datePaid,
    //     },
    //   });
    //   return hasCreated !== null;
    // }

    public static async removeUser(id: string) {
      await prisma.profiles.delete({
        where: { id },
      });
    }

    public static async getUserById(id: string) {
      return await prisma.profiles.findUnique({
        where: { id },
      });
    }

    public static async getUsersWithCredits() {
      return await prisma.profiles.findMany({
        where: { credits: { gt: 0 } },
      });
    }

    public static async getUsersWithCreditsByUserIds(ids: string[]): Promise<any> {
      return await prisma.profiles.findMany({
        where: { credits: { gt: 0 }, id: { in: ids } },
      });
    }

    public static async removeOneCreditFromUserID(id: string): Promise<boolean> {
      const success = await prisma.profiles.update({
        where: { id },
        data: { credits: { decrement: 1 } },
      });
      return success !== null;
    }


    public static async ProlongSubscriptionByEmail(email: string, daysToProlong: number): Promise<boolean> {

      const now: Date = new Date();
      const futureDate: Date = new Date(now.getTime() + daysToProlong * 24 * 60 * 60 * 1000);
      const futureTimestamp: number = Math.floor(futureDate.getTime() / 1000);

      const hasProlonged = await prisma.profiles.update({
        where: { email },
        data: { subscription_expiration_date: futureTimestamp.toString(), credits: 500 },
      });
      return hasProlonged !== null;
    }


    // public static async getAllActiveUsers() {
    //   return await prisma.profiles.findMany({
    //     where: { credits: { gt: 0 }, active: true }
    //   });
    // }

    // public static async getActiveUsersByArea(area: string): Promise<any> {
    //   const profiles = await prisma.profiles.findMany({
    //     where: { credits: { gt: 0 }, activ, area: area },
    //   });
    //   return profiles;
    // }

    public static async getAllUsers() {
      return await prisma.profiles.findMany();
    }

    // public static async setUserActiveByPhone(phone: string, active: boolean): Promise<boolean> {
    //   const hasActivated = await prisma.profiles.update({
    //     where: { phone },
    //     data: { active },
    //   });
    //   return hasActivated !== null;
    // }

    public static async getUserCreditsByID(id: string): Promise<number> {
      const profile = await prisma.profiles.findUnique({
        where: { id },
        select: { credits: true },
      });

      if (profile === null || profile === undefined || profile.credits === null || profile.credits === undefined) {
        return -1;
      }

      return profile.credits;

    }





  }


  public static Notifications = class {


    public static async createNotification({ id = "", title = "", body = "", area = "", date = "" }: { id?: string, title?: string, body?: string, area?: string, date?: string }) {
      if (id === "")
        id = generateRandomUUID();

      const r = await prisma.notifications.create({
        data: {
          id: id,
          title: title,
          body: body,
          area: area
        },
      });
      console.log(`[Databasemanager] Created notification: ${r}`);
      return r !== null;
    };

    public static async getNotificationsByArea(area: string) {
      return await prisma.notifications.findMany({
        where: { area },
      });
    }

    public static async getAllNotifications() {
      return await prisma.notifications.findMany();
    }
    public static async getLatestNotifications(count: number = 5) {
      return await prisma.notifications.findMany({
        orderBy: {
          date: "desc"
        },
        take: count
      });
    }



  }


  public static Services = class {

    //   addService: t.procedure
    //     .input(z.object({
    //       user: z.string(),
    // name: z.string(),
    // notification: z.string(),
    // notificationWithIn: z.number(),
    // options: z.object({ }),
    //       }))
    //       .query((async ({ input }) => {
    //   const { user, name, notification, notificationWithIn, options } = input;
    //   await DatabaseManager.Services.addService(user, name, notification, notificationWithIn, options);
    //   return true;


    public static async getServiceConfiguration(uuid: string, name: string): Promise<any> {
      const serviceConfiguration = await prisma.services.findUnique({
        where: {
          user_name: {
            user: uuid,
            name: name,
          },
        },
      });

      console.log("Databasemanager — Service configuration: ");
      console.log(serviceConfiguration);

      return serviceConfiguration;
    }


    public static async getUserIdsByOptions(key: string, value: any): Promise<any> {
      const userIds = await prisma.services.findMany({
        where: {
          options: {
            path: [key],
            equals: value,
          },
        },
      });

      console.log(userIds);
      return userIds;
    }


    public static async createService(user: string, name: string, notification: string, notificationWithin: number, options: {}) {

      // Check if a record with the same user and name combination exists
      const existingService = await prisma.services.findUnique({
        where: {
          user_name: {
            user: user,
            name: name,
          },
        },
      });

      let r;

      if (existingService === null) {
        // If the record doesn't exist, create a new one
        r = await prisma.services.create({
          data: {
            user: user,
            name: name,
            notification: notification,
            notificationWithin: notificationWithin,
            options: options,
          },
        });
        console.log("[Databasemanager] Created service: " + r);
      } else {
        // If the record exists, update it
        r = await prisma.services.update({
          where: {
            id: existingService.id,
          },
          data: {
            notification: notification,
            notificationWithin: notificationWithin,
            options: options,
          },
        });
        console.log(`[Databasemanager] Updated service: ${r}`);
      }

      return r !== null;
      // const r = await prisma.services.upsert({
      //   where: {
      //     user_name: {
      //       user: user,
      //       name: name,
      //     }
      //   },
      //   update: {
      //     notification: notification,
      //     notificationWithIn: notificationWithIn,
      //     options: options,
      //   },
      //   create: {
      //     user: user,
      //     name: name,
      //     notification: notification,
      //     notificationWithIn: notificationWithIn,
      //     options: options,
      //   },
      // });
      console.log(`[Databasemanager] Upserted service: ${r}`);
      return r !== null;
    }
  }


}

