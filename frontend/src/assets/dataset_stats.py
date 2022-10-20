import argparse
import pandas as pd

def conditional_count(x, label) -> int:
    return sum(i == label for i in x)

def conditional_perc(x, label) -> float:
    return (100 * conditional_count(x, label) / len(x)) if len(x) > 0 else 0

def compute_stats_by_columns(df: pd.DataFrame, columns) -> pd.DataFrame:
    group_df = df.groupby(columns)

    stats_df = group_df.agg(
        byConnectivity_Yes = ('internet_availability', lambda x: conditional_count(x, 'Yes')),
        byConnectivity_No  = ('internet_availability', lambda x: conditional_count(x, 'No')),
        byConnectivity_NA  = ('internet_availability', lambda x: conditional_count(x, 'NA')),

        schoolsConnectedCount      = ('internet_availability', lambda x: conditional_count(x, 'Yes')),
        schoolsConnectedPercentage = ('internet_availability', lambda x: conditional_perc(x, 'Yes')),

        schoolsWithoutConnectivityDataCount      = ('internet_availability', lambda x: conditional_count(x, 'NA')),
        schoolsWithoutConnectivityDataPercentage = ('internet_availability', lambda x: conditional_perc(x, 'NA')),        

        statesCount = ('state_code', lambda x: len(set(x))),
        citiesCount = ('city_code', lambda x: len(set(x))),
        schoolsCount = ('uuid', lambda x: len(set(x))),
        studentCount = ('student_count', 'sum'),
    )

    stats_df['schoolsInternetAvailabilityPredictionCount'] = group_df.apply(lambda x: conditional_count(
        x[x['internet_availability'] == 'NA']['internet_availability_prediction'], 'Yes'))
    stats_df['schoolsInternetAvailabilityPredictionPercentage'] = group_df.apply(lambda x: conditional_perc(
        x[x['internet_availability'] == 'NA']['internet_availability_prediction'], 'Yes'))

    connectivity_options = ['Yes', 'No', 'NA']    

    school_region_options = ['Urban', 'Rural']
    for school_region in school_region_options:
        for connectivity in connectivity_options:        
            label = 'connectivityBySchoolRegion.{0}.{1}'.format(school_region, connectivity)
            stats_df[label] = group_df.apply(lambda x: x[
                (x['school_region'] == school_region) & (x['internet_availability'] == connectivity)
            ].shape[0])

    school_type_options = ['Municipal', 'Estadual', 'Federal']
    for school_type in school_type_options:
        for connectivity in connectivity_options:        
            label = 'connectivityBySchoolType.{0}.{1}'.format(school_type, connectivity)
            stats_df[label] = group_df.apply(lambda x: x[
                (x['school_type'] == school_type) & (x['internet_availability'] == connectivity)
            ].shape[0])

    return stats_df.rename(columns={
        'byConnectivity_Yes': 'byConnectivity.Yes',
        'byConnectivity_No': 'byConnectivity.No',
        'byConnectivity_NA': 'byConnectivity.NA',
    })

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Process dataset to send to the Frontend.')
    parser.add_argument('--input', type=str, required=True, help='input filepath')
    parser.add_argument('--output', type=str, required=True, help='output filepath')

    args = parser.parse_args()
    input_filepath = args.input
    output_filepath = args.output

    input_df = pd.read_csv(input_filepath, sep=',', encoding='utf-8')
    input_df = input_df.fillna('NA')

    groupby_columns = ['region', 'region_code', 'state', 'state_code', 'city', 'city_code']    
    region_df = compute_stats_by_columns(input_df, groupby_columns[:2]).reset_index()
    state_df = compute_stats_by_columns(input_df, groupby_columns[:4]).reset_index()
    city_df = compute_stats_by_columns(input_df, groupby_columns).reset_index()
    
    stats_df = pd.concat([city_df, state_df, region_df]).rename(columns={
        'region': 'regionName',
        'region_code': 'regionCode',
        'state': 'stateName',
        'state_code': 'stateCode',
        'city': 'cityName',
        'city_code': 'cityCode',
    })

    rename_columns = ['regionName', 'regionCode', 'stateName', 'stateCode', 'cityName', 'cityCode']
    stats_df[rename_columns] = stats_df[rename_columns].fillna('')
    stats_df = stats_df.sort_values(rename_columns)

    print(stats_df.iloc[0])
    stats_df.to_csv(output_filepath, encoding='utf-8', index=False, header=True, float_format='%.1f')
