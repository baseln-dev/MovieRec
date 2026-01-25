CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    email_verified SMALLINT NOT NULL DEFAULT 0,
    totp_key BYTEA,
    recovery_code BYTEA NOT NULL
);

CREATE INDEX IF NOT EXISTS email_index ON "user"(email);

CREATE TABLE IF NOT EXISTS session (
    id TEXT NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id),
    expires_at BIGINT NOT NULL,
    two_factor_verified SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS email_verification_request (
    id TEXT NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id),
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS password_reset_session (
    id TEXT NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id),
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at BIGINT NOT NULL,
    email_verified SMALLINT NOT NULL DEFAULT 0,
    two_factor_verified SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS watchlist (
    user_id INTEGER NOT NULL REFERENCES "user"(id),
    movie_id INTEGER NOT NULL,
    added_at BIGINT NOT NULL,
    PRIMARY KEY (user_id, movie_id)
);

CREATE INDEX IF NOT EXISTS watchlist_user_index ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS watchlist_movie_index ON watchlist(movie_id);
