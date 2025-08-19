import { drizzle as drizzleLibsql } from 'drizzle-orm/libsql';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import * as schema from '../../../drizzle/schema';

interface GetDbParams {
    d1Binding?: any; // D1Database
    libsqlBinding?: string;
}

export const getDb = ({ d1Binding, libsqlBinding }: GetDbParams) => {
    if (d1Binding) {
        return drizzleD1(d1Binding, { schema });
    }
    if (libsqlBinding) {
        return drizzleLibsql(libsqlBinding, { schema });
    }
    throw new Error(`No database binding provided ${JSON.stringify({ d1Binding, libsqlBinding })}`);
};

export type DrizzleClient = ReturnType<typeof getDb>;