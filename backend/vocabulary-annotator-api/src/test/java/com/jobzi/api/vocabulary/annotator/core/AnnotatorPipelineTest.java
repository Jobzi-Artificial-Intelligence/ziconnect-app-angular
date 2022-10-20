package com.jobzi.api.vocabulary.annotator.core;

import com.jobzi.api.vocabulary.annotator.core.annotation.AnnotatedDocument;
import com.jobzi.api.vocabulary.annotator.core.annotation.ReduceGramAnnotation;
import com.jobzi.api.vocabulary.annotator.core.annotation.TokenAnnotation;
import org.junit.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class AnnotatorPipelineTest {
    @Test
    public void getAnnotators() throws Exception {
        // GIVEN
        List<Annotator> expectedAnnotators = Arrays.asList(new TokenAnnotator());
        AnnotatorPipeline pipeline = new AnnotatorPipeline(expectedAnnotators);

        // WHEN
        List<Annotator> actualAnnotators = pipeline.getAnnotators();

        // THEN
        assertEquals(expectedAnnotators, actualAnnotators);
    }

    @Test
    public void setAnnotators() throws Exception {
        // GIVEN
        List<Annotator> expectedAnnotators = Arrays.asList(new TokenAnnotator());
        AnnotatorPipeline pipeline = new AnnotatorPipeline();

        // WHEN
        pipeline.setAnnotators(expectedAnnotators);

        // THEN
        assertEquals(expectedAnnotators, pipeline.getAnnotators());
    }

    @Test
    public void annotate() throws Exception {
        // GIVEN
        String text = "Este é um texto de prova";
        AnnotatedDocument document = new AnnotatedDocument(text);
        List<Annotator> annotators = Arrays.asList(new TokenAnnotator(), new ReduceGramAnnotator());
        AnnotatorPipeline pipeline = new AnnotatorPipeline(annotators);

        // WHEN
        AnnotatedDocument annotatedDocument = pipeline.annotate(document);

        // THEN
        assertTrue(annotatedDocument.hasAnnotation(TokenAnnotation.class));
        assertTrue(annotatedDocument.hasAnnotation(ReduceGramAnnotation.class));

    }

}