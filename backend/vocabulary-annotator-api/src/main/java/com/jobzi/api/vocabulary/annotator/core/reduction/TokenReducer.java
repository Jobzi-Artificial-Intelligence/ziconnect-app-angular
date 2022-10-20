package com.jobzi.api.vocabulary.annotator.core.reduction;

import com.jobzi.api.vocabulary.annotator.core.annotation.TokenAnnotation;

import java.util.HashMap;
import java.util.Map;

public abstract class TokenReducer {

    protected Map<String, String> synonyms;

    public TokenReducer() {
        synonyms = new HashMap<>();
    }

    /**
     * Apply a sequence of pre-processing rules to the token string
     *
     * @param token Token annotation
     */
    public abstract void reduce(TokenAnnotation token);

    /**
     * Get a synonym for the given token
     *
     * @param text Token string
     * @return Synonym word (or itself if no synonym is found)
     */
    protected String substitute(String text) {
        return synonyms.getOrDefault(text, text);
    }

}
