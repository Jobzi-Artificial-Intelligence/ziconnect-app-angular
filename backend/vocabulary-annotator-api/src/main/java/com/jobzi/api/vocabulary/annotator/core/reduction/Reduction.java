package com.jobzi.api.vocabulary.annotator.core.reduction;

public enum Reduction {
    NORMAL, TITLE_NO_ABBREVIATION, TITLE_FINAL;

    public static TokenReducer getReducer(Reduction reduction) {
        switch (reduction){
            case TITLE_FINAL:
                return new TitleTokenReducer();
            default:
                return new NormalTokenReducer();
        }
    }

}
