package com.jobzi.api.vocabulary.annotator.controller;

import com.jobzi.api.vocabulary.annotator.models.*;
import com.jobzi.api.vocabulary.annotator.service.VocabularyAnnotatorService;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping(value = "/vocabulary")
public class VocabularyAnnotatorController {

    private VocabularyAnnotatorService service;

    public VocabularyAnnotatorController(VocabularyAnnotatorService service) {
        this.service = service;
    }

    /**
     * Extract all vocabulary terms found in a given text and context list
     *
     * @param parseRequest Text and contexts info
     * @return List of vocabulary terms
     */
    @ResponseBody
    @RequestMapping(value = "/parse", method = RequestMethod.POST, produces = "application/json", consumes = "application/json")
    public List<MarkUpWebVocabularyTerm> getParse(@RequestBody ParseRequest parseRequest) {
        return service.getParseTerms(parseRequest);
    }

    /**
     * Extract all vocabulary terms found in a given list of texts and context lists
     *
     * @param parseRequests List of text and contexts info
     * @return List of lists of the vocabulary terms found for each request
     */
    @ResponseBody
    @RequestMapping(value = "/parse/list", method = RequestMethod.POST, produces = "application/json", consumes = "application/json")
    public List<List<MarkUpWebVocabularyTerm>> getParseList(@RequestBody List<ParseRequest> parseRequests) {
        List<List<MarkUpWebVocabularyTerm>> results = new ArrayList<>();
        for (ParseRequest request: parseRequests) {
            results.add(service.getParseTerms(request));
        }
        return results;
    }

    /**
     * Return the field (e.g: IT, Finances, ...) associated with the given title id
     *
     * @param termId Title id
     * @return Title field id
     */
    @ResponseBody
    @RequestMapping(value = "/title-field", method = RequestMethod.POST, produces = "application/json", consumes = "application/json")
    public Long getTitleField(@RequestBody Long termId) {
        return service.getTitleField(termId).getId();
    }

    /**
     * Return the field (e.g: IT, Finances, ...) associated with each title id
     *
     * @param termIds List of title ids
     * @return Object mapping the title id to its field id
     */
    @ResponseBody
    @RequestMapping(value = "/title-field/list", method = RequestMethod.POST, produces = "application/json", consumes = "application/json")
    public Map<Long, Long> getTitleFieldList(@RequestBody List<Long> termIds) {
        Map<Long, Long> resultMap = new HashMap<>();
        for (Long termId: termIds) {
            resultMap.put(termId, service.getTitleField(termId).getId());
        }
        return resultMap;
    }

}
