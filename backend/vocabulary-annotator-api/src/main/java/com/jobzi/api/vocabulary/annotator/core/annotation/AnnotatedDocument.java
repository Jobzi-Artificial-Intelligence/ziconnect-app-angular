package com.jobzi.api.vocabulary.annotator.core.annotation;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

public class AnnotatedDocument {

    private String text;
    private Map<Class<? extends Annotation>, List<? extends Annotation>> annotationsMap;

    public AnnotatedDocument(String text) {
        this.text = text;
        annotationsMap = new HashMap<>();
    }

    public <T extends Annotation> void setAnnotation(Class<T> annotationClass, List<T> annotations){
        annotationsMap.put(annotationClass, annotations);
    }

    public <T extends Annotation> List<T> getAnnotation(Class<T> annotationClass){

        List<T> resultAnnotations = new ArrayList<>();
        List<? extends Annotation> annotations = annotationsMap.getOrDefault(annotationClass, Collections.emptyList());

        resultAnnotations.addAll(annotations.stream().map((Function<Annotation, T>) annotationClass::cast).collect(Collectors.toList()));
        return resultAnnotations;
    }

    public <T extends Annotation> Boolean hasAnnotation(Class<T> annotationClass) {
        return annotationsMap.containsKey(annotationClass);
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
