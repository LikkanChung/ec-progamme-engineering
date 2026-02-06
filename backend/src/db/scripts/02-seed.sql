-- Seed data for local development
-- Inserts sample URLs so new developers can see how the service works immediately

INSERT INTO urls (short_code, long_url) VALUES
    ('abc12', 'https://www.example.com'),
    ('xyz34', 'https://www.github.com'),
    ('pqrs5', 'https://www.wikipedia.org'),
    ('demo1', 'https://www.google.com'),
    ('test2', 'https://www.stackoverflow.com')
ON CONFLICT (short_code) DO NOTHING;
