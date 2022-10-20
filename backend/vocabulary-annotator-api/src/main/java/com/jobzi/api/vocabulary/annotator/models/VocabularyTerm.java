package com.jobzi.api.vocabulary.annotator.models;


import com.fasterxml.jackson.annotation.JsonIgnore;

public class VocabularyTerm {

    protected long id;
    protected String displayName;
    protected String processedTerm;
    protected VocabularyTerm standardTerm;
    protected VocabularyContext context;

    public VocabularyTerm() {
        this.id = 0L;
        this.displayName = "";
        this.processedTerm = "";
        this.standardTerm = null;
        this.context = VocabularyContext.UNDEFINED;
    }

    public VocabularyTerm(long id, String processedTerm, String displayName, VocabularyContext context, VocabularyTerm standardTerm) {
        this.id = id;
        this.processedTerm = processedTerm;
        this.displayName = displayName;
        this.context = (context == null ? VocabularyContext.UNDEFINED : context);
        this.standardTerm = standardTerm;
    }

    public long getId() {
        return id;
    }

    public String getProcessedTerm() {
        return processedTerm;
    }

    public VocabularyContext getContext() {
        return context;
    }

    public VocabularyTerm getStandardTerm() {
        return standardTerm == null ? this : standardTerm;
    }

    @Override
    public String toString() {
        return context + ":" + processedTerm;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public boolean equals(Object o) {
        if(!(o instanceof VocabularyTerm)) return false;
        VocabularyTerm t = (VocabularyTerm) o;
        if (processedTerm.equals(t.processedTerm) && context.equals(t.context)) {
            if (t.id > 0 && id > 0 && t.id == id) {
                return true;
            } else if (t.id == 0 && id == 0) {
                if (isStandard() && t.isStandard()) return true;
                if (!isStandard() && !t.isStandard()) return standardTerm.equals(t.standardTerm);
            }
        }
        return false;
    }

    @JsonIgnore
    public boolean isStandard() {
        return standardTerm == null;
    }

    @Override
    public int hashCode() {
        return (context.getName() + ":" + processedTerm).hashCode();
    }
}

