package com.jobzi.api.vocabulary.annotator.models;

import java.util.HashMap;
import java.util.Map;

public enum TitleField {
    UNDEFINED(0, "undefined"),
    IT(1, "information technology");

    private long id;
    private String name;
    private static Map<Long, TitleField> mapIdToInstance = new HashMap<>();

    static {
        for (TitleField field: TitleField.values()) {
            mapIdToInstance.put(field.getId(), field);
        }
    }

    public static TitleField getFromId(long id) {
        return mapIdToInstance.get(id);
    }

    TitleField(long id, String name) {
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