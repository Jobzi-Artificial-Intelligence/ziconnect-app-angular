package com.jobzi.api.vocabulary.annotator.core;

import com.google.common.collect.Sets;
import com.jobzi.api.vocabulary.annotator.models.VocabularyTerm;
import com.jobzi.api.vocabulary.annotator.core.reduction.Reduction;

import java.util.Set;

public class TitleVocabularyTermAnnotator extends VocabularyTermAnnotator {

    public TitleVocabularyTermAnnotator(Set<VocabularyTerm> terms) {
        super(terms);
        ReduceGramAnnotator reduceGramAnnotator = new ReduceGramAnnotator(Sets.newHashSet(Reduction.TITLE_FINAL));
        this.reduceGramAnnotator = reduceGramAnnotator;
        reduction = Reduction.TITLE_FINAL;
    }

    public TitleVocabularyTermAnnotator(Set<VocabularyTerm> terms, ReduceGramAnnotator reduceGramAnnotator) {
        super(terms, reduceGramAnnotator);
        reduction = Reduction.TITLE_FINAL;
    }


}
