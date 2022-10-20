package com.jobzi.api.vocabulary.annotator.core.annotation;

import com.jobzi.api.vocabulary.annotator.core.reduction.Reduction;
import com.jobzi.api.vocabulary.annotator.core.reduction.TokenReductionMap;

import java.util.HashMap;
import java.util.Map;

public class TokenAnnotation extends TextAnnotation implements TokenReductionMap {

    protected Integer index;
    private Map<Reduction, String> reductionsMap;

    public TokenAnnotation() {
        index = 0;
        reductionsMap = new HashMap<>();
    }

    public TokenAnnotation(String text, Integer position, Integer index) {
        super(text, position);
        this.index = index;
        reductionsMap = new HashMap<>();
    }

    public TokenAnnotation(String text, Integer position) {
        super(text, position);
        this.index = 0;
        reductionsMap = new HashMap<>();
    }

    public Integer getIndex() {
        return index;
    }

    public void setIndex(Integer index) {
        this.index = index;
    }

    @Override
    public String toString() {
        return getText() + ":" + getPosition().toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;

        TokenAnnotation that = (TokenAnnotation) o;

        if (!getIndex().equals(that.getIndex())) return false;
        return reductionsMap.equals(that.reductionsMap);

    }

    @Override
    public int hashCode() {
        int result = super.hashCode();
        result = 31 * result + getIndex().hashCode();
        result = 31 * result + reductionsMap.hashCode();
        return result;
    }

    @Override
    public String getReduction(Reduction reductionType) {
        return reductionsMap.get(reductionType);
    }

    @Override
    public void setReduction(Reduction reductionType, String reduction) {
        reductionsMap.put(reductionType, reduction);
    }

    @Override
    public boolean hasReduction(Reduction reductionType) {
        return reductionsMap.containsKey(reductionType);
    }
}
