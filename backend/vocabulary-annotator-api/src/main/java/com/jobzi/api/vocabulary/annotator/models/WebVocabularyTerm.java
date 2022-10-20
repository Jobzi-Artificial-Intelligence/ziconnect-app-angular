package com.jobzi.api.vocabulary.annotator.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.HashSet;
import java.util.Objects;

public class WebVocabularyTerm {

    @JsonProperty("term")
    public String term;

    @JsonProperty("id")
    public Long id;

    @JsonProperty("context")
    public Long context;

    @JsonProperty("standard_term_id")
    public Long standardTermId;
    
    public WebVocabularyTerm() {
        this.term = "";
        this.id = 0L;
        this.context = VocabularyContext.UNDEFINED.getId();
        this.standardTermId = 0L;
    }

    public WebVocabularyTerm(String term, Long id, Long context, Long standardTermId) {
        this.term = term;
        this.id = id;
        this.context = context;
        this.standardTermId = standardTermId;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 13 * hash + Objects.hashCode(this.term);
        hash = 13 * hash + Objects.hashCode(this.id);
        hash = 13 * hash + Objects.hashCode(this.context);
        hash = 13 * hash + Objects.hashCode(this.standardTermId);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final WebVocabularyTerm other = (WebVocabularyTerm) obj;
        if (!Objects.equals(this.term, other.term)) {
            return false;
        }
        if (!Objects.equals(this.id, other.id)) {
            return false;
        }
        if (!Objects.equals(this.context, other.context)) {
            return false;
        }
        if (!Objects.equals(this.standardTermId, other.standardTermId)) {
            return false;
        }
        return true;
    }


    public static class WebVocabularyTermSet extends HashSet<WebVocabularyTerm> {
        private static final long serialVersionUID = 42;
    }

    public static class LongSet extends HashSet<Long> {
        private static final long serialVersionUID = 42;
    }
}
