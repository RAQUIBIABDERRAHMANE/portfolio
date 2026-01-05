import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });
dotenv.config();

const url = process.env.TURSO_DATABASE_URL || 'file:./database/users.sqlite';
const authToken = process.env.TURSO_AUTH_TOKEN;

const db = createClient({
    url,
    authToken,
});

async function listUsers() {
    try {
        const result = await db.execute('SELECT * FROM users');
        console.log('Users found:', JSON.stringify(result.rows, null, 2));
    } catch (err) {
        console.error('Error listing users:', err);
    }
}

listUsers();

async function deleteUser() {
    const email = 'abdothelord6@gmail.com';
    console.log(`Deleting user with email: ${email}`);

    try {
        const result = await db.execute({
            sql: 'DELETE FROM users WHERE email = ?',
            args: [email]
        });
        console.log(`Rows affected: ${result.rowsAffected}`);
        if (result.rowsAffected > 0) {
            console.log('User deleted successfully.');
        } else {
            console.log('User not found.');
        }
    } catch (err) {
        console.error('Error deleting user:', err);
    }
}

deleteUser();
