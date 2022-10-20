package com.jobzi.api.vocabulary.annotator.core.annotation;

import org.junit.Assert;
import org.junit.Test;

public class TokenAnnotationTest {

    @Test
    public void equals() throws Exception {

        // GIVEN
        TokenAnnotation t1 = new TokenAnnotation();
        TokenAnnotation t2 = new TokenAnnotation();
        TokenAnnotation t3 = new TokenAnnotation("some text", 1);

        // WHEN
        Boolean equals = t1.equals(t2);
        Boolean different = t1.equals(t3);

        // THEN
        Assert.assertTrue(equals);
        Assert.assertFalse(different);

    }

    @Test
    public void getAndSetIndex() throws Exception {

        // GIVEN
        Integer index = 0;
        TokenAnnotation t = new TokenAnnotation();
        t.setIndex(index);

        // WHEN
        Integer actualIndex = t.getIndex();

        // THEN
        Assert.assertEquals(index, actualIndex);

    }


}