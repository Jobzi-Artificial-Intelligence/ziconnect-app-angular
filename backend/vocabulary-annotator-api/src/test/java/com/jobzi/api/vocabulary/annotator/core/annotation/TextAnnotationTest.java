package com.jobzi.api.vocabulary.annotator.core.annotation;

import org.junit.Assert;
import org.junit.Test;

public class TextAnnotationTest {

    @Test
    public void getText() throws Exception {

        // GIVEN
        String expectedText = "annotation";
        Integer expectedPosition = 0;
        TextAnnotation textAnnotation = new TextAnnotation(expectedText, expectedPosition);


        // WHEN
        String actualText = textAnnotation.getText();

        // THEN
        Assert.assertEquals(expectedText, actualText);

    }

    @Test
    public void setText() throws Exception {

        // GIVEN
        String expectedText = "annotation";
        Integer expectedPosition = 0;
        TextAnnotation textAnnotation = new TextAnnotation();


        // WHEN
        textAnnotation.setText(expectedText);
        textAnnotation.setPosition(expectedPosition);

        // THEN
        Assert.assertEquals(expectedText, textAnnotation.getText());
        Assert.assertEquals(expectedPosition, textAnnotation.getPosition());

    }

    @Test
    public void getPosition() throws Exception {

        // GIVEN
        String expectedText = "annotation";
        Integer expectedPosition = 0;
        TextAnnotation textAnnotation = new TextAnnotation(expectedText, expectedPosition);


        // WHEN
        Integer actualPosition = textAnnotation.getPosition();

        // THEN
        Assert.assertEquals(expectedPosition, actualPosition);

    }

    @Test
    public void setPosition() throws Exception {

        // GIVEN
        String expectedText = "annotation";
        Integer expectedPosition = 0;
        TextAnnotation textAnnotation = new TextAnnotation();


        // WHEN
        textAnnotation.setPosition(expectedPosition);

        // THEN
        Assert.assertEquals(expectedPosition, textAnnotation.getPosition());

    }

}