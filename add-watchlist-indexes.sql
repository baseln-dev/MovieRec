-- Add indexes to watchlist table for better query performance
-- Run this after the initial setup

-- Index on user_id for faster lookups of a user's watched movies
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);

-- Index on movie_id for faster lookups when checking if a movie is watched
CREATE INDEX IF NOT EXISTS idx_watchlist_movie_id ON watchlist(movie_id);

-- Composite index on user_id and movie_id for faster duplicate checks
CREATE INDEX IF NOT EXISTS idx_watchlist_user_movie ON watchlist(user_id, movie_id);

-- Index on watched_at for sorting by date added
CREATE INDEX IF NOT EXISTS idx_watchlist_watched_at ON watchlist(watched_at);
