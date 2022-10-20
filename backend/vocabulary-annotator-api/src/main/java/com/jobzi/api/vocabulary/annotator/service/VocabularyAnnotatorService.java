package com.jobzi.api.vocabulary.annotator.service;

import com.jobzi.api.vocabulary.annotator.core.Annotator;
import com.jobzi.api.vocabulary.annotator.core.annotation.AnnotatedDocument;
import com.jobzi.api.vocabulary.annotator.core.annotation.ReduceGramAnnotation;
import com.jobzi.api.vocabulary.annotator.data.VocabularyAnnotatorRepository;
import com.jobzi.api.vocabulary.annotator.models.MarkUpWebVocabularyTerm;
import com.jobzi.api.vocabulary.annotator.models.ParseRequest;
import com.jobzi.api.vocabulary.annotator.models.TitleField;
import com.jobzi.api.vocabulary.annotator.models.WebVocabularyTerm;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.*;

import static java.util.stream.Collectors.toList;

@Service
public class VocabularyAnnotatorService {

    private Map<Long, WebVocabularyTerm> idVocabularyTermMap = new HashMap<>();
    private Annotator annotator;
    private VocabularyAnnotatorRepository vocabularyRepository;
    private Set<String> stopwords;
    private Map<Long, TitleField> titleFieldMap;

    public VocabularyAnnotatorService(@Qualifier("vocabularyAnnotator") Annotator annotator,
                                      Map<Long, WebVocabularyTerm> idVocabularyTermMap,
                                      VocabularyAnnotatorRepository vocabularyRepository) {
        this.annotator = annotator;
        this.idVocabularyTermMap = idVocabularyTermMap;
        this.vocabularyRepository = vocabularyRepository;
        this.stopwords = vocabularyRepository.getStopWords();
        this.titleFieldMap = vocabularyRepository.getTitleFields();
    }

    /**
     * Extract all vocabulary terms found in a given text and context list
     *
     * @param parseRequest Text and contexts info
     * @return List of vocabulary terms
     */
    public List<MarkUpWebVocabularyTerm> getParseTerms(ParseRequest parseRequest) {

        String toParse = parseRequest.getToParse();
        List<Long> context = parseRequest.getContexts();

        AnnotatedDocument document = new AnnotatedDocument(toParse);
        document = annotator.annotate(document);
        List<ReduceGramAnnotation> annotations = document.getAnnotation(ReduceGramAnnotation.class);

        List<MarkUpWebVocabularyTerm> result = new LinkedList<>();
        for (ReduceGramAnnotation annotation : annotations) {
            for (Long vocabularyTermId : annotation.getVocabularyTerms()) {
                Long vocabularyContext = idVocabularyTermMap.get(vocabularyTermId).context;
                Long standardTermId = idVocabularyTermMap.get(vocabularyTermId).standardTermId;
                result.add(new MarkUpWebVocabularyTerm(annotation.getText(), vocabularyTermId, vocabularyContext,
                        standardTermId, annotation.getPosition(), annotation.getText().length()));
            }
        }

        if (context != null && context.size() > 0) {
            result = result.stream().filter(vocabularyTerm -> context.contains(vocabularyTerm.context)).collect(toList());
        }
        return result;
    }

    /**
     * Return the title field (e.g: IT, Finances, ...) associated with the given term id
     *
     * @param termId Term id
     * @return Title field
     */
    public TitleField getTitleField(Long termId) {
        return titleFieldMap.getOrDefault(termId, TitleField.UNDEFINED);
    }

}
