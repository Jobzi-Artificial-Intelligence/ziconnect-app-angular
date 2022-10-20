package com.jobzi.api.vocabulary.annotator.core.reduction;

import com.jobzi.api.vocabulary.annotator.core.annotation.TokenAnnotation;

import java.text.Normalizer;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TitleTokenReducer extends TokenReducer {

    private static final Pattern allowedCharactersPattern = Pattern.compile("(c\\p{M}*+|\\p{ASCII})");
    private static String stripChars = "aeo";
    private static String stripSuffix = "s";
    private StringBuilder buffer;

    public TitleTokenReducer() {
        this.synonyms = new HashMap<>();
        this.buffer = new StringBuilder();
    }

    public TitleTokenReducer(Map<String, String> synonyms) {
        this.synonyms = synonyms;
        this.buffer = new StringBuilder();
    }

    /**
     * Apply a sequence of title pre-processing rules to the token string
     *
     * @param token Token annotation
     */
    @Override
    public void reduce(TokenAnnotation token) {

        if (!token.hasReduction(Reduction.TITLE_NO_ABBREVIATION)) {
            throw new IllegalStateException("TitleTokenReducer must be used after AbbreviationReducer");
        }

        String normal = normalize(token.getReduction(Reduction.TITLE_NO_ABBREVIATION).toLowerCase(Locale.getDefault()));
        normal = removeGenderSpecificLetters(normal);

        int end = normal.length();
        if (normal.length() > 4) {

            if (normal.endsWith(stripSuffix)) {
                end -= 1;
            }

            while (end != 4 && stripChars.indexOf(normal.charAt(end - 1)) != -1) {
                --end;
            }

        }

        token.setReduction(Reduction.TITLE_FINAL, substitute(normal.substring(0, end)));

    }

    /**
     * Removes all accents from letters and with the exception of cedilla on c.
     *
     * @param input String with accentuated characters
     * @return String (UNICODE NFC) with the accentuated characters removed.
     */

    protected String normalize(String input) {
        String decomposedUnicodeString = Normalizer.normalize(input, Normalizer.Form.NFD);
        Matcher allowedCharactersMatcher = allowedCharactersPattern.matcher(decomposedUnicodeString);

        // Filter out those characters that don't belong to the allowed character set.
        // Compose the resulting string with the characters that matched.
        // It was implemented this way because time constraints didn't allow to search for
        // an alternative regex to replace the characters that do not belong to the character set.
        // TODO: find a regex to use with replace function.

        while (allowedCharactersMatcher.find()) {
            buffer.append(allowedCharactersMatcher.group());
        }

        String result = Normalizer.normalize(buffer.toString(), Normalizer.Form.NFC);
        buffer.setLength(0);
        return result;
    }

    protected String removeGenderSpecificLetters(String word) {

        String result = word.replaceAll("\\(a\\)", "")
                .replaceAll("\\(as\\)", "")
                .replaceAll("\\(es\\)", "");
        return result;

    }

}
