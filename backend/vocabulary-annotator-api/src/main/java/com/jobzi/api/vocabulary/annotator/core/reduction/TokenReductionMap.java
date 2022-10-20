package com.jobzi.api.vocabulary.annotator.core.reduction;

public interface TokenReductionMap {

    String getReduction(Reduction reductionType);

    void setReduction(Reduction reductionType, String reduction);

    boolean hasReduction(Reduction reductionType);

}
