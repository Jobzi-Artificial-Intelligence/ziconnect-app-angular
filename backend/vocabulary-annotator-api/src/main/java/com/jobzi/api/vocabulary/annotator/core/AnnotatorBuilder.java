package com.jobzi.api.vocabulary.annotator.core;

import com.google.common.collect.Sets;
import com.jobzi.api.vocabulary.annotator.data.VocabularyAnnotatorRepository;
import com.jobzi.api.vocabulary.annotator.models.VocabularyContext;
import com.jobzi.api.vocabulary.annotator.models.VocabularyTerm;
import com.jobzi.api.vocabulary.annotator.core.reduction.*;

import java.text.Normalizer;
import java.util.*;
import java.util.stream.Collectors;

public class AnnotatorBuilder {

    private VocabularyAnnotatorRepository vocabularyAnnotatorRepository;

    // Support Data
    private Map<String, String> abbreviations;
    private Map<String, String> synonyms;
    private Set<VocabularyTerm> allVocabularyTerms;
    private Set<VocabularyTerm> titles;
    private Set<VocabularyTerm> genericTerms;
    private Set<String> stopWords;

    // Reducer
    private AbbreviationReducer titleAbbreviationReducer;
    private NormalTokenReducer normalTokenReducer;
    private TitleTokenReducer titleReducer;
    // Annotator
    private ReduceGramAnnotator reduceGramAnnotator;
    private TitleVocabularyTermAnnotator titleAnnotator;
    private VocabularyTermAnnotator genericAnnotator;
    
    
    public AnnotatorBuilder(VocabularyAnnotatorRepository vocabularyAnnotatorRepository) {
        this.vocabularyAnnotatorRepository = vocabularyAnnotatorRepository;
        this.abbreviations = vocabularyAnnotatorRepository.getAbbreviations();
        this.synonyms = vocabularyAnnotatorRepository.getSynonyms();

        // VOCABULARY TERMS
        allVocabularyTerms = new HashSet<>(vocabularyAnnotatorRepository.getAll(false));
        titles = allVocabularyTerms.stream().filter(vt -> vt.getContext().equals(VocabularyContext.JOB_TITLES_COMPLETE)).collect(Collectors.toSet());
        stopWords = allVocabularyTerms.stream().filter(vt -> vt.getContext().equals(VocabularyContext.STOPWORD)).map(VocabularyTerm::getProcessedTerm).collect(Collectors.toSet());
        Set<VocabularyContext> specificContext = new HashSet<>();
        this.genericTerms = allVocabularyTerms.stream().filter(vt -> specificContext.contains(vt.getContext())).collect(Collectors.toSet());

        // REDUCERS
        this.normalTokenReducer = new NormalTokenReducer();
        this.titleAbbreviationReducer = new AbbreviationReducer(vocabularyAnnotatorRepository.getAbbreviations(), Reduction.TITLE_NO_ABBREVIATION);
        this.titleReducer = new TitleTokenReducer(synonyms);

        // ANNOTATORS
        TokenAnnotator tokenAnnotator = new TokenAnnotator(Arrays.asList(normalTokenReducer, titleAbbreviationReducer, titleReducer));
        Set<Reduction> reductions = Sets.newHashSet(Reduction.NORMAL, Reduction.TITLE_FINAL);
        this.reduceGramAnnotator = new ReduceGramAnnotator(reductions, tokenAnnotator, stopWords);
        this.reduceGramAnnotator.setMaxGramSize(7);
        this.reduceGramAnnotator.setMinGramSize(1);
        Set<VocabularyTerm> processedTitles = titles.stream().map(AnnotatorBuilder::normalizeTerm).collect(Collectors.toSet());
        this.titleAnnotator = new TitleVocabularyTermAnnotator(processedTitles, reduceGramAnnotator);
        this.genericAnnotator = new VocabularyTermAnnotator(genericTerms, reduceGramAnnotator);
    }

    public <T extends Annotator> T build(Class<T> annotatorClass) {
        String annotatorClassString = annotatorClass.toString();
        if (annotatorClassString.equalsIgnoreCase(ReduceGramAnnotator.class.toString())) {
            return (T) reduceGramAnnotator;
        } else if (annotatorClassString.equalsIgnoreCase(TitleVocabularyTermAnnotator.class.toString())) {
            return (T) titleAnnotator;
        } else {
            return (T) genericAnnotator;
        }
    }

    public static VocabularyTerm normalizeTerm(VocabularyTerm vocabularyTerm) {
        return new VocabularyTerm(
                vocabularyTerm.getId(),
                Normalizer.normalize(vocabularyTerm.getProcessedTerm(), Normalizer.Form.NFC),
                vocabularyTerm.getDisplayName(),
                vocabularyTerm.getContext(),
                vocabularyTerm.getStandardTerm()
        );
    }

}
