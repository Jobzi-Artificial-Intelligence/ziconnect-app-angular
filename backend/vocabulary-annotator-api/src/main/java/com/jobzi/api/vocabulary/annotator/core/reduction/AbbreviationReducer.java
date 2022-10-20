package com.jobzi.api.vocabulary.annotator.core.reduction;

import com.jobzi.api.vocabulary.annotator.core.annotation.TokenAnnotation;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class AbbreviationReducer extends TokenReducer {

    private Map<String, String> abbreviationsMapping;
    private Pattern abbreviationsPattern;
    private Reduction reduction;

    public AbbreviationReducer(Reduction reduction) {
        buildAbbreviationsMapping(Collections.emptyMap());
        this.reduction = reduction;
        this.abbreviationsPattern = buildPattern(Collections.emptyMap());
    }

    public AbbreviationReducer(Map<String, String> abbreviationsMapping, Reduction reduction) {
        buildAbbreviationsMapping(abbreviationsMapping);
        this.abbreviationsPattern = buildPattern(abbreviationsMapping);
        this.reduction = reduction;
    }

    protected void buildAbbreviationsMapping(Map<String, String> abbreviationsMapping) {
        this.abbreviationsMapping = new HashMap<>();
        for (Map.Entry<String, String> entry : abbreviationsMapping.entrySet()) {
            String value = " " + entry.getValue() + " ";
            this.abbreviationsMapping.put(entry.getKey(), value);
        }
    }

    protected String normalizeAbbreviations(String text) {

        StringBuffer buffer = new StringBuffer();
        Matcher matcher = abbreviationsPattern.matcher(" " + text + " ");
        while(matcher.find()){
            String key = matcher.group().trim().toLowerCase(Locale.getDefault());
            matcher.appendReplacement(buffer, abbreviationsMapping.get(key));
        }

        matcher.appendTail(buffer);
        return buffer.toString().trim();

    }

    /**
     * Whether text is an abbreviation
     *
     * @param text Text string
     * @return Boolean indicating whether the text is an abbreviation
     */
    public boolean matchAbbreviation(String text) {

        if(abbreviationsMapping.isEmpty()) return false;

        Matcher matcher = abbreviationsPattern.matcher(" " + text + " ");
        return matcher.find();
    }

    /**
     * Expand all abbreviations
     *
     * @param token Token annotation
     */
    public void reduce(TokenAnnotation token) {

        if(abbreviationsMapping.isEmpty()) {
            token.setReduction(reduction, token.getText());
        } else {
            token.setReduction(reduction, normalizeAbbreviations(token.getText()));
        }

    }

    private static Pattern buildPattern(Map<String, String> abbreviationsMapping) {
        Set<String> elements = abbreviationsMapping.keySet().stream()
                .map(s -> Pattern.quote(" " + s + " ")).collect(Collectors.toSet());
        String regex = String.join("|", elements);
        return Pattern.compile(regex, Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);
    }

}
