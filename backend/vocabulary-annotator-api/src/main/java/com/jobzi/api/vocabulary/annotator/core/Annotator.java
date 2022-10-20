package com.jobzi.api.vocabulary.annotator.core;


import com.jobzi.api.vocabulary.annotator.core.annotation.AnnotatedDocument;

public interface Annotator {

    /**
     * Append some meta information about the given document
     *
     * @param document Text document to be annotated
     * @return Document with the annotations appended
     */
    AnnotatedDocument annotate(AnnotatedDocument document);
}
