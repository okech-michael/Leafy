import { HttpError } from './errors.js';
export function parseBody(schema, body) {
    const result = schema.safeParse(body);
    if (!result.success) {
        throw new HttpError(400, 'Request validation failed.', result.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
        })));
    }
    return result.data;
}
