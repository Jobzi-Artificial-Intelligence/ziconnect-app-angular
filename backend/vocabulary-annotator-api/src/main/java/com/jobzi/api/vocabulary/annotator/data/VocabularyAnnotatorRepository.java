package com.jobzi.api.vocabulary.annotator.data;

import com.jobzi.api.vocabulary.annotator.models.TitleField;
import com.jobzi.api.vocabulary.annotator.models.VocabularyContext;
import com.jobzi.api.vocabulary.annotator.models.VocabularyTerm;

import java.util.*;
import java.util.function.BinaryOperator;
import java.util.stream.Collectors;

public class VocabularyAnnotatorRepository extends DataRepository {

    private List<VocabularyTerm> allTerms;

    public Map<String, String> getAbbreviations() {
        return loadTable("title_abbreviation_table").stream()
                .collect(Collectors.toMap(r -> r[0], r -> r[1], BinaryOperator.minBy(Comparator.<String>naturalOrder())));
    }

    public Set<String> getStopWords() {
        if(allTerms == null) getAll();
        return allTerms.stream()
                .filter(t -> t.getContext().getId() == VocabularyContext.STOPWORD.getId())
                .map(VocabularyTerm::getProcessedTerm)
                .collect(Collectors.toSet());
    }

    public Map<String, String> getSynonyms() {
        return loadTable("synonym_table").stream()
                .collect(Collectors.toMap(r -> r[0], r -> r[1], BinaryOperator.minBy(Comparator.<String>naturalOrder())));
    }

    public Map<Long, TitleField> getTitleFields() {
        return loadTable("title_field_table").stream()
                .collect(Collectors.toMap(r -> Long.parseLong(r[0]), r -> TitleField.getFromId(Long.parseLong(r[1]))));
    }

    public Collection<VocabularyTerm> getAll() {
        return getAll(false);
    }

    public Collection<VocabularyTerm> getAll(boolean forceReload) {
        if (!forceReload && allTerms != null) return allTerms;

        List<String[]> rows = loadTable("vocabulary_term_table");

        allTerms = new ArrayList<>();
        Map<Long, VocabularyTerm> lookup = new HashMap<>();
        // get all standard terms
        for(int i = 0; i < rows.size(); i++) {
            String[] row = rows.get(i);
            long termId               = Long.parseLong(row[0]);
            VocabularyContext context = VocabularyContext.getFromId(Long.parseLong(row[1]));
            long standardTermId       = row[2].isEmpty()? 0 : Long.parseLong(row[2]);
            String processedTerm      = row[3];
            String displayName        = row[4];

            if(standardTermId > 0) continue;
            lookup.put(termId, new VocabularyTerm(termId, processedTerm, displayName, context, null));
        }
        allTerms.addAll(lookup.values());

        // get all non standard terms
        for(int i = 0; i < rows.size(); i++) {
            String[] row = rows.get(i);
            long termId               = Long.parseLong(row[0]);
            VocabularyContext context = VocabularyContext.getFromId(Long.parseLong(row[1]));
            long standardTermId       = row[2].isEmpty()? 0 : Long.parseLong(row[2]);
            String processedTerm      = row[3];
            String displayName        = row[4];

            if(standardTermId <= 0) continue;
            lookup.put(termId, new VocabularyTerm(termId, processedTerm, displayName, context, lookup.get(standardTermId)));
        }

        return allTerms;
    }
}
