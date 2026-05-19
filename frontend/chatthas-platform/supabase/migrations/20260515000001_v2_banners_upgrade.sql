-- Phase 4: Banner Management Upgrades

ALTER TABLE homepage_sections 
ADD COLUMN media_url_mobile TEXT,
ADD COLUMN target VARCHAR(50) DEFAULT 'homepage_hero',
ADD COLUMN animation_type VARCHAR(50) DEFAULT 'fade',
ADD COLUMN cta_style VARCHAR(50) DEFAULT 'primary',
ADD COLUMN start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN end_date TIMESTAMP WITH TIME ZONE;
