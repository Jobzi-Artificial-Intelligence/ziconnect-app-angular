package com.jobzi.api.vocabulary.annotator.data;

import au.com.bytecode.opencsv.CSVReader;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;

public class DataRepository {

    protected List<String[]> loadTable(String tableName) {
        InputStream inputStream = getClass().getResourceAsStream(tableName + ".csv");
        try {
            CSVReader reader = new CSVReader(new InputStreamReader(inputStream));
            List<String[]> rows = reader.readAll();
            inputStream.close();
            reader.close();
            return rows;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
