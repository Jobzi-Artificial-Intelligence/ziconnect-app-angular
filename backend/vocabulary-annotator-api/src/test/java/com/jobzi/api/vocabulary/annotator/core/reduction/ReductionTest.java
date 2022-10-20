package com.jobzi.api.vocabulary.annotator.core.reduction;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class ReductionTest {

    @Test
    public void getReducer() throws Exception {

        // WHEN
        TokenReducer reducer = Reduction.getReducer(Reduction.NORMAL);

        // THEN
        assertEquals(reducer.getClass(), NormalTokenReducer.class);

        // WHEN
        reducer = Reduction.getReducer(Reduction.TITLE_FINAL);

        // THEN
        assertEquals(reducer.getClass(), TitleTokenReducer.class);

    }



}