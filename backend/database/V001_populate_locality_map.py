from typing import Dict

import json
import requests
import sys

from sqlalchemy import MetaData, Table, Column, UniqueConstraint
from sqlalchemy import String, Integer, DateTime, JSON
from sqlalchemy.sql import func
from db import get_engine

RESOURCES_DIR = "./resourses"
TABLE_NAME = "locality_map"

# Sources:
# https://servicodados.ibge.gov.br/api/docs/localidades
# https://servicodados.ibge.gov.br/api/docs/malhas?versao=2
# https://towardsdatascience.com/sqlalchemy-python-tutorial-79a577141a91

def get_ibge_locality(adm_level: str) -> Dict:
    locality_url = "https://servicodados.ibge.gov.br/api/v1/localidades/"
    url = f"{locality_url}/{adm_level}"
    response = requests.request("GET", url, headers={}, data={})
    return json.loads(response.text)

def get_ibge_geometry(adm_level: str=None) -> Dict:
    geometry_url = "https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR"
    geometry_param = "formato=application/vnd.geo+json&qualidade=intermediaria"
    url = f"{geometry_url}?{geometry_param}"
    if adm_level:
        url += f"&intrarregiao={adm_level}"
    response = requests.request("GET", url, headers={}, data={})
    return json.loads(response.text)

def extract_country(locality: Dict) -> Dict:
    country = {}
    country["adm_level"] = 'country'
    country["country_code"] = locality["id"]["ISO-ALPHA-2"]
    country["country_name"] = locality["nome"]
    return country

def extract_region(locality: Dict) -> Dict:
    region = {}
    region["adm_level"] = 'region'
    region["region_code"] = str(locality["id"])
    region["region_name"] = locality["nome"]
    region["region_abbreviation"] = locality["sigla"]
    return region

def extract_state(locality: Dict) -> Dict:
    state =  extract_region(locality["regiao"])
    state["adm_level"] = 'state'
    state["state_code"] = str(locality["id"])
    state["state_name"] = locality["nome"]
    state["state_abbreviation"] = locality["sigla"]
    return state

def extract_municipality(locality: Dict) -> Dict:
    municipality = extract_state(locality["microrregiao"]["mesorregiao"]["UF"])
    municipality["adm_level"] = 'municipality'
    municipality["municipality_code"] = str(locality["id"])
    municipality["municipality_name"] = locality["nome"]
    return municipality

def get_all_localities():
    # Get entity geometry
    country_geometries = get_ibge_geometry()
    region_geometries = get_ibge_geometry("regiao")
    state_geometries = get_ibge_geometry("UF")
    municipality_geometries = get_ibge_geometry("municipio")

    def to_geometry_map(geometries):
        geometry_map = {}
        for geometry in geometries:
            code = geometry["properties"]["codarea"]
            geometry_map[str(code)] = geometry
        return geometry_map

    geometry_map = to_geometry_map(country_geometries["features"])
    geometry_map.update(to_geometry_map(region_geometries["features"]))
    geometry_map.update(to_geometry_map(state_geometries["features"]))
    geometry_map.update(to_geometry_map(municipality_geometries["features"]))

    # Get entity info
    country_localities = get_ibge_locality("paises")
    region_localities = get_ibge_locality("regioes")
    state_localities = get_ibge_locality("estados")
    municipality_localities = get_ibge_locality("municipios")

    def parse_locality(localities, parse_func):
        return [parse_func(locality) for locality in localities]

    all_localities = parse_locality(country_localities, extract_country)
    all_localities.extend(parse_locality(region_localities, extract_region))
    all_localities.extend(parse_locality(state_localities, extract_state))
    all_localities.extend(parse_locality(municipality_localities, extract_municipality))

    # We only need the geometry of Brazil
    all_localities = [locality for locality in all_localities
                      if locality["adm_level"] != "country" or locality["country_code"] == "BR"]
    for locality in all_localities:
        locality["country_code"] = "BR"
        locality["country_name"] = "Brasil"

    def append_geometry_to_locality(localities):
        locality_code_map = {
            "country": "country_code",
            "region": "region_code",
            "state": "state_code",
            "municipality": "municipality_code",
        }
        for locality in localities:
            locality_code_column = locality_code_map[locality["adm_level"]]
            locality_code = locality[locality_code_column]
            geometry = geometry_map[locality_code]
            for key, value in locality.items():
                geometry["properties"][key] = value
            del geometry["properties"]["codarea"]
            locality["geometry"] = geometry
        return localities

    all_localities = append_geometry_to_locality(all_localities)
    return all_localities

def create_table(engine) -> Table:
    meta = MetaData(bind=engine)
    map_geometry_table = Table(
        TABLE_NAME, meta,
        Column('id', Integer, primary_key=True, autoincrement=True),
        Column('country_name', String),
        Column('country_code', String),
        Column('region_name', String),
        Column('region_code', String),
        Column('state_name', String),
        Column('state_abbreviation', String),
        Column('state_code', String),
        Column('municipality_name', String),
        Column('municipality_code', String),
        Column('adm_level', String, nullable=False),
        Column('geometry', JSON, nullable=False),
        Column('create_at', DateTime(timezone=True), nullable=False, 
            server_default=func.now()),
        UniqueConstraint('country_code', 'region_code', 'state_code', 'municipality_code'),
        schema="unicef"
    )
    meta.create_all(engine, checkfirst=True)
    return map_geometry_table

def main(db_filepath):
    # Retrieve all data
    all_localities = get_all_localities()

    #
    engine = get_engine(db_filepath)
    table = create_table(engine)

    rows = []
    for locality in all_localities:
        rows.append({
            'country_name':       locality.get("country_name", None),
            'country_code':       locality.get("country_code", None),
            'region_name':        locality.get("region_name", None),
            'region_code':        locality.get("region_code", None),
            'state_name':         locality.get("state_name", None),
            'state_abbreviation': locality.get("state_abbreviation", None),
            'state_code':         locality.get("state_code", None),
            'municipality_name':  locality.get("municipality_name", None),
            'municipality_code':  locality.get("municipality_code", None),
            'adm_level':          locality.get("adm_level"),
            'geometry':           locality.get("geometry"),
        })
    engine.execute(table.insert().values(rows))

if __name__ == "__main__":
    args = sys.argv
    env = args[1].lower() if len(args) > 1 else "development"
    if env not in {"development", "production"}:
        raise ValueError("Environment must be: 'development' or 'production'")
    main(f"{RESOURCES_DIR}/{env}.json")
