# -*- coding: utf-8 -*-

def fix_data(schools):
    """
    Input: original schools dataframe with address information retrieved via
    the `get_address_info` function.
    Output: corrected dataframe with regions per state and student_count
            outliers removed.
    """

    # all schools with missing states share the same postcode
    missing_state_postcodes = schools[schools.state.isna()].\
    postcode.dropna().unique()
    missing_state_postcode = missing_state_postcodes[0]

    # fill missing states with state from postcode
    missing_states = schools[schools.postcode==missing_state_postcode].\
    state.dropna().unique()
    missing_state = missing_states[0]
    schools.state.fillna(missing_state, inplace=True)

    # schools from Pará are from region 'Região Nordeste'
    schools.loc[schools.state=='Pará', 'region'] = 'Região Nordeste'

    # schools from Rio Grande do Sul, Santa Catarina or Paraná are from region
    # 'Região Sul'
    schools.loc[(schools.state=='Rio Grande do Sul') |
                (schools.state=='Paraná') |
                (schools.state=='Santa Catarina'),
                'region'] = 'Região Sul'

    # remove studente_count outliers from schools
    schools = schools[schools.student_count < 5000]

    return schools

def get_jobs_it(jobs):
    """
    Input: a job openings dataframe that must contain columns `latitude`,
    `longitude`, and `is_it_title`.
    Output: a dataframe with only the jobs for which `is_it_title` is `True`,
            and with a column `latlong` with the latitude and longitude of the
            job opening separated by a comma.
    """
    jobs_it = jobs[jobs.is_it_title].copy(deep=True)
    jobs_it['latlong'] = jobs_it.latitude.astype(str) + ',' + jobs_it.longitude.astype(str)
    return jobs_it

def get_jobs_info(schools, jobs, distances, km=50):
    """
    Adds two columns to `schools`:
    - The number of job openings from `jobs` that are below `km` distance from
        each school in `schools`.
    - Whether there is at least one job from `jobs` that is no more than `km`
        kilometers away from each school in `schools`.
    """
    schools[f'it_jobs_below_{km}_km'] = \
    (distances < km).T.multiply(jobs.latlong.value_counts(),
                                axis='index').sum().reindex(schools.latlong).values
    schools[f'has_jobs_below_{i}_km'] = schools[f'it_jobs_below_{i}_km'] > 0
