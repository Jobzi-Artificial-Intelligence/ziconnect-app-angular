package com.jobzi.api.vocabulary.annotator.core;

import com.google.common.collect.Sets;
import com.jobzi.api.vocabulary.annotator.core.annotation.AnnotatedDocument;
import com.jobzi.api.vocabulary.annotator.core.annotation.ReduceGramAnnotation;
import com.jobzi.api.vocabulary.annotator.core.annotation.TokenAnnotation;
import com.jobzi.api.vocabulary.annotator.core.reduction.*;

import java.util.*;

import static java.util.stream.Collectors.toList;

public class ReduceGramAnnotator implements Annotator {

    private static final String DEFAULT_FILLER_TOKEN = "";

    private Integer maxGramSize;
    private Integer minGramSize;
    private Set<Reduction> reductions;
    private TokenAnnotator tokenAnnotator;
    private Set<String> stopWords;
    private Set<String> titleStopWords;
    private Set<String> companyStopWords;
    private static final String companyStopWordsValues = "ltda,me,epp,eireli,bne,mei,sa,ss,de,da,do,e,em,na,no,para";

    public ReduceGramAnnotator() {
        maxGramSize = 2;
        minGramSize = 2;
        reductions = Sets.newHashSet(Reduction.NORMAL);
        List<TokenReducer> reducers = Arrays.asList(new NormalTokenReducer());
        tokenAnnotator = new TokenAnnotator(reducers);
        stopWords = new HashSet<>();
        titleStopWords = new HashSet<>();
        titleStopWords.addAll(stopWords);
        companyStopWords = new HashSet<>();
        companyStopWords.addAll(Arrays.asList((companyStopWordsValues).split(",")));
    }

    public ReduceGramAnnotator(Set<Reduction> reductions, TokenAnnotator tokenAnnotator, Set<String> stopWords) {
        this.reductions = reductions;
        this.tokenAnnotator = tokenAnnotator;
        this.stopWords = stopWords;
        titleStopWords = new HashSet<>();
        titleStopWords.add("ramo");
        titleStopWords.add("area");
        titleStopWords.addAll(stopWords);
        companyStopWords = new HashSet<>();
        companyStopWords.addAll(Arrays.asList((companyStopWordsValues).split(",")));
    }

    public ReduceGramAnnotator(Set<Reduction> reductions, Set<String> stopWords) {
        maxGramSize = 2;
        minGramSize = 2;

        this.reductions = reductions;
        List<TokenReducer> reducers = new ArrayList<>();
        reducers.add(new NormalTokenReducer());
        reducers.add(new AbbreviationReducer(Reduction.TITLE_NO_ABBREVIATION));
        reducers.addAll(reductions.stream().map(Reduction::getReducer).collect(toList()));

        tokenAnnotator = new TokenAnnotator(reducers);
        this.stopWords = stopWords;
        titleStopWords = new HashSet<>();
        titleStopWords.add("ramo");
        titleStopWords.add("area");
        titleStopWords.addAll(stopWords);

    }

    public ReduceGramAnnotator(Set<Reduction> reductions) {
        maxGramSize = 2;
        minGramSize = 2;

        this.reductions = reductions;
        List<TokenReducer> reducers = new ArrayList<>();
        reducers.add(new NormalTokenReducer());
        reducers.add(new AbbreviationReducer(Reduction.TITLE_NO_ABBREVIATION));
        reducers.addAll(reductions.stream().map(Reduction::getReducer).collect(toList()));

        tokenAnnotator = new TokenAnnotator(reducers);
        this.stopWords = new HashSet<>();
        titleStopWords = new HashSet<>();
        titleStopWords.add("ramo");
        titleStopWords.add("area");
        titleStopWords.addAll(stopWords);

    }

    public Integer getMaxGramSize() {
        return maxGramSize;
    }

    public void setMaxGramSize(Integer maxGramSize) {
        this.maxGramSize = maxGramSize;
    }

    public Integer getMinGramSize() {
        return minGramSize;
    }

    public void setMinGramSize(Integer minGramSize) {
        this.minGramSize = minGramSize;
    }

    public Set<Reduction> getReductions() {
        return reductions;
    }

    public TokenAnnotator getTokenAnnotator() {
        return tokenAnnotator;
    }

    public void setTokenAnnotator(TokenAnnotator tokenAnnotator) {
        this.tokenAnnotator = tokenAnnotator;
    }

    /**
     * Annotate all n-gram tokens with [min, max] size
     *
     * @param document Text document to be annotated
     * @return Document with the n-gram token annotations appended
     */
    @Override
    public AnnotatedDocument annotate(AnnotatedDocument document) {

        if (!document.hasAnnotation(ReduceGramAnnotation.class)) {
            if (!document.hasAnnotation(TokenAnnotation.class)) {
                document = (tokenAnnotator.annotate(document));
            }
            List<TokenAnnotation> tokenAnnotations = document.getAnnotation(TokenAnnotation.class);

            List<ReduceGramAnnotation> result = makeGrams(tokenAnnotations, document.getText());
            document.setAnnotation(ReduceGramAnnotation.class, result);

        }

        return document;
    }

    /**
     * Generate all n-gram tokens from the original text tokens
     *
     * @param tokenAnnotations List of text tokens (sorted by start index)
     * @param text Original text
     * @return List of n-gram token annotations
     */
    protected List<ReduceGramAnnotation> makeGrams(List<TokenAnnotation> tokenAnnotations, String text) {

        List<TokenAnnotation> workingTokenAnnotations = new ArrayList<>(tokenAnnotations);
        for (int i = 0; i < maxGramSize; i++) {
            workingTokenAnnotations.add(new TokenAnnotation(DEFAULT_FILLER_TOKEN, text.length()));
        }

        List<ReduceGramAnnotation> gramAnnotations = new ArrayList<>();
        List<ReduceGramAnnotation> auxiliaryGramAnnotations = new ArrayList<>();
        for (int i = 0; i < tokenAnnotations.size(); i++) {
            auxiliaryGramAnnotations.clear();

            // a gram cannot start or finish in a stopWord
            Integer limit = Math.min(i + (maxGramSize + 1), tokenAnnotations.size() + 1);
            for (int j = i + minGramSize; j < limit; j++) {

                String gramText = getGramText(text, workingTokenAnnotations.get(i), workingTokenAnnotations.get(j - 1));
                ReduceGramAnnotation reduceGramAnnotation = new ReduceGramAnnotation(gramText, tokenAnnotations.get(i).getPosition(),
                        tokenAnnotations.get(i).getIndex(), j - i);

                for (Reduction reduction : reductions) {

                    if(canHaveReduction(reduction, workingTokenAnnotations.get(i), workingTokenAnnotations.get(j - 1))){
                        String reduceForm = getReduceGram(reduction, workingTokenAnnotations.subList(i, j));
                        reduceGramAnnotation.setReduction(reduction, reduceForm);
                    } else {
                        reduceGramAnnotation.setReduction(reduction, DEFAULT_FILLER_TOKEN);
                    }
                }

                auxiliaryGramAnnotations.add(reduceGramAnnotation);
            }

            Collections.reverse(auxiliaryGramAnnotations);
            gramAnnotations.addAll(auxiliaryGramAnnotations);
        }

        return gramAnnotations;
    }

    /**
     * Whether the n-gram token generated can be reduced.
     * Annotations starting (or ending) with stopwords can not be reduced.
     *
     * @param reduction Type of reduction to be applied
     * @param start First token of the n-gram
     * @param end Last token of the n-gram
     * @return Boolean indicating whether we can reduce the n-gram
     */
    private boolean canHaveReduction(Reduction reduction, TokenAnnotation start, TokenAnnotation end) {
        return notInStopWords(start.getReduction(reduction), reduction) &&
                notInStopWords(end.getReduction(reduction), reduction);
    }

    /**
     * The reduced version of the n-gram token
     *
     * @param reduction Type of reduction to be applied
     * @param tokenAnnotations Tokens of the n-gram
     * @return String representing the reduced version of the n-gram token
     */
    private String getReduceGram(Reduction reduction, List<TokenAnnotation> tokenAnnotations) {
        List<String> tokens = tokenAnnotations.stream()
                .map(an -> an.getReduction(reduction))
                .filter(s -> notInStopWords(s, reduction))
                .collect(toList());
        return String.join(" ", tokens);
    }

    private boolean notInStopWords(String s, Reduction reduction) {
        switch (reduction) {
            case TITLE_FINAL:
                return !this.titleStopWords.contains(s);
            default:
                return true;
        }
    }

    protected String getGramText(String text, TokenAnnotation start, TokenAnnotation end) {
        int beginIndex = start.getPosition();
        int endIndex = end.getPosition() + end.getText().length();
        return text.substring(beginIndex, endIndex);
    }

}
