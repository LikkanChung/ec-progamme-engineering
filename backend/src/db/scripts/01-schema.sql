-- URL Shortener Database Schema
-- Creates the urls table for storing shortened URLs

CREATE TABLE IF NOT EXISTS urls (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(5) NOT NULL UNIQUE,
    long_url VARCHAR(256) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookups by short_code
CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);
