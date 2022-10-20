
# Jobzi Vocabulary Annotator API

## Setting up the local environment

This guide explains how to set up your local environment. It includes information about prerequisites, installation, build and running that app locally to verify your setup.

## Requirements  

To execute this project, first you need to install the Java Development Kit (JDK) and its package manager (Maven). By default, Maven should be installed together with the JDK. To check whether you have JDK and Maven installed, run `javac -version` and `mvn -v` respectively in a terminal window.

### Java Development Kit (JDK)

There are many tutorials on how to install the JDK. For ubuntu, it can be installed with `sudo apt update; sudo apt install openjdk-8-jdk`. If you are unsure what version of JDK runs on your system, run `javac -version` in a terminal window.  

### Maven Package Manager

To download and install the dependency packages, you need an maven package manager. To install it, there is a guide at https://maven.apache.org/install.html. To check what version of maven runs on your system, run `mvn -v` in a terminal window.

## Install package dependencies  

To download all package dependencies, open a terminal window, access application folder and run the following command:  

`mvn compile`

To check the dependencies that are going to be installed, open the pom.xml file in this same directory.

## Generate Jar

To generate the Jar object just run the following command:

`mvn clean package`

The jar should be located at `./target/vocabulary-annotator-api-0.1.0-SNAPSHOT.jar`

## Run Vocabulary Annotator API

Go to the target directory and run `java -jar vocabulary-annotator-api-0.1.0-SNAPSHOT.jar`. The API is available on port 50043.

## Test

To check if everything is all right, run the following command 

`curl --location --request POST 'http://localhost:50043/vocabulary/parse' \
--header 'Content-Type: application/json' \
--data-raw '{
    "text": "Programador Android",
    "contexts": [1, 2]
}'`

The result should be:

`[{"position":0,"length":19,"term":"Programador Android","id":11916,"context":2,"standard_term_id":11916}]`
