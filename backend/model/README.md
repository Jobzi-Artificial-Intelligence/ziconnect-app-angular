# Predicting school connectivity in Brazil

## Getting the data

- The original schools dataset can be found in the `data` folder ([link](https://bitbucket.org/atlz/unicef/src/master/backend/model/data/initial_school_data.csv)). It includes only the latitude and longitude of the schools.
  - The `get_address_info` function from `geo_functions.py` ([link](https://bitbucket.org/atlz/unicef/src/master/backend/model/src/geo_functions.py#lines-10)) uses OpenStreetMap's reverse geocoding service to retrieve address information for all schools. (This can take a while to run.)
  - The `fix_data` function from `data_prep_functions.py` ([link](https://bitbucket.org/atlz/unicef/src/master/backend/model/src/data_prep_functions.py#lines-3)) corrects missing or erroneous information on the state and region of some schools in the dataset, and removes outliers (schools with more than 5,000 students).
- The original job openings dataset is retrieved from our proprietary database using the vocabulary can be found in the `data` folder ([link](https://bitbucket.org/atlz/unicef/src/master/backend/model/data/initial_jobs_data.csv)).
  - The `get_jobs_it` function from `data_prep_functions.py` ([link](https://bitbucket.org/atlz/unicef/src/master/backend/model/src/data_prep_functions.py#lines-37)) retrieves only the job openings for IT positions.
  - The `get_all_distances` function from `geo_functions.py` ([link](https://bitbucket.org/atlz/unicef/src/master/backend/model/src/geo_functions.py#lines-51)) returns a dataframe with the distances between unique positions for job openings and schools.
  - The `get_jobs_info` function from `data_prep_functions.py` ([link](https://bitbucket.org/atlz/unicef/src/master/backend/model/src/data_prep_functions.py#lines-49)) adds to the schools dataset two columns indicating whether (and how many) job openings are at a given distance from each school.
- The augmented schools dataset with address and IT jobs information can be found in the `data` folder ([link](https://bitbucket.org/atlz/unicef/src/master/backend/model/data/input_data.csv)).

## Preparing the data for modeling

The following functions from `model_functions.py` ([link](https://bitbucket.org/atlz/unicef/src/master/backend/model/src/model_functions.py)) are used to prepare the input data for our models:

- `prepare_data` ([link](https://bitbucket.org/atlz/unicef/src/master/backend/model/src/model_functions.py#lines-7)): returns a dataframe with the feature variables used in our initial models and a series with the target variable indicating if the schools are connected to the Internet. Schools with no information regarding internet availability are dropped from the training set, but we keep them for predicting internet availability.
- `get_cv_folds`([link](https://bitbucket.org/atlz/unicef/src/master/backend/model/src/model_functions.py#lines-27)): returns a stratified k-fold of the dataset, used to validate the initial models.

## Modeling

The initial models are available in the `initial_models.ipynb` notebook ([link](https://bitbucket.org/atlz/unicef/src/master/backend/model/notebooks/initial_models.ipynb)). They are:

- a `k`-nearest neighbor model that uses only the schools' location to predict internet availability: the school's internet availability status will be predict as the same status as that of the majority of its `k` neighbors, with `k` being chosen via validation. This model achieves an accuracy score of ~82% on validation data.
- a decision-tree model that uses additional information from our input data, including the number of IT job openings near the school. This model achieves an accuracy score of ~85% on validation data.
