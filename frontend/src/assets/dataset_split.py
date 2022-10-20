import argparse
import os
import pandas as pd

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Process dataset to send to the Frontend.')
    parser.add_argument('--input', type=str, required=True, help='input filepath')
    parser.add_argument('--output', type=str, required=True, help='output dirpath')

    args = parser.parse_args()
    input_filepath = args.input
    output_dirpath = args.output    

    input_df = pd.read_csv(input_filepath, sep=',', encoding='utf-8')

    basename = os.path.basename(input_filepath)
    filename = os.path.splitext(basename)[0]

    if not os.path.exists(output_dirpath):
        os.makedirs(output_dirpath)

    state_codes = sorted(list(set(input_df['state_code'].values)))
    for state_code in state_codes:
        output_filepath = '{0}/{1}_{2}.csv'.format(output_dirpath, state_code, filename)

        state_df = input_df[input_df['state_code'] == state_code]
        state_df.to_csv(output_filepath, encoding='utf-8', index=False, header=True)
