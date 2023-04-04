import { getUserId } from '../../Managers/AuthManager';
import { generateRandomUUID } from '$lib/Inbox/Utils';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class DatabaseManager {


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



    public static async getCreditsById(id: string): Promise<number> {
      const userObj = await prisma.profiles.findUnique({
        where: { id },
      });
      console.log("Credits: " + userObj?.credits)
      return userObj?.credits || -1;

    }
    public static async getCreditsByPhone(phone: string): Promise<number> {
      const userObj = await prisma.profiles.findUnique({
        where: { phone },
      });
      console.log("Credits: " + userObj?.credits)
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

    public static async userExistsByPhone(phone: string): Promise<boolean> {
      const userObj = await prisma.profiles.findUnique({
        where: { phone },
      });
      return userObj !== null;
    }

    public static async userExistsByEmail(email: string): Promise<boolean> {
      const userObj = await prisma.profiles.findUnique({
        where: { email },
      });
      return userObj !== null;
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


    public static async createUser({ uuid = "", phone = "", email = "", area = "", active = false }: { uuid?: string, phone?: string, email?: string, area?: string, active?: boolean }): Promise<boolean> {

      if (uuid == "")
        uuid = generateRandomUUID();

      console.log("[DatabaseManager] Creating user with id: " + uuid);
      console.log("[DatabaseManager] Creating user with phone: " + phone);
      console.log("[DatabaseManager] Creating user with email: " + email);
      console.log("[DatabaseManager] Creating user with area: " + area);
      console.log("[DatabaseManager] Creating user with active: " + active);

      const hasCreated = await prisma.profiles.create({
        data: {
          id: uuid,
          active: active,
          area: area,
          phone: phone,
          email: email,
        },
      });
      return hasCreated !== null;
    }

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

    public static async removeOneCreditFromUserID(id: string) {
      await prisma.profiles.update({
        where: { id },
        data: { credits: { decrement: 1 } },
      });
    }

    public static async getAllActiveUsers() {
      return await prisma.profiles.findMany({
        where: { credits: { gt: 0 }, active: true }
      });
    }

    public static async getActiveUsersByArea(area: string): Promise<any> {
      const profiles = await prisma.profiles.findMany({
        where: { credits: { gt: 0 }, active: true, area: area },
      });
      return profiles;
    }

    public static async getAllUsers() {
      return await prisma.profiles.findMany();
    }

    public static async setUserActiveByPhone(phone: string, active: boolean): Promise<boolean> {
      const hasActivated = await prisma.profiles.update({
        where: { phone },
        data: { active },
      });
      return hasActivated !== null;
    }

    public static async getUserCreditsByID(id: string) {
      const user = await prisma.profiles.findUnique({
        where: { id },
        select: { credits: true },
      })
    }


  }


  public static Notifications = class {


    public static async createNotification({ id = "", title = "", body = "", area = "", date = "" }: { id?: string, title?: string, body?: string, area?: string, date?: string }) {
      if (id == "")
        id = generateRandomUUID();

      const r = await prisma.notifications.create({
        data: {
          id: id,
          title: title,
          body: body,
          area: area
        },
      });
      console.log("[Databasemanager] Created notification: " + r);
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
    public static async getLatestNotifications() {
      return await prisma.notifications.findMany({
        orderBy: {
          date: "desc"
        },
        take: 10
      });
    }



  }


}

