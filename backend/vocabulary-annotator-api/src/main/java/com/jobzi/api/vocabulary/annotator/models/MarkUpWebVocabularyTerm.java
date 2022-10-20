package com.jobzi.api.vocabulary.annotator.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;

public class MarkUpWebVocabularyTerm extends WebVocabularyTerm {

    @JsonProperty
    public Integer position;

    @JsonProperty
    public Integer length;

    public MarkUpWebVocabularyTerm() { }

    public MarkUpWebVocabularyTerm(String term, Long id, Long context, Long standardTermId, Integer position, Integer length) {
        super(term, id, context, standardTermId);
        this.position = position;
        this.length = length;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;

        MarkUpWebVocabularyTerm that = (MarkUpWebVocabularyTerm) o;

        if (!position.equals(that.position)) return false;
        return length.equals(that.length);

    }

    @Override
    public int hashCode() {
        int result = super.hashCode();
        result = 31 * result + position.hashCode();
        result = 31 * result + length.hashCode();
        return result;
    }

    public Integer getPosition() {
        return position;
    }

    public Integer getLength() {
        return length;
    }

    public static class MarkUpWebVocabularyTermSet extends ArrayList<MarkUpWebVocabularyTerm> {
        private static final long serialVersionUID = 42L;
    }

}
