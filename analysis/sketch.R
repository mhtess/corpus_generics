getwd()
setwd("~/Documents/research/corpus_generics/")
# install.packages("tidyr")
library(tidyr)

d <- read.table("swbd.tab.txt", sep = '\t', quote = "",
                header = T)

df.chakia <- data.frame(
  id = c(1,2,5,8),
  words = c("a", "b", "c", "d")
)

df.charles <- data.frame(
  id = c(2,5,8, 9),
  words = c( "b", "c","d", "e")
)

df.join <- full_join(
  mutate(df.chakia, generator = "chakia"),
  mutate(df.charles, generator = "charles"), 
  by = c("id", "words"))

df.join %>%
  filter(is.na(generator.x))
