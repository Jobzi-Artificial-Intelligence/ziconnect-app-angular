package com.jobzi.api.vocabulary.annotator.core;

import com.google.common.collect.Sets;
import com.jobzi.api.vocabulary.annotator.core.annotation.AnnotatedDocument;
import com.jobzi.api.vocabulary.annotator.core.annotation.ReduceGramAnnotation;
import com.jobzi.api.vocabulary.annotator.core.annotation.TokenAnnotation;
import com.jobzi.api.vocabulary.annotator.core.reduction.NormalTokenReducer;
import com.jobzi.api.vocabulary.annotator.core.reduction.Reduction;
import org.junit.Test;

import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;

import static java.util.stream.Collectors.toList;
import static org.junit.Assert.assertEquals;

public class ReduceGramAnnotatorTest {

    @Test
    public void getMaxGramSize() throws Exception {

        // GIVEN
        ReduceGramAnnotator annotator = new ReduceGramAnnotator();
        Integer expectedMaxGramSize = 2;

        // WHEN
        Integer actualMaxGramSize = annotator.getMaxGramSize();

        // THEN
        assertEquals(expectedMaxGramSize, actualMaxGramSize);


    }

    @Test
    public void setMaxGramSize() throws Exception {

        // GIVEN
        Integer expectedMaxGramSize = 4;
        ReduceGramAnnotator annotator = new ReduceGramAnnotator();
        annotator.setMaxGramSize(expectedMaxGramSize);

        // WHEN
        Integer actualMaxGramSize = annotator.getMaxGramSize();

        // THEN
        assertEquals(expectedMaxGramSize, actualMaxGramSize);

    }

    @Test
    public void getMinGramSize() throws Exception {

        // GIVEN
        ReduceGramAnnotator annotator = new ReduceGramAnnotator();
        Integer expectedMinGramSize = 2;

        // WHEN
        Integer actualMinGramSize = annotator.getMinGramSize();

        // THEN
        assertEquals(expectedMinGramSize, actualMinGramSize);

    }

    @Test
    public void setMinGramSize() throws Exception {

        // GIVEN
        Integer expectedMinGramSize = 4;
        ReduceGramAnnotator annotator = new ReduceGramAnnotator();
        annotator.setMinGramSize(expectedMinGramSize);

        // WHEN
        Integer actualMinGramSize = annotator.getMinGramSize();

        // THEN
        assertEquals(expectedMinGramSize, actualMinGramSize);

    }

    @Test
    public void makeGrams() throws Exception {

        // GIVEN
        String text = "Vaga para Vendedor Externo";
        ReduceGramAnnotator annotator = new ReduceGramAnnotator();
        AnnotatedDocument document = new AnnotatedDocument(text);
        (new TokenAnnotator()).annotate(document);
        List<Integer> expectedTokenCounts = Arrays.asList(2, 2, 2);
        List<String> expectedTexts = Arrays.asList("Vaga para", "para Vendedor", "Vendedor Externo");

        // WHEN
        List<ReduceGramAnnotation> annotations = annotator.makeGrams(document.getAnnotation(TokenAnnotation.class), text);

        // THEN
        List<Integer> actualTokenCounts = annotations.stream().map(annotation -> annotation.getTokenCount()).collect(toList());
        assertEquals(expectedTokenCounts, actualTokenCounts);

        List<String> actualTexts = annotations.stream().map(annotation -> annotation.getText()).collect(toList());
        assertEquals(expectedTexts, actualTexts);

    }

    @Test
    public void makeGramsDifferentGramSizes() throws Exception {

        // GIVEN
        String text = "Vaga para Vendedor Externo";
        ReduceGramAnnotator annotator = new ReduceGramAnnotator();
        annotator.setMinGramSize(1);
        annotator.setMaxGramSize(3);

        AnnotatedDocument document = new AnnotatedDocument(text);
        (new TokenAnnotator()).annotate(document);

        List<String> expectedTextOfLength13 = Arrays.asList("Vaga para Vendedor", "Vaga para", "Vaga", "para Vendedor Externo",
                "para Vendedor", "para", "Vendedor Externo", "Vendedor", "Externo");

        // WHEN
        List<ReduceGramAnnotation> annotations = annotator.makeGrams(document.getAnnotation(TokenAnnotation.class), text);

        // THEN
        List<String> actualTextOfLength13 = annotations.stream().map(annotation -> annotation.getText()).collect(toList());
        assertEquals(expectedTextOfLength13, actualTextOfLength13);

    }

    @Test
    public void makeGramSomeOtherGramSizes() throws Exception {

        // GIVEN
        String text = "Vaga para Vendedor Externo";
        ReduceGramAnnotator annotator = new ReduceGramAnnotator();
        annotator.setMinGramSize(2);
        annotator.setMaxGramSize(3);

        AnnotatedDocument document = new AnnotatedDocument(text);
        (new TokenAnnotator()).annotate(document);

        List<String> expectedTextOfLength23 = Arrays.asList("Vaga para Vendedor", "Vaga para", "para Vendedor Externo",
                "para Vendedor", "Vendedor Externo");

        // WHEN
        List<ReduceGramAnnotation> annotations = annotator.makeGrams(document.getAnnotation(TokenAnnotation.class), text);

        // THEN
        List<String> actualTextOfLength23 = annotations.stream().map(annotation -> annotation.getText()).collect(toList());
        assertEquals(expectedTextOfLength23, actualTextOfLength23);

    }

    @Test
    public void getGramText() throws Exception {

        // GIVEN
        String text = "Vaga para Vendedor Externo";
        ReduceGramAnnotator annotator = new ReduceGramAnnotator();
        annotator.setMinGramSize(2);
        annotator.setMaxGramSize(3);

        AnnotatedDocument document = new AnnotatedDocument(text);
        (new TokenAnnotator()).annotate(document);

        // WHEN
        List<TokenAnnotation> tokenAnnotations = document.getAnnotation(TokenAnnotation.class);
        String actualGramText = annotator.getGramText(text, tokenAnnotations.get(0), tokenAnnotations.get(1));

        // THEN
        assertEquals("Vaga para", actualGramText);


    }

    @Test
    public void annotate() throws Exception {

        // GIVEN
        String text = "Este é um exemplo de prova";
        AnnotatedDocument document = new AnnotatedDocument(text);
        ReduceGramAnnotator annotator = new ReduceGramAnnotator(Sets.newHashSet(Reduction.TITLE_FINAL));
        List<String> expectedReductions = Arrays.asList("este e", "e um", "um exempl", "exempl de", "de prov");

        // WHEN
        AnnotatedDocument annotatedDocument = annotator.annotate(document);

        // THEN
        List<ReduceGramAnnotation> annotations = annotatedDocument.getAnnotation(ReduceGramAnnotation.class);
        List<String> actualReductions = new LinkedList<>();
        for (ReduceGramAnnotation annotation : annotations) {
            String reduction = String.join(" ", annotation.getReduction(Reduction.TITLE_FINAL));
            actualReductions.add(reduction);
        }
        assertEquals(expectedReductions, actualReductions);


    }

    @Test
    public void annotateWithConsecutivePunctuation() throws Exception {

        // GIVEN
        String expectedText = "realizando gestão";
        String text = "), realizando gestão e supervisão geral dos setores de frigobar";
        AnnotatedDocument document = new AnnotatedDocument(text);
        ReduceGramAnnotator annotator = new ReduceGramAnnotator(Sets.newHashSet(Reduction.TITLE_FINAL));
        annotator.setMinGramSize(1);
        annotator.setMaxGramSize(3);

        // WHEN
        document = annotator.annotate(document);
        List<ReduceGramAnnotation> annotations = document.getAnnotation(ReduceGramAnnotation.class);
        String actualText = annotations.get(1).getText();

        // THEN
        assertEquals(expectedText, actualText);

    }

}