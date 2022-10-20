package com.jobzi.api.vocabulary.annotator.models;

import java.util.HashMap;
import java.util.Map;

public enum VocabularyContext {
    UNDEFINED(0, "undefined"),
    STOPWORD(1, "stopword"),
    JOB_TITLES_COMPLETE(2, "jobs > titles > complete");

    private long id;
    private String name;
    private static Map<Long, VocabularyContext> mapIdToInstance = new HashMap<>();

    static {
        for (VocabularyContext context : VocabularyContext.values()) {
            mapIdToInstance.put(context.getId(), context);
        }
    }

    public static VocabularyContext getFromId(long id) {
        return mapIdToInstance.get(id);
    }

    VocabularyContext(long id, String name) {
        this.id = id;
        this.name = name;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String toString() {
        return name;
    }

}

