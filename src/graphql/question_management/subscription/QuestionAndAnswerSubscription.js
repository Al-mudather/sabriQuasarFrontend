import gql from 'graphql-tag'

export const QuestionAndAnswerSubscription = gql`
subscription QuestionAndAnswer($courseId: Int) {
  questionAnswerSubscription(courseId: $courseId) {
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
        totalCount
      }
    }
  }
}
`
