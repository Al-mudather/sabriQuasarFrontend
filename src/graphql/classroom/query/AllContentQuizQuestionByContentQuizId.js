import gql from 'graphql-tag'

export const AllContentQuizQuestionByContentQuizIdQuery = gql`
  query AllContentQuizQuestionByContentQuizId($contentQuizId: Int!, $filters: JSONString) {
    allContentQuizQuestionByContentQuiz(
      contentQuizId: $contentQuizId
      filters: $filters
    ) {
      edges {
        node {
          pk
          question
          contentquizquestionanswerSet {
            edges {
              node {
                id
                pk
                answer
                isCorrect
                why
              }
            }
          }
          coursequizsolutionSet {
            edges {
              node {
                id
                pk
                userAnswer {
                  id
                  pk
                  answer
                  isCorrect
                  why
                }
              }
            }
          }
        }
      }
    }
  }
`
