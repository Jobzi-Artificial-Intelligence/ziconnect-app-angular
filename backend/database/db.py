from typing import List

import json
import math
import pandas as pd

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

def get_engine(filepath) -> Engine:
    config = json.load(open(filepath, encoding="utf-8"))

    host     = config["db.host"]
    port     = config["db.port"]
    database = config["db.database"]
    user     = config["db.user"]
    password = config["db.password"]

    engine_url = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
    return create_engine(engine_url, echo = False, pool_pre_ping=True)

def get_locality_map_ids_adm_level(engine: Engine, codes: List[str], adm_level: str):
    value_template = '(\'{0}\')'
    values = [value_template.format(code) for code in codes]
    query = f"""
        SELECT lm.id
        FROM (VALUES
            {', '.join(values)}
        ) AS temp(code)
        LEFT JOIN unicef.locality_map lm
    """
    if adm_level == "region":
        query += " ON lm.region_code = code AND lm.state_code IS NULL AND lm.municipality_code IS NULL"
    elif adm_level == "state":
        query += " ON lm.state_code = code AND lm.municipality_code IS NULL"
    else:
        query += " ON lm.municipality_code = code"

    with engine.connect() as connect:
        results = connect.execute(query)
        records = [dict(r) for r in results]
        return pd.DataFrame(records)['id']

def get_locality_map_ids(engine: Engine, district_codes: List[str]):
    value_template = '(\'{0}\')'
    values = [value_template.format(code) for code in district_codes]
    query = f"""
        SELECT lm.id
        FROM (VALUES
            {', '.join(values)}
        ) AS temp(district_code)
        LEFT JOIN unicef.school_location sl ON temp.district_code = sl.district_code
        LEFT JOIN unicef.locality_map lm ON sl.municipality_code = lm.municipality_code
    """
    with engine.connect() as connect:
        results = connect.execute(query)
        records = [dict(r) for r in results]
        return pd.DataFrame(records)['id']

def get_school_location_ids(engine: Engine, district_codes: List[str]):
    value_template = '(\'{0}\')'
    values = [value_template.format(code) for code in district_codes]
    query = f"""
        SELECT sl.id
        FROM unicef.school_location sl
        RIGHT JOIN (VALUES
            {', '.join(values)}
        ) AS temp(district_code) ON sl.district_code = temp.district_code;
    """
    with engine.connect() as connect:
        results = connect.execute(query)
        records = [dict(r) for r in results]
        return pd.DataFrame(records)['id']

def get_schools_plus_ibge(engine: Engine):
    query = """
        SELECT  s.uuid,
                s.country,
                s.source,
                s.giga_school_id,
                s.source_school_id,
                s.school_name,
                s.latitude,
                s.longitude,
                s.hex8,
                s.dq_score,
                s.duplicate,
                s.source_timestamp,
                s.master_timestamp,
                s.school_archive,
                s.student_count,
                s.computer_availability,
                s.school_type,
                s.school_region,
                s.internet_availability,
                s.internet_availability_prediction,
                s.internet_speed_mbps,
                sl.district_code,
                sl.district_name,
                sl.municipality_code,
                sl.municipality_name,
                sl.microregion_code,
                sl.microregion_name,
                sl.mesoregion_code,
                sl.mesoregion_name,
                sl.state_code,
                sl.state_name,
                sl.state_abbreviation,
                sl.region_code,
                sl.region_name
        FROM unicef.school s
        INNER JOIN unicef.school_location sl ON s.school_location_id = sl.id;
    """
    with engine.connect() as connect:
        results = connect.execute(query)
        records = [dict(r) for r in results]
        return pd.DataFrame(records)

def update_internet_connectivity_prediction(engine: Engine, data: pd.DataFrame):
    query_template = """
        UPDATE unicef.school AS sg 
        SET internet_availability_prediction = temp.prediction
        FROM (VALUES
            {0}
        ) AS temp(uuid, prediction)
        WHERE sg.uuid = temp.uuid;
    """
    value_template = '(\'{0}\', {1})'

    num_rows = data.shape[0]    
    insert_every = math.ceil(0.05 * num_rows)
    with engine.connect() as connect:
        values = []
        for idx, row in data.iterrows():
            value = value_template.format(row["uuid"], row["prediction"])
            values.append(value)
            if idx + 1 % insert_every == 0 or idx + 1 == num_rows:
                query = query_template.format(', '.join(values))
                connect.execute(query)
                values = []
