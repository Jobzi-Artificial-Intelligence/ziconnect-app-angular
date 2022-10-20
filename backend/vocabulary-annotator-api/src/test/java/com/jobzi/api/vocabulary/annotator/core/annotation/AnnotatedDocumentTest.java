package com.jobzi.api.vocabulary.annotator.core.annotation;

import org.junit.Test;

import java.util.LinkedList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class AnnotatedDocumentTest {

    @Test
    public void setAndGetAnnotation() throws Exception {

        // GIVEN
        AnnotatedDocument annotatedDocument = new AnnotatedDocument("some random text for annotations");
        List<TokenAnnotation> expectedTokenAnnotations = new LinkedList<>();
        expectedTokenAnnotations.add(new TokenAnnotation("confeiteir", 0));

        // WHEN
        annotatedDocument.setAnnotation(TokenAnnotation.class, expectedTokenAnnotations);

        // THEN
        assertEquals(expectedTokenAnnotations, annotatedDocument.getAnnotation(TokenAnnotation.class));

    }

    @Test
    public void getText() throws Exception {

        // GIVEN
        String expectedText = "some random text for annotations";
        AnnotatedDocument annotatedDocument = new AnnotatedDocument(expectedText);

        // WHEN
        String actualText = annotatedDocument.getText();

        // THEN
        assertEquals(expectedText, actualText);

    }

}

