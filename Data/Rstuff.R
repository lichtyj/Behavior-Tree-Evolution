setwd("C:/Users/mrlic/Google Drive/School/TCSS 499/Data/Standard/")
getwd()
list.files()

MyData <- read.csv(file="C:/Users/mrlic/Google Drive/School/TCSS 499/Data/Standard/data1.csv", header=TRUE, sep=",");

buckets = 20;
genes = c("metabolicRate",
"thirstThreshold",
"hungerThreshold",
"matingThreshold",
"energyThreshold",
"thirstSated",
"hungerSated",
"energySated",
"wanderWeight",
"uphillWeight",
"foodPreference",
"attackPreference",
"plantWeight",
"meatWeight",
"waterWeight",
"matingWeight",
"orientationWeight",
"cohesionWeight",
"separationWeight",
"matingDonationM",
"matingDonationF",
"drowningAggression",
"foodAggression",
"drinkAggression",
"matingAggression",
"wanderAggression",
"attackDelay",
"loyalty");

population = MyData[1];

scatterplots = NULL;
dataOffset = 6;
metabolicRate = MyData[7:26]


plot.ts(population)
