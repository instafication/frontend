import type { profiles, services, scrapers, notifications } from '../../../drizzle';

// Export types for the Drizzle schema
export type Profile = typeof profiles.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Scraper = typeof scrapers.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
