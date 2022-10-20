package com.jobzi.api.vocabulary.annotator.core.reduction;

import com.jobzi.api.vocabulary.annotator.core.annotation.TokenAnnotation;
import org.junit.Assert;
import org.junit.Test;

import java.text.Normalizer;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class TitleTokenReducerTest {

    private Map<String, String> abbreviations;
    private Map<String, String> synonyms;

    @Test
    public void removeGenderSpecificLetters() throws Exception {

        // GIVEN
        TitleTokenReducer titleTokenReducer = new TitleTokenReducer();
        String messyWord = "estagio(a)";
        String expected = "estagio";

        // WHEN
        String actual = titleTokenReducer.removeGenderSpecificLetters(messyWord);


        // THEN
        assertEquals(expected, actual);

    }

    @Test
    public void reduce() throws Exception {

        // GIVEN
        String expectedReduction = Normalizer.normalize("administraç", Normalizer.Form.NFC);
        TitleTokenReducer reducer = new TitleTokenReducer();
        AbbreviationReducer abbreviationReducer = new AbbreviationReducer(Reduction.TITLE_NO_ABBREVIATION);
        TokenAnnotation annotation = new TokenAnnotation("Administração", 0);
        abbreviationReducer.reduce(annotation);

        // WHEN
        reducer.reduce(annotation);

        // THEN
        assertTrue(annotation.hasReduction(Reduction.TITLE_FINAL));
        assertEquals(expectedReduction, annotation.getReduction(Reduction.TITLE_FINAL));

    }

    @Test
    public void reduceWithAllSteps() throws Exception {

        // GIVEN
        String messyWord = "estagiario(a)";
        String expectedReduction = "estagi";
        AbbreviationReducer abbreviationReducer = new AbbreviationReducer(Reduction.TITLE_NO_ABBREVIATION);
        TokenAnnotation annotation = new TokenAnnotation(messyWord, 0);
        abbreviationReducer.reduce(annotation);

        abbreviations = new HashMap<>();
        abbreviations.put("tec", "tecnico");

        synonyms = new HashMap<>();
        synonyms.put("estagiari", "estagi");
        synonyms.put("zelador", "porteiro");

        TitleTokenReducer titleTokenReducer = new TitleTokenReducer(synonyms);

        // WHEN
        titleTokenReducer.reduce(annotation);

        // THEN
        assertEquals(expectedReduction, annotation.getReduction(Reduction.TITLE_FINAL));

    }

    @Test
    public void normalizeWithTilde() throws Exception {
        // GIVEN
        String input = "administração";
        String expected = Normalizer.normalize("administraçao", Normalizer.Form.NFC);
        TitleTokenReducer reducer = new TitleTokenReducer(Collections.emptyMap());

        // WHEN
        String output = reducer.normalize(input);

        // THEN
        Assert.assertEquals(expected, output);

    }

    @Test
    public void normalizeWithCircumflex() throws Exception {
        // GIVEN
        String input = "administrâçao";
        String expected = Normalizer.normalize("administraçao", Normalizer.Form.NFC);
        TitleTokenReducer reducer = new TitleTokenReducer(Collections.emptyMap());

        // WHEN
        String output = reducer.normalize(input);

        // THEN
        Assert.assertEquals(expected, output);

    }

}