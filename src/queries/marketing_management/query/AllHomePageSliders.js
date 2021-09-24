import gql from 'graphql-tag'

export const AllHomePageSliders = gql`
fragment CourseFragments on CourseNode {
  pk
  id
  title
  cover
  brief
}    
  

query AllHomePageSliders(
  $orderBy: [String]
) {

  allHomePageSliders(
    #isPublished: true,
    #orderBy: $orderBy
  ) {

      edges {

          node {
              
            # here the slider is defined by fragments
            slide {
              ...CourseFragments
            }
            objectId
            id
            pk    
            isPublished
            startDate
            endDate
          }

      }

  }

}
`
