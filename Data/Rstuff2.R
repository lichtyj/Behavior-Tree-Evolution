setwd("C:/Users/Josh/Google Drive/School/TCSS 499/Data/Standard")
getwd()
list.files()

MyData <- read.csv(file="C:/Users/Josh/Google Drive/School/TCSS 499/Data/Standard/data1.csv", header=TRUE, sep=",");

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
drowning = MyData[2];
theRng = MyData[3];
violence = MyData[4];
malnutrition = MyData[5];

scatterplots = NULL;
dataOffset <- 7;
dataOffset = dataOffset + 1;
buckets = 20;
index = 0;


metabolicRate = MyData[dataOffset + index * buckets:dataOffset + (index + 1) * buckets - 1]
metabolicRate

plot.ts(population)
