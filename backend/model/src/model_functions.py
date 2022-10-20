# -*- coding: utf-8 -*-

import numpy as np
import pandas as pd
from sklearn.model_selection import StratifiedKFold

def prepare_data(data, for_train=True):
    """
    Input: dataset with information for predicting internet availaibility
            in Brazilian schools.
    Returns the independent variables used to evaluate the model, as well
            as the dependent variable to be predicted in boolean form.
    """
    if for_train:
        ans = data.dropna(subset=['internet_availability']).sample(frac=1)
    else:
        ans = data.copy(deep=True)
    # variables used in the decision tree model
    X_cols = ['latitude', 'longitude', 'dq_score', 'duplicate',
              'student_count', 'school_type', 'school_region',
              'it_jobs_below_50_km', 'has_jobs_below_50_km']
    X = pd.get_dummies(ans[X_cols])
    y = ans['internet_availability'] == 'Yes'
    return X, y


def get_cv_folds(X, y, k=10):
    """
    Returns the splits of `X` to be used in a stratified (according to the `y`
        variable) k-fold cross-validation scheme.
    """
    skf = StratifiedKFold(n_splits=k)
    return list(skf.split(X, y))
