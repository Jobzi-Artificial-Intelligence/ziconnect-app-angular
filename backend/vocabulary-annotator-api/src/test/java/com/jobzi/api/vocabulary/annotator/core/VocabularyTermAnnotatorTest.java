package com.jobzi.api.vocabulary.annotator.core;

import com.google.common.collect.Sets;
import com.jobzi.api.vocabulary.annotator.core.annotation.AnnotatedDocument;
import com.jobzi.api.vocabulary.annotator.core.annotation.ReduceGramAnnotation;
import com.jobzi.api.vocabulary.annotator.core.reduction.Reduction;
import com.jobzi.api.vocabulary.annotator.models.VocabularyContext;
import com.jobzi.api.vocabulary.annotator.models.VocabularyTerm;
import org.junit.Assert;
import org.junit.Test;

import java.util.*;

public class VocabularyTermAnnotatorTest {

    @Test
    public void annotate() throws Exception {

        // GIVEN
        String text = "Esto é um exemplo de prova";
        AnnotatedDocument document = new AnnotatedDocument(text);
        VocabularyTerm example = new VocabularyTerm(1, "exempl de", "exemplo de", VocabularyContext.JOB_TITLES_COMPLETE, null);
        Set<VocabularyTerm> terms = new HashSet<>(Collections.singletonList(example));
        VocabularyTermAnnotator annotator = new TitleVocabularyTermAnnotator(terms, new ReduceGramAnnotator(Sets.newHashSet(Reduction.TITLE_FINAL)));

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

    @Test
    public void annotatePrefixMultipleTerms() throws Exception {

        // GIVEN
        String text = "Vaga de Vendedor Externo";
        AnnotatedDocument document = new AnnotatedDocument(text);
        VocabularyTerm vocabularyTerm1 = new VocabularyTerm(1, "vendedor extern", "vendedor externo", VocabularyContext.JOB_TITLES_COMPLETE, null);
        VocabularyTerm vocabularyTerm2 = new VocabularyTerm(2, "vendedor", "vendedor", VocabularyContext.JOB_TITLES_COMPLETE, null);
        Set<VocabularyTerm> terms = new HashSet<>(Arrays.asList(vocabularyTerm1, vocabularyTerm2));

        ReduceGramAnnotator reduceGramAnnotator = new ReduceGramAnnotator(Sets.newHashSet(Reduction.TITLE_FINAL));
        reduceGramAnnotator.setMaxGramSize(3);
        reduceGramAnnotator.setMinGramSize(1);
        VocabularyTermAnnotator annotator = new TitleVocabularyTermAnnotator(terms, reduceGramAnnotator);

        // WHEN
        AnnotatedDocument annotatedDocument = annotator.annotate(document);

        // THEN
        List<ReduceGramAnnotation> annotations = annotatedDocument.getAnnotation(ReduceGramAnnotation.class);
        List<Long> ids = new LinkedList<>();
        for (ReduceGramAnnotation annotation : annotations) {
            ids.addAll(annotation.getVocabularyTerms());
        }

        Assert.assertEquals(1, ids.size());
        Assert.assertEquals(new Long(vocabularyTerm1.getId()), ids.get(0));


    }

    @Test
    public void annotateSuffixMultipleTerms() throws Exception {

        // GIVEN
        String text = "Oportunidade para Operador de Caixa";
        AnnotatedDocument document = new AnnotatedDocument(text);
        VocabularyTerm vocabularyTerm1 = new VocabularyTerm(1, "operador caix", "operador caixa", VocabularyContext.JOB_TITLES_COMPLETE, null);
        VocabularyTerm vocabularyTerm2 = new VocabularyTerm(2, "caix", "caixa", VocabularyContext.JOB_TITLES_COMPLETE, null);
        Set<VocabularyTerm> terms = new HashSet<>(Arrays.asList(vocabularyTerm1, vocabularyTerm2));

        ReduceGramAnnotator reduceGramAnnotator = new ReduceGramAnnotator(Sets.newHashSet(Reduction.TITLE_FINAL), Sets.newHashSet("de"));
        reduceGramAnnotator.setMaxGramSize(3);
        reduceGramAnnotator.setMinGramSize(1);
        VocabularyTermAnnotator annotator = new TitleVocabularyTermAnnotator(terms, reduceGramAnnotator);

        // WHEN
        AnnotatedDocument annotatedDocument = annotator.annotate(document);

        // THEN
        List<ReduceGramAnnotation> annotations = annotatedDocument.getAnnotation(ReduceGramAnnotation.class);
        List<Long> ids = new LinkedList<>();
        for (ReduceGramAnnotation annotation : annotations) {
            ids.addAll(annotation.getVocabularyTerms());
        }

        Assert.assertEquals(1, ids.size());
        Assert.assertEquals(new Long(vocabularyTerm1.getId()), ids.get(0));


    }

    @Test
    public void annotateOtherExamples() throws Exception {

        // GIVEN
        String text = "Vaga para Operador de Telemarketing Ativo";
        AnnotatedDocument document = new AnnotatedDocument(text);
        VocabularyTerm vocabularyTerm1 = new VocabularyTerm(1, "operador telemarketing", "gerente de manutencão", VocabularyContext.JOB_TITLES_COMPLETE, null);
        VocabularyTerm vocabularyTerm2 = new VocabularyTerm(2, "operador telemarketing ativ", "gerente", VocabularyContext.JOB_TITLES_COMPLETE, null);
        VocabularyTerm vocabularyTerm3 = new VocabularyTerm(3, "ativ", "manutencão", VocabularyContext.JOB_TITLES_COMPLETE, null);
        Set<VocabularyTerm> terms = new HashSet<>(Arrays.asList(vocabularyTerm1, vocabularyTerm2, vocabularyTerm3));
        ReduceGramAnnotator reduceGramAnnotator = new ReduceGramAnnotator(Sets.newHashSet(Reduction.TITLE_FINAL), Sets.newHashSet("de"));
        reduceGramAnnotator.setMaxGramSize(4);
        reduceGramAnnotator.setMinGramSize(1);
        VocabularyTermAnnotator annotator = new TitleVocabularyTermAnnotator(terms, reduceGramAnnotator);


        // WHEN
        AnnotatedDocument annotatedDocument = annotator.annotate(document);

        // THEN
        List<ReduceGramAnnotation> annotations = annotatedDocument.getAnnotation(ReduceGramAnnotation.class);
        List<Long> ids = new LinkedList<>();
        for (ReduceGramAnnotation annotation : annotations) {
            ids.addAll(annotation.getVocabularyTerms());
        }

        Assert.assertEquals(1, ids.size());
        Assert.assertEquals(new Long(vocabularyTerm2.getId()), ids.get(0));

    }

    @Test
    public void updateOccupiedPositionsForNegativeId() throws Exception {

        // GIVEN
        VocabularyTermAnnotator annotator = new VocabularyTermAnnotator();
        Long negativeId = -1L;
        Set<Integer> occupiedPositions = new HashSet<>();


        // WHEN
        annotator.updateOccupiedPositions(occupiedPositions, new ReduceGramAnnotation(), negativeId);

        // THEN
        Assert.assertTrue(occupiedPositions.isEmpty());

    }

    @Test
    public void updateOccupiedPositions() throws Exception {

        // GIVEN
        VocabularyTermAnnotator annotator = new VocabularyTermAnnotator();
        Long positiveId = 1L;
        Set<Integer> occupiedPositions = new HashSet<>();
        ReduceGramAnnotation annotation = new ReduceGramAnnotation("hello", 0, 0, 3);

        // WHEN
        annotator.updateOccupiedPositions(occupiedPositions, annotation, positiveId);

        // THEN
        Assert.assertEquals(6, occupiedPositions.size());

    }

    @Test
    public void testGenericTermDetector() throws Exception {

        // GIVEN
        Set<VocabularyTerm> terms = Sets.newHashSet(new VocabularyTerm(1L, "auxiliar administrativo", "auxiliar administrativo", VocabularyContext.JOB_TITLES_COMPLETE, null));
        VocabularyTermAnnotator annotator = new VocabularyTermAnnotator(terms, new ReduceGramAnnotator());
        AnnotatedDocument document = new AnnotatedDocument("vaga de auxiliar administrativo. cursando ensino medio");

        // WHEN
        document = annotator.annotate(document);

        // THEN
        List<ReduceGramAnnotation> annotations = document.getAnnotation(ReduceGramAnnotation.class);
        List<Long> vocabularyTermIds = new ArrayList<>();
        for (ReduceGramAnnotation annotation : annotations) {
            vocabularyTermIds.addAll(annotation.getVocabularyTerms());
        }

        Assert.assertEquals(1, vocabularyTermIds.size());
        Assert.assertTrue(vocabularyTermIds.contains(1L));

        vocabularyTermIds.clear();

        ReduceGramAnnotator reduceGramAnnotator = new ReduceGramAnnotator();
        reduceGramAnnotator.setMaxGramSize(7);

        terms = Sets.newHashSet(new VocabularyTerm(2L, "necessario experiencia em empresa de grande porte", "necessario experiencia em empresa de grande porte", VocabularyContext.JOB_TITLES_COMPLETE, null));
        annotator = new VocabularyTermAnnotator(terms, reduceGramAnnotator);
        document = new AnnotatedDocument("É necessário experiência em empresa de grande porte");
        document = annotator.annotate(document);
        annotations = document.getAnnotation(ReduceGramAnnotation.class);
        vocabularyTermIds.clear();
        for (ReduceGramAnnotation annotation : annotations) vocabularyTermIds.addAll(annotation.getVocabularyTerms());
        Assert.assertEquals(1, vocabularyTermIds.size());
        Assert.assertTrue(vocabularyTermIds.contains(2L));

    }
}