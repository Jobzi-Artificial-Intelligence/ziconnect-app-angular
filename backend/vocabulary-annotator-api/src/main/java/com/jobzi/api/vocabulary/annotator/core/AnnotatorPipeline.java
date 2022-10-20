package com.jobzi.api.vocabulary.annotator.core;

import com.jobzi.api.vocabulary.annotator.core.annotation.AnnotatedDocument;

import java.util.ArrayList;
import java.util.List;

public class AnnotatorPipeline implements Annotator {

    List<Annotator> annotators;

    public AnnotatorPipeline() {
        annotators = new ArrayList<>();
    }

    public AnnotatorPipeline(List<Annotator> annotators) {
        this.annotators = annotators;
    }

    public List<Annotator> getAnnotators() {
        return annotators;
    }

    public void setAnnotators(List<Annotator> annotators) {
        this.annotators = annotators;
    }

    @Override
    public AnnotatedDocument annotate(AnnotatedDocument document) {
        for (int i = 0, annotatorsSize = annotators.size(); i < annotatorsSize; i++) {
            Annotator annotator = annotators.get(i);
            document = annotator.annotate(document);
        }

        return document;
    }
}
