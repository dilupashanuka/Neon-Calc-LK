const { Client } = require('pg');

const setupDatabase = async () => {
    const connectionString = "postgresql://postgres:Shanuka200312900266@db.mxidzqtkmbhladdwyfhg.supabase.co:5432/postgres";

    const client = new Client({
        connectionString: connectionString,
    });

    try {
        await client.connect();
        console.log("Connected to Supabase Postgres for setup...");

        const createQuery = `
            CREATE TABLE IF NOT EXISTS site_settings (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                phone TEXT,
                whatsapp TEXT,
                email TEXT,
                fb_link TEXT,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            -- Insert a default row if table is empty
            INSERT INTO site_settings (phone, whatsapp, email, fb_link)
            SELECT '078 939 5851', '+94 76 564 6270', 'support@neoncalc.lk', 'https://facebook.com/neoncalclk'
            WHERE NOT EXISTS (SELECT 1 FROM site_settings);
        `;

        await client.query(createQuery);
        console.log("Setup site_settings successfully.");
    } catch (err) {
        console.error("Setup Error:", err);
    } finally {
        await client.end();
    }
};

setupDatabase();
