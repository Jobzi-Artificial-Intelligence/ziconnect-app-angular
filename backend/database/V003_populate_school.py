from datetime import datetime
from sqlalchemy import MetaData, Table, Column
from sqlalchemy import UniqueConstraint, ForeignKeyConstraint
from sqlalchemy import String, Integer, Float, Boolean, DateTime
from sqlalchemy.sql import func

from db import get_engine, get_locality_map_ids, get_school_location_ids

import pandas as pd
import sys

RESOURCES_DIR = "./resourses"
TABLE_NAME = "school"

def create_table(engine) -> Table:
    # Row example:
    #
    # uuid                  82679ff0-f358-33d0-b3ce-4fc4c2740b7e
    # country               Brazil
    # source                government
    # giga_school_id        G_BRA_000001
    # source_school_id      11000023
    # school_name           EEEE ABNAEL MACHADO DE LIMA - CENE
    # latitude              -8.7585
    # longitude             -63.854
    # hex8                  888a05915dfffff
    # dq_score              0.94
    # duplicate             0
    # source_timestamp      2021-04
    # master_timestamp      2021-06-28 21:32:36.909
    # school_archive        No
    # district_code         110020505
    # student_count         174
    # school_type           Urban
    # school_region         Estadual
    # computer_availability Yes
    # internet_availability Yes
    # internet_speed_mbps   5.0
    meta = MetaData(bind=engine)

    # Need to fetch existing tables for foreign key to work
    meta.reflect(schema='unicef')

    table = Table(
        TABLE_NAME, meta,
        Column('id', Integer, primary_key=True),
        Column('school_location_id', Integer, nullable=True),
        Column('locality_map_id', Integer, nullable=True),
        Column('uuid', String, nullable=False),
        Column('country', String, nullable=False),
        Column('source', String, nullable=False),
        Column('giga_school_id', String, nullable=False),
        Column('source_school_id', String, nullable=False),
        Column('school_name', String, nullable=False),
        Column('latitude', Float, nullable=False),
        Column('longitude', Float, nullable=False),
        Column('hex8', String, nullable=False),
        Column('dq_score', Float, nullable=False),
        Column('duplicate', Boolean, nullable=False),
        Column('source_timestamp', DateTime, nullable=False),
        Column('master_timestamp', DateTime, nullable=False),
        Column('school_archive', Boolean, nullable=False),
        Column('district_code', String, nullable=False),
        Column('student_count', Integer, nullable=False),
        Column('school_type', String, nullable=False),
        Column('school_region', String, nullable=False),
        Column('computer_availability', Boolean),
        Column('internet_availability', Boolean),
        Column('internet_speed_mbps', Float),
        Column('internet_availability_prediction', Boolean),
        Column('create_at', DateTime(timezone=True), nullable=False, 
            server_default=func.now()),
        ForeignKeyConstraint(['school_location_id'], ['unicef.school_location.id']),
        ForeignKeyConstraint(['locality_map_id'], ['unicef.locality_map.id']),
        UniqueConstraint('uuid'),
        UniqueConstraint('giga_school_id'),
        UniqueConstraint('source_school_id'),
        schema="unicef",
        keep_existing=True
    )
    meta.create_all(engine, checkfirst=True)
    return table

def main(db_filepath):
    # Retrieve all data
    schools_df = pd.read_csv(f'{RESOURCES_DIR}/initial_school_data.csv', skip_blank_lines=True)

    engine = get_engine(db_filepath)
    table = create_table(engine)

    def parse_date(value: str, format: str) -> datetime:
        return datetime.strptime(value, format)

    def parse_bool(value: str, true_label: str) -> bool:
        if value is None or pd.isna(value):
            return None
        return value.lower() == true_label.lower()

    schools_df['giga_school_id']        = schools_df['giga_school_id'].astype(str)
    schools_df['source_school_id']      = schools_df['source_school_id'].astype(str)
    schools_df['duplicate']             = schools_df['duplicate'].apply(lambda x: parse_bool(str(x), '1'))
    schools_df['source_timestamp']      = schools_df['source_timestamp'].apply(lambda x: parse_date(x, '%Y-%m'))
    schools_df['master_timestamp']      = schools_df['master_timestamp'].apply(lambda x: parse_date(x, '%Y-%m-%d %H:%M:%S.%f'))
    schools_df['school_archive']        = schools_df['school_archive'].apply(lambda x: parse_bool(x, 'yes'))
    schools_df['district_code']         = schools_df['district_code'].astype(str)
    schools_df['computer_availability'] = schools_df['computer_availability'].apply(lambda x: parse_bool(x, 'yes'))
    schools_df['internet_availability'] = schools_df['internet_availability'].apply(lambda x: parse_bool(x, 'yes'))
    schools_df['internet_availability_prediction'] = None

    district_codes = schools_df['district_code'].to_list()
    schools_df['school_location_id'] = get_school_location_ids(engine, district_codes)
    schools_df['locality_map_id'] = get_locality_map_ids(engine, district_codes)

    rows = schools_df.to_dict('records')

    # The "pd.NaN" is equal a "infinite"
    # And, unfortunaly, a Integer column raise a exception "Out of Bounds"
    nan_columns = ['internet_speed_mbps', 'locality_map_id', 'school_location_id']
    for row in rows:        
        for column in nan_columns:
            if pd.isna(row[column]):
                row[column] = None

    engine.execute(table.insert().values(rows))

if __name__ == "__main__":
    args = sys.argv
    env = args[1].lower() if len(args) > 1 else "development"
    if env not in {"development", "production"}:
        raise ValueError("Environment must be: 'development' or 'production'")
    main(f"{RESOURCES_DIR}/{env}.json")