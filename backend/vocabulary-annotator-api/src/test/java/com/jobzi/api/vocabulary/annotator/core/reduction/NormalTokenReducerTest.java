package com.jobzi.api.vocabulary.annotator.core.reduction;

import com.jobzi.api.vocabulary.annotator.core.annotation.TokenAnnotation;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class NormalTokenReducerTest {

    @Test
    public void reduce() throws Exception {

        // GIVEN
        NormalTokenReducer reducer = new NormalTokenReducer();
        TokenAnnotation annotation = new TokenAnnotation("Administração", 0);
        String expectedReduction = "administracao";

        // WHEN
        reducer.reduce(annotation);

        // THEN
        assertTrue(annotation.hasReduction(Reduction.NORMAL));
        assertEquals(expectedReduction, annotation.getReduction(Reduction.NORMAL));

    }

}