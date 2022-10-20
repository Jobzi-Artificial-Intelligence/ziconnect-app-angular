package com.jobzi.api.vocabulary.annotator.core;

import com.jobzi.api.vocabulary.annotator.core.annotation.AnnotatedDocument;
import com.jobzi.api.vocabulary.annotator.core.annotation.ReduceGramAnnotation;
import com.jobzi.api.vocabulary.annotator.models.VocabularyContext;
import com.jobzi.api.vocabulary.annotator.models.VocabularyTerm;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import java.util.*;

public class TitleVocabularyTermAnnotatorTest {

    private String text;
    private VocabularyTerm example;
    private Set<VocabularyTerm> terms;

    @Before
    public void setUp() throws Exception {
        text = "Esto é um exemplo de prova";
        example = new VocabularyTerm(1, "exempl de", "exemplo de", VocabularyContext.JOB_TITLES_COMPLETE, null);
        terms = new HashSet<>(Collections.singletonList(example));
    }

    @Test
    public void annotate() throws Exception {

        // GIVEN
        AnnotatedDocument document = new AnnotatedDocument(text);
        VocabularyTermAnnotator annotator = new TitleVocabularyTermAnnotator(terms);

        // WHEN
        AnnotatedDocument annotatedDocument = annotator.annotate(document);

        // THEN
        List<ReduceGramAnnotation> annotations = annotatedDocument.getAnnotation(ReduceGramAnnotation.class);
        List<Long> ids = new LinkedList<>();
        for (ReduceGramAnnotation annotation : annotations) {
            ids.addAll(annotation.getVocabularyTerms());
        }

        Assert.assertEquals(1, ids.size());
        Assert.assertEquals(new Long(example.getId()), ids.get(0));


    }

}