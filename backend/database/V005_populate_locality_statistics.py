from typing import List

import argparse
import pandas as pd

from sqlalchemy import MetaData, Table, Column, ForeignKeyConstraint
from sqlalchemy import JSON, Integer, Float, DateTime
from sqlalchemy.sql import func

from db import get_engine, get_schools_plus_ibge, get_locality_map_ids_adm_level

from collections import Counter

RESOURCES_DIR = "./resourses"
TABLE_NAME = "locality_statistics"

def conditional_count(x, label) -> int:
    return sum(i == label for i in x)

def conditional_perc(x, label) -> float:
    return (100 * conditional_count(x, label) / len(x)) if len(x) > 0 else 0

def compute_stats_by_columns(df: pd.DataFrame, columns: List[str]) -> pd.DataFrame:
    group_df = df.groupby(columns)

    stats_df = group_df.agg(
        region_count       = ('region_code', lambda x: len(set(x))),
        state_count        = ('state_code', lambda x: len(set(x))),
        municipality_count = ('municipality_code', lambda x: len(set(x))),
        school_count       = ('uuid', lambda x: len(set(x))),
        student_count      = ('student_count', 'sum'),

        connected_count      = ('internet_availability', lambda x: conditional_count(x, 'Yes')),
        connected_percentage = ('internet_availability', lambda x: conditional_perc(x, 'Yes')),

        internet_availability_null_count      = ('internet_availability', lambda x: conditional_count(x, 'NA')),
        internet_availability_null_percentage = ('internet_availability', lambda x: conditional_perc(x, 'NA')),

        internet_availability_by_value = ('internet_availability', lambda x: Counter(x)),
    )

    stats_df['internet_availability_by_school_region'] = group_df.apply(
        lambda x: x.groupby(['school_region', 'internet_availability']).size()
            .unstack(fill_value=0).to_dict('index')
    )
    stats_df['internet_availability_by_school_type'] = group_df.apply(
        lambda x: x.groupby(['school_type', 'internet_availability']).size()
            .unstack(fill_value=0).to_dict('index')
    )

    stats_df['internet_availability_prediction_count'] = group_df.apply(lambda x: conditional_count(
        x[x['internet_availability'] == 'NA']['internet_availability_prediction'], 'Yes'))
    stats_df['internet_availability_prediction_percentage'] = group_df.apply(lambda x: conditional_perc(
        x[x['internet_availability'] == 'NA']['internet_availability_prediction'], 'Yes'))
    stats_df['internet_availability_prediction_by_value'] = group_df.apply(
        lambda x: x[x['internet_availability'] == 'NA']
            .groupby('internet_availability_prediction')
            .size().to_dict()
    )
    stats_df['internet_availability_prediction_by_school_region'] = group_df.apply(
        lambda x: x[x['internet_availability'] == 'NA']
            .groupby(['school_region', 'internet_availability_prediction'])
            .size()
            .unstack(fill_value=0).to_dict('index')
    )
    stats_df['internet_availability_prediction_by_school_type'] = group_df.apply(
        lambda x: x[x['internet_availability'] == 'NA']
            .groupby(['school_type', 'internet_availability_prediction'])
            .size()
            .unstack(fill_value=0).to_dict('index')
    )

    return stats_df

def create_table(engine) -> Table:
    meta = MetaData(bind=engine)

    # Need to fetch existing tables for foreign key to work
    meta.reflect(schema='unicef')

    map_geometry_table = Table(
        TABLE_NAME, meta,
        Column('id', Integer, primary_key=True),
        Column('locality_map_id', Integer, nullable=True),
        Column('region_count', Integer, nullable=False),
        Column('state_count', Integer, nullable=False),
        Column('municipality_count', Integer, nullable=False),
        Column('school_count', Integer, nullable=False),
        Column('student_count', Integer, nullable=False),
        Column('connected_count', Integer, nullable=False),
        Column('connected_percentage', Float, nullable=False),
        Column('internet_availability_null_count', Integer, nullable=False),
        Column('internet_availability_null_percentage', Float, nullable=False),
        Column('internet_availability_by_value', JSON, nullable=False),
        Column('internet_availability_by_school_region', JSON, nullable=False),
        Column('internet_availability_by_school_type', JSON, nullable=False),
        Column('internet_availability_prediction_count', Integer, nullable=False),
        Column('internet_availability_prediction_percentage', Float, nullable=False),
        Column('internet_availability_prediction_by_value', JSON, nullable=False),
        Column('internet_availability_prediction_by_school_region', JSON, nullable=False),
        Column('internet_availability_prediction_by_school_type', JSON, nullable=False),
        Column('create_at', DateTime(timezone=True), nullable=False, 
            server_default=func.now()),
        ForeignKeyConstraint(['locality_map_id'], ['unicef.locality_map.id']),
        schema="unicef",
        keep_existing=True
    )

    meta.create_all(engine, checkfirst=True)
    return map_geometry_table

def parse_bool(value: bool):
    if value is None or pd.isna(value):
        return 'NA'
    return 'Yes' if value else 'No'

def main(db_filepath):
    # Retrieve all school data from Database
    engine = get_engine(db_filepath)
    table = create_table(engine)

    input_df = get_schools_plus_ibge(engine)
    input_df['internet_availability'] = \
        input_df['internet_availability'].apply(parse_bool)
    input_df['internet_availability_prediction'] = \
        input_df['internet_availability_prediction'].apply(parse_bool)

    groupby_columns = [
        'country',
        'region_name', 'region_code',
        'state_name', 'state_code',
        'municipality_name', 'municipality_code'
    ]
    country_df = compute_stats_by_columns(input_df, groupby_columns[:1]).reset_index()
    region_df = compute_stats_by_columns(input_df, groupby_columns[:3]).reset_index()
    state_df = compute_stats_by_columns(input_df, groupby_columns[:5]).reset_index()
    municipality_df = compute_stats_by_columns(input_df, groupby_columns).reset_index()

    # HARD CODED -> Only Brazil is available
    assert country_df.shape[0] == 1, "Locality should only be available to Brazil!"

    country_codes = ['BR']
    country_df['locality_map_id'] = get_locality_map_ids_adm_level(engine, country_codes, 'country')

    region_codes = region_df['region_code'].to_list()
    region_df['locality_map_id'] = get_locality_map_ids_adm_level(engine, region_codes, 'region')

    state_codes = state_df['state_code'].to_list()
    state_df['locality_map_id'] = get_locality_map_ids_adm_level(engine, state_codes, 'state')

    city_codes = municipality_df['municipality_code'].to_list()
    municipality_df['locality_map_id'] = get_locality_map_ids_adm_level(engine, city_codes, 'municipality')

    stats_df = pd.concat([country_df, municipality_df, state_df, region_df])
    stats_df[groupby_columns] = stats_df[groupby_columns].fillna('')
    stats_df = stats_df.sort_values('locality_map_id')
    stats_df = stats_df.drop(columns=groupby_columns)

    rows = stats_df.to_dict('records')
    engine.execute(table.insert().values(rows))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Script to train a prediction "
        "model for internet connectivity in schools.")
    parser.add_argument('--env', help="Environment to save / load the data. "
                        "Options: 'development', 'production'.", required=False,
                        default='development', choices=['development', 'production'])
    args = parser.parse_args()
    main(f"{RESOURCES_DIR}/{args.env}.json")