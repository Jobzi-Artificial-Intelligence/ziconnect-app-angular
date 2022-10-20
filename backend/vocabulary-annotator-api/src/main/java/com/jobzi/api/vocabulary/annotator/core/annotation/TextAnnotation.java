package com.jobzi.api.vocabulary.annotator.core.annotation;

import java.util.Objects;

public class TextAnnotation extends Annotation {

    private String text;
    private Integer position;

    public TextAnnotation() {
        this("", 0);
    }

    public TextAnnotation(String text, Integer position) {
        this.text = text;
        this.position = position;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    @Override
    public boolean equals(Object obj) {
        boolean basicChecks = super.equals(obj);

        if(!basicChecks) return false;

        TextAnnotation other = (TextAnnotation) obj;

        return Objects.equals(other.text, this.text) && Objects.equals(other.position, this.position);

    }

    @Override
    public int hashCode() {
        return Objects.hash(text, position);
    }
}
