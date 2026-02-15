CREATE TABLE providers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE prices (
    id BIGSERIAL PRIMARY KEY,
    provider_id INT NOT NULL REFERENCES providers(id),
    asset_id INT NOT NULL REFERENCES assets(id),
    price bigint NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_price_provider_asset_time
ON prices (provider_id, asset_id, recorded_at DESC);

CREATE INDEX idx_price_asset_time
ON prices (asset_id, recorded_at DESC);

ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;


CREATE TABLE latest_prices (
    provider_id INT,
    asset_id INT,
    price bigint,
    recorded_at TIMESTAMPTZ,
    PRIMARY KEY (provider_id, asset_id)
);



CREATE OR REPLACE FUNCTION insert_price_if_needed(
    p_provider_id INT,
    p_asset_id INT,
    p_price NUMERIC,
    p_time TIMESTAMPTZ
)
RETURNS VOID AS $$
DECLARE
    v_last_price NUMERIC;
    v_threshold NUMERIC;
BEGIN
    -- گرفتن threshold
    SELECT threshold_percent
    INTO v_threshold
    FROM assets
    WHERE id = p_asset_id;

    -- گرفتن آخرین قیمت
    SELECT price
    INTO v_last_price
    FROM latest_prices
    WHERE provider_id = p_provider_id
      AND asset_id = p_asset_id;

    -- اگر اولین رکورد است
    IF v_last_price IS NULL THEN
        INSERT INTO prices(provider_id, asset_id, price, recorded_at)
        VALUES (p_provider_id, p_asset_id, p_price, p_time);

        INSERT INTO latest_prices(provider_id, asset_id, price, recorded_at)
        VALUES (p_provider_id, p_asset_id, p_price, p_time);

        RETURN;
    END IF;

    -- محاسبه درصد تغییر
    IF ABS(p_price - v_last_price) / v_last_price * 100 >= v_threshold THEN
        
        INSERT INTO prices(provider_id, asset_id, price, recorded_at)
        VALUES (p_provider_id, p_asset_id, p_price, p_time);

        UPDATE latest_prices
        SET price = p_price,
            recorded_at = p_time
        WHERE provider_id = p_provider_id
          AND asset_id = p_asset_id;
    END IF;
END;
$$ LANGUAGE plpgsql;



INSERT INTO providers (name) VALUES
('Arzdigital'),
('Bitpin'),
('Nobitex'),
('Tgju'),
('Wallex')
ON CONFLICT (name) DO NOTHING;


INSERT INTO assets (symbol) VALUES
('USDT'),
('BTC'),
('GOLD18'),
('COIN'),
('USD')
ON CONFLICT (symbol) DO NOTHING;


