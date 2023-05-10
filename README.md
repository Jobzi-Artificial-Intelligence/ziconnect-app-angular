[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://github.com/Jobzi-Artificial-Intelligence/ziconnectapp-angular/blob/main/LICENSE)
[![codecov](https://codecov.io/gh/Jobzi-Artificial-Intelligence/ziconnect-app-angular/branch/master/graph/badge.svg)](https://codecov.io/gh/Jobzi-Artificial-Intelligence/ziconnect-app-angular)

# Predicting school connectivity and employability in Brazil #

Jobzi has a considerable knowledge and experience to provide AI NLP solution designed to guide, contribute and merge the Job and Education market. As a part of this experience we are helping the Unicef and Giga a platform 
and AI prediction models to identify Internet availability in Brazilian schools using geographical data and information on employability and internet connectivity for the schools' region.

As a result of this Unicef project, we have a platform featured for connectivity dashboard provided through the 
AI Models for predicting Internet availability in Brazilian schools using geographical data and information on employability for the schools' region.

### What is this repository for? ###

This repository presents the data and the code needed to predict whether a Brazilian school (among those listed in our dataset) has access to the Internet.

The repository is organized as follows:

* `repository`: PostgreSQL with the schema and initial data (schools, locations), for the dataBase consider dumpUnicef.sql | Default database: unicef
* `backend`: PostgREST API library to collect and summarized information on connectivity and employability. Retrieve additional geographical information based on the schools' positions (latitude and longitude), and for running and evaluating the machine learning models that predict internet availability for Brazilian schools.
* `frontend`: Angular code library for running and presenting the project website, containing information on the Brazilian schools in our dataset, including a prediction regarding their employability and internet availability.

Additional guidance files or procedures can be find to explain how to set up each component of the project.

### Who do I talk to? ###

* Jobzi support team: [support@jobzi.com](mailto:support@jobzi.com)
