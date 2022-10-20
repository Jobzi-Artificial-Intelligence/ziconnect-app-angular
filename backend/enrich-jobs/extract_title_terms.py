import json
import pandas as pd
import requests

headers = {'Content-Type': 'application/json'}
parse_terms_url = 'http://localhost:50043/vocabulary/parse/list'
def extract_titles_from_texts(texts):
    parse_requests = [{'text': text, 'contexts': [2]} for text in texts]    
    response = requests.post(parse_terms_url, headers=headers, data=json.dumps(parse_requests))
    try:
        response_json = json.loads(response.text)
        return response_json
    except Exception as e:
        print(e)
        return []

title_field_url = 'http://localhost:50043/vocabulary/title-field/list'
def get_title_fields(term_ids): 
    response = requests.post(title_field_url, headers=headers, data=json.dumps(term_ids))
    try:
        response_json = json.loads(response.text)
        return response_json
    except Exception as e:
        print(e)
        return []

# Load job opening information
job_columns = ['id', 'url', 'title', 'description', 'state', 'city', 'latitude', 'longitude']
job_df = pd.read_csv('data/crawled_jobs.csv', sep=',', names=job_columns, encoding='utf-8')

# Extract title term from Job title field
title_terms_list = extract_titles_from_texts(job_df['title'])
title_ids = list({term['id'] for terms in title_terms_list for term in terms})

# Map the title term to its field (e.g: 'IT', 'Finances', ...)
title_fields = get_title_fields(title_ids)
# We are only interest in knowing whether the job opening is related to the IT field
it_title_ids = {title_id for title_id, field_id in title_fields.items() if field_id == 1}

# Put title information in a dataframe
extracted_titles = [(terms[0]['id'], terms[0]['term']) if terms else () for terms in title_terms_list]
extracted_title_df = pd.DataFrame(extracted_titles, columns=['title_term_id', 'title_term'])

# Concatenate new information
concated_df = pd.concat([job_df, extracted_title_df], axis=1)
concated_df['is_it_title'] = concated_df['title_term_id'].isin(it_title_ids)
concated_df.to_csv('data/enriched_crawled_jobs.csv', index=False, encoding='utf-8')