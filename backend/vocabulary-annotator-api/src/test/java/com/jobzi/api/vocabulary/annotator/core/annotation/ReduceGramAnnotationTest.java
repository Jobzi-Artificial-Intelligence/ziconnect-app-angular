package com.jobzi.api.vocabulary.annotator.core.annotation;

import com.google.common.collect.Sets;
import com.jobzi.api.vocabulary.annotator.core.reduction.Reduction;
import org.junit.Before;
import org.junit.Test;

import java.util.Arrays;

import static org.junit.Assert.*;

public class ReduceGramAnnotationTest {

    private static final String TEXT = "Esto é um exemplo de prova";
    private static final Integer TOKEN_COUNT = 3;
    ReduceGramAnnotation reduceGramAnnotation;

    @Before
    public void setUp() throws Exception {

        // GIVEN
        reduceGramAnnotation = new ReduceGramAnnotation(TEXT, 0, TOKEN_COUNT);

    }

    @Test
    public void getTokenCount() throws Exception {

        // WHEN
        Integer tokenCount = reduceGramAnnotation.getTokenCount();

        // THEN
        assertEquals(TOKEN_COUNT, tokenCount);

    }

    @Test
    public void setTokenCount() throws Exception {

        // WHEN
        Integer expectedTokenCount = 2;
        reduceGramAnnotation.setTokenCount(expectedTokenCount);

        // THEN
        assertEquals(expectedTokenCount, reduceGramAnnotation.getTokenCount());

    }

    @Test
    public void setVocabularyTerms() throws Exception {

        // GIVEN
        ReduceGramAnnotation annotation = new ReduceGramAnnotation("one two", 0, Arrays.asList("one", "two"));

        // WHEN
        annotation.setVocabularyTerms(Sets.newHashSet(1L, 2L));

        // THEN
        assertEquals(2, annotation.getVocabularyTerms().size());

    }

    @Test
    public void testEqualsWithPointer() throws Exception {

        // GIVEN
        ReduceGramAnnotation pointerReduceGramAnnotation = reduceGramAnnotation;

        // WHEN
        Boolean actual = pointerReduceGramAnnotation.equals(reduceGramAnnotation);

        // THEN
        assertTrue(actual);

    }

    @Test
    public void testEqualsOfDifferentObjects() throws Exception {

        // GIVEN
        ReduceGramAnnotation annotation = new ReduceGramAnnotation();

        // WHEN
        Boolean actual = annotation.equals(new Long(1));

        // THEN
        assertFalse(actual);

    }

    @Test
    public void testEqualsOfNull() throws Exception {

        // GIVEN
        ReduceGramAnnotation annotation = new ReduceGramAnnotation();

        // WHEN
        Boolean actual = annotation.equals(null);

        // THEN
        assertFalse(actual);

    }

    @Test
    public void testEqualsOfTrulyEqualsObjects() throws Exception {

        // GIVEN
        ReduceGramAnnotation annotation = new ReduceGramAnnotation("one two", 0, Arrays.asList("one", "two"));
        ReduceGramAnnotation otherAnnotation = new ReduceGramAnnotation("one two", 0, Arrays.asList("one", "two"));

        // WHEN
        Boolean actual = otherAnnotation.equals(annotation);

        // THEN
        assertTrue(actual);

    }

    @Test
    public void setIndex() throws Exception {

        // GIVEN
        ReduceGramAnnotation annotation = new ReduceGramAnnotation();

        // WHEN
        annotation.setIndex(34);

        // THEN
        assertEquals(new Integer(34), annotation.getIndex());

    }

    @Test
    public void hasReduction() throws Exception {

        // GIVEN
        ReduceGramAnnotation annotation = new ReduceGramAnnotation();

        // WHEN
        annotation.setReduction(Reduction.NORMAL, "");

        // THEN
        assertTrue(annotation.hasReduction(Reduction.NORMAL));

    }

    @Test
    public void compareTo() throws Exception {

        // GIVEN
        ReduceGramAnnotation first = new ReduceGramAnnotation();
        first.setPosition(0);
        ReduceGramAnnotation second = new ReduceGramAnnotation();
        second.setPosition(1);

        // WHEN
        Integer actualOrder = first.compareTo(second);

        // THEN
        assertEquals(new Integer(-1), actualOrder);

    }

}