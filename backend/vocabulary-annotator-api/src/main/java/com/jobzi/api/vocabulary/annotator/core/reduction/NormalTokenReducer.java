package com.jobzi.api.vocabulary.annotator.core.reduction;

import com.jobzi.api.vocabulary.annotator.core.annotation.TokenAnnotation;
import org.apache.commons.lang3.StringUtils;

import java.text.Normalizer;
import java.util.Locale;

public class NormalTokenReducer extends TokenReducer {

    /**
     * Apply default string normalization (lowercase and remove all accents and numbers)
     *
     * @param token Token annotation
     */
    @Override
    public void reduce(TokenAnnotation token) {

        String text = token.getText();
        String result = normalize(text);
        token.setReduction(Reduction.NORMAL, result);

    }

    private static String normalize(String text) {
        String result = text.replaceAll("[0-9]", " ");
        result = StringUtils.stripAccents(result.toLowerCase(Locale.getDefault()));
        result = Normalizer.normalize(result, Normalizer.Form.NFKD);
        return result;
    }


}
