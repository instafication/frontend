import { generateRandomUUID } from '../Inbox/Utils';
import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
  profiles,
  services,
  scrapers,
  notifications
} from '../../drizzle';
import { eq, gt, and, inArray, desc, sql } from 'drizzle-orm';

// Create the database connection
const client = postgres(DATABASE_URL, {
  ssl: {
    rejectUnauthorized: false,
  },
});
const db = drizzle(client);

export class DatabaseManager {
  public static Ping = async () => {
    try {
      const res = await db.select().from(profiles).where(eq(profiles.email, "hello@deploya.dev")).limit(1);
      return res[0] || null;
    } catch (error) {
      console.error("[DatabaseManager] Error in Ping:", error);
      return null;
    }
  }

  public static Scraper = class {
    public static async updatePingTimestampByCompanyNameAndParamValue(k: string, v: any, unixTimestamp: number): Promise<boolean> {
      console.log(`[Scraper] Updating latest_ping with ${k} = ${v} to ${unixTimestamp}`);
      
      try {
        // Note: Drizzle doesn't have direct JSON path support like Prisma
        // We'll need to handle this differently, possibly with raw SQL
        const r = await db.update(scrapers)
          .set({ last_ping: BigInt(unixTimestamp) })
          .where(sql`params->>'${sql.raw(k)}' = ${v}`);
        
        return r.count > 0;
      } catch (error) {
        console.error("[DatabaseManager] Error in updatePingTimestampByCompanyNameAndParamValue:", error);
        return false;
      }
    }

    public static async existsByCompanyNameAndParamValue(k: string, v: any): Promise<boolean> {
      try {
        // Note: Drizzle doesn't have direct JSON path support like Prisma
        // We'll need to handle this differently, possibly with raw SQL
        const r = await db.select().from(scrapers)
          .where(sql`params->>'${sql.raw(k)}' = ${v}`)
          .limit(1);
        
        return r.length > 0;
      } catch (error) {
        console.error("[DatabaseManager] Error in existsByCompanyNameAndParamValue:", error);
        return false;
      }
    }

    public static async createScraper(scraper: typeof scrapers.$inferSelect): Promise<boolean> {
      try {
        const result = await db.insert(scrapers).values({
          company: scraper.company,
          services: scraper.services || [],
          last_ping: BigInt(Date.now()),
          last_update: BigInt(Date.now()),
          params: scraper.params,
          frequency: scraper.frequency
        });
        return result.count > 0;
      } catch (error) {
        console.error("[DatabaseManager] Error creating scraper:", error);
        return false;
      }
    }

    public static async updateLastUpdatedByCompanyAndParam(k: string, v: any, last_update: number): Promise<boolean> {
      try {
        // Note: Drizzle doesn't have direct JSON path support like Prisma
        // We'll need to handle this differently, possibly with raw SQL
        const r = await db.update(scrapers)
          .set({ last_update: BigInt(last_update) })
          .where(sql`params->>'${sql.raw(k)}' = ${v}`);
        
        return r.count > 0;
      } catch (error) {
        console.error("[DatabaseManager] Error in updateLastUpdatedByCompanyAndParam:", error);
        return false;
      }
    }

    public static async getLastUpdated(k: string, v: any): Promise<number> {
      try {
        // Note: Drizzle doesn't have direct JSON path support like Prisma
        // We'll need to handle this differently, possibly with raw SQL
        const r = await db.select({ last_update: scrapers.last_update }).from(scrapers)
          .where(sql`params->>'${sql.raw(k)}' = ${v}`)
          .limit(1);
        
        return Number(r[0]?.last_update) || -1;
      } catch (error) {
        console.error("[DatabaseManager] Error in getLastUpdated:", error);
        return -1;
      }
    }

    public static async getLastUpdatedByCompany(company: string): Promise<number> {
      try {
        // Get the most recent last_update time for all scrapers of a company
        const r = await db.select({ last_update: scrapers.last_update }).from(scrapers)
          .where(eq(scrapers.company, company))
          .orderBy(desc(scrapers.last_update))
          .limit(1);
        
        return Number(r[0]?.last_update) || -1;
      } catch (error) {
        console.error("[DatabaseManager] Error in getLastUpdatedByCompany:", error);
        return -1;
      }
    }
  }

  public static Profiles = class {
    public static async updateProfileById(id: string, email: string, phone: string) {
      try {
        const result = await db.update(profiles)
          .set({ email, phone })
          .where(eq(profiles.id, id));
        return result.count > 0;
      } catch (error) {
        console.error("[DatabaseManager] Error in updateProfileById:", error);
        return false;
      }
    }

    public static async getRawUserData(id: string): Promise<{}> {
      try {
        const result = await db.select({ raw_user_meta_data: profiles.raw_user_meta_data })
          .from(profiles)
          .where(eq(profiles.id, id))
          .limit(1);
        
        if (result.length > 0) {
          return result[0].raw_user_meta_data || {};
        } else {
          return { "Message": "Error" };
        }
      } catch (error) {
        console.error("[DatabaseManager] Error in getRawUserData:", error);
        return { "Message": "Error" };
      }
    }

    public static async getCreditsById(id: string): Promise<number> {
      try {
        const result = await db.select({ credits: profiles.credits })
          .from(profiles)
          .where(eq(profiles.id, id))
          .limit(1);
        
        if (result.length > 0) {
          return result[0].credits || -1;
        } else {
          return -1;
        }
      } catch (error) {
        console.error("[DatabaseManager] Error in getCreditsById:", error);
        return -1;
      }
    }

    public static async getCreditsByPhone(phone: string): Promise<number> {
      try {
        const result = await db.select({ credits: profiles.credits })
          .from(profiles)
          .where(eq(profiles.phone, phone))
          .limit(1);
        
        console.log(`Credits: ${result[0]?.credits}`);
        return result[0]?.credits || -1;
      } catch (error) {
        console.error("[DatabaseManager] Error in getCreditsByPhone:", error);
        return -1;
      }
    }

    public static async getPhoneById(id: string): Promise<string> {
      try {
        const result = await db.select({ phone: profiles.phone })
          .from(profiles)
          .where(eq(profiles.id, id))
          .limit(1);
        
        return result[0]?.phone || "";
      } catch (error) {
        console.error("[DatabaseManager] Error in getPhoneById:", error);
        return "";
      }
    }

    public static async getEmailById(id: string): Promise<string> {
      try {
        const result = await db.select({ email: profiles.email })
          .from(profiles)
          .where(eq(profiles.id, id))
          .limit(1);
        
        return result[0]?.email || "";
      } catch (error) {
        console.error("[DatabaseManager] Error in getEmailById:", error);
        return "";
      }
    }

    public static async getUserIdByPhone(phone: string): Promise<string> {
      try {
        const result = await db.select({ id: profiles.id })
          .from(profiles)
          .where(eq(profiles.phone, phone))
          .limit(1);
        
        return result[0]?.id || "";
      } catch (error) {
        console.error("[DatabaseManager] Error in getUserIdByPhone:", error);
        return "";
      }
    }

    public static async checkIfPhoneNumberExistsInRows(phone: string): Promise<boolean> {
      try {
        const result = await db.select()
          .from(profiles)
          .where(eq(profiles.phone, phone));
        
        return result.length > 0;
      } catch (error) {
        console.error("[DatabaseManager] Error in checkIfPhoneNumberExistsInRows:", error);
        return false;
      }
    }

    public static async userExistsByPhone(phone: string): Promise<boolean> {
      try {
        const result = await db.select()
          .from(profiles)
          .where(eq(profiles.phone, phone))
          .limit(1);
        
        return result.length > 0;
      } catch (error) {
        console.error("[DatabaseManager] Error in userExistsByPhone:", error);
        return false;
      }
    }

    public static async removeUser(id: string) {
      try {
        await db.delete(profiles).where(eq(profiles.id, id));
      } catch (error) {
        console.error("[DatabaseManager] Error in removeUser:", error);
      }
    }

    public static async getUserById(id: string) {
      try {
        const result = await db.select()
          .from(profiles)
          .where(eq(profiles.id, id))
          .limit(1);
        
        return result[0] || null;
      } catch (error) {
        console.error("[DatabaseManager] Error in getUserById:", error);
        return null;
      }
    }

    public static async getUsersWithCredits() {
      try {
        return await db.select()
          .from(profiles)
          .where(gt(profiles.credits, 0));
      } catch (error) {
        console.error("[DatabaseManager] Error in getUsersWithCredits:", error);
        return [];
      }
    }

    public static async getUsersWithCreditsByUserIds(ids: string[]) {
      try {
        return await db.select()
          .from(profiles)
          .where(and(
            gt(profiles.credits, 0),
            inArray(profiles.id, ids)
          ));
      } catch (error) {
        console.error("[DatabaseManager] Error in getUsersWithCreditsByUserIds:", error);
        return [];
      }
    }

    public static async removeOneCreditFromUserID(id: string): Promise<boolean> {
      try {
        const result = await db.update(profiles)
          .set({ 
            credits: sql`${profiles.credits} - 1`
          })
          .where(eq(profiles.id, id));
        
        return result.count > 0;
      } catch (error) {
        console.error("[DatabaseManager] Error in removeOneCreditFromUserID:", error);
        return false;
      }
    }

    public static async ProlongSubscriptionByEmail(email: string, daysToProlong: number): Promise<boolean> {
      try {
        const now: Date = new Date();
        const futureDate: Date = new Date(now.getTime() + daysToProlong * 24 * 60 * 60 * 1000);
        const futureTimestamp: number = Math.floor(futureDate.getTime() / 1000);
        
        const result = await db.update(profiles)
          .set({ 
            subscription_expiration_date: futureTimestamp.toString(), 
            credits: 500 
          })
          .where(eq(profiles.email, email));
        
        return result.count > 0;
      } catch (error) {
        console.error("[DatabaseManager] Error in ProlongSubscriptionByEmail:", error);
        return false;
      }
    }

    public static async RefillByEmail(email: string, credits: number): Promise<boolean> {
      try {
        const user = await db.select()
          .from(profiles)
          .where(eq(profiles.email, email))
          .limit(1);
        
        if (user.length === 0) {
          return false;
        }
        
        let newCredits = credits;
        if (user[0].credits !== null) {
          newCredits = user[0].credits + credits;
        }
        
        const result = await db.update(profiles)
          .set({ credits: newCredits })
          .where(eq(profiles.email, email));
        
        return result.count > 0;
      } catch (error) {
        console.error("[DatabaseManager] Error in RefillByEmail:", error);
        return false;
      }
    }

    public static async getAllUsers() {
      try {
        return await db.select().from(profiles);
      } catch (error) {
        console.error("[DatabaseManager] Error in getAllUsers:", error);
        return [];
      }
    }

    public static async getUserCreditsByID(id: string): Promise<number> {
      try {
        const result = await db.select({ credits: profiles.credits })
          .from(profiles)
          .where(eq(profiles.id, id))
          .limit(1);
        
        if (result.length === 0 || result[0].credits === null) {
          return -1;
        }
        
        return result[0].credits;
      } catch (error) {
        console.error("[DatabaseManager] Error in getUserCreditsByID:", error);
        return -1;
      }
    }
  }

  public static Notifications = class {
    public static async createNotification({ id = "", title = "", body = "", area = "", date = "" }: { id?: string, title?: string, body?: string, area?: string, date?: string }) {
      if (id === "")
        id = generateRandomUUID();
      
      try {
        const result = await db.insert(notifications).values({
          id: id,
          title: title,
          body: body,
          area: area,
          date: date ? new Date(date) : undefined
        });
        
        console.log(`[Databasemanager] Created notification: ${result.count > 0}`);
        return result.count > 0;
      } catch (error) {
        console.error("[DatabaseManager] Error creating notification:", error);
        return false;
      }
    }

    public static async getNotificationsByArea(area: string) {
      try {
        return await db.select()
          .from(notifications)
          .where(eq(notifications.area, area));
      } catch (error) {
        console.error("[DatabaseManager] Error in getNotificationsByArea:", error);
        return [];
      }
    }

    public static async getAllNotifications() {
      try {
        return await db.select().from(notifications);
      } catch (error) {
        console.error("[DatabaseManager] Error in getAllNotifications:", error);
        return [];
      }
    }

    public static async getLatestNotifications(count: number = 5) {
      try {
        return await db.select()
          .from(notifications)
          .orderBy(desc(notifications.date))
          .limit(count);
      } catch (error) {
        console.error("[DatabaseManager] Error in getLatestNotifications:", error);
        return [];
      }
    }
  }

  public static Scrapers = class {
    public static async getAllScrapers() {
      try {
        return await db.select().from(scrapers);
      } catch (error) {
        console.error("[DatabaseManager] Error in getAllScrapers:", error);
        return [];
      }
    }
  }

  public static Services = class {
    public static async getServiceConfiguration(uuid: string, name: string): Promise<any> {
      // Check if uuid is provided
      if (!uuid) {
        console.log("No user ID provided for getServiceConfiguration");
        return null;
      }
      
      try {
        const result = await db.select()
          .from(services)
          .where(and(
            eq(services.user, uuid),
            eq(services.name, name)
          ))
          .limit(1);
        
        console.log("Databasemanager — Service configuration: ");
        console.log(result[0]);
        
        return result[0] || null;
      } catch (error) {
        console.error("[DatabaseManager] Error in getServiceConfiguration:", error);
        return null;
      }
    }

    public static async getUserIdsByOptions(key: string, value: any): Promise<any> {
      try {

        // Get all usr ids with {"area": "medicinaren"} for instance
        console.log("[DatabaseManager -> getUserIdsByOptions -> key+value: ")
        console.log(key, value)
        const result = await db.select()
          .from(services)
          .where(sql`options->>'${sql.raw(key)}' = ${value}`);
        
        console.log("[DatabaseManager -> getUserIdsByOptions (results): ")
        console.log(result);
        return result;
      } catch (error) {
        console.error("[DatabaseManager] Error in getUserIdsByOptions:", error);
        return [];
      }
    }

    public static async createService(user: string, name: string, notificationMethod: string, notificationWithinTime: number, options: {}) {
      // Check if user ID is provided
      if (!user) {
        console.log("No user ID provided for createService");
        return false;
      }

      console.log(user, name, notificationMethod, notificationWithinTime, options);

      try {
        // Check if a record with the same user and name combination exists
        const existingService = await db.select()
          .from(services)
          .where(and(
            eq(services.user, user),
            eq(services.name, name)
          ))
          .limit(1);
        
        console.log("existingService: ", existingService.length);

        let result;
        
        if (existingService.length === 0) {
          // If the record doesn't exist, create a new one
          result = await db.insert(services).values({
            user: user,
            name: name,
            notificationMethod: notificationMethod,
            notificationWithinTime: notificationWithinTime.toString(),
            options: options
          });
          console.log("[Databasemanager] Created service: " + result.count);
        } else {
          // If the record exists, update it
          result = await db.update(services)
            .set({
              notificationMethod: notificationMethod,
              notificationWithinTime: notificationWithinTime.toString(),
              options: options
            })
            .where(eq(services.id, existingService[0].id));
          console.log(`[Databasemanager] Updated service: ${result.count}`);
        }
        
        return result.count > 0;
      } catch (error) {
        console.error("[DatabaseManager] Error in createService:", error);
        return false;
      }
    }
  }
}
