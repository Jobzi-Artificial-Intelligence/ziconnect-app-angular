package com.jobzi.api.vocabulary.annotator.core.reduction;

import org.junit.Before;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class TokenReducerTest {

    private Map<String, String> abbreviations;
    private Map<String, String> synonyms;
    private TokenReducer tokenReducer;

    @Before
    public void setUp() throws Exception {

        synonyms = new HashMap<>();
        synonyms.put("estagiari", "estagi");
        synonyms.put("zelador", "porteiro");

        tokenReducer = new TitleTokenReducer(synonyms);

    }

//    @Test
//    public void unAbbreviate() throws Exception {
//
//        // GIVEN
//        String expected = "tecnico";
//
//        // WHEN
//        String actual = tokenReducer.unAbbreviate("tec");
//
//        // THEN
//        assertEquals(expected, actual);
//
//    }

    @Test
    public void substitute() throws Exception {

        // GIVEN
        String expected = "porteiro";

        // WHEN
        String actual = tokenReducer.substitute("zelador");

        // THEN
        assertEquals(expected, actual);

    }

}