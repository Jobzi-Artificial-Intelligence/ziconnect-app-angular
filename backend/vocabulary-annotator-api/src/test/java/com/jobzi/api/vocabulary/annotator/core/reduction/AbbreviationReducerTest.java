package com.jobzi.api.vocabulary.annotator.core.reduction;

import com.jobzi.api.vocabulary.annotator.core.annotation.TokenAnnotation;
import org.junit.Test;

import java.util.HashMap;

import static org.junit.Assert.*;


public class AbbreviationReducerTest {

    @Test
    public void normalizeAbbreviations() throws Exception {

        // GIVEN
        HashMap<String, String> abbreviations = new HashMap<>();
        String target = "recursos humanos";
        abbreviations.put("rh.", target);
        AbbreviationReducer abbreviationReducer = new AbbreviationReducer(abbreviations, Reduction.TITLE_NO_ABBREVIATION);

        // WHEN
        String actual = abbreviationReducer.normalizeAbbreviations("rh.");

        // THEN
        assertEquals(target, actual);

    }

    @Test
    public void normalizeAbbreviationsFail() throws Exception {

        // GIVEN
        HashMap<String, String> abbreviations = new HashMap<>();
        String target = "recursos humanos";
        abbreviations.put("rh", target);
        AbbreviationReducer abbreviationReducer = new AbbreviationReducer(abbreviations, Reduction.TITLE_NO_ABBREVIATION);

        // WHEN
        String actual = abbreviationReducer.normalizeAbbreviations("rh.");

        // THEN
        assertNotEquals(target, actual);

    }

    @Test
    public void matchAbbreviation() throws Exception {

        // GIVEN
        HashMap<String, String> abbreviations = new HashMap<>();
        String target = "recursos humanos";
        abbreviations.put("rh.", target);
        AbbreviationReducer reducer = new AbbreviationReducer(abbreviations, Reduction.TITLE_NO_ABBREVIATION);

        // WHEN
        boolean isAbbreviation = reducer.matchAbbreviation("rh.");

        // THEN
        assertTrue(isAbbreviation);

    }

    @Test
    public void reduceNormal() throws Exception {

        // GIVEN
        String expected = "t.i.";
        AbbreviationReducer reducer = new AbbreviationReducer(Reduction.TITLE_NO_ABBREVIATION);
        TokenAnnotation annotation = new TokenAnnotation(expected, 0);

        // WHEN
        reducer.reduce(annotation);

        // THEN
        assertEquals(expected, annotation.getReduction(Reduction.TITLE_NO_ABBREVIATION));

    }

}