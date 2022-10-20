package com.jobzi.api.vocabulary.annotator.core.annotation;

import com.jobzi.api.vocabulary.annotator.core.reduction.Reduction;
import com.jobzi.api.vocabulary.annotator.core.reduction.TokenReductionMap;

import java.util.*;

public class ReduceGramAnnotation extends TextAnnotation implements TokenReductionMap, Comparable<ReduceGramAnnotation> {

    private Integer index;
    private Integer tokenCount;
    private Set<Long> vocabularyTerms;
    private Map<Reduction, String> reductions;

    public ReduceGramAnnotation() {
        super();
        this.index = 0;
        this.tokenCount = 0;
        reductions = new HashMap<>();
        vocabularyTerms = new HashSet<>();

    }

    public ReduceGramAnnotation(String text, Integer position, Integer index, Integer tokenCount) {
        super(text, position);
        this.index = index;
        this.tokenCount = tokenCount;
        reductions = new HashMap<>();
        vocabularyTerms = new HashSet<>();
    }

    public ReduceGramAnnotation(String text, Integer position, Integer tokenCount) {
        super(text, position);
        this.tokenCount = tokenCount;
        reductions = new HashMap<>();
        vocabularyTerms = new HashSet<>();
    }

    public ReduceGramAnnotation(String text, Integer position, List<String> words) {
        super(text, position);
        this.tokenCount = words.size();
        reductions = new HashMap<>();
        vocabularyTerms = new HashSet<>();
        index = 0;
    }

    public ReduceGramAnnotation(String text, Integer position, Integer tokenCount, Set<Long> vocabularyTerms) {
        super(text, position);
        this.tokenCount = tokenCount;
        this.vocabularyTerms = vocabularyTerms;
        reductions = new HashMap<>();
    }

    public Integer getTokenCount() {
        return tokenCount;
    }

    public void setTokenCount(Integer tokenCount) {
        this.tokenCount = tokenCount;
    }

    public Set<Long> getVocabularyTerms() {
        return vocabularyTerms;
    }

    public Map<Reduction, String> getReductions() { return reductions; }

    public void setVocabularyTerms(Set<Long> vocabularyTerms) {
        this.vocabularyTerms = vocabularyTerms;
    }

    public void addTerm(Long id) {
        this.vocabularyTerms.add(id);
    }


    @Override
    public int compareTo(ReduceGramAnnotation o) {

        return getPosition().compareTo(o.getPosition());

    }

    public Integer getIndex() {
        return index;
    }

    public void setIndex(Integer index) {
        this.index = index;
    }

    @Override
    public String getReduction(Reduction reductionType) {
        return reductions.get(reductionType);
    }

    @Override
    public void setReduction(Reduction reductionType, String reduction) {
        reductions.put(reductionType, reduction);
    }

    @Override
    public boolean hasReduction(Reduction reductionType) {
        return reductions.containsKey(reductionType);
    }

    @Override
    public int hashCode() {
        return Objects.hash(index, tokenCount, reductions, vocabularyTerms, getText(), getPosition());
    }

    @Override
    public boolean equals(Object obj) {

        // null check
        if(obj == null) return false;

        // self reference check
        if(this == obj) return true;

        // class check
        if(obj.getClass() != this.getClass()) return false;

        // cast
        ReduceGramAnnotation annotation = (ReduceGramAnnotation) obj;

        // full field check
        return annotation.index.equals(index)
                && annotation.tokenCount.equals(tokenCount)
                && annotation.reductions.equals(reductions)
                && annotation.vocabularyTerms.equals(vocabularyTerms)
                && annotation.getText().equals(getText())
                && annotation.getPosition().equals(getPosition());
    }
}
