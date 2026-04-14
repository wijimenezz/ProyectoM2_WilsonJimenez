CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    author_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE

);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    post_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);

INSERT INTO authors (name, email, bio) VALUES
('Wilson', 'wilson@email.com', 'Apasionado por el running y la tecnología'),
('Karla', 'karen@email.com', 'Amante de la naturaleza y los viajes'),
('Carlos', 'carlos@email.com', 'Backend developer y fan de PostgreSQL');

INSERT INTO posts (author_id, title, content, published) VALUES
(1, 'Aprendiendo SQL', 'Este es un post sobre SQL básico', true),
(1, 'Entrenamiento para media maratón', 'Tips para correr mejor', true),
(2, 'Viaje a la montaña', 'Experiencia en hiking', true),
(3, 'API con Node.js', 'Cómo crear tu primera API', false);

INSERT INTO comments (content, post_id, author_id) VALUES
('Muy buen post!', 1, 2),
('Me ayudó mucho, gracias!', 1, 3),
('Voy a aplicar estos consejos', 2, 2),
('Qué buen viaje!', 3, 1),
('Explica más sobre Express por favor', 4, 1),
('Buen contenido técnico', 4, 2);
