package com.jobzi.api.vocabulary.annotator.core;


import com.jobzi.api.vocabulary.annotator.core.annotation.AnnotatedDocument;
import com.jobzi.api.vocabulary.annotator.core.annotation.ReduceGramAnnotation;
import com.jobzi.api.vocabulary.annotator.models.VocabularyTerm;
import com.jobzi.api.vocabulary.annotator.core.reduction.Reduction;

import java.util.*;
import java.util.stream.IntStream;

import static java.util.stream.Collectors.toList;

public class VocabularyTermAnnotator implements Annotator {

    protected Reduction reduction;
    protected ReduceGramAnnotator reduceGramAnnotator;
    protected Map<String, Long> termsIdsMap;

    public VocabularyTermAnnotator() {
        termsIdsMap = new HashMap<>();
        reduceGramAnnotator = new ReduceGramAnnotator();
    }

    public VocabularyTermAnnotator(Set<VocabularyTerm> terms) {
        setTerms(terms);
        this.reduction = Reduction.NORMAL;
        this.reduceGramAnnotator = new ReduceGramAnnotator();
    }

    public VocabularyTermAnnotator(Set<VocabularyTerm> terms, ReduceGramAnnotator reduceGramAnnotator) {
        setTerms(terms);
        this.reduceGramAnnotator = reduceGramAnnotator;
        this.reduction = Reduction.NORMAL;

    }

    /**
     * Update objects information:
     * - Mark the [start, end] text positions as occupied
     * - Associate the given term id with the annotation
     *
     * @param occupiedPositions List of text indices currently occupied by annotations
     * @param annotation Text annotation
     * @param id Term id to be associated with the annotation
     */
    protected void updateOccupiedPositions(Set<Integer> occupiedPositions, ReduceGramAnnotation annotation, Long id) {
        if(id > 0 && !occupiedPositions.contains(annotation.getPosition())) {
            annotation.addTerm(id);
            Integer start = annotation.getPosition();
            Integer end = start + annotation.getText().length();
            occupiedPositions.addAll(IntStream.rangeClosed(start, end).boxed().collect(toList()));
        }
    }

    /**
     * Annotate all tokens associated with vocabulary terms
     *
     * @param document Text document to be annotated
     * @return Document with the vocabulary term annotations appended
     */
    @Override
    public AnnotatedDocument annotate(AnnotatedDocument document) {
        if(!document.hasAnnotation(ReduceGramAnnotation.class)){
            document = this.reduceGramAnnotator.annotate(document);
        }
        List<ReduceGramAnnotation> gramAnnotations = document.getAnnotation(ReduceGramAnnotation.class);

        Set<Integer> occupiedPositions = new HashSet<>();
        for (int i = 0; i < gramAnnotations.size(); i++) {
            ReduceGramAnnotation annotation = gramAnnotations.get(i);
            String candidate = annotation.getReduction(reduction);
            if (candidate != null) {
                Long id = termsIdsMap.getOrDefault(candidate, -1L);
                updateOccupiedPositions(occupiedPositions, annotation, id);
            }

        }

        return document;
    }

    public void setTerms(Set<VocabularyTerm> terms) {
        termsIdsMap = new HashMap<>();
        for (VocabularyTerm term : terms) {
            termsIdsMap.put(term.getProcessedTerm(), term.getId());
        }
    }
}
