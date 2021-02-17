import gql from "graphql-tag";

export const GetAllLearningProgressByCourse = gql`
    query GetAllLearningProgressByCourse($courseId: Int, $enrollmentId: Int) {
        learningProgressByCourse(
            courseId: $courseId
            enrollmentId: $enrollmentId
        ) {
            edges {
                node {
                    id
                    pk
                    courseUnitContent {
                        id
                        pk
                    }
                    begin
                    complete
                }
            }
        }
    }
`;
