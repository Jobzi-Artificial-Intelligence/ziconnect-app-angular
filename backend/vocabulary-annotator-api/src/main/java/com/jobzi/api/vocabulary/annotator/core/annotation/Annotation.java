package com.jobzi.api.vocabulary.annotator.core.annotation;


public abstract class Annotation {

    @Override
    public boolean equals(Object obj) {
        // self check
        if (this == obj) return true;

        // null check
        if (obj == null) return false;

        // type check and cast
        return obj.getClass() == this.getClass();

    }

    @Override
    public int hashCode() {
        return super.hashCode();
    }
}
