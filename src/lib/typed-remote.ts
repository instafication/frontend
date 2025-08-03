import { query, command } from '$app/server';
import type * as v from 'valibot';

/**
 * Valibot-aware query helper.
 *   vQuery(schema, handler)  → parameter type = v.Input<typeof schema>
 */
export function vQuery<S extends v.BaseSchema, R>(
    schema: S,
    handler: (arg: v.Input<S>) => R | Promise<R>
) {
    return query<v.Input<S>, Awaited<R>>(schema, handler);
}

/**
 * Valibot-aware command helper.
 *   vCommand(schema, handler) → parameter type = v.Input<typeof schema>
 */
export function vCommand<S extends v.BaseSchema, R>(
    schema: S,
    handler: (arg: v.Input<S>) => R | Promise<R>
) {
    return command<v.Input<S>, Awaited<R>>(schema, handler);
}
