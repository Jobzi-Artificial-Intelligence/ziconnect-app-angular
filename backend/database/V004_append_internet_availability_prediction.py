from collections import OrderedDict
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.model_selection import GridSearchCV
from sklearn.model_selection import StratifiedKFold
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder
from typing import Optional, Dict

import argparse
import pandas as pd
import os
import pickle

from db import get_engine
from db import get_schools_plus_ibge 
from db import update_internet_connectivity_prediction

RESOURCES_DIR = "./resourses"
MODEL_NAME = 'final'
PREFIX_MODEL_NAME = f'{MODEL_NAME}'

OUTPUT_COLUMN = 'internet_availability'

class StudentCountEstimator(BaseEstimator, TransformerMixin):
    
    # Columns needed to estimate student count
    LOCALITY_COLUMNS = [
        # 'district_code',
        'municipality_code', 
        'microregion_code',
        'mesoregion_code', 
        'state_code', 
        'region_code',
    ]

    BY_LOCALITY_REGION_TYPE_KEY = 'by=loc+reg+type'
    BY_LOCALITY_REGION_KEY = 'by=loc+reg'
    BY_LOCALITY_KEY = 'by=loc'

    def _generate_counter_map(self,
                              X: pd.DataFrame,
                              column: Optional[str] = None
                             ):
        groupby_columns = [column, 'school_region', 'school_type']

        counter_map = {}
        # School count by locality, school region and school_type
        
        counter_map[self.BY_LOCALITY_REGION_TYPE_KEY] = \
            X.groupby(groupby_columns)['student_count'].median().to_dict()

        # School count by locality and school region
        counter_map[self.BY_LOCALITY_REGION_KEY] = \
            X.groupby(groupby_columns[:2])['student_count'].median().to_dict()

        # School count by locatily
        counter_map[self.BY_LOCALITY_KEY] = \
            X.groupby(groupby_columns[:1])['student_count'].median().to_dict()

        return counter_map

    def fit(self, X: pd.DataFrame, y: pd.Series=None):
        for column in self.LOCALITY_COLUMNS + ['student_count']:
            assert column in X.columns, \
                f"DataFrame does not contain column '{column}'"

        self.locality_counter_maps_ = OrderedDict()
        for column in self.LOCALITY_COLUMNS:
            self.locality_counter_maps_[column] = \
                self._generate_counter_map(X, column)

        return self

    def _get_count(self, row: pd.Series) -> int:
        # Get the "best" approximation possible given school data
        for column, counter_map in self.locality_counter_maps_.items():
            key_values = [row[column],
                          row['school_region'], 
                          row['school_type']]

            key = tuple(key_values)
            if key in counter_map[self.BY_LOCALITY_REGION_TYPE_KEY]:
                return counter_map[self.BY_LOCALITY_REGION_TYPE_KEY][key]

            key = tuple(key_values[:2])
            if key in counter_map[self.BY_LOCALITY_REGION_KEY]:
                return counter_map[self.BY_LOCALITY_REGION_KEY][key]

            key = tuple(key_values[:1])
            if key in counter_map[self.BY_LOCALITY_KEY]:
                return counter_map[self.BY_LOCALITY_KEY][key]

    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        # Compute the student count for each school
        X.loc[:, 'student_count'] = X.apply(self._get_count, axis=1)
        return X


def save_model(model_folder, model_name, model, replace=True):
    exists = os.path.exists(model_folder)
    if not exists:
        os.makedirs(model_folder)
    
    exists = os.path.exists(f'{model_folder}/{model_name}')
    assert (not exists or replace), "A model with that name already exists. " + \
         "Change the model name or set replace to True."
    
    pickle.dump(model, open(f'{model_folder}/{model_name}', 'wb'))


def load_model(model_folder, model_name):
     return pickle.load(open(f'{model_folder}/{model_name}', 'rb'))    


def prepare_data(data: pd.DataFrame, for_train: bool=True):
    """
    Input: dataset with information for predicting internet availaibility
            in Brazilian schools.
    Returns the independent variables used to evaluate the model, as well
            as the dependent variable to be predicted in boolean form.
    """

    input_columns = list(data.columns)
    input_columns.remove(OUTPUT_COLUMN)
    input_data = data[input_columns]
    output_data = None
    if for_train:
        output_data = data[OUTPUT_COLUMN]
        # Since we're applying supervised learning algortihm, we discard 
        # all rows with NA output values
        is_train_rows = ~output_data.isna()        
        input_data = input_data[is_train_rows]

        # Output
        output_data = output_data[is_train_rows]

    # Fix noise values
    # Since we will have to estimate the student_count, it make sense to use 
    # a small count since most school there are few students
    if 'student_count' in input_data.columns:
        input_data.loc[:, 'student_count'] = \
            input_data['student_count'].clip(upper=200)
    
    # Variables used in the models
    # Discriteze categorical variables
    X = input_data
    y = None if output_data is None else output_data.astype(bool)
    return X, y

def get_cv_folds(X, y, k=10):
    """
    Returns the splits of `X` to be used in a stratified (according to the `y`
        variable) k-fold cross-validation scheme.
    """
    skf = StratifiedKFold(n_splits=k)
    return list(skf.split(X, y))

def train(data: pd.DataFrame, model_folder):    
    X, y = prepare_data(data)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, 
        random_state=42, stratify=y)

    num_folds = 10
    cv_folds = get_cv_folds(X_train, y_train, k=num_folds)

    # After an extensive experimentation, these were the variables choosen
    continuous_columns = ['latitude', 'longitude', 'student_count']
    categorical_columns = ['school_type', 'school_region', 'region_name', 
                           'state_abbreviation', 'mesoregion_name']

    # Normalize the data
    model = Pipeline(steps=[
        ('estimator', StudentCountEstimator()),
        ('selector', ColumnTransformer([
            ('selector', 'passthrough', continuous_columns),
            ('encoder', OneHotEncoder(sparse=False), categorical_columns)
        ], remainder="drop")),
        ('scaler', MinMaxScaler()), 
        ('model', RandomForestClassifier(random_state=0))
    ], verbose=False)

    # Grid Search Parameters
    param_grid = {
        'model__max_depth': [1, 2, 4, 8, 16, 32],
        'model__min_samples_leaf': [5]
    }

    clf_rf = GridSearchCV(estimator=model,
                          param_grid=param_grid,
                          cv=cv_folds,
                          n_jobs=6,
                          verbose=1,
                          scoring=['accuracy'],
                          refit='accuracy',
                          return_train_score=True)

    clf_rf.fit(X_train, y_train)

    cv_results = clf_rf.cv_results_
    best_params = clf_rf.best_params_
    best_index = clf_rf.best_index_
    for fold in range(num_folds):
        print(f'SPLIT #{fold}')
        split_train_accuracy = cv_results[f"split{fold}_train_accuracy"][best_index]
        print(f'Train accuracy: {split_train_accuracy:.4f}')
        split_valid_accuracy = cv_results[f"split{fold}_test_accuracy"][best_index]
        print(f'Valid accuracy: {split_valid_accuracy:.4f}')
        print()
    print(f'CROSS-VALIDATION')
    mean_train_accuracy = cv_results["mean_train_accuracy"][best_index]
    std_train_accuracy = cv_results["std_train_accuracy"][best_index]
    print(f'Train accuracy: {mean_train_accuracy:.4f} ± {std_train_accuracy:.4f}')
    mean_valid_accuracy = cv_results["mean_test_accuracy"][best_index]
    std_valid_accuracy = cv_results["std_test_accuracy"][best_index]
    print(f'Valid accuracy: {mean_valid_accuracy:.4f} ± {std_valid_accuracy:.4f}')
    
    best_model = clf_rf.best_estimator_

    rf_pred = best_model.predict(X_test)
    rf_acc = accuracy_score(y_test, rf_pred)

    #predicting the test data for each model
    rf_pred = best_model.predict(X_test)
    print(f'Test accuracy: {rf_acc:.4f}')
    
    # Finally, retrain the model using all labelled data
    model.set_params(**best_params)
    model = model.fit(X, y)
    save_model(model_folder, f'{PREFIX_MODEL_NAME}_pipeline.pkl', best_model)    

def predict(data: pd.DataFrame, model_folder: str) -> None:
    X, _ = prepare_data(data, for_train=False)    
    assert X.shape[0] == data.shape[0], \
        f"Number of test entries is different! X: {X.shape} | data: {data.shape}"

    # Load all the pipeline (Preprocessing + Model)
    model = load_model(model_folder, f'{PREFIX_MODEL_NAME}_pipeline.pkl')

    # Predict
    return model.predict(X)


def main(db_filepath, model_folder, is_test):
    # Retrieve all school data from Database
    engine = get_engine(db_filepath)
    data = get_schools_plus_ibge(engine)

    # There are a few (~10) schools which we could not infer their locations
    data = data[~data['district_code'].isna()]

    # Guarantee all relevant variables are present
    # We only allow connectivity related variables to be missing since these
    # are the variables we are interest to predict and fill the missing entries
    na_columns = data.columns[data.isna().any()].values
    connectivity_columns = [
        'computer_availability', 'internet_availability', 'internet_speed_mbps'
    ]
    assert (na_columns.size == 0) or (na_columns == connectivity_columns).all()

    if is_test:
        print('PREDICTION STEP')
        data['prediction'] = predict(data, model_folder)
        update_internet_connectivity_prediction(engine, data)
    else:
        print('TRAIN STEP')
        train(data, model_folder)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Script to train a prediction "
        "model for internet connectivity in schools.")
    parser.add_argument('--env', help="Environment to save / load the data. "
                        "Options: 'development', 'production'.", required=False, 
                        default='development', choices=['development', 'production'])
    parser.add_argument('--output', help="Model folder", required=False,
                        default=f'./{RESOURCES_DIR}/connectivity_models/{MODEL_NAME}')
    parser.add_argument('--test', help="Whether to train a new model or load " 
                        "a trained model and predict the connectivity of all "
                        "school in the database.", required=False, 
                        action='store_true')    
    args = parser.parse_args()
    main(f"{RESOURCES_DIR}/{args.env}.json", args.output, args.test)
