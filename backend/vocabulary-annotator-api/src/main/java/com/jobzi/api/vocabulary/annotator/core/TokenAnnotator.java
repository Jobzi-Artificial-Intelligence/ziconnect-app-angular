package com.jobzi.api.vocabulary.annotator.core;

import com.jobzi.api.vocabulary.annotator.core.annotation.AnnotatedDocument;
import com.jobzi.api.vocabulary.annotator.core.annotation.TokenAnnotation;
import com.jobzi.api.vocabulary.annotator.core.reduction.AbbreviationReducer;
import com.jobzi.api.vocabulary.annotator.core.reduction.TokenReducer;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TokenAnnotator implements Annotator {

    private Pattern splitPattern;
    private Pattern pointPattern;
    private Pattern punctuationPattern;

    private static final String punctuation = "[\\p{Punct}&&[^.]]";
    private static final String point = "\\.";
    private List<TokenReducer> reducers;


    public TokenAnnotator() {
        this.splitPattern = Pattern.compile("\\S+");
        this.pointPattern = Pattern.compile(point);
        this.punctuationPattern = Pattern.compile(punctuation);
        reducers = new ArrayList<>();
    }

    public TokenAnnotator(Pattern splitPattern) {
        this.splitPattern = splitPattern;
        this.pointPattern = Pattern.compile(point);
        this.punctuationPattern = Pattern.compile(punctuation);
        reducers = new ArrayList<>();
    }

    public TokenAnnotator(Pattern pointPattern, List<TokenReducer> reducers) {
        this.splitPattern = Pattern.compile("\\S+");;
        this.pointPattern = pointPattern;
        this.punctuationPattern = Pattern.compile(punctuation);
        this.reducers = reducers;
    }

    public TokenAnnotator(List<TokenReducer> reducers) {
        this.reducers = reducers;
        this.splitPattern = Pattern.compile("\\S+");
        this.pointPattern = Pattern.compile(point);
        this.punctuationPattern = Pattern.compile(punctuation);

    }

    /**
     * Annotate all tokens found in the given document
     *
     * @param document Text document to be annotated
     * @return Document with the annotated tokens
     */
    @Override
    public AnnotatedDocument annotate(AnnotatedDocument document) {


        if(!document.hasAnnotation(TokenAnnotation.class)){

            String text = document.getText();

            text = punctuationPattern.matcher(text).replaceAll(" ");
            Matcher matcher = splitPattern.matcher(text);

            Integer offset = 0;
            List<TokenAnnotation> annotations = new ArrayList<>();
            for (int index = 0; matcher.find(); index++) {
                String tokenText = matcher.group();

                List<TokenAnnotation> innerAnnotations = new ArrayList<>();
                if(hasPoint(tokenText)) {
                    Integer innerOffset = 0;
                    TokenAnnotation annotation;
                    List<String> subTexts = splitByPoints(tokenText);
                    for (String subText : subTexts) {
                        annotation = new TokenAnnotation(subText, innerOffset + matcher.start(), index);
                        innerOffset += subText.length();
                        innerAnnotations.add(annotation);
                    }
                } else {
                    TokenAnnotation annotation = new TokenAnnotation(tokenText, offset + matcher.start(), index);
                    innerAnnotations.add(annotation);
                }

                for (TokenAnnotation annotation : innerAnnotations) {
                    reducers.forEach(reducer -> reducer.reduce(annotation));
                }

                annotations.addAll(innerAnnotations);
            }

            document.setAnnotation(TokenAnnotation.class, annotations);
        }
        return document;
    }

    /**
     * Split token string by points
     *
     * @param tokenText Original token string
     * @return List of substring tokens
     */
    private List<String> splitByPoints(String tokenText) {
        List<String> result = new ArrayList<>();
        String modifiedText = pointPattern.matcher(tokenText).replaceAll(" . ");
        Matcher matcher = splitPattern.matcher(modifiedText);
        while(matcher.find()) {
            result.add(matcher.group());
        }
        return result;
    }

    /**
     * Whether there is a point character in the string.
     * If token contains a point but it is an abbreviation (e.g: Ph.D), we return False.
     *
     * @param tokenText Token string
     * @return Boolean indicating whether string as a point
     */
    private boolean hasPoint(String tokenText) {

        boolean hasPoint = pointPattern.matcher(tokenText).find();
        boolean isAnAbbreviation = false;

        for (TokenReducer reducer : reducers) {
            if(reducer instanceof AbbreviationReducer){
                AbbreviationReducer abbreviationReducer = (AbbreviationReducer) reducer;
                if (abbreviationReducer.matchAbbreviation(tokenText)){
                    isAnAbbreviation = true;
                    break;
                }
            }
        }

        return hasPoint && !isAnAbbreviation;
    }

}
