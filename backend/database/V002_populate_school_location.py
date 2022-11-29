from sqlalchemy import MetaData, Table, Column
from sqlalchemy import UniqueConstraint, ForeignKeyConstraint
from sqlalchemy import String, Integer, DateTime
from sqlalchemy.sql import func
from typing import Dict
from db import get_engine

import json
import requests
import sys

RESOURCES_DIR = "./resourses"
TABLE_NAME = "school_location"

def get_ibge_districts() -> Dict:
    url = "https://servicodados.ibge.gov.br/api/v1/localidades/distritos"
    response = requests.request("GET", url, headers={}, data={})
    return json.loads(response.text)

def create_table(engine) -> Table:
    # Row example:
    #
    # id                 1
    # district_code      110001505
    # district_name      Alta Floresta D'Oeste
    # municipality_code  1100015
    # municipality_name  Alta Floresta D'Oeste
    # microregion_code   11006
    # microregion_name   Cacoal
    # mesoregion_code    1102
    # mesoregion_name    Leste Rondoniense
    # state_code         11
    # state_name         RO
    # state_abbreviation Rondônia
    # region_code        1
    # region_name        Norte
    # create_at          2022-10-01T18:00:00.000Z
    meta = MetaData(bind=engine)
    table = Table(
        TABLE_NAME, meta,
        Column('id', Integer, primary_key=True, autoincrement=True),
        Column('district_code', String, nullable=False),
        Column('district_name', String, nullable=False),
        Column('municipality_code', String, nullable=False),
        Column('municipality_name', String, nullable=False),
        Column('microregion_code', String, nullable=False),
        Column('microregion_name', String, nullable=False),
        Column('mesoregion_code', Integer, nullable=False),
        Column('mesoregion_name', String, nullable=False),
        Column('state_code', String, nullable=False),
        Column('state_name', String, nullable=False),
        Column('state_abbreviation', String, nullable=False),
        Column('region_code', String, nullable=False),
        Column('region_name', String, nullable=False),
        Column('create_at', DateTime(timezone=True), nullable=False, 
            server_default=func.now()),
        UniqueConstraint('district_code'),
        schema="unicef"
    )
    meta.create_all(engine, checkfirst=True)
    return table

def flat_data(data: Dict, key_prefix: str):
    flatten_data = {}
    for key, value in data.items():
        if isinstance(value, dict):
            flatten_data.update(flat_data(value, key))
        else:
            flatten_key = f'{key_prefix}_{key}'
            flatten_data[flatten_key] = value
    return flatten_data

def parse_district(district_data: Dict) -> tuple:
    flatten_data = flat_data(district_data, 'distrito')
    return {
        'district_code':      flatten_data['distrito_id'],
        'district_name':      flatten_data['distrito_nome'],
        'municipality_code':  flatten_data['municipio_id'],
        'municipality_name':  flatten_data['municipio_nome'],
        'microregion_code':   flatten_data['microrregiao_id'],
        'microregion_name':   flatten_data['microrregiao_nome'],
        'mesoregion_code':    flatten_data['mesorregiao_id'],
        'mesoregion_name':    flatten_data['mesorregiao_nome'],
        'state_code':         flatten_data['UF_id'],
        'state_name':         flatten_data['UF_nome'],
        'state_abbreviation': flatten_data['UF_sigla'],
        'region_code':        flatten_data['regiao_id'],
        'region_name':        flatten_data['regiao_nome'],
    }

def main(db_filepath):
    # Retrieve all data
    districts = get_ibge_districts()

    engine = get_engine(db_filepath)
    table = create_table(engine)

    rows = [parse_district(r) for r in districts]
    engine.execute(table.insert().values(rows))

if __name__ == "__main__":
    args = sys.argv
    env = args[1].lower() if len(args) > 1 else "development"
    if env not in {"development", "production"}:
        raise ValueError("Environment must be: 'development' or 'production'")
    main(f"{RESOURCES_DIR}/{env}.json")