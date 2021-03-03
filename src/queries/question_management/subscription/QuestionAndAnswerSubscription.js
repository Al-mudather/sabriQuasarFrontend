import gql from 'graphql-tag'

export const QuestionAndAnswerSubscription = gql`
subscription QuestionAndAnswer($courseId: Int) {
  questionAnswerSubscription(courseId: $courseId) {
    notification{
      id,
      pk,
      title
      description
      extraData
      type
      created
      updated
    },
    question{
      pk,
      question,
      user {
        id,
        pk,
        firstName,
        lastName,
        email
      },
      questionreplySet {
        totalCount,
        edges {
          node {
            id,
            pk,
            answer,
            user {
              id,
              pk,
              firstName,
              lastName,
              email
            }
          }
        }
      }
    },
    answer {
      pk,
      answer,
      user {
        id,
        pk,
        firstName,
        lastName,
        email
      }
    }
  }
}
`
