CREATE TABLE IF NOT EXISTS "contact" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "contact_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first" text,
	"last" text,
	"avatar" text,
	"twitter" text,
	"notes" text,
	"favorite" boolean,
	"fts" "tsvector" GENERATED ALWAYS AS (to_tsvector('english',coalesce("contact"."first", '') || ' ' || coalesce("contact"."last", ''))) STORED
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contact_search_index" ON "contact" USING gin ("fts");

--> statement-breakpoint
-- Seed data
INSERT INTO "contact" ("first", "last", "avatar", "twitter", "notes")
VALUES
  ('Andrew', 'Sherman', 'https://pbs.twimg.com/profile_images/1549811149385990145/ndpteEfY_400x400.jpg', '@andrii_sherman', 'Drizzle Team'),
  ('Alex', 'Blokh', 'https://pbs.twimg.com/profile_images/1729947770088202240/cQ1A5Fx6_400x400.jpg', '@_alexblokh', 'Drizzle Team'),
  ('Alem', 'Tuzlak', 'https://pbs.twimg.com/profile_images/1646187495783030785/4JWIYQtB_400x400.jpg', '@AlemTuzlak', 'The man who speaks to the birds'),
  ('Raphaël', 'Moreau', 'https://pbs.twimg.com/profile_images/1784874925775347712/jFretCU5_400x400.jpg', '@rphlmr', 'Building https://drizzle.run'),
  ('Shruti', 'Kapoor', 'https://sessionize.com/image/124e-400o400o2-wHVdAuNaxi8KJrgtN3ZKci.jpg', '@shrutikapoor08', NULL),
  ('Glenn', 'Reyes', 'https://sessionize.com/image/1940-400o400o2-Enh9dnYmrLYhJSTTPSw3MH.jpg', '@glnnrys', NULL),
  ('Ryan', 'Florence', 'https://sessionize.com/image/9273-400o400o2-3tyrUE3HjsCHJLU5aUJCja.jpg', NULL, NULL),
  ('Oscar', 'Newman', 'https://sessionize.com/image/d14d-400o400o2-pyB229HyFPCnUcZhHf3kWS.png', '@__oscarnewman', NULL),
  ('Michael', 'Jackson', 'https://sessionize.com/image/fd45-400o400o2-fw91uCdGU9hFP334dnyVCr.jpg', NULL, NULL),
  ('Christopher', 'Chedeau', 'https://sessionize.com/image/b07e-400o400o2-KgNRF3S9sD5ZR4UsG7hG4g.jpg', '@Vjeux', NULL),
  ('Cameron', 'Matheson', 'https://sessionize.com/image/262f-400o400o2-UBPQueK3fayaCmsyUc1Ljf.jpg', '@cmatheson', NULL),
  ('Brooks', 'Lybrand', 'https://sessionize.com/image/820b-400o400o2-Ja1KDrBAu5NzYTPLSC3GW8.jpg', '@BrooksLybrand', NULL),
  ('Alex', 'Anderson', 'https://sessionize.com/image/df38-400o400o2-JwbChVUj6V7DwZMc9vJEHc.jpg', '@ralex1993', NULL),
  ('Kent C.', 'Dodds', 'https://sessionize.com/image/5578-400o400o2-BMT43t5kd2U1XstaNnM6Ax.jpg', '@kentcdodds', NULL),
  ('Nevi', 'Shah', 'https://sessionize.com/image/c9d5-400o400o2-Sri5qnQmscaJXVB8m3VBgf.jpg', '@nevikashah', NULL),
  ('Andrew', 'Petersen', 'https://sessionize.com/image/2694-400o400o2-MYYTsnszbLKTzyqJV17w2q.png', NULL, NULL),
  ('Scott', 'Smerchek', 'https://sessionize.com/image/907a-400o400o2-9TM2CCmvrw6ttmJiTw4Lz8.jpg', '@smerchek', NULL),
  ('Giovanni', 'Benussi', 'https://sessionize.com/image/08be-400o400o2-WtYGFFR1ZUJHL9tKyVBNPV.jpg', '@giovannibenussi', NULL),
  ('Igor', 'Minar', 'https://sessionize.com/image/f814-400o400o2-n2ua5nM9qwZA2hiGdr1T7N.jpg', '@IgorMinar', NULL),
  ('Brandon', 'Kish', 'https://sessionize.com/image/fb82-400o400o2-LbvwhTVMrYLDdN3z4iEFMp.jpeg', NULL, NULL),
  ('Arisa', 'Fukuzaki', 'https://sessionize.com/image/fcda-400o400o2-XiYRtKK5Dvng5AeyC8PiUA.png', '@arisa_dev', NULL),
  ('Alexandra', 'Spalato', 'https://sessionize.com/image/c8c3-400o400o2-PR5UsgApAVEADZRixV4H8e.jpeg', '@alexadark', NULL),
  ('Cat', 'Johnson', 'https://sessionize.com/image/7594-400o400o2-hWtdCjbdFdLgE2vEXBJtyo.jpg', NULL, NULL),
  ('Ashley', 'Narcisse', 'https://sessionize.com/image/5636-400o400o2-TWgi8vELMFoB3hB9uPw62d.jpg', '@_darkfadr', NULL),
  ('Edmund', 'Hung', 'https://sessionize.com/image/6aeb-400o400o2-Q5tAiuzKGgzSje9ZsK3Yu5.JPG', '@_edmundhung', NULL),
  ('Clifford', 'Fajardo', 'https://sessionize.com/image/30f1-400o400o2-wJBdJ6sFayjKmJycYKoHSe.jpg', '@cliffordfajard0', NULL),
  ('Erick', 'Tamayo', 'https://sessionize.com/image/6faa-400o400o2-amseBRDkdg7wSK5tjsFDiG.jpg', '@ericktamayo', NULL),
  ('Paul', 'Bratslavsky', 'https://sessionize.com/image/feba-400o400o2-R4GE7eqegJNFf3cQ567obs.jpg', '@codingthirty', NULL),
  ('Pedro', 'Cattori', 'https://sessionize.com/image/c315-400o400o2-spjM5A6VVfVNnQsuwvX3DY.jpg', '@pcattori', NULL),
  ('Andre', 'Landgraf', 'https://sessionize.com/image/eec1-400o400o2-HkvWKLFqecmFxLwqR9KMRw.jpg', '@AndreLandgraf94', NULL),
  ('Monica', 'Powell', 'https://sessionize.com/image/c73a-400o400o2-4MTaTq6ftC15hqwtqUJmTC.jpg', '@indigitalcolor', NULL),
  ('Brian', 'Lee', 'https://sessionize.com/image/cef7-400o400o2-KBZUydbjfkfGACQmjbHEvX.jpeg', '@brian_dlee', NULL),
  ('Sean', 'McQuaid', 'https://sessionize.com/image/f83b-400o400o2-Pyw3chmeHMxGsNoj3nQmWU.jpg', '@SeanMcQuaidCode', NULL),
  ('Shane', 'Walker', 'https://sessionize.com/image/a9fc-400o400o2-JHBnWZRoxp7QX74Hdac7AZ.jpg', '@swalker326', NULL),
  ('Jon', 'Jensen', 'https://sessionize.com/image/6644-400o400o2-aHnGHb5Pdu3D32MbfrnQbj.jpg', '@jenseng', NULL);