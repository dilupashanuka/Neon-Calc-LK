CREATE TABLE IF NOT EXISTS site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    fb_link TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO site_settings (phone, whatsapp, email, fb_link)
SELECT '078 939 5851', '+94 76 564 6270', 'support@neoncalc.lk', 'https://facebook.com/neoncalclk'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);
