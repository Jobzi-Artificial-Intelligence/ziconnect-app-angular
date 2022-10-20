package com.jobzi.api.vocabulary.annotator.config;

import com.jobzi.api.vocabulary.annotator.data.*;
import com.jobzi.api.vocabulary.annotator.core.*;
import com.jobzi.api.vocabulary.annotator.models.VocabularyContext;
import com.jobzi.api.vocabulary.annotator.models.VocabularyTerm;
import com.jobzi.api.vocabulary.annotator.models.WebVocabularyTerm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.*;

@Configuration
public class VocabularyApplicationConfig {

    private static Logger logger = LoggerFactory.getLogger(VocabularyApplicationConfig.class);

    @Bean
    public VocabularyAnnotatorRepository getVocabularyAnnotatorRepository() {
        logger.info("Calling getVocabularyRepository Bean method");
        return new VocabularyAnnotatorRepository();
    }

    @Bean
    public AnnotatorBuilder getAnnotatorBuilder() {
        logger.info("Calling getAnnotatorBuilder Bean method");
        return new AnnotatorBuilder(getVocabularyAnnotatorRepository());
    }

    @Bean
    public ReduceGramAnnotator getReduceGramAnnotator() {
        logger.info("Calling getReduceGramAnnotator Bean method");
        return getAnnotatorBuilder().build(ReduceGramAnnotator.class);
    }

    @Bean
    public VocabularyTermAnnotator getVocabularyTermAnnotator() {
        logger.info("Calling getVocabularyTermAnnotator Bean method");
        return getAnnotatorBuilder().build(VocabularyTermAnnotator.class);
    }

    @Bean
    public TitleVocabularyTermAnnotator getTitleVocabularyTermAnnotator() {
        logger.info("Calling getTitleVocabularyTermAnnotator Bean method");
        return getAnnotatorBuilder().build(TitleVocabularyTermAnnotator.class);
    }

    @Bean(name = "vocabularyAnnotator")
    public Annotator getVocabularyAnnotator() {
        logger.info("Calling getVocabularyAnnotator Bean method");
        return new AnnotatorPipeline(Arrays.asList(getReduceGramAnnotator(), getTitleVocabularyTermAnnotator(),
                getVocabularyTermAnnotator()));
    }

    @Bean
    public Map<Long, WebVocabularyTerm> getIdVocabularyTermMap() {
        logger.info("Calling getIdVocabularyTermMap Bean method");
        Map<Long, WebVocabularyTerm> result = new HashMap<>();
        for (VocabularyTerm vocabularyTerm : getVocabularyAnnotatorRepository().getAll(false)) {
            result.put(vocabularyTerm.getId(),
                    new WebVocabularyTerm(
                        vocabularyTerm.getProcessedTerm(),
                        vocabularyTerm.getId(),
                        vocabularyTerm.getContext().getId(),
                        vocabularyTerm.getStandardTerm().getId()
                    )
            );
        }
        return result;
    }

    @Bean
    public Map<Long, VocabularyContext> getContextMap() {
        logger.info("Calling getContextMap Bean method");
        Map<Long, VocabularyContext> result = new HashMap<>();
        for (VocabularyTerm vocabularyTerm : getVocabularyAnnotatorRepository().getAll(false)) {
            result.put(vocabularyTerm.getId(), vocabularyTerm.getContext());
        }
        return result;
    }

    @Bean
    public Map<Long, String> getDisplayNameMap() {
        logger.info("Calling getContextMap Bean method");
        Map<Long, String> result = new HashMap<>();
        for (VocabularyTerm vocabularyTerm : getVocabularyAnnotatorRepository().getAll(false)) {
            result.put(vocabularyTerm.getId(), vocabularyTerm.getDisplayName());
        }
        return result;
    }

}
