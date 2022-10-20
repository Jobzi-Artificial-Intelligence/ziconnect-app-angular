# -*- coding: utf-8 -*-

import numpy as np
import pandas as pd

from geopy import distance
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter

def get_address_info(data, folder):
    """
    Input: Dataframe containing latitude and longitude information (in columns
            named `latitude` and `longitude` respectively)
    Output: the original dataframe with additional columns with the city, state,
            municipality, region, state, state district and postcode of the
            schools in the `data` Dataframe.
    """

    latlong = data.latitude.astype(str) + ',' + data.longitude.astype(str)

    # functions to access OSM reverse geocoding
    locator = Nominatim(user_agent='myAgent', timeout=10)
    rgeocode = RateLimiter(locator.reverse, min_delay_seconds=0.001)

    # retrieve address per school
    address = latlong.progress_apply(rgeocode)
    addresses = pd.DataFrame([i.raw['address'] for i in address])

    # add columns to the `data Dataframe
    for i in ['city', 'state', 'municipality', 'region',
              'state', 'state_district', 'postcode']:
        data[i] = addresses[i]

    return data

def get_distance(c, s):
    """
    Returns the distance (in kilometers) between two sets of (lat,long) values,
    stored in the `name` object of `c` and `s` (usually they should be pandas
    Series).
    """
    return distance.vincenty(s.name.split(','), c.name.split(',')).km

def get_distances(s, data):
    """
    Apply `get_distance` to find the distance between all elements of DataFrame
    `data` and Series `s`.
    """
    return data.apply(get_distance, s=s, axis=1)

def get_all_distances(schools, jobs):
    """
    Input: dataframes with schools and jobs information. Both dataframes should
            have `latitude` and `longitude` columns.
    Output: a dataframe with all the distances between unique school positions
            and unique job positions.
    """

    # retrieve latitude and longitude information from schools and jobs
    latlong_schools = schools.latitude.astype(str) + ',' + schools.longitude.astype(str)
    latlong_jobs = jobs.latitude.astype(str) + ',' + jobs.longitude.astype(str)

    # retrieve unique values of schools and jobs latlong
    unique_latlong_schools = schools.latlong.unique()
    unique_latlong_jobs = latlong_jobs.unique()

    # create dataframe to store the distances between schools and job
    distances = np.zeros((unique_latlong_schools.shape[0],
                      unique_latlong_jobs.shape[0]))
    distances = pd.DataFrame(distances, index=unique_latlong_schools,
                             columns=unique_latlong_jobs)

    # apply the get_distances function to
    distances = distances.apply(get_distances, data=distances)

    return distances
