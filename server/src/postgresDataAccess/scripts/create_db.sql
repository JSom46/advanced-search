--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2 (Debian 15.2-1.pgdg110+1)
-- Dumped by pg_dump version 15.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: add_elements(integer[]); Type: PROCEDURE; Schema: public; Owner: root
--

CREATE PROCEDURE public.add_elements(IN integer[])
    LANGUAGE plpgsql
    AS $_$
DECLARE
	el integer;
BEGIN
  FOREACH el IN ARRAY $1
  LOOP
    INSERT INTO elements (id) VALUES (el) ON CONFLICT DO NOTHING;
  END LOOP;
  INSERT INTO updates(update_date, updated_table) VALUES (CURRENT_DATE, 'elements');
END;
$_$;


ALTER PROCEDURE public.add_elements(IN integer[]) OWNER TO root;

--
-- Name: add_tags(integer, text[]); Type: PROCEDURE; Schema: public; Owner: root
--

CREATE PROCEDURE public.add_tags(IN area integer, IN names text[])
    LANGUAGE plpgsql
    AS $$
BEGIN
  CASE area
    WHEN 1 THEN
      INSERT INTO characters (name) SELECT unnest(names) ON CONFLICT DO NOTHING;
    WHEN 2 THEN
      INSERT INTO tags (name) SELECT unnest(names) ON CONFLICT DO NOTHING;
    WHEN 3 THEN
      INSERT INTO series (name) SELECT unnest(names) ON CONFLICT DO NOTHING;
    WHEN 4 THEN
      INSERT INTO artists (name) SELECT unnest(names) ON CONFLICT DO NOTHING;
    ELSE
      RAISE EXCEPTION 'Invalid area: %', area;
  END CASE;
END;
$$;


ALTER PROCEDURE public.add_tags(IN area integer, IN names text[]) OWNER TO root;

--
-- Name: set_tag_elements(integer, text, integer[]); Type: PROCEDURE; Schema: public; Owner: root
--

CREATE PROCEDURE public.set_tag_elements(IN area integer, IN tag text, IN ids integer[])
    LANGUAGE plpgsql
    AS $$DECLARE
	loop_id INTEGER;

BEGIN
  CASE area
  	WHEN 0 THEN
	  UPDATE elements SET language = (SELECT id FROM languages WHERE name = tag) WHERE id IN (SELECT unnest(ids));
	  UPDATE languages SET last_updated = CURRENT_DATE WHERE name = tag;
	  
    WHEN 1 THEN
	  DELETE FROM element_character WHERE (character = (SELECT id FROM characters WHERE name = tag)) AND (element NOT IN (SELECT unnest(ids)));
      FOREACH loop_id IN ARRAY ids LOOP
    	INSERT INTO element_character (element, character)
    	  SELECT id, (SELECT id FROM characters WHERE name = tag) FROM elements WHERE id = loop_id
		  ON CONFLICT DO NOTHING;
  	  END LOOP;
	  UPDATE characters SET last_updated = CURRENT_DATE WHERE name = tag;
	  
    WHEN 2 THEN
      DELETE FROM element_tag t WHERE (t.tag = (SELECT id FROM tags WHERE name = set_tag_elements.tag)) AND (element NOT IN (SELECT unnest(ids)));
      FOREACH loop_id IN ARRAY ids LOOP
    	INSERT INTO element_tag (element, tag)
    	  SELECT id, (SELECT id FROM tags WHERE name = tag) FROM elements WHERE id = loop_id
		  ON CONFLICT DO NOTHING;
  	  END LOOP;
	  UPDATE tags SET last_updated = CURRENT_DATE WHERE name = tag;
		
    WHEN 3 THEN
      DELETE FROM element_series WHERE (series = (SELECT id FROM series WHERE name = tag)) AND (element NOT IN (SELECT unnest(ids)));
      FOREACH loop_id IN ARRAY ids LOOP
    	INSERT INTO element_series (element, series)
    	  SELECT id, (SELECT id FROM series WHERE name = tag) FROM elements WHERE id = loop_id
		  ON CONFLICT DO NOTHING;
  	  END LOOP;
	  UPDATE series SET last_updated = CURRENT_DATE WHERE name = tag;
		
    WHEN 4 THEN
      DELETE FROM element_artist WHERE (artist = (SELECT id FROM artists WHERE name = tag)) AND (element NOT IN (SELECT unnest(ids)));
      FOREACH loop_id IN ARRAY ids LOOP
    	INSERT INTO element_artist (element, artist)
    	  SELECT id, (SELECT id FROM artists WHERE name = tag) FROM elements WHERE id = loop_id
		  ON CONFLICT DO NOTHING;
  	  END LOOP;
	  UPDATE artists SET last_updated = CURRENT_DATE WHERE name = tag;
		
    ELSE
      RAISE EXCEPTION 'Invalid area: %', area;
	  
  END CASE;
END;$$;


ALTER PROCEDURE public.set_tag_elements(IN area integer, IN tag text, IN ids integer[]) OWNER TO root;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: artists; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.artists (
    id integer NOT NULL,
    name text NOT NULL,
    last_updated date
);


ALTER TABLE public.artists OWNER TO root;

--
-- Name: artists_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.artists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.artists_id_seq OWNER TO root;

--
-- Name: artists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.artists_id_seq OWNED BY public.artists.id;


--
-- Name: characters; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.characters (
    id integer NOT NULL,
    name text NOT NULL,
    last_updated date
);


ALTER TABLE public.characters OWNER TO root;

--
-- Name: characters_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.characters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.characters_id_seq OWNER TO root;

--
-- Name: characters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.characters_id_seq OWNED BY public.characters.id;


--
-- Name: element_artist; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.element_artist (
    element integer NOT NULL,
    artist integer NOT NULL
);


ALTER TABLE public.element_artist OWNER TO root;

--
-- Name: element_character; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.element_character (
    element integer NOT NULL,
    "character" integer NOT NULL
);


ALTER TABLE public.element_character OWNER TO root;

--
-- Name: element_series; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.element_series (
    element integer NOT NULL,
    series integer NOT NULL
);


ALTER TABLE public.element_series OWNER TO root;

--
-- Name: element_tag; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.element_tag (
    element integer NOT NULL,
    tag integer NOT NULL
);


ALTER TABLE public.element_tag OWNER TO root;

--
-- Name: elements; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.elements (
    id integer NOT NULL,
    language integer,
    last_updated date,
    title text
);


ALTER TABLE public.elements OWNER TO root;

--
-- Name: images; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.images (
    id integer NOT NULL,
    url text NOT NULL,
    element_id integer NOT NULL
);


ALTER TABLE public.images OWNER TO root;

--
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.images_id_seq OWNER TO root;

--
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.images_id_seq OWNED BY public.images.id;


--
-- Name: languages; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.languages (
    id integer NOT NULL,
    name text NOT NULL,
    last_updated date
);


ALTER TABLE public.languages OWNER TO root;

--
-- Name: languages_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.languages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.languages_id_seq OWNER TO root;

--
-- Name: languages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.languages_id_seq OWNED BY public.languages.id;


--
-- Name: series; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.series (
    id integer NOT NULL,
    name text NOT NULL,
    last_updated date
);


ALTER TABLE public.series OWNER TO root;

--
-- Name: series_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.series_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.series_id_seq OWNER TO root;

--
-- Name: series_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.series_id_seq OWNED BY public.series.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name text NOT NULL,
    last_updated date
);


ALTER TABLE public.tags OWNER TO root;

--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tags_id_seq OWNER TO root;

--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: updates; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.updates (
    id integer NOT NULL,
    update_date date NOT NULL,
    updated_table text NOT NULL
);


ALTER TABLE public.updates OWNER TO root;

--
-- Name: updates_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.updates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.updates_id_seq OWNER TO root;

--
-- Name: updates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.updates_id_seq OWNED BY public.updates.id;


--
-- Name: artists id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.artists ALTER COLUMN id SET DEFAULT nextval('public.artists_id_seq'::regclass);


--
-- Name: characters id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.characters ALTER COLUMN id SET DEFAULT nextval('public.characters_id_seq'::regclass);


--
-- Name: images id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.images ALTER COLUMN id SET DEFAULT nextval('public.images_id_seq'::regclass);


--
-- Name: languages id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.languages ALTER COLUMN id SET DEFAULT nextval('public.languages_id_seq'::regclass);


--
-- Name: series id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.series ALTER COLUMN id SET DEFAULT nextval('public.series_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: updates id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.updates ALTER COLUMN id SET DEFAULT nextval('public.updates_id_seq'::regclass);


--
-- Name: artists artists_name_unique; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.artists
    ADD CONSTRAINT artists_name_unique UNIQUE (name);


--
-- Name: artists artists_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.artists
    ADD CONSTRAINT artists_pkey PRIMARY KEY (id);


--
-- Name: characters characters_name_unique; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_name_unique UNIQUE (name);


--
-- Name: characters characters_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_pkey PRIMARY KEY (id);


--
-- Name: element_artist element_artist_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.element_artist
    ADD CONSTRAINT element_artist_pkey PRIMARY KEY (element, artist);


--
-- Name: element_character element_character_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.element_character
    ADD CONSTRAINT element_character_pkey PRIMARY KEY (element, "character");


--
-- Name: element_series element_series_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.element_series
    ADD CONSTRAINT element_series_pkey PRIMARY KEY (element, series);


--
-- Name: element_tag element_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.element_tag
    ADD CONSTRAINT element_tag_pkey PRIMARY KEY (element, tag);


--
-- Name: elements elements_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.elements
    ADD CONSTRAINT elements_pkey PRIMARY KEY (id);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: languages languages_name_unique; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_name_unique UNIQUE (name);


--
-- Name: languages languages_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_pkey PRIMARY KEY (id);


--
-- Name: artists name; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.artists
    ADD CONSTRAINT name UNIQUE (name) INCLUDE (name);


--
-- Name: series series_name_unique; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.series
    ADD CONSTRAINT series_name_unique UNIQUE (name);


--
-- Name: series series_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.series
    ADD CONSTRAINT series_pkey PRIMARY KEY (id);


--
-- Name: tags tags_name_unique; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_unique UNIQUE (name);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: updates updates_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.updates
    ADD CONSTRAINT updates_pkey PRIMARY KEY (id);


--
-- Name: artists_name_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX artists_name_idx ON public.artists USING hash (name);


--
-- Name: characters_name_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX characters_name_idx ON public.characters USING hash (name);


--
-- Name: element_artist_artist_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX element_artist_artist_idx ON public.element_artist USING hash (artist);


--
-- Name: element_character_character_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX element_character_character_idx ON public.element_character USING hash ("character");


--
-- Name: element_series_series_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX element_series_series_idx ON public.element_series USING hash (series);


--
-- Name: element_tag_tag_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX element_tag_tag_idx ON public.element_tag USING hash (tag);


--
-- Name: elements_id_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX elements_id_idx ON public.elements USING btree (id);


--
-- Name: elements_language_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX elements_language_idx ON public.elements USING btree (language);


--
-- Name: languages_name_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX languages_name_idx ON public.languages USING hash (name);


--
-- Name: series_name_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX series_name_idx ON public.series USING hash (name);


--
-- Name: tags_name_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX tags_name_idx ON public.tags USING hash (name);


--
-- Name: element_artist artist; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.element_artist
    ADD CONSTRAINT artist FOREIGN KEY (artist) REFERENCES public.artists(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: element_character character; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.element_character
    ADD CONSTRAINT "character" FOREIGN KEY ("character") REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: element_artist element; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.element_artist
    ADD CONSTRAINT element FOREIGN KEY (element) REFERENCES public.elements(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: element_character element; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.element_character
    ADD CONSTRAINT element FOREIGN KEY (element) REFERENCES public.elements(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: element_series element; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.element_series
    ADD CONSTRAINT element FOREIGN KEY (element) REFERENCES public.elements(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: element_tag element; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.element_tag
    ADD CONSTRAINT element FOREIGN KEY (element) REFERENCES public.elements(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: images element_id; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT element_id FOREIGN KEY (element_id) REFERENCES public.elements(id);


--
-- Name: elements language; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.elements
    ADD CONSTRAINT language FOREIGN KEY (language) REFERENCES public.languages(id) ON UPDATE SET NULL ON DELETE SET NULL NOT VALID;


--
-- Name: element_series series; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.element_series
    ADD CONSTRAINT series FOREIGN KEY (series) REFERENCES public.series(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: element_tag tag; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.element_tag
    ADD CONSTRAINT tag FOREIGN KEY (tag) REFERENCES public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- PostgreSQL database dump complete
--

