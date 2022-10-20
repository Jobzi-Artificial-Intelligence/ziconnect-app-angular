package com.jobzi.api.vocabulary.annotator.core;

import com.jobzi.api.vocabulary.annotator.data.VocabularyAnnotatorRepository;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import java.util.ArrayList;
import java.util.HashMap;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class AnnotatorBuilderTest {

    private static VocabularyAnnotatorRepository vocabularyRepository;

    @BeforeClass
    public static void setUp() {
        // GIVEN
        AnnotatorBuilderTest.vocabularyRepository = mock(VocabularyAnnotatorRepository.class);
        when(vocabularyRepository.getAbbreviations()).thenReturn(new HashMap<>());
        when(vocabularyRepository.getSynonyms()).thenReturn(new HashMap<>());
        when(vocabularyRepository.getAll(false)).thenReturn(new ArrayList<>());
    }

    @Test
    public void buildTitleAnnotator() throws Exception {

        // WHEN
        TitleVocabularyTermAnnotator annotator = new AnnotatorBuilder(vocabularyRepository).build(TitleVocabularyTermAnnotator.class);

        // THEN
        Assert.assertTrue(annotator != null);
        Assert.assertTrue(annotator instanceof TitleVocabularyTermAnnotator);
    }

}