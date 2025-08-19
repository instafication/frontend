import { drizzle as drizzleD1 } from 'drizzle-orm/d1';

interface GetDbParams {
    d1Binding?: any; // D1Database
}

export const getDb = ({ d1Binding }: GetDbParams) => {
    if (d1Binding) {
        return drizzleD1(d1Binding);
    }
    throw new Error(`No database binding provided ${JSON.stringify({ d1Binding })}`);
};

export type DrizzleClient = ReturnType<typeof getDb>;