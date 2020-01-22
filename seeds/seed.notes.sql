INSERT INTO notes (note_name, date_modified,folderid, content)
    VALUES
    ('Dogs', now() -'4 days'::INTERVAL, 1, 'Corporis accusamus placeat quas non voluptas. Harum fugit molestias qui.'),
    ('Cats', now() -'3 days'::INTERVAL, 2, 'Corporis accusamus placeat quas non voluptas. Harum fugit molestias qui.'),
    ('Pigs', now() -'2 days'::INTERVAL, 3, 'Corporis accusamus placeat quas non voluptas. Harum fugit molestias qui.'),
    ('Ducks', now() -'1 days'::INTERVAL, 1, 'Corporis accusamus placeat quas non voluptas. Harum fugit molestias qui.');
