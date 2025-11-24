-- Таблица для голосования за пол малыша
CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('boy', 'girl')),
    voter_ip VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для быстрого подсчета голосов
CREATE INDEX idx_vote_type ON votes(vote_type);
CREATE INDEX idx_created_at ON votes(created_at);