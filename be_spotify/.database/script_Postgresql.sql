DROP DATABASE IF EXISTS db_spotify;

CREATE DATABASE db_spotify;

CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    account VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    nationality VARCHAR(100),
    channel_name VARCHAR(255),
    avatar TEXT,
    description TEXT,
    banner TEXT,
    refresh_token TEXT,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    is_artist BOOLEAN DEFAULT FALSE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE artists (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    artist_name VARCHAR(255) NOT NULL UNIQUE,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE friend_list (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    friend_id INT NOT NULL,
    room_chat VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (friend_id) REFERENCES users(id)
);

CREATE TABLE song_genres (
    id SERIAL PRIMARY KEY,
    genre_name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE songs (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    genre_id INT,
    song_name VARCHAR(255) NOT NULL,
    viewer INT DEFAULT 0,
    duration VARCHAR(10), 
    popular BOOLEAN DEFAULT FALSE,
    description TEXT,
    song_image TEXT,
    public_date DATE,
    file_path TEXT NOT NULL,
    discuss_quality INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (genre_id) REFERENCES song_genres(id)
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    song_id INT NOT NULL,
    content TEXT NOT NULL,
    discuss_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reply_discuss_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (song_id) REFERENCES songs(id),
    FOREIGN KEY (reply_discuss_id) REFERENCES comments(id)
);

CREATE TABLE playlists (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    image_path TEXT,
    playlist_name VARCHAR(255) NOT NULL,
    description TEXT,
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE playlist_songs (
    id SERIAL PRIMARY KEY,
    playlist_id INT NOT NULL,
    song_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id),
    FOREIGN KEY (song_id) REFERENCES songs(id)
);

CREATE TABLE queue_songs (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    song_id INT NOT NULL,
    position INT NOT NULL,
    "current_time" INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (song_id) REFERENCES songs(id)
);
