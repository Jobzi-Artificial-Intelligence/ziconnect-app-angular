# Predicting school connectivity in Brazil #

A model for predicting Internet availability in Brazilian schools using geographical data and information on employability for the schools' region.

### What is this repository for? ###

This repository presents the data and the code needed to predict whether a Brazilian school (among those listed in our dataset) has access to the Internet.

The repository is organized as follows:

* `backend/vocabulary-annotator-api`: the code for retrieving and treating job openings
* `backend/model`: the code for incorporating summarized information about job openings in the school dataset; for retrieving additional geographical information based on the schools' positions (latitude and longitude); and for running and evaluating the machine learning models that predict internet availability for Brazilian schools.
* `frontend`: the code for running and presenting the project website, containing information on the Brazilian schools in our dataset, including a prediction regarding their internet availability.

Additional readme files in each folder explain how to set up each component of the project.

### Who do I talk to? ###

* Lucas Murtinho: [lucas.murtinho@jobzi.com](mailto:lucas.murtinho@jobzi.com)
