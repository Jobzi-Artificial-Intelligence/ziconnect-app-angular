package com.jobzi.api.vocabulary.annotator.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;

public class ParseRequest {

    @JsonProperty("text")
    public String toParse;

    @JsonProperty("contexts")
    public ContextList contexts;

    public ParseRequest() {
        this.toParse = "";
        this.contexts = new ContextList();
    }

    public ParseRequest(String toParse, ContextList contexts) {
        this.toParse = toParse;
        this.contexts = contexts;
    }

    public String getToParse() {
        return toParse;
    }

    public ContextList getContexts() {
        return contexts;
    }

    public static class ContextList extends ArrayList<Long> {

        private static final long serialVersionUID = 42;


    }

}
