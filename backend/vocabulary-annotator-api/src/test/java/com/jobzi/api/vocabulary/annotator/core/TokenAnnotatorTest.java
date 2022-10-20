package com.jobzi.api.vocabulary.annotator.core;

import com.jobzi.api.vocabulary.annotator.core.annotation.AnnotatedDocument;
import com.jobzi.api.vocabulary.annotator.core.annotation.TokenAnnotation;
import com.jobzi.api.vocabulary.annotator.core.reduction.*;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Pattern;

import static java.util.stream.Collectors.toList;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class TokenAnnotatorTest {

    private TokenAnnotator tokenAnnotator;

    @Before
    public void setUp() throws Exception {
        HashMap<String, String> abbreviations = new HashMap<>();
        abbreviations.put("t.i.", "ti");
        abbreviations.put("t i", "ti");
        abbreviations.put("rh.", "recursos humanos");
        abbreviations.put("r.h.", "recursos humanos");
        abbreviations.put("1/2", "meio");
        abbreviations.put("anl.", "analista");
        abbreviations.put("pl.", "pleno");

        List<TokenReducer> reducers = new ArrayList<>();
        reducers.add(new AbbreviationReducer(abbreviations, Reduction.TITLE_NO_ABBREVIATION));
        reducers.add(new TitleTokenReducer());

        tokenAnnotator = new TokenAnnotator(reducers);

    }

    @Test
    public void annotate() throws Exception {

        // GIVEN
        AnnotatedDocument document = new AnnotatedDocument("Este é um texto de prova");
        TokenAnnotator annotator = new TokenAnnotator();

        // WHEN
        AnnotatedDocument actualDocument = annotator.annotate(document);

        // THEN
        List<TokenAnnotation> annotations = actualDocument.getAnnotation(TokenAnnotation.class);
        annotations.forEach(System.out::println);
        assertEquals(6, annotations.size());

    }

    @Test
    public void annotateWithPunctuation() throws Exception {

        // GIVEN
        AnnotatedDocument document = new AnnotatedDocument(".Este é um texto de prova.");
        List<String> expected = Arrays.asList(".", "Este", "é", "um", "texto", "de", "prova", ".");
        TokenAnnotator annotator = new TokenAnnotator();


        // WHEN
        AnnotatedDocument actualDocument = annotator.annotate(document);

        // THEN
        actualDocument.hasAnnotation(TokenAnnotation.class);
        List<TokenAnnotation> annotations = actualDocument.getAnnotation(TokenAnnotation.class);
        assertEquals(8, annotations.size());

        List<String> tokens = annotations.stream().map(annotation -> annotation.getText()).collect(toList());
        assertEquals(expected, tokens);

    }

    @Test
    public void annotateWithAlternativeConstructor() throws Exception {

        // GIVEN
        AnnotatedDocument document = new AnnotatedDocument("Este é um texto de prova");
        TokenAnnotator annotator = new TokenAnnotator(Pattern.compile("\\S+"));

        // WHEN
        AnnotatedDocument actualDocument = annotator.annotate(document);

        // THEN
        List<TokenAnnotation> annotations = actualDocument.getAnnotation(TokenAnnotation.class);
        assertEquals(6, annotations.size());

    }

    @Test
    public void annotateWithTitleAbbreviationReducer() throws Exception {

        // GIVEN
        String text = "tecnico em t.i. ou areas afins";
        AnnotatedDocument documentToAnnotate = new AnnotatedDocument(text);

        String reference = "ou";
        int expectedOriginalPosition = 16;
        int expectedFinalPosition = 13;

        // WHEN
        tokenAnnotator.annotate(documentToAnnotate);

        // THEN
        checkCorrectnessOfAbbreviationReduction(text, documentToAnnotate, expectedOriginalPosition,
                expectedFinalPosition, reference);
    }

    @Test
    public void annotateWithTitleAbbreviationReducerWithSpace() throws Exception {

        // GIVEN
        String text = "anl. pl. experiencia em";
        AnnotatedDocument document = new AnnotatedDocument(text);
        String reference = "experienci";

        int originalPosition = 9;
        int finalPosition = 13;

        // WHEN
        tokenAnnotator.annotate(document);

        // THEN
        checkCorrectnessOfAbbreviationReduction(text, document, originalPosition, finalPosition, reference);

    }

    @Test
    public void annotateWithOverlappingAbbreviation() throws Exception {

        // GIVEN
        String text = "curso em adm";
        String expectedTitleFinal = "curs em administrativ";
        AnnotatedDocument document = new AnnotatedDocument(text);

        HashMap<String, String> titleAbbreviations = new HashMap<>();
        titleAbbreviations.put("adm", "administrativo");

        List<TokenReducer> reducers = new ArrayList<>();
        reducers.add(new AbbreviationReducer(titleAbbreviations, Reduction.TITLE_NO_ABBREVIATION));
        reducers.add(new TitleTokenReducer());

        TokenAnnotator annotator = new TokenAnnotator(reducers);

        // WHEN
        document = annotator.annotate(document);
        List<TokenAnnotation> annotations = document.getAnnotation(TokenAnnotation.class);

        // THEN
        List<String> titleTokens = new ArrayList<>();
        for (TokenAnnotation annotation : annotations) {
            titleTokens.add(annotation.getReduction(Reduction.TITLE_FINAL));
        }

        String titleFinal = String.join(" ", titleTokens);
        assertEquals(expectedTitleFinal, titleFinal);

    }

    @Test
    public void annotateWithPointInMiddle() throws Exception {

        // GIVEN
        String text = "Management 3.0";
        List<TokenReducer> reducers = Arrays.asList(new AbbreviationReducer(Reduction.TITLE_NO_ABBREVIATION),
                new TitleTokenReducer());
        TokenAnnotator tokenAnnotator = new TokenAnnotator(reducers);
        AnnotatedDocument document = new AnnotatedDocument(text);

        // WHEN
        tokenAnnotator.annotate(document);

        // THEN
        List<TokenAnnotation> tokenAnnotations = document.getAnnotation(TokenAnnotation.class);

        Integer expectedPosition = 0;
        for (TokenAnnotation tokenAnnotation : tokenAnnotations) {
            assertTrue(expectedPosition <= tokenAnnotation.getPosition());
            expectedPosition = tokenAnnotation.getPosition() + tokenAnnotation.getText().length();
        }

    }

    private void checkCorrectnessOfAbbreviationReduction(String text, AnnotatedDocument documentToAnnotate,
                                                         int expectedOriginalPosition,
                                                         int expectedFinalPosition,
                                                         String reference) {

        List<TokenAnnotation> tokens = documentToAnnotate.getAnnotation(TokenAnnotation.class);
        List<String> originalTokenText = new ArrayList<>();
        List<String> finalTokenText = new ArrayList<>();
        for (TokenAnnotation token : tokens) {
            originalTokenText.add(token.getText());
            finalTokenText.add(token.getReduction(Reduction.TITLE_FINAL));
        }

        String originalText = String.join(" ", originalTokenText);
        String finalText = String.join(" ", finalTokenText);

        assertEquals(text, originalText);

        assertEquals(expectedOriginalPosition, originalText.indexOf(reference));
        assertEquals(expectedFinalPosition, finalText.indexOf(reference));

    }


}