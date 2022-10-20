
# Enrich Jobs script

This is a preprocessing step for the [School Connectivity Predictor](https://bitbucket.org/atlz/unicef/src/master/backend/model/)

## Data

All jobs found on the data directory were crawler by [BigData Corp](https://bigdatacorp.com.br/en/)

## Run

To successfully execute this script, you first need to set up and run the [Vocabulary Annotator API](https://bitbucket.org/atlz/unicef/src/master/backend/vocabulary-annotator-api/). After that, just use the command `python3 extract_title_terms.py` in a console window. The output result should be at `data/enriched_crawled_jobs.csv`
